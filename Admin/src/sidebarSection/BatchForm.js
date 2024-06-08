import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BatchForm({ onAddBatch, onEditBatch, onCancel, isEditMode, batchToEdit }) {
  const [batchName, setBatchName] = useState('');
  const [batchDescription, setBatchDescription] = useState('');

  // Set initial values if in edit mode
  useEffect(() => {
    if (isEditMode && batchToEdit) {
      setBatchName(batchToEdit.label);
      setBatchDescription(batchToEdit.description);
    }
  }, [isEditMode, batchToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBatch = {
      name: batchName,
      description: batchDescription
    };
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:7000/api/batch/${batchToEdit._id}`, newBatch);
        onEditBatch({ ...batchToEdit, label: batchName, description: batchDescription });
      } else {
        const response = await axios.post('http://localhost:7000/api/batch', newBatch);
        onAddBatch({ href: '/BatchDetail', label: batchName, description: batchDescription });
        setBatchName('');
        setBatchDescription('');
      }
    } catch (error) {
      console.error('Error saving batch:', error);
    }
  };

  return (
    <div className="batch-form-container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="batchName" className="form-label">Batch Name</label>
          <input
            type="text"
            className="form-control"
            id="batchName"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="batchDescription" className="form-label">Batch Description</label>
          <textarea
            className="form-control"
            id="batchDescription"
            value={batchDescription}
            onChange={(e) => setBatchDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">{isEditMode ? 'Update' : 'Done'}</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default BatchForm;
