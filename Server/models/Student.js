const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the class schema
const classSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  time: { type: String, required: true },
  professor: { type: String, required: true },
  latestClassDate: { type: Date }, // Latest date of the class on which the same topic is taught
  demoClass: { type: Boolean, default: false } // Add demoClass property
});

// Define the schedule schema
const scheduleSchema = new mongoose.Schema({
  classDate: { type: Date, required: true },
  classes: [classSchema]
});

// Define the student schema
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrollmentNo: { type: String, required: true, unique: true },
  emailId: { type: String, required: true },
  username: { type: String, unique: true }, // Add username field
  password: { type: String, required: true }, 
  batchstartDate: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  schedule: [scheduleSchema] // Add the schedule field
});

// Hash password before saving the student
studentSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
