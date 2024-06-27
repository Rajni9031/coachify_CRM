const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Batch = require('../models/Batch'); // Assuming Batch model is imported

// Get schedules for all batches on the current date
router.get('/schedules/today', async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to midnight to compare only the date part

    // Aggregate and filter schedules for all students
    const schedulesForToday = await Student.aggregate([
      {
        $match: {
          'schedule.classDate': {
            $gte: currentDate,
            $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // Next day
          }
        }
      },
      {
        $unwind: '$schedule'
      },
      {
        $match: {
          'schedule.classDate': {
            $gte: currentDate,
            $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // Next day
          }
        }
      },
      {
        $group: {
          _id: '$batchId',
          schedules: { $first: '$schedule.classes' }
        }
      },
      {
        $lookup: {
          from: 'batches', // Collection name in MongoDB
          localField: '_id',
          foreignField: '_id',
          as: 'batchInfo'
        }
      },
      {
        $unwind: '$batchInfo'
      },
      {
        $project: {
          _id: 0,
          batchId: '$_id',
          batchName: '$batchInfo.name',
          schedules: 1
        }
      }
    ]);

    // Include batches with no schedules for today
    const allBatches = await Batch.find({});
    const result = allBatches.map(batch => {
      const batchSchedule = schedulesForToday.find(s => s.batchId.equals(batch._id));
      return {
        batchId: batch._id,
        batchName: batch.name,
        schedules: batchSchedule ? batchSchedule.schedules : 'No classes scheduled for today'
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching schedules for today:', err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
