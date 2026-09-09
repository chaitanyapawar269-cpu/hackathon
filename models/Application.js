const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicant: { type: String, required: true },
  businessName: String,
  businessType: String,
  service: { type: String, required: true },
  status: { type: String, default: 'Application Submitted' },
  submittedAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  currentStage: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);