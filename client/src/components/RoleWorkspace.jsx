import React from 'react';
import { Activity, BarChart3, Building2, CheckCircle2, ClipboardCheck, Clock3, FileCheck2, FileText, Gauge, ShieldCheck, TriangleAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const roleDetails = {
  Business: {
    eyebrow: 'BUSINESS WORKSPACE',
    title: 'Instrument verification workspace',
    description: 'Register instruments, follow applications and access issued verification records.',
    actions: [['/business/instruments/register', 'Register instrument'], ['/business/applications', 'Track applications']],
    metrics: [['24', 'Registered instruments', Gauge], ['03', 'Applications in progress', Clock3], ['19', 'Verified instruments', CheckCircle2]],
    links: [['/business/instruments', 'My instruments', 'Manage registered instruments'], ['/business/certificates', 'Certificates', 'View issued verification records'], ['/business/complaints', 'Complaints', 'Contact the responsible authority']]
  },
  LMO: {
    eyebrow: 'LEGAL METROLOGY OFFICER WORKSPACE',
    title: 'Officer review centre',
    description: 'Inspect application evidence, run advisory checks and record transparent workflow recommendations.',
    actions: [['/lmo/applications', 'Open review queue'], ['/lmo/reports', 'View test reports']],
    metrics: [['18', 'Applications in queue', FileText], ['07', 'Inspections pending', ClipboardCheck], ['11', 'Reports to review', FileCheck2]],
    links: [['/lmo/applications', 'Application review', 'Inspect evidence and recommend status changes'], ['/lmo/inspections', 'Inspections', 'Coordinate instrument inspection work'], ['/lmo/reports', 'Test reports', 'Review GATC measurement results']]
  },
  GATC: {
    eyebrow: 'APPROVED TEST CENTRE WORKSPACE',
    title: 'Testing operations centre',
    description: 'Work from assigned test requests, record measurements and submit traceable test reports.',
    actions: [['/gatc/requests', 'View test requests'], ['/gatc/reports', 'Submit test report']],
    metrics: [['06', 'Assigned test requests', ClipboardCheck], ['03', 'Scheduled tests', Clock3], ['12', 'Reports submitted', FileCheck2]],
    links: [['/gatc/requests', 'Test requests', 'Open applications assigned for testing'], ['/gatc/tests', 'Scheduled tests', 'Review the testing calendar'], ['/gatc/reports', 'Submit reports', 'Record readings and test outcomes']]
  },
  HeadOfficer: {
    eyebrow: 'HEAD OFFICER AUTHORITY WORKSPACE',
    title: 'Final approval authority',
    description: 'Review complete case packages and make the authorized final decision for certificate issuance.',
    actions: [['/head/approvals', 'Review approvals'], ['/head/audit-logs', 'Audit trail']],
    metrics: [['04', 'Awaiting final decision', ShieldCheck], ['02', 'Approved this week', CheckCircle2], ['01', 'Returned for correction', TriangleAlert]],
    links: [['/head/approvals', 'Final approvals', 'Accept, reject or return reviewed applications'], ['/head/audit-logs', 'Audit trail', 'Review recorded authority actions']]
  },
  Admin: {
    eyebrow: 'SYSTEM ADMINISTRATION WORKSPACE',
    title: 'Platform administration',
    description: 'Monitor the workflow, manage platform records and inspect operational signals.',
    actions: [['/admin/applications', 'View applications'], ['/admin/users', 'Manage users']],
    metrics: [['125', 'Total applications', FileText], ['48', 'Active users', Users], ['98.2%', 'Traceable records', Activity]],
    links: [['/admin/users', 'User administration', 'Review authorized workspace accounts'], ['/admin/applications', 'Application records', 'Monitor the full application pipeline'], ['/admin/analytics', 'Operational analytics', 'Inspect system-wide workflow signals']]
  }
};

export default function RoleWorkspace({ role }) {
  const detail = roleDetails[role] || roleDetails.Business;
  return <main className="content role-workspace"><div className="page-heading"><div><div className="eyebrow">{detail.eyebrow}</div><h1>{detail.title}</h1><p>{detail.description}</p></div><div className="heading-actions">{detail.actions.map(([to, label]) => <Link className="btn btn-primary" to={to} key={to}>{label}</Link>)}</div></div><div className="kpi-grid">{detail.metrics.map(([value, label, Icon]) => <div className="kpi" key={label}><div className="kpi-icon blue"><Icon size={19}/></div><div className="kpi-copy"><span>{label}</span><strong>{value}</strong><small>Live workspace signal</small></div></div>)}</div><section className="role-intro"><div className="role-intro-icon"><ShieldCheck size={22}/></div><div><strong>Authorized access only</strong><p>This workspace shows tools and records for the {role === 'HeadOfficer' ? 'Head Officer' : role} role. Decisions remain traceable to the signed-in account.</p></div></section><div className="role-link-grid">{detail.links.map(([to, title, description]) => <Link className="role-link-panel" to={to} key={to}><div className="role-link-icon">{role === 'HeadOfficer' ? <ShieldCheck size={19}/> : role === 'GATC' ? <ClipboardCheck size={19}/> : role === 'LMO' ? <FileCheck2 size={19}/> : role === 'Admin' ? <BarChart3 size={19}/> : <Building2 size={19}/>}</div><div><h2>{title}</h2><p>{description}</p></div><span>Open</span></Link>)}</div></main>;
}
