const express = require('express');
const Fee = require('../models/Fee');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const router = express.Router();

// Create or update fee details for a student
router.post('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const feeDetails = req.body;

    // Upsert fee details for the student
    const fee = await Fee.findOneAndUpdate(
      { studentId },
      { ...feeDetails, studentId },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(fee);
  } catch (error) {
    console.error('Error saving fee details:', error);
    res.status(500).json({ error: 'Failed to save fee details' });
  }
});

// Get fee details for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const fee = await Fee.findOne({ studentId });

    if (!fee) {
      return res.status(404).json({ error: 'Fee details not found' });
    }

    res.status(200).json(fee);
  } catch (error) {
    console.error('Error fetching fee details:', error);
    res.status(500).json({ error: 'Failed to fetch fee details' });
  }
});

router.get('/batch/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    console.log(`Fetching batch with ID: ${batchId}`);

    // Fetch the batch details and populate the 'object' field with student documents
    const batch = await Batch.findById(batchId).populate('object');

    if (!batch) {
      console.error(`Batch not found with ID: ${batchId}`);
      return res.status(404).json({ error: 'Batch not found' });
    }

    console.log(`Batch found: ${batch}`);

    // Extract student IDs from the populated batch
    const studentIds = batch.object.map(student => student._id);

    console.log(`Student IDs in batch: ${studentIds}`);

    // Fetch student details
    const students = await Student.find({ _id: { $in: studentIds } }, 'firstName lastName enrollmentNo');

    if (!students.length) {
      console.error(`No students found for batch with ID: ${batchId}`);
      return res.status(404).json({ error: 'No students found for this batch' });
    }

    console.log(`Students found: ${students}`);

    // Fetch fee details for all students in the batch
    const feeDetails = await Fee.find({ studentId: { $in: studentIds } });

    if (!feeDetails.length) {
      console.error(`No fee details found for students in batch with ID: ${batchId}`);
      return res.status(404).json({ error: 'No fee details found for students in this batch' });
    }

    console.log(`Fee details found: ${feeDetails}`);

    // Map fee details to include student information
    const detailedFeeInfo = feeDetails.map(fee => {
      const student = students.find(student => student._id.toString() === fee.studentId.toString());
      return {
        ...fee.toObject(),
        studentName: `${student.firstName} ${student.lastName}`,
        enrollmentNo: student.enrollmentNo
      };
    });

    res.status(200).json(detailedFeeInfo);
  } catch (err) {
    console.error('Error fetching fee details for batch:', err);
    res.status(500).json({ error: 'Failed to fetch fee details for batch' });
  }
});

module.exports = router;