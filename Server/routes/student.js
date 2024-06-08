const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Create a new student
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, enrollmentNumber, batchName, email, password, startDate, endDate } = req.body;
    const student = new Student({
      firstName,
      lastName,
      enrollmentNumber,
      batchName,
      email,
      password,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
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
    const students = await Student.find();
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
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
    const { firstName, lastName, enrollmentNumber, batchName, email, password, startDate, endDate } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        enrollmentNumber,
        batchName,
        email,
        password,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      { new: true, runValidators: true }
    );
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
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.status(200).send('Student deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
