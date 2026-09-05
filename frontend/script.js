const serviceCatalog = [
  {
    icon: 'fa-solid fa-id-card',
    title: 'License Management',
    description: 'Apply, renew and manage relevant licenses for businesses and traders.',
    docs: ['Business proof', 'Identity', 'Address proof'],
    process: 'Submit → Review → Approval',
    source: 'Official source'
  },
  {
    icon: 'fa-solid fa-scale-balanced',
    title: 'Verification & Reverification',
    description: 'Validate weighing and measuring instruments for compliance and certification.',
    docs: ['Certificate', 'Instrument details'],
    process: 'Request → Inspection → Result',
    source: 'Government portal'
  },
  {
    icon: 'fa-solid fa-certificate',
    title: 'Certificate Verification',
    description: 'Check validity of a certificate and understand verification status.',
    docs: ['Certificate number'],
    process: 'Check → Match → Verified',
    source: 'Official record'
  },
  {
    icon: 'fa-solid fa-box-open',
    title: 'Package Commodity Registration',
    description: 'Review declarations, quantities and packaging requirements.',
    docs: ['Product details', 'Declarations'],
    process: 'Assess → Prepare → Submit',
    source: 'Consumer Affairs'
  },
  {
    icon: 'fa-solid fa-route',
    title: 'Application Tracking',
    description: 'Follow each application stage from submission to approval.',
    docs: ['Application ID'],
    process: 'Track → Review → Status',
    source: 'Portal status'
  },
  {
    icon: 'fa-solid fa-circle-exclamation',
    title: 'Complaint / Issue Reporting',
    description: 'Report incorrect weights, missing declarations or suspected tampering.',
    docs: ['Complaint info', 'Location'],
    process: 'Report → Review → Resolution',
    source: 'Demo interface'
  },
  {
    icon: 'fa-solid fa-book-open',
    title: 'Rules & Regulations',
    description: 'Find the most relevant acts, rules and guidance documents.',
    docs: ['Search by topic'],
    process: 'Search → Read → Apply',
    source: 'Official acts'
  },
  {
    icon: 'fa-solid fa-bell',
    title: 'Government Notifications',
    description: 'Stay informed on recent rule changes, updates and circulars.',
    docs: ['Notification period'],
    process: 'Browse → Review → Track',
    source: 'Government updates'
  }
];

const toast = document.getElementById('toast');

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => toast.classList.remove('visible'), 2400);
}

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('metrologyToken');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
}

const serviceGrid = document.getElementById('serviceGrid');
if (serviceGrid) {
  serviceGrid.innerHTML = serviceCatalog.map((service) => `
    <article class="service-card">
      <div class="service-icon"><i class="${service.icon}"></i></div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <ul>
        <li>${service.docs[0]}</li>
        <li>${service.docs[1] || 'Required records'}</li>
      </ul>
      <div class="card-meta">
        <span>${service.process}</span>
        <span>${service.source}</span>
      </div>
      <button class="primary-btn">View Service</button>
    </article>
  `).join('');
}

const recommendationTitle = document.getElementById('recommendationTitle');
const recommendationReason = document.getElementById('recommendationReason');
const recommendationList = document.getElementById('recommendationList');
const recommendationSource = document.getElementById('recommendationSource');

const serviceMap = {
  'Start a business': {
    title: 'License Management',
    reason: 'You need to understand which legal metrology license applies to your business setup and compliance requirements.',
    docs: ['Business registration proof', 'Identity proof', 'Address proof'],
    source: 'Official source: Department of Consumer Affairs'
  },
  'Renew a license': {
    title: 'License Management',
    reason: 'Your business needs a renewal request and updated supporting documents before expiry.',
    docs: ['Current licence', 'Renewal form', 'Updated documents'],
    source: 'Official source: Department of Consumer Affairs'
  },
  'Verify a weighing instrument': {
    title: 'Verification & Reverification',
    reason: 'You need to validate or confirm whether an instrument is legally compliant and fit for use.',
    docs: ['Instrument details', 'Previous certificate', 'Owner information'],
    source: 'Official source: Legal Metrology Department'
  },
  'Register packaged commodities': {
    title: 'Package Commodity Registration',
    reason: 'Your goods must meet packaged commodity declaration and labeling requirements before sale.',
    docs: ['Product details', 'Packing declaration', 'Label templates'],
    source: 'Official source: Government of India'
  },
  'Check a certificate': {
    title: 'Certificate Verification',
    reason: 'You need to confirm whether a certificate is valid and whether the instrument remains legally compliant.',
    docs: ['Certificate number', 'Instrument number'],
    source: 'Official source: Legal Metrology Department'
  },
  'File a complaint': {
    title: 'Complaint / Issue Reporting',
    reason: 'You should report incorrect weight, missing declarations or suspected tampering through the complaint workflow.',
    docs: ['Issue description', 'Location', 'Business name'],
    source: 'Official source: Consumer complaint portal'
  },
  'Learn about consumer rights': {
    title: 'Consumer Awareness',
    reason: 'You need guidance on MRP, declarations, expiry dates and packaged goods checks before purchase.',
    docs: ['Packaged goods checklist', 'Consumer guidance'],
    source: 'Official source: Consumer Affairs'
  }
};

const optionButtons = document.querySelectorAll('.option-btn');
optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.choice;
    const match = serviceMap[choice] || serviceMap['Verify a weighing instrument'];
    if (!recommendationTitle || !recommendationReason || !recommendationList || !recommendationSource) return;
    recommendationTitle.textContent = match.title;
    recommendationReason.textContent = match.reason;
    recommendationList.innerHTML = match.docs.map((item) => `<li>${item}</li>`).join('');
    recommendationSource.textContent = match.source;
    document.getElementById('recommendationBox').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

document.getElementById('continueWorkflow')?.addEventListener('click', () => {
  document.getElementById('verification').scrollIntoView({ behavior: 'smooth' });
  const input = document.getElementById('verificationInput');
  if (input) input.focus();
});

const licenseForm = document.getElementById('licenseForm');
if (licenseForm) {
  licenseForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(licenseForm);
    const success = document.getElementById('licenseSuccess');
    try {
      const result = await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          applicant: formData.get('applicantName'),
          businessName: formData.get('businessName'),
          businessType: formData.get('businessType'),
          service: formData.get('licenseType')
        })
      });
      success.textContent = `Application submitted successfully. Application ID: ${result.data.applicationId}`;
      success.classList.add('visible');
      licenseForm.reset();
      showToast('Application submitted successfully');
    } catch (error) {
      showToast(error.message);
    }
  });
}

const verificationInput = document.getElementById('verificationInput');
const verifyBtn = document.getElementById('verifyBtn');
const verificationResult = document.getElementById('verificationResult');

if (verifyBtn) {
  verifyBtn.addEventListener('click', async () => {
    const value = (verificationInput?.value || '').trim();
    if (!value) {
      showToast('Please enter a certificate or instrument number.');
      return;
    }
    try {
      const result = await apiRequest(`/api/certificates/verify/${encodeURIComponent(value)}`);
      const data = result.data;
      verificationResult.classList.remove('hidden');
      document.getElementById('resultCertificate').textContent = data.certificateNumber || value;
      document.getElementById('resultInstrument').textContent = data.instrument;
      document.getElementById('resultOwner').textContent = data.owner;
      document.getElementById('resultDate').textContent = data.verificationDate || '15/08/2026';
      document.getElementById('resultValid').textContent = data.validUntil;
      document.getElementById('resultAuthority').textContent = data.authority || 'Legal Metrology Department';
      showToast('Verification successful');
    } catch (error) {
      showToast(error.message);
    }
  });
}

const trackingInput = document.getElementById('trackingInput');
const trackBtn = document.getElementById('trackBtn');
const trackingCard = document.getElementById('trackingCard');

if (trackBtn) {
  trackBtn.addEventListener('click', async () => {
    const value = (trackingInput?.value || '').trim();
    const id = value || 'LMAPP-2026-00045';
    try {
      const result = await apiRequest(`/api/applications/${encodeURIComponent(id)}`);
      const application = result.data;
      document.getElementById('trackingId').textContent = application.applicationId;
      document.getElementById('trackingApplicant').textContent = application.applicant;
      document.getElementById('trackingService').textContent = application.service;
      document.getElementById('trackingDate').textContent = application.submittedAt;
      document.getElementById('trackingUpdated').textContent = application.updatedAt;
      document.getElementById('trackingStatus').textContent = application.status;
      document.getElementById('trackingStatus').className = 'status-badge status-warning';
      const stages = ['Application Submitted', 'Documents Uploaded', 'Documents Under Review', 'Inspector Verification', 'Approved / Rejected', 'Certificate Issued'];
      document.getElementById('trackingTimeline').innerHTML = stages.map((stage, index) => `
        <div class="timeline-item-status ${index === application.currentStage - 1 ? 'current' : ''}">
          <span class="timeline-step"></span><span>${stage}</span>
        </div>
      `).join('');
      trackingCard.classList.remove('hidden');
      showToast('Application status loaded');
    } catch (error) {
      showToast(error.message);
    }
  });
}

const complaintForm = document.getElementById('complaintForm');
if (complaintForm) {
  complaintForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(complaintForm);
    const success = document.getElementById('complaintSuccess');
    try {
      const result = await apiRequest('/api/complaints', {
        method: 'POST',
        body: JSON.stringify({
          category: formData.get('category'),
          businessName: formData.get('businessName'),
          location: formData.get('location'),
          description: formData.get('description')
        })
      });
      success.textContent = `Complaint registered successfully. Complaint ID: ${result.data.complaintId}`;
      success.classList.add('visible');
      complaintForm.reset();
      showToast('Complaint registered successfully');
    } catch (error) {
      showToast(error.message);
    }
  });
}

const documentGrid = document.getElementById('documentGrid');
const documentSearch = document.getElementById('documentSearch');
const documentFilter = document.getElementById('documentFilter');

const documents = [
  { title: 'Legal Metrology Act, 2009', category: 'Acts', date: '2009-04-01', description: 'Primary legal framework governing weights, measures and packaged commodities.', source: 'Department of Consumer Affairs' },
  { title: 'Packaged Commodities Rules', category: 'Rules', date: '2023-06-15', description: 'Standards for declarations, MRP and packaged good labeling.', source: 'Government of India' },
  { title: 'Verification Guidelines 2024', category: 'Guidelines', date: '2024-02-10', description: 'Operational guidance for inspection and verification of measuring devices.', source: 'Legal Metrology Department' },
  { title: 'Consumer Awareness Flyer', category: 'Consumer Awareness Material', date: '2024-08-22', description: 'Checklist for consumers before buying packaged products.', source: 'Maharashtra Government' },
  { title: 'Notification: Declaration Update', category: 'Notifications', date: '2025-01-18', description: 'Official update related to declaration norms and product information.', source: 'Government of India' },
  { title: 'Application Form for Repairer Licence', category: 'Forms', date: '2024-11-21', description: 'Sample form used for legal metrology repairer applications.', source: 'Legal Metrology Department' }
];

function renderDocuments() {
  if (!documentGrid) return;
  const search = (documentSearch?.value || '').toLowerCase();
  const filter = documentFilter?.value || 'all';
  const filtered = documents.filter((doc) => {
    const matchesSearch = !search || doc.title.toLowerCase().includes(search) || doc.description.toLowerCase().includes(search) || doc.category.toLowerCase().includes(search);
    const matchesFilter = filter === 'all' || doc.category === filter;
    return matchesSearch && matchesFilter;
  });

  documentGrid.innerHTML = filtered.map((doc) => `
    <article class="document-card">
      <div class="doc-tag">${doc.category}</div>
      <h3>${doc.title}</h3>
      <p>${doc.description}</p>
      <div class="doc-meta">
        <span>${doc.date}</span>
        <span>${doc.source}</span>
      </div>
      <div class="doc-actions">
        <a href="#">View</a>
        <button type="button">Download</button>
      </div>
    </article>
  `).join('');
}

documentSearch?.addEventListener('input', renderDocuments);
documentFilter?.addEventListener('change', renderDocuments);
renderDocuments();

const notificationList = document.getElementById('notificationList');
const notifications = [
  'Application submitted successfully',
  'Application approved by department',
  'Certificate expiring in 30 days',
  'New government notification released'
];
if (notificationList) {
  notificationList.innerHTML = notifications.map((item) => `<li>${item}</li>`).join('');
}

const loginTrigger = document.getElementById('loginTrigger');
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
if (loginTrigger) {
  loginTrigger.addEventListener('click', () => authModal.classList.remove('hidden'));
}
if (closeAuth) {
  closeAuth.addEventListener('click', () => authModal.classList.add('hidden'));
}

const tabs = document.querySelectorAll('.tab');
const authForms = document.querySelectorAll('.auth-form');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.toggle('active', t === tab));
    authForms.forEach((form) => form.classList.toggle('active-form', form.id === `${tab.dataset.tab}Form`));
  });
});

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
    });
    localStorage.setItem('metrologyToken', result.token);
    localStorage.setItem('metrologyUser', JSON.stringify(result.user));
    authModal.classList.add('hidden');
    document.getElementById('userDashboardSection').hidden = false;
    showToast('Login successful');
  } catch (error) {
    showToast(error.message);
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  try {
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        password: formData.get('password'),
        userType: formData.get('userType')
      })
    });
    localStorage.setItem('metrologyToken', result.token);
    localStorage.setItem('metrologyUser', JSON.stringify(result.user));
    authModal.classList.add('hidden');
    document.getElementById('userDashboardSection').hidden = false;
    showToast('Registration successful');
  } catch (error) {
    showToast(error.message);
  }
});

const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const sendChat = document.getElementById('sendChat');

const assistantResponses = {
  'What license do I need to start a weighing instrument business?': 'Based on the information provided, you may need a relevant Legal Metrology license. Please check the applicable official requirements before applying.',
  'How can I verify a weighing instrument?': 'Use the Verification module, enter the certificate number or instrument number, and compare the displayed results with the official record.',
  'What is verification and reverification?': 'Verification confirms legal compliance at a given time, while reverification is the renewal or re-checking of the instrument after the validity period or after a review.',
  'What should I check on packaged goods?': 'Check the MRP, net quantity, expiry date, declarations, manufacturer details and weight accuracy before making a purchase.',
  'How do I track my application?': 'Use the Application Tracking feature and enter your application ID to view the current stage and review timeline.',
  'What documents are required?': 'Typically you need proof of identity, business registration, address proof and relevant supporting documents depending on the service type.',
  'Where can I find Legal Metrology rules?': 'You can review the official sources under the Documents and Data Sources sections for acts, rules and notifications.',
  'I want to start a business': 'You likely need a Business License or Manufacturer/Dealer/Importer registration based on your activity. Prepare identity proof, business proof, address proof and trade documents.',
  'I want to file a complaint': 'Start with the complaint form, describe the issue clearly, share business name and location, and upload supporting evidence if available. This demo system is not the official government complaint portal.',
  'I am a consumer and want to check product quality': 'Check the MRP, net quantity, expiry date, manufacturer details, packaging declaration, and verify whether the weighing instrument is sealed and accurate.',
  'I need help with my application': 'Open the tracking section, enter your application ID, and review the status timeline. If the application is delayed, gather missing documents and check for inspector verification updates.'
};

function generateAIHelpResponse(category, query) {
  const lower = (query || '').toLowerCase();
  const hasQuery = lower.trim().length > 0 && lower !== 'i need help';
  if (hasQuery && (lower.includes('verify') || lower.includes('weigh') || lower.includes('certificate'))) {
    return 'Use the verification section and enter your certificate number or instrument number. Check the verification date, validity, authority, and any mismatch with ownership or instrument type.';
  }
  if (hasQuery && (lower.includes('complaint') || lower.includes('issue'))) {
    return 'Document the issue, mention location and business name, and upload supporting evidence. Common complaint categories include incorrect weight, missing product declarations, and MRP mismatch.';
  }
  if (hasQuery && (lower.includes('buy') || lower.includes('mrp') || lower.includes('expiry'))) {
    return 'Before buying, check MRP, net quantity, expiry date, declarations, manufacturer details, and weight correctness. Always keep your bill and review the packaging details carefully.';
  }
  if (hasQuery && (lower.includes('track') || lower.includes('status'))) {
    return 'Use the application tracking page. Enter your application ID to view review progress, document status, and the current stage of approval or rejection.';
  }
  if (category === 'license' || lower.includes('license') || lower.includes('business')) {
    return 'For a business setup, first confirm your category: Manufacturer, Dealer, Repairer, or Importer. Prepare identity proof, business registration, address proof, and the relevant trade documents before applying.';
  }
  if (category === 'verification' || lower.includes('verify') || lower.includes('weigh') || lower.includes('certificate')) {
    return 'Use the verification section and enter your certificate number or instrument number. Check the verification date, validity, authority, and any mismatch with ownership or instrument type.';
  }
  if (category === 'complaint' || lower.includes('complaint') || lower.includes('issue')) {
    return 'Document the issue, mention location and business name, and upload supporting evidence. Common complaint categories include incorrect weight, missing product declarations, and MRP mismatch.';
  }
  if (category === 'consumer' || lower.includes('buy') || lower.includes('mrp') || lower.includes('expiry')) {
    return 'Before buying, check MRP, net quantity, expiry date, declarations, manufacturer details, and weight correctness. Always keep your bill and review the packaging details carefully.';
  }
  if (category === 'tracking' || lower.includes('track') || lower.includes('status')) {
    return 'Use the application tracking page. Enter your application ID to view review progress, document status, and the current stage of approval or rejection.';
  }
  return 'I can help you find the right service, understand the documents required, and guide you to the correct compliance step. Please specify whether you need license help, verification help, complaint support, or consumer guidance.';
}

function appendMessage(text, sender = 'assistant') {
  if (!chatBody) return;
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerHTML = `<span>${sender === 'assistant' ? 'Assistant:' : 'You:'}</span> ${text}`;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleAssistantRequest(question) {
  if (!question) return;
  appendMessage(question, 'user');
  const response = assistantResponses[question] || 'Please check the official government source for the latest legal requirements and matching application guidance.';
  setTimeout(() => appendMessage(response, 'assistant'), 200);
}

const helpSubmit = document.getElementById('helpSubmit');
const helpCategory = document.getElementById('helpCategory');
const helpQuery = document.getElementById('helpQuery');
const helpResult = document.getElementById('helpResult');

if (helpSubmit && helpCategory && helpQuery && helpResult) {
  helpSubmit.addEventListener('click', () => {
    const category = helpCategory.value;
    const query = helpQuery.value.trim();
    const message = query ? generateAIHelpResponse(category, query) : generateAIHelpResponse(category, 'I need help');
    helpResult.innerHTML = `<strong>AI Assistant:</strong><p>${message}</p>`;
    helpQuery.value = '';
  });
}

sendChat?.addEventListener('click', () => {
  const value = chatInput?.value.trim();
  if (!value) return;
  handleAssistantRequest(value);
  chatInput.value = '';
});

chatInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const value = chatInput.value.trim();
    if (!value) return;
    handleAssistantRequest(value);
    chatInput.value = '';
  }
});

document.querySelectorAll('.prompt-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.question;
    if (chatInput) {
      chatInput.value = question;
      handleAssistantRequest(question);
      chatInput.value = '';
    }
  });
});

const productCategory = document.getElementById('productCategory');
const buyChecklist = document.getElementById('buyChecklist');
if (productCategory && buyChecklist) {
  productCategory.addEventListener('change', (event) => {
    const category = event.target.value;
    const messages = {
      Food: ['✓ Check MRP', '✓ Check net quantity', '✓ Check manufacturing / packing details', '✓ Check expiry where applicable', '✓ Check required declarations', '✓ Keep your bill'],
      Electronics: ['✓ Verify product code', '✓ Check warranty details', '✓ Check BIS / certification', '✓ Check MRP', '✓ Keep invoice', '✓ Inspect packaging'],
      Grocery: ['✓ Check MRP', '✓ Check net quantity', '✓ Check expiry date', '✓ Check packing seal', '✓ Check declarations', '✓ Keep bill'],
      'Packaged goods': ['✓ Check MRP', '✓ Check net quantity', '✓ Check expiry where applicable', '✓ Check declarations', '✓ Check manufacturer details', '✓ Keep your bill'],
      'Household products': ['✓ Check MRP', '✓ Check net quantity', '✓ Check ingredients or composition', '✓ Check product details', '✓ Check labels', '✓ Keep receipt']
    };
    buyChecklist.innerHTML = (messages[category] || messages['Packaged goods']).map((item) => `<li>${item}</li>`).join('');
  });
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
if (mobileMenuBtn && mainNav) {
  mobileMenuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

const charts = {
  applications: [1100, 1200, 1300, 1350, 1500, 1700],
  verification: [1000, 1100, 1250, 1500, 1600, 1850],
  services: [30, 26, 18, 12, 14],
  complaints: [38, 23, 19, 11, 9]
};

function renderBarChart(containerId, data, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const maxValue = Math.max(...data);
  container.innerHTML = `
    <div class="mini-chart">
      ${data.map((value, index) => `
        <div class="chart-bar-group">
          <div class="chart-bar" style="height:${Math.max((value / maxValue) * 145, 18)}px; background:linear-gradient(180deg, ${color}, #0b3d6b);"></div>
          <span class="chart-label">${['Jan','Feb','Mar','Apr','May','Jun'][index] || ''}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDonutChart(containerId, values) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const total = values.reduce((sum, item) => sum + item, 0);
  const colors = ['#104e8d', '#1f9d66', '#d97706', '#7c3aed', '#ef4444'];
  let current = 0;
  const segments = values.map((value, index) => {
    const start = current;
    current += value;
    const startPct = (start / total) * 100;
    const endPct = (current / total) * 100;
    return `${colors[index]} ${startPct}% ${endPct}%`;
  });
  container.innerHTML = `
    <div class="donut-chart" style="background:conic-gradient(${segments.join(', ')});">
      <div class="donut-hole">${total}</div>
    </div>
  `;
}

renderBarChart('chartApplications', charts.applications, '#104e8d');
renderBarChart('chartVerification', charts.verification, '#1f9d66');
renderDonutChart('chartServices', charts.services);
renderBarChart('chartComplaints', charts.complaints, '#d97706');

const analytics = { totalApplications: '12,540', verifiedInstruments: '8,200', activeLicenses: '1,460', complaints: '345', completedApplications: '9,125' };
document.getElementById('metricApplications').textContent = analytics.totalApplications;
document.getElementById('metricVerified').textContent = analytics.verifiedInstruments;
document.getElementById('metricLicenses').textContent = analytics.activeLicenses;
document.getElementById('metricComplaints').textContent = analytics.complaints;
document.getElementById('metricCompleted').textContent = analytics.completedApplications;
