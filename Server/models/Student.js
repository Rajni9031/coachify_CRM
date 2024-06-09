const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrollmentNo: { type: String, required: true, unique: true },
  emailId: { type: String, required: true },
  password: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
