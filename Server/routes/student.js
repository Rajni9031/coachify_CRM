const express = require('express');
const nodemailer = require('nodemailer');
const Student = require('../models/Student');
const Batch = require('../models/Batch')
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();



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
const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $addToSet: { object: student._id } }, // Using $addToSet to avoid duplicates
      { new: true, runValidators: true }
    );
    console.log(batch);
    // Log the email user (for debugging purposes, avoid logging the password)
    console.log('EMAIL_USER:', process.env.EMAIL_USER);

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,// Use your email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password (or app password if using 2FA)
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: emailId, // Recipient address
      subject: 'Welcome to the batch', // Subject line
      text: `Hello ${firstName},\n\nYou have been successfully enrolled in the batch with ID ${batchId}.`, // Plain text body
      // html: `<p>Hello ${firstName},</p><p>You have been successfully enrolled in the batch with ID ${batchId}.</p>` // HTML body
    };

    // Send the email
    try {
      const info = transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ status: "success", message: "Student saved and email sent successfully", info: info.response });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      res.status(500).json({ status: "error", message: "Failed to send email", error: emailError.message });
    }
  } catch (error) {
    console.error("Error saving student:", error);
    if (error.code === 11000) {
      res.status(400).json({ status: "error", message: "Enrollment number already exists. Please use a different enrollment number." });
    } else {
      res.status(500).json({ status: "error", message: "Failed to save student" });
    }
  }
});

    // const subject = 'Welcome to the batch';
    // const text = `Hello ${firstName},\n\nYou have been successfully enrolled in the batch with ID ${batchId}.`;
    // const html = `<p>Hello ${firstName},</p><p>You have been successfully enrolled in the batch with ID ${batchId}.</p>`;

 
// Get all students
router.get('/:id/students', async (req, res) => {
  try {
    const batchId = req.params.id;

    // Find the batch document
    const batch = await Batch.findById(batchId);

    if (!batch) {
      return res.status(404).send({ error: 'Batch not found' });
    }

    // Initialize an array to hold student details
    const studentDetails = [];

    // Loop through the object array to get each student's details
    for (const studentId of batch.object) {
      const student = await Student.findById(studentId);
      if (student) {
        studentDetails.push(student);
      }
    }

    // Send the array of student details
    res.status(200).send(studentDetails);
  } catch (err) {
    console.error('Error fetching students for batch:', err.message);
    res.status(500).send({ error: err.message });
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

    await sendEmail(
      emailId, // Send email to the student's email address
      'Your details have been updated',
      `Hello ${firstName},\n\nYour student details have been updated.`,
      `<p>Hello ${firstName},</p><p>Your student details have been updated.</p>`
    );

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

    await sendEmail(
      student.emailId, // Send email to the student's email address
      'Your enrollment has been removed',
      `Hello ${student.firstName},\n\nYour enrollment in the batch has been removed.`,
      `<p>Hello ${student.firstName},</p><p>Your enrollment in the batch has been removed.</p>`
    );

    res.status(200).send('Student deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
