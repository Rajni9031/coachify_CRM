const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, enrollmentNo, emailId, password, startDate, endDate, batchId } = req.body;
    const student = new Student({
      firstName,
      lastName,
      enrollmentNo,
      emailId,
      password,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      batchId
    });
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('batchId');
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('batchId');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, enrollmentNo, emailId, password, startDate, endDate, batchId } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        enrollmentNo,
        emailId,
        password,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        batchId
      },
      { new: true, runValidators: true }
    ).populate('batchId');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id).populate('batchId');
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send('Student deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
