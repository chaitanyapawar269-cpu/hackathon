const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDatabase } = require('./config/database');
const User = require('./models/User');
const Application = require('./models/Application');
const Complaint = require('./models/Complaint');
const { createToken, requireAuth } = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, 'frontend');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

const services = [
  {
    id: 'license-management',
    title: 'License Management',
    category: 'Business Support',
    description: 'Apply, renew and manage Legal Metrology licenses for manufacturers, dealers, repairers and importers.',
    documents: ['Business registration proof', 'Identity proof', 'Address proof', 'Trade certificate'],
    process: ['Fill application', 'Upload documents', 'Submit fee', 'Department review'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'verification-reverification',
    title: 'Verification & Reverification',
    category: 'Verification',
    description: 'Schedule and complete verification of weighing and measuring instruments for compliance and legal use.',
    documents: ['Instrument details', 'Ownership proof', 'Previous certificate'],
    process: ['Submit request', 'Book inspection', 'Verification done', 'Certificate issued'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'certificate-verification',
    title: 'Certificate Verification',
    category: 'Verification',
    description: 'Check the validity and authenticity of a certificate or instrument verification record.',
    documents: ['Certificate number', 'Instrument number'],
    process: ['Enter certificate ID', 'Check record', 'View result'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'package-registration',
    title: 'Package Commodity Registration',
    category: 'Compliance',
    description: 'Understand packaging declarations, net quantity standards and legal commodity registration requirements.',
    documents: ['Product details', 'Packing list', 'Declaration format'],
    process: ['Review packaging norms', 'Prepare declarations', 'Submit documents'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'application-tracking',
    title: 'Application Tracking',
    category: 'Service Status',
    description: 'Monitor a submitted application through every review and approval stage.',
    documents: ['Application ID'],
    process: ['Track from portal', 'Check latest stage', 'View status'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'complaint-reporting',
    title: 'Complaint / Issue Reporting',
    category: 'Consumer Support',
    description: 'File issues related to incorrect weights, missing declarations, MRP errors and suspected tampering.',
    documents: ['Complaint details', 'Location', 'Business name'],
    process: ['Describe issue', 'Upload evidence', 'Get complaint ID'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'rules-regulations',
    title: 'Rules & Regulations',
    category: 'Government Docs',
    description: 'Access Legal Metrology rules, acts and official guidance for businesses and end users.',
    documents: ['Relevant act/rule', 'Search query'],
    process: ['Search document', 'Review summary', 'Review official source'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  },
  {
    id: 'government-notifications',
    title: 'Government Notifications',
    category: 'Updates',
    description: 'Keep up with official notifications, circulars and revisions impacting legal metrology compliance.',
    documents: ['Notification date', 'Document category'],
    process: ['Browse updates', 'Check relevance', 'Download circular'],
    sourceUrl: 'https://consumeraffairs.nic.in/'
  }
];

const documents = [
  {
    id: 'doc-1',
    title: 'Legal Metrology Act, 2009',
    category: 'Acts',
    description: 'Primary legal framework governing weights, measures and packaged commodities.',
    source: 'Department of Consumer Affairs',
    sourceUrl: 'https://consumeraffairs.nic.in/',
    publishedDate: '2009-04-01'
  },
  {
    id: 'doc-2',
    title: 'Packaged Commodities Rules',
    category: 'Rules',
    description: 'Rules for declarations, MRP, net quantity and packaging compliance.',
    source: 'Government of India',
    sourceUrl: 'https://consumeraffairs.nic.in/',
    publishedDate: '2023-06-15'
  },
  {
    id: 'doc-3',
    title: 'Verification Guidelines 2024',
    category: 'Guidelines',
    description: 'Operational guidance for inspection and verification of measuring and weighing devices.',
    source: 'Legal Metrology Department',
    sourceUrl: 'https://consumeraffairs.nic.in/',
    publishedDate: '2024-02-10'
  },
  {
    id: 'doc-4',
    title: 'Consumer Awareness Flyer',
    category: 'Consumer Awareness Material',
    description: 'Checklist for consumers before buying packaged goods and weighing instruments.',
    source: 'Maharashtra Government',
    sourceUrl: 'https://mahalegmet.gov.in/',
    publishedDate: '2024-08-22'
  }
];

const notifications = [
  { id: 'n1', title: 'Application submitted', message: 'Your license application has been submitted successfully.', type: 'success', date: '2026-09-05' },
  { id: 'n2', title: 'Verification due', message: 'Your certificate expires in 30 days. Please renew in time.', type: 'warning', date: '2026-09-04' },
  { id: 'n3', title: 'New notification', message: 'Updated guidelines on packaged commodity declarations have been published.', type: 'info', date: '2026-09-03' }
];

const analytics = {
  totalApplications: 12540,
  verifiedInstruments: 8200,
  activeLicenses: 1460,
  complaints: 345,
  completedApplications: 9125,
  applicationsByMonth: [
    { month: 'Jan', value: 1100 },
    { month: 'Feb', value: 1200 },
    { month: 'Mar', value: 1300 },
    { month: 'Apr', value: 1350 },
    { month: 'May', value: 1500 },
    { month: 'Jun', value: 1700 }
  ],
  verificationTrend: [
    { month: 'Jan', value: 1000 },
    { month: 'Feb', value: 1100 },
    { month: 'Mar', value: 1250 },
    { month: 'Apr', value: 1500 },
    { month: 'May', value: 1600 },
    { month: 'Jun', value: 1850 }
  ],
  serviceDistribution: [
    { name: 'License Management', value: 30 },
    { name: 'Verification', value: 26 },
    { name: 'Certificate Check', value: 18 },
    { name: 'Complaint Handling', value: 12 },
    { name: 'Consumer Awareness', value: 14 }
  ],
  complaintCategories: [
    { name: 'Incorrect weight', value: 38 },
    { name: 'MRP issue', value: 23 },
    { name: 'Missing declaration', value: 19 },
    { name: 'Tampering', value: 11 },
    { name: 'Other', value: 9 }
  ],
  regionalData: [
    { district: 'Mumbai', count: 260 },
    { district: 'Pune', count: 185 },
    { district: 'Nagpur', count: 150 },
    { district: 'Nashik', count: 120 },
    { district: 'Kolhapur', count: 90 }
  ]
};

const applications = [
  {
    applicationId: 'LMAPP-2026-00045',
    applicant: 'ABC Enterprises',
    service: 'Verification & Reverification',
    submittedAt: '2026-08-20',
    status: 'Documents Under Review',
    updatedAt: '2026-09-05',
    currentStage: 3
  },
  {
    applicationId: 'LMAPP-2026-00076',
    applicant: 'Raman Traders',
    service: 'License Management',
    submittedAt: '2026-08-28',
    status: 'Approved',
    updatedAt: '2026-09-01',
    currentStage: 5
  }
];

const certificates = [
  {
    certificateNumber: 'LM-2026-001245',
    instrument: 'Electronic Weighing Machine',
    owner: 'ABC Enterprises',
    validUntil: '2027-08-14',
    status: 'Verified'
  }
];

const complaints = [];
const demoUsers = [];

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

function publicUser(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role
  };
}

app.get('/api/services', (req, res) => {
  res.json({ success: true, data: services });
});

app.get('/api/services/:id', (req, res) => {
  const service = services.find(item => item.id === req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
});

app.get('/api/documents', (req, res) => {
  res.json({ success: true, data: documents });
});

app.get('/api/notifications', (req, res) => {
  res.json({ success: true, data: notifications });
});

app.get('/api/analytics', (req, res) => {
  res.json({ success: true, data: analytics, label: 'Demo / Sample Data' });
});

app.get('/api/applications/:id', (req, res) => {
  const appData = applications.find(item => item.applicationId === req.params.id);
  if (!appData) return res.status(404).json({ success: false, message: 'Application not found' });
  res.json({ success: true, data: appData });
});

app.get('/api/applications/user', (req, res) => {
  res.json({ success: true, data: applications });
});

app.get('/api/certificates/verify/:number', (req, res) => {
  const certificate = certificates.find(item => item.certificateNumber === req.params.number || item.instrument === req.params.number);
  if (!certificate) {
    return res.json({
      success: true,
      demo: true,
      status: 'Verified',
      message: 'Demo verification data returned for hackathon presentation.',
      data: {
        certificateNumber: req.params.number,
        instrument: 'Electronic Weighing Machine',
        owner: 'ABC Enterprises',
        verificationDate: '15/08/2026',
        validUntil: '14/08/2027',
        authority: 'Legal Metrology Department'
      }
    });
  }
  res.json({ success: true, demo: true, data: certificate });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, mobile, password, userType } = req.body || {};
  if (!name || !email || !mobile || !password || !userType) {
    return res.status(400).json({ success: false, message: 'All registration fields are required.' });
  }
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = isDatabaseConnected()
    ? await User.findOne({ email: normalizedEmail })
    : demoUsers.find(user => user.email === normalizedEmail);
  if (existingUser) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = isDatabaseConnected()
    ? await User.create({ name, email: normalizedEmail, mobile, passwordHash, role: userType })
    : { id: `demo-user-${Date.now()}`, name, email: normalizedEmail, mobile, passwordHash, role: userType };
  if (!isDatabaseConnected()) demoUsers.push(user);
  res.status(201).json({ success: true, message: 'Registration successful', user: publicUser(user), token: createToken(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }
  const normalizedEmail = email.toLowerCase().trim();
  const user = isDatabaseConnected()
    ? await User.findOne({ email: normalizedEmail })
    : demoUsers.find(item => item.email === normalizedEmail);
  const validPassword = user && await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  res.json({ success: true, message: 'Login successful', user: publicUser(user), token: createToken(user) });
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = isDatabaseConnected()
    ? await User.findById(req.user.id)
    : demoUsers.find(item => item.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user: publicUser(user) });
});

app.post('/api/applications', async (req, res) => {
  const payload = req.body;
  const appId = `LMAPP-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(5, '0')}`;
  const record = {
    applicationId: appId,
    userId: req.user?.id,
    applicant: payload.applicant || 'Demo User',
    businessName: payload.businessName,
    businessType: payload.businessType,
    service: payload.service || 'Verification & Reverification',
    status: 'Application Submitted',
    submittedAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    currentStage: 1
  };
  const saved = isDatabaseConnected() ? await Application.create(record) : record;
  if (!isDatabaseConnected()) applications.unshift(record);
  res.json({ success: true, message: 'Application submitted successfully', data: saved });
});

app.post('/api/complaints', async (req, res) => {
  const payload = req.body;
  const complaintId = `LM-CMP-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`;
  const record = {
    complaintId,
    userId: req.user?.id,
    category: payload.category || 'Other',
    businessName: payload.businessName,
    location: payload.location || 'Demo location',
    description: payload.description || '',
    status: 'Registered',
    createdAt: new Date().toISOString().slice(0, 10)
  };
  const saved = isDatabaseConnected() ? await Complaint.create(record) : record;
  if (!isDatabaseConnected()) complaints.unshift(record);
  res.json({ success: true, message: 'Complaint registered successfully', data: saved, note: 'Demo interface only; this is not an official government filing platform.' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Legal Metrology Platform API is running.' });
});

app.use(express.static(FRONTEND_DIR));

app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Legal Metrology platform running on http://localhost:${PORT}`);
  });
}

startServer();
