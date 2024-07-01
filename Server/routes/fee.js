const express = require('express');
const Fee = require('../models/Fee');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const router = express.Router();
const mongoose = require('mongoose');

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
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.find(); 
    res.status(200).json(fees);
  } catch (err) {
    console.error('Error fetching all student data:', err);
    res.status(500).json({ error: 'Failed to fetch all student data' });
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

    // Map fee details to include student information and installments
    const detailedFeeInfo = feeDetails.map(fee => {
      const student = students.find(student => student._id.toString() === fee.studentId.toString());
      return {
        ...fee.toObject(),
        studentName: `${student.firstName} ${student.lastName}`,
        enrollmentNo: student.enrollmentNo,
        installments: fee.installments, // Include installments in response
      };
    });

    res.status(200).json(detailedFeeInfo);
  } catch (err) {
    console.error('Error fetching fee details for batch:', err);
    res.status(500).json({ error: 'Failed to fetch fee details for batch' });
  }
});

router.get('/all', async (req, res) => {
  try {
    // Fetch all fee details
    const feeDetails = await Fee.find().lean();

    if (!feeDetails.length) {
      return res.status(404).json({ error: 'No fee details found for any student' });
    }

    // Extract unique student IDs from fee details
    const studentIds = [...new Set(feeDetails.map(fee => fee.studentId.toString()))];

    // Fetch student details for all unique student IDs
    const students = await Student.find({ _id: { $in: studentIds } }, 'firstName lastName enrollmentNo').lean();

    if (!students.length) {
      console.error('No students found for fetched fee details');
      return res.status(404).json({ error: 'No students found for fetched fee details' });
    }

    // Map fee details to include student information
    const detailedFeeInfo = feeDetails.map(fee => {
      const student = students.find(student => student._id.toString() === fee.studentId.toString());
      if (!student) {
        console.error(`Student not found for fee entry: ${fee._id}`);
        return { ...fee, studentName: 'Unknown', enrollmentNo: 'Unknown' };
      }
      return {
        ...fee,
        studentName: `${student.firstName} ${student.lastName}`,
        enrollmentNo: student.enrollmentNo,
      };
    });

    res.status(200).json(detailedFeeInfo);
  } catch (error) {
    console.error('Error fetching fee details for all students:', error);
    res.status(500).json({ error: 'Failed to fetch fee details for all students' });
  }
});

router.put('/installment/:feeId/:installmentId', async (req, res) => {
  try {
    const { feeId, installmentId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(feeId) || !mongoose.Types.ObjectId.isValid(installmentId)) {
      return res.status(404).json({ error: 'Invalid ObjectId provided' });
    }

    // Find fee by its ObjectId
    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ error: 'Fee details not found' });
    }

    // Find installment within fee's installments array by its ObjectId
    const installment = fee.installments.id(installmentId);
    if (!installment) {
      return res.status(404).json({ error: 'Installment not found' });
    }

    // Update installment's paid status
    installment.paid = req.body.paid;

    // Save fee document to persist changes
    await fee.save();

    // Respond with updated fee document
    res.status(200).json(fee);
  } catch (error) {
    console.error('Error updating installment status:', error);
    res.status(500).json({ error: 'Failed to update installment status' });
  }
});


module.exports = router;