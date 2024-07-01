import React, { useState, useEffect, useRef, useContext } from 'react';
import NotesParent from './Notes';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { DateContext } from './DateContext';

const APP = process.env.REACT_APP_API_URL;

function SideScroll({ showbar, joiningDate, batchStartDate, showDemoClasses, isAdmin }) {
  const [isVisible, setIsVisible] = useState(showbar);
  const [showMenu, setShowMenu] = useState(false);
  const { batchId } = useParams();
  const { clickedDate } = useContext(DateContext);

  // Initialize allNotes with an empty array
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
        setAllNotes(response.data.classes || []); // Ensure to handle undefined response.data.classes
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
    if (selectedNoteIndex !== null && allNotes.length > 0) {
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
    window.location.reload();
  };

  const handleEditNote = async () => {
    if (selectedNoteIndex !== null && allNotes.length > 0) {
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
    window.location.reload();
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
      border: '1px solid #d1d1d1', 
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 10px', 
      fontFamily: 'GestaRegular, Arial, Helvetica, sans-serif', 
      overflow: 'auto', 
      marginLeft: '2vw', 
      borderRadius: '10px', 
      backgroundColor: '#e8efff' 
    }}>
      {isVisible && (
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          cursor: 'pointer', 
          backgroundColor: '#fff', 
          border: '1px solid #ccc', 
          borderRadius: '50%', 
          padding: '8px', 
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
        }} 
        onClick={handleMenuToggle}
        >
           <FaPlus />
        </div>
      )}
      {showMenu && (
        <div ref={dropdownRef} style={{ 
          position: 'absolute', 
          top: '40px', 
          right: '10px', 
          background: '#efdddd', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', 
          zIndex: 1000 
        }}>
          <div style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s ease' 
          }} 
          onClick={handleEditModal}
          >
            Edit Note
          </div>
          <div style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s ease' 
          }} 
          onClick={handleAddModal}
          >
            Add New Note
          </div>
          <div style={{ 
            padding: '10px 20px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s ease' 
          }} 
          onClick={handleDeleteModal}
          >
            Delete Note
          </div>
        </div>
      )}

      <NotesParent notes={filteredNotes} isAdmin={isAdmin} />

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
            onChange={(e) => setNewNote({ ...newNote, time: e.target.value })}
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
          <label>
            <input
              type="checkbox"
              checked={newNote.demoClass}
              onChange={(e) => setNewNote({ ...newNote, demoClass: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            Demo Class
          </label>
          <button
            onClick={handleAddNote}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              padding: '10px 20px',
              marginTop: '15px'
            }}
          >
            Add Note
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
          <p style={{ fontWeight: 'bold' }}>Select a note to delete:</p>
          <ul>
            {allNotes.map((note, index) => (
              <li 
                style={{ 
                  marginTop: '20px', 
                  marginBottom: '20px', 
                  listStyleType: 'none', 
                  color: selectedNoteIndex === index ? 'red' : 'black', 
                  fontSize: 'larger', 
                  cursor: 'pointer' 
                }} 
                key={index} 
                onClick={() => setSelectedNoteIndex(index)}
              >
                {note.topic}
              </li>
            ))}
          </ul>
          <button 
            onClick={handleDeleteNote} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              transition: 'background-color 0.3s ease' 
            }}
          >
            Delete
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
          <p style={{ fontWeight: 'bold' }}>Select a note to edit:</p>
          <ul>
            {allNotes.map((note, index) => (
              <li 
                style={{ 
                  marginTop: '20px', 
                  marginBottom: '20px', 
                  listStyleType: 'none', 
                  color: selectedNoteIndex === index ? 'blue' : 'black', 
                  fontSize: 'larger', 
                  cursor: 'pointer' 
                }} 
                key={index} 
                onClick={() => setSelectedNoteIndex(index)}
              >
                {note.topic}
              </li>
            ))}
          </ul>
          {selectedNoteIndex !== null && (
            <div>
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
              <textarea 
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
                  padding: '10px 20px', 
                  backgroundColor: '#007bff', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  transition: 'background-color 0.3s ease' 
                }}
              >
                Update
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SideScroll;
