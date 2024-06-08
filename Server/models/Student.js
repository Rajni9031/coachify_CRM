const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  batchName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
