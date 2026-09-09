from datetime import date
from typing import Any
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title='Legal Metrology Digital System Advisory ML Service', version='0.1.0')

class ApplicationInput(BaseModel):
    fields: dict[str, Any] = {}
    documents: list[dict[str, Any]] = []

class ExpiryInput(BaseModel):
    days_to_expiry: int
    previous_renewals: int = 0
    failed_inspections: int = 0

class AssistantInput(BaseModel):
    question: str

@app.get('/health')
def health():
    return {'status': 'ok', 'mode': 'synthetic-demo', 'advisory_only': True}

@app.post('/assistant')
def assistant(payload: AssistantInput):
    question = payload.question.lower()
    answers = [
        (('document', 'required', 'upload'), 'Typical evidence includes an instrument photograph, a clear serial-number or manufacturer-plate photograph, and any previous verification record available to the business.'),
        (('verify', 'weighing', 'instrument'), 'Register the instrument, submit the application and evidence, complete the advisory pre-check, then wait for review and a decision by the authorized Legal Metrology Officer.'),
        (('renew', 'expiry', 'expire'), 'Review the validity date on your record and begin the applicable renewal process before expiry. The prediction is advisory and does not create a legal deadline.'),
        (('test centre', 'gatc', 'inspection'), 'Use the GATC finder to identify an available test centre, then submit a test request through the platform.'),
        (('status', 'track', 'application'), 'Open Applications to see the latest workflow status, submitted evidence, officer remarks and test-report updates.'),
    ]
    for keywords, answer in answers:
        if any(keyword in question for keyword in keywords):
            return {'answer': answer, 'advisory_only': True, 'source': 'APPROVED PROTOTYPE GUIDANCE', 'confident': True}
    return {'answer': 'I could not confidently verify this information. Please contact the concerned Legal Metrology authority.', 'advisory_only': True, 'source': 'UNCERTAIN', 'confident': False}

@app.post('/analyze/document')
def analyze_document(payload: dict[str, Any]):
    # OCR integration point. Synthetic extraction keeps the prototype honest.
    text = payload.get('text', '')
    return {'extracted': {'certificate_number': 'LM-MH-2026-00123' if 'LM-' in text else None, 'serial_number': 'WS-98473' if 'WS-' in text else None}, 'confidence': 0.94, 'source': 'DEMO HEURISTIC - CONNECT APPROVED OCR PROVIDER', 'advisory_only': True}

@app.post('/analyze/application')
def analyze_application(payload: ApplicationInput):
    fields = payload.fields
    documents = payload.documents
    checks = {'application_information_complete': all(fields.get(key) for key in ['instrument_type', 'serial_number']), 'instrument_photo_detected': any(d.get('kind') == 'instrument_photo' for d in documents), 'previous_certificate_detected': any(d.get('kind') == 'previous_certificate' for d in documents), 'serial_number_detected': bool(fields.get('serial_number'))}
    warnings = []
    if not checks['application_information_complete']: warnings.append('Required instrument fields are missing.')
    if fields.get('serial_number') and fields.get('previous_serial_number') and fields['serial_number'] != fields['previous_serial_number']: warnings.append('Serial number differs from previous certificate.')
    score = round(sum(checks.values()) / len(checks) * 100)
    return {'checks': checks, 'warnings': warnings, 'completeness': score, 'recommendation': 'Application appears complete. Officer review required.', 'advisory_only': True, 'source': 'SYNTHETIC DEMO RULES - NOT A LEGAL DECISION'}

@app.post('/predict/expiry-risk')
def expiry_risk(payload: ExpiryInput):
    if payload.days_to_expiry <= 30 or payload.failed_inspections >= 2: risk = 'HIGH RISK'
    elif payload.days_to_expiry <= 90 or payload.previous_renewals >= 2: risk = 'MEDIUM RISK'
    else: risk = 'LOW RISK'
    return {'risk': risk, 'recommendation': 'START RENEWAL PROCESS' if payload.days_to_expiry <= 60 else 'MONITOR', 'advisory_only': True, 'source': 'SYNTHETIC DEMO DATA'}

@app.post('/predict/anomaly')
def anomaly(payload: dict[str, Any]):
    signals = payload.get('signals', {})
    count = sum(bool(value) for value in signals.values())
    label = 'POTENTIAL ANOMALY' if count >= 2 else ('REVIEW RECOMMENDED' if count == 1 else 'NORMAL')
    return {'label': label, 'signals_considered': signals, 'advisory_only': True, 'source': 'ISOLATION FOREST INTEGRATION POINT; SYNTHETIC DEMO RULES'}
