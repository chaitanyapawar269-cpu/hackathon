import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Instrument, Application, TestReport } from './models/index.js';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '.env') });
const passwordHash = await bcrypt.hash('Demo@12345', 12);
await mongoose.connect(process.env.MONGO_URI);
const accounts = [
  { name: 'Ananya Rao', email: 'business@smartmetrix.demo', role: 'BUSINESS' },
  { name: 'R. Kulkarni', email: 'lmo@smartmetrix.demo', role: 'LMO' },
  { name: 'Pune Metrology Test Centre', email: 'gatc@smartmetrix.demo', role: 'GATC' },
  { name: 'Head Approving Authority', email: 'head@smartmetrix.demo', role: 'HEAD_OFFICER' },
  { name: 'Platform Administrator', email: 'admin@smartmetrix.demo', role: 'ADMIN' }
];
const users = {};
for (const account of accounts) users[account.role] = await User.findOneAndUpdate({ email: account.email }, { ...account, passwordHash, active: true }, { upsert: true, new: true, setDefaultsOnInsert: true });
let instrument = await Instrument.findOne({ serialNumber: 'WS-98473' });
if (!instrument) instrument = await Instrument.create({ business: users.BUSINESS._id, type: 'Digital Weighing Machine', category: 'Weighing instrument', manufacturer: 'ABC Instruments', modelNumber: 'ABC-150', serialNumber: 'WS-98473', capacity: '150 kg', accuracyClass: 'III', installationLocation: 'Pune, Maharashtra', expiryDate: new Date('2027-09-05'), status: 'PENDING' });
let application = await Application.findOne({ instrument: instrument._id });
if (!application) application = await Application.create({ business: users.BUSINESS._id, instrument: instrument._id, status: 'OFFICER_REVIEW', assignedOfficer: users.LMO._id, remarks: 'DEMO DATA - NOT GOVERNMENT RECORDS' });
if (!await TestReport.findOne({ application: application._id })) await TestReport.create({ application: application._id, gatc: users.GATC._id, readings: [{ observed: 150.02, reference: 150, error: 0.02, permissibleError: 0.15 }], result: 'PASS', anomalyFlag: false, remarks: 'Synthetic demonstration report.' });
console.log('Seeded demo accounts and workflow records. Password: Demo@12345');
await mongoose.disconnect();
