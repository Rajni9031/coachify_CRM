import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BatchForm from '../sidebarSection/BatchForm';
import EditBatchForm from '../sidebarSection/EditBatchForm';

const APP = process.env.REACT_APP_API_URL;

const initialNavItems = [
  {
    type: 'item',
    icon: 'bi bi-grid',
    label: 'Dashboard',
    href: '/home',
  },
  {
    type: 'dropdown',
    icon: 'bi bi-menu-button-wide',
    label: 'Batches',
    id: 'components-nav',
    children: [],
  },
  {
    type: 'heading',
    label: 'Pages',
  },
  {
    type: 'item',
    icon: 'bi bi-person',
    label: 'Profile',
    to: '/ProfilePage',
  },
];

function Sidebar() {
  const [navItems, setNavItems] = useState(initialNavItems);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${APP}/api/batches`);
      const batches = response.data;
      setNavItems((prevNavItems) => {
        const updatedNavItems = [...prevNavItems];
        updatedNavItems[1].children = batches.map((batch) => ({
          href: `/BatchDetail/${batch._id}`,
          label: batch.name,
          description: batch.description,
          startDate: batch.startDate, // Include startDate
          _id: batch._id,
        }));
        return updatedNavItems;
      });
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const addBatch = async (newBatch) => {
    try {
      // Make an asynchronous request to fetch the ID from MongoDB
      const response = await fetch(`${APP}/api/getObjectId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBatch),
      });
      window.location.reload(false);

      if (!response.ok) {
        throw new Error('Failed to fetch object ID');
      }

      const data = await response.json();
      const objectId = data._id;

      // Update the state with the new batch and fetched object ID
      setNavItems((prevNavItems) => {
        const updatedNavItems = [...prevNavItems];
        updatedNavItems[1].children.push({
          ...newBatch,
          href: `/BatchDetail/${objectId}`,
          _id: objectId,
        });
        return updatedNavItems;
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error adding batch:', error);
      // Handle error, possibly by showing an error message to the user
    }
  };

  const editBatch = async (updatedBatch) => {
    try {
      await axios.put(`${APP}/api/batches/${updatedBatch._id}`, updatedBatch);
      setNavItems((prevNavItems) => {
        const updatedNavItems = [...prevNavItems];
        const batchIndex = updatedNavItems[1].children.findIndex(
          (batch) => batch._id === updatedBatch._id
        );
        updatedNavItems[1].children[batchIndex] = {
          ...updatedBatch,
          href: `/BatchDetail/${updatedBatch._id}`,
        };
        window.location.reload(false);
        return updatedNavItems;
      });
      setShowEditForm(false);
    } catch (error) {
      console.error('Error editing batch:', error);
    }
  };

  const removeBatch = async (batchId) => {
    try {
      await axios.delete(`${APP}/api/batches/${batchId}`);
      setNavItems((prevNavItems) => {
        const updatedNavItems = [...prevNavItems];
        updatedNavItems[1].children = updatedNavItems[1].children.filter(
          (batch) => batch._id !== batchId
        );
        return updatedNavItems;
      });
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const handleAddBatchClick = () => {
    setShowForm(true);
  };

  const handleEditBatchClick = (batch) => {
    setBatchToEdit(batch);
    setShowEditForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowEditForm(false);
  };

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        {navItems.map((item, index) => {
          if (item.type === 'item') {
            return (
              <li className="nav-item" key={index}>
                {item.href ? (
                  <Link className="nav-link" to={item.href}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <Link className="nav-link collapsed" to={item.to}>
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          } else if (item.type === 'dropdown') {
            return (
              <li className="nav-item" key={index}>
                <a
                  className="nav-link collapsed"
                  data-bs-toggle="collapse"
                  href={`#${item.id}`}
                  role="button"
                  aria-expanded="false"
                  aria-controls={item.id}
                  onClick={fetchBatches}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                  <i className="bi bi-chevron-down ms-auto"></i>
                </a>
                <ul id={item.id} className="nav-content collapse" data-bs-parent="#sidebar-nav">
                  {item.children.map((child, childIndex) => (
                    <li key={childIndex} className="d-flex justify-content-between align-items-center">
                      <Link to={`/BatchDetail/${child._id}`}>
                        <i className="bi bi-circle"></i>
                        <span>{child.label}</span>
                      </Link>
                      <div>
                        <button
                          className="btn btn-link text-primary"
                          onClick={() => handleEditBatchClick(child)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => removeBatch(child._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                  <li>
                    <button className="btn btn-link nav-link" onClick={handleAddBatchClick}>
                      <i className="bi bi-plus-circle"></i> Add Batch
                    </button>
                  </li>
                </ul>
                {showForm && <BatchForm onAddBatch={addBatch} onCancel={handleCancel} />}
                {showEditForm && batchToEdit && (
                  <EditBatchForm batch={batchToEdit} onEditBatch={editBatch} onCancel={handleCancel} />
                )}
              </li>
            );
          } else if (item.type === 'heading') {
            return (
              <li className="nav-heading" key={index}>
                {item.label}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
