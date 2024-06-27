// SideScroll.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import NotesParent from './Notes';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { DateContext } from './DateContext';

const APP = process.env.REACT_APP_API_URL;

function SideScroll({ showbar, joiningDate, batchStartDate, showDemoClasses }) {
  // const [isVisible, setIsVisible] = useState(showbar);
  const [showMenu, setShowMenu] = useState(false);
  const { batchId } = useParams();
  const { clickedDate } = useContext(DateContext);
  const [allNotes, setAllNotes] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const [newNote, setNewNote] = useState({
    topic: "",
    time: "",
    professor: "",
    demoClass: false
  });

  const [editedNote, setEditedNote] = useState({
    topic: "",
    time: "",
    professor: ""
  });

  useEffect(() => {
    if (!clickedDate) {
      console.error('clickedDate is null or undefined in useEffect');
      return;
    }
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${APP}/api/batches/${batchId}/schedule/${clickedDate}`);
        setAllNotes(response.data.classes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    if (batchId && clickedDate) {
      fetchNotes();
    }
  }, [batchId, clickedDate]);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleEditModal = () => {
    setModalType('edit');
    setShowMenu(false);
  };

  const handleAddModal = () => {
    setModalType('add');
    setShowMenu(false);
  };

  const handleDeleteModal = () => {
    setModalType('delete');
    setShowMenu(false);
  };

  const handleAddNote = async () => {
    try {
      const payload = {
        classDate: clickedDate,
        classes: [newNote]
      };
      const response = await axios.post(
        `${APP}/api/batches/${batchId}/schedule`,
        [payload]
      );

      setAllNotes([...allNotes, ...response.data.classes]);
      setNewNote({
        topic: "",
        time: "",
        professor: "",
        demoClass: false
      });

    } catch (error) {
      console.error('Error adding note:', error);
    }
    setModalType(null);
    window.location.reload();
  };

  const handleDeleteNote = async () => {
    if (selectedNoteIndex !== null) {
      const noteToDelete = allNotes[selectedNoteIndex];
      const classId = noteToDelete._id;

      try {
        const response = await axios.delete(`${APP}/api/batches/${batchId}/schedule/${clickedDate}/${classId}`);
        console.log('Note deleted:', response.data);

        const updatedNotes = allNotes.filter((_, index) => index !== selectedNoteIndex);
        setAllNotes(updatedNotes);
        setSelectedNoteIndex(null);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
    setModalType(null);
  };

  const handleEditNote = async () => {
    if (selectedNoteIndex !== null) {
      const noteToEdit = allNotes[selectedNoteIndex];
      const classId = noteToEdit._id;

      if (!clickedDate) {
        console.error('clickedDate is null or undefined');
        return;
      }

      try {
        const payload = {
          topic: editedNote.topic,
          time: editedNote.time,
          professor: editedNote.professor,
          latestClassDate: clickedDate
        };

        const localDate = new Date(clickedDate);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const response = await axios.put(`${APP}/api/batches/${batchId}/schedule/${clickedDate}/${classId}`, payload);
        console.log('Note edited:', response.data);

        const updatedNotes = allNotes.map((note, index) =>
          index === selectedNoteIndex ? { ...note, ...payload } : note
        );
        setAllNotes(updatedNotes);
        setSelectedNoteIndex(null);
        setEditedNote({
          topic: "",
          time: "",
          professor: ""
        });
      } catch (error) {
        console.error('Error editing note:', error);
      }
    }
    setModalType(null);
  };

  const modalRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (modalRef.current && !modalRef.current.contains(event.target)) ||
        (dropdownRef.current && !dropdownRef.current.contains(event.target))
      ) {
        setModalType(null);
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalType]);

  // Filter notes based on the showDemoClasses prop
  const filteredNotes = showDemoClasses ? allNotes : allNotes.filter(note => !note.demoClass);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative',
      padding: '10px',
      height: '70vh',
      width: '45vw',
      border: '2px solid black',
      boxShadow: '2px 2px 5px #aaa',
      backgroundColor: 'white',
      overflowY: 'auto'
    }}>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999
      }}>
        <button
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={handleMenuToggle}
        >
          <FaPlus style={{ marginRight: '10px' }} />
        </button>
        {showMenu && (
          <ul
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#aaa1a1',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '5px',
              listStyle: 'none',
              padding: '10px 0',
              marginTop: '10px',
              zIndex: 1000
            }}
          >
            <li
              onClick={handleAddModal}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Add Notes
            </li>
            <li
              onClick={handleEditModal}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Edit Notes
            </li>
            <li
              onClick={handleDeleteModal}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
            >
              Delete Notes
            </li>
          </ul>
        )}
      </div>

      <NotesParent notes={filteredNotes} />

      {modalType === 'add' && (
        <div ref={modalRef} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#aaa1a1',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <input
            type="text"
            placeholder="Topic"
            value={newNote.topic}
            onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Time"
            value={newNote.time}
            onChange={(e) => setNewNote({ ...newNote, time: e.target.value            })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Professor"
            value={newNote.professor}
            onChange={(e) => setNewNote({ ...newNote, professor: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <button
            onClick={handleAddNote}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding: '10px 20px'
            }}
          >
            Add Note
          </button>
        </div>
      )}

      {modalType === 'edit' && (
        <div ref={modalRef} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#aaa1a1',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <input
            type="text"
            placeholder="Topic"
            value={editedNote.topic}
            onChange={(e) => setEditedNote({ ...editedNote, topic: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Time"
            value={editedNote.time}
            onChange={(e) => setEditedNote({ ...editedNote, time: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <input
            type="text"
            placeholder="Professor"
            value={editedNote.professor}
            onChange={(e) => setEditedNote({ ...editedNote, professor: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <button
            onClick={handleEditNote}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding: '10px 20px'
            }}
          >
            Save Changes
          </button>
        </div>
      )}

      {modalType === 'delete' && (
        <div ref={modalRef} style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#aaa1a1',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <p style={{ marginBottom: '15px' }}>Are you sure you want to delete this note?</p>
          <button
            onClick={handleDeleteNote}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding: '10px 20px',
              marginRight: '10px'
            }}
          >
            Delete
          </button>
          <button
            onClick={() => setModalType(null)}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding: '10px 20px'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default SideScroll;
