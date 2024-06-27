const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Batch = require('../models/Batch');
const Student = require('../models/Student');

// Get schedules for all batches on the current date
router.get('/schedules/today', async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part

    // Find all batches
    const batches = await Batch.find().exec();

    // Initialize an array to hold the schedules
    const schedulesForToday = [];

    for (const batch of batches) {
      // Find all students in the current batch
      const students = await Student.find({ batchId: batch._id }).exec();

      // Collect schedules for the current date from all students in the batch
      const batchSchedules = [];

      for (const student of students) {
        const todaySchedules = student.schedule.filter(
          sch => new Date(sch.classDate).toDateString() === currentDate.toDateString()
        );

        if (todaySchedules.length > 0) {
          batchSchedules.push({
            studentId: student._id,
            studentName: `${student.firstName} ${student.lastName}`,
            schedule: todaySchedules
          });
        }
      }

      if (batchSchedules.length > 0) {
        schedulesForToday.push({
          batchId: batch._id,
          batchName: batch.name,
          schedules: batchSchedules
        });
      }
    }

    res.status(200).json(schedulesForToday);
  } catch (err) {
    console.error('Error fetching schedules for today:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
