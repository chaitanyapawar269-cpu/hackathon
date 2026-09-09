const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, default: 'Other' },
  businessName: String,
  location: { type: String, default: 'Demo location' },
  description: String,
  status: { type: String, default: 'Registered' },
  createdAt: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);