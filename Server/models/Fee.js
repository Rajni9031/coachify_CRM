const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  totalFee: { type: Number, required: true },
  registrationFee: { type: Number, required: true },
  scholarship: { type: Number, default: 0 },
  installments: [{
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    paid: { type: Boolean, default: false }
  }]
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;