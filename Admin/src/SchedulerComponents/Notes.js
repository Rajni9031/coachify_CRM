import React from 'react';
import CardComponent from './CardComponent';

const NotesParent = ({ notes, isAdmin }) => {
    return (
        <div className="page-content container note-has-grid">
            <div id="note-full-container" className="note-has-grid row" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {notes ? (
                    notes.map((note, index) => (
                        <CardComponent
                            key={index}
                            noteTitle={note.topic}
                            noteDate={note.time}
                            noteContent={note.professor}
                            noteClass={note.latestClassDate}
                            demoClass={note.demoClass}
                            isAdmin={isAdmin} // Pass isAdmin prop to CardComponent
                        />
                    ))
                ) : (
                    <h1 style={{ textAlign: 'center', width: '100%' }}>No Schedule Yet</h1>
                )}
            </div>
        </div>
    );
};

export default NotesParent;
