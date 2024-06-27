
const express = require('express');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const router = express.Router();

// Create a new batch
router.post('/', async (req, res) => {
  try {
    console.log('Request body:', req.body);
    let { name, description, startDate } = req.body;
    
    // Replace spaces and slashes with underscores in the name
    name = name.replace(/[\/\s]+/g, '_');

    const batch = await new Batch({ name, description, startDate, object: [] }).save();
    res.status(201).send(batch);
  } catch (err) {
    console.error('Error creating batch:', err.message);
    res.status(400).send({ error: err.message });
  }
});



// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find();
    res.status(200).send(batches);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a batch by ID
router.get('/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).send('Batch not found');
    }
    res.status(200).send(batch);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a batch
router.put('/:id', async (req, res) => {
  try {
    let { name, description, startDate } = req.body;

    // Replace spaces and slashes with underscores in the batch name
    if (name) {
      name = name.replace(/[\s\/]/g, '_');
    }

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      { name, description, startDate },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).send('Batch not found');
    }

    res.status(200).send(batch);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a batch
router.delete('/:id', async (req, res) => {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).send('Batch not found');
    }
    res.status(200).send('Batch deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add or update schedule for a batch
router.post("/:batchId/schedule", async (req, res) => {
  try {
    const { batchId } = req.params;
    const schedules = req.body;

    // Find the batch by ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send("Batch not found");
    }

    // Ensure batch.object is iterable (assuming it's an array of student IDs)
    const studentIds = batch.object;
    if (!Array.isArray(studentIds)) {
      return res.status(400).send("Invalid students format in batch");
    }

    // Process each student in the batch
    for (const studentId of studentIds) {
      // Find student by ID
      const student = await Student.findById(studentId);
      if (!student) continue; // Skip if student not found

      // Process each schedule in the schedules array
      schedules.forEach((schedule) => {
        const { classDate, classes } = schedule;
        const parsedDate = new Date(classDate);

        if (isNaN(parsedDate)) {
          throw new Error(`Invalid date format for classDate: ${classDate}`);
        }

        classes.forEach((newClass) => {
          let existingClassFound = false;

          // Check if there is an existing schedule for the parsed date
          let existingSchedule = student.schedule.find(
            sch => sch.classDate.toDateString() === parsedDate.toDateString()
          );

          if (existingSchedule) {
            // Update or add classes to the existing schedule
            existingSchedule.classes.forEach((existingClass) => {
              if (existingClass.topic === newClass.topic) {
                existingClass.time = newClass.time;
                existingClass.professor = newClass.professor;
                existingClass.latestClassDate = parsedDate;
                existingClassFound = true;
              }
            });

            if (!existingClassFound) {
              existingSchedule.classes.push({
                topic: newClass.topic,
                time: newClass.time,
                professor: newClass.professor,
                latestClassDate: parsedDate
              });
            }
          } else {
            // Create a new schedule entry if no existing schedule is found for the date
            student.schedule.push({
              classDate: parsedDate,
              classes: [{
                topic: newClass.topic,
                time: newClass.time,
                professor: newClass.professor,
                latestClassDate: parsedDate
              }]
            });
          }

          // Update previous entries with the new class details
          student.schedule.forEach((existingSchedule) => {
            existingSchedule.classes.forEach((existingClass) => {
              if (existingClass.topic === newClass.topic && existingClass.latestClassDate < parsedDate) {
                existingClass.time = newClass.time;
                existingClass.professor = newClass.professor;
                existingClass.latestClassDate = parsedDate;
              }
            });
          });
        });
      });

      // Save the student object after updating schedules
      await student.save();
    }

    res.status(200).send("Schedules updated for all students in the batch");
  } catch (err) {
    console.error("Error adding/updating schedule for batch:", err);
    res.status(500).send(err.message);
  }
});


// Editing the batch
router.put("/:batchId/schedule/:classDate/:classId", async (req, res) => {
  try {
    const { batchId, classDate, classId } = req.params;
    const { topic, time, professor, latestClassDate } = req.body;

    console.log(`Received PUT request with batchId: ${batchId}, classDate: ${classDate}, classId: ${classId}`);

    // Find the batch by ID
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send("Batch not found");
    }

    // Ensure batch.object is iterable (assuming it's an array of student IDs)
    const studentIds = batch.object;
    if (!Array.isArray(studentIds)) {
      return res.status(400).send("Invalid students format in batch");
    }

    const parsedDate = new Date(classDate);
    if (isNaN(parsedDate)) {
      return res.status(400).send("Invalid classDate format");
    }

    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (!student) continue;

      let existingSchedule = student.schedule.find(
        sch => new Date(sch.classDate).toDateString() === parsedDate.toDateString()
      );

      if (existingSchedule) {
        const classIndex = existingSchedule.classes.findIndex(c => c._id.toString() === classId);
        if (classIndex !== -1) {
          existingSchedule.classes[classIndex].topic = topic;
          existingSchedule.classes[classIndex].time = time;
          existingSchedule.classes[classIndex].professor = professor;
          existingSchedule.classes[classIndex].latestClassDate = new Date(latestClassDate);
        } else {
          return res.status(404).send("Class not found in schedule");
        }
      } else {
        return res.status(404).send("Schedule not found for the given date");
      }

      await student.save();
    }

    res.status(200).send("Schedule updated for all students in the batch");
  } catch (err) {
    console.error("Error editing schedule for batch:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});




router.get('/:batchId/schedules', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).send({ error: 'Batch not found' });
    }

    const scheduleDetail = [];
    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (student) {
        scheduleDetail.push({
          studentId: student._id,
          schedule: student.schedule  // Assuming schedule is an array of schedules for the student
        });
      }
    }

    res.status(200).send(scheduleDetail);
  } catch (err) {
    console.error('Error fetching schedules for batch:', err.message);
    res.status(500).send({ error: err.message });
  }
});

router.get("/:batchId/schedule/:date", async (req, res) => {
  try {
    const { batchId, date } = req.params;
    const classDate = new Date(date);

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send("Batch not found");
    }

    let scheduleForSingleStudent = null;

    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (!student) continue;

      const studentSchedule = student.schedule.find(
        (sch) => sch.classDate && sch.classDate.toDateString() === classDate.toDateString()
      );

      if (studentSchedule) {
        scheduleForSingleStudent = {
          studentId: student._id,
          studentName: student.name,
          classDate: studentSchedule.classDate,
          classes: studentSchedule.classes,
        };
        break; // Exit loop after finding the first match
      }
    }

    if (scheduleForSingleStudent) {
      res.status(200).send(scheduleForSingleStudent);
    } else {
      res.status(201).send("No schedule found for the given date in this batch");
    }
  } catch (err) {
    console.error("Error retrieving schedule for date in batch:", err);
    res.status(500).send(err);
  }
});





// Delete all schedules for a batch on a particular day
router.delete('/:batchId/schedule/:date', async (req, res) => {
  try {
    const { batchId, date } = req.params;
    const classDate = new Date(date);

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send('Batch not found');
    }

    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (!student) continue;

      student.schedule = student.schedule.filter(sch => !sch.classDate || sch.classDate.toDateString() !== classDate.toDateString());
      await student.save();
    }

    res.status(200).send('Schedules for the specified date deleted for all students in the batch');
  } catch (err) {
    console.error('Error deleting schedules for date in batch:', err);
    res.status(500).send(err);
  }
});

// Delete all schedules for a batch
router.delete('/:batchId/schedule', async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send('Batch not found');
    }

    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (!student) continue;

      student.schedule = [];
      await student.save();
    }

    res.status(200).send('All schedules deleted for all students in the batch');
  } catch (err) {
    console.error('Error deleting all schedules in batch:', err);
    res.status(500).send(err);
  }
});

router.put('/:batchId/schedule/:classDate/:classId', (req, res) => {
    const { batchId, classDate, classId } = req.params;
    const { topic, time, professor } = req.body;

    if (!scheduleData[batchId] || !scheduleData[batchId][classDate]) {
        return res.status(404).json({ error: 'Schedule not found' });
    }

    const updatedNote = scheduleData[batchId][classDate].find(note => note._id === classId);

    if (!updatedNote) {
        return res.status(404).json({ error: 'Note not found' });
    }

    updatedNote.topic = topic;
    updatedNote.time = time;
    updatedNote.professor = professor;

    res.json(updatedNote);
});

// Delete a particular class from the schedule of all students in a batch on a specific date
router.delete('/:batchId/schedule/:date/:classId', async (req, res) => {
  try {
    const { batchId, date, classId } = req.params;
    const classDate = new Date(date);

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).send('Batch not found');
    }

    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (!student) continue;

      const schedule = student.schedule.find(sch => sch.classDate.toDateString() === classDate.toDateString());
      if (!schedule) continue;

      const classIndex = schedule.classes.findIndex(cls => cls._id.toString() === classId);
      if (classIndex !== -1) {
        schedule.classes.splice(classIndex, 1);
      }

      await student.save();
    }

    res.status(200).send('Class deleted for all students in the batch on the specified date');
  } catch (err) {
    console.error('Error deleting class for date in batch:', err);
    res.status(500).send(err);
  }
});

module.exports = router;