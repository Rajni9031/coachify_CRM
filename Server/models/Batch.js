const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true,unique:true },
  description: { type: String },
  startDate: { type: String, required: true },
  object: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ]
});

const Batch = mongoose.model('Batch', batchSchema);
module.exports = Batch;