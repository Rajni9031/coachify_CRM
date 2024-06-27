import React from 'react';

// Function to convert date to IST and get the date part only
const convertToISTDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' };
    return date.toLocaleDateString('en-IN', options);
};

const CardComponent = ({ noteTitle, noteDate, noteContent, noteClass, demoClass }) => {
    // Convert noteClass to IST date
    const dateOnly = noteClass ? convertToISTDate(noteClass) : '';

    // Set background color based on demoClass property
    const cardBackgroundColor = demoClass ? '#d4edda' : 'rgb(228, 226, 226)'; // Green background for demo classes

    return (
        <div style={{ flexBasis: '80%', maxWidth: '80%', padding: '0 15px', marginBottom: '30px' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minWidth: '0', wordWrap: 'break-word', backgroundColor: cardBackgroundColor, backgroundClip: 'border-box', border: '0 solid transparent', borderRadius: '10px', margin: '10px', padding: '1.57rem' }}>
                <span style={{ position: 'absolute', width: '3px', height: '35px', left: '0', backgroundColor: 'rgba(82, 95, 127, 0.5)' }}></span>
                <h5 style={{ marginBottom: '0', fontSize: '1rem', width: '75%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} data-noteheading={noteTitle}>
                    {noteTitle} <i className="fa fa-circle" style={{ color: 'rgba(82, 95, 127, 0.5)', fontSize: '10px', marginLeft: '4px' }}></i>
                </h5>
                <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{noteDate}</p>
                <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                        {noteContent}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>{dateOnly}</div>
            </div>
        </div>
    );
};

export default CardComponent;
