# Legal Metrology Digital System

**AI Powered Legal Metrology & Instrument Certification Platform**

Legal Metrology Digital System is a hackathon-ready workflow prototype for businesses, Legal Metrology Officers (LMOs), Government Approved Test Centres (GATCs), and administrators. It is intentionally labeled **DEMO DATA - NOT GOVERNMENT RECORDS**. AI features provide advisory recommendations only; the authorized officer remains responsible for every legal decision.

## Run locally

Requirements: Node.js 18+, Python 3.10+ (optional for ML service), MongoDB (optional for the prototype API).

```bash
npm run install:all
npm run dev
```

Client: http://localhost:5173  |  API: http://localhost:5000/api  |  ML service: http://localhost:8001

To run the ML service: `pip install -r ml-service/requirements.txt && npm run ml`.

## Demo accounts

Run `npm run seed --prefix server` once, then sign in with password `Demo@12345`:

- `business@smartmetrix.demo` - Business
- `lmo@smartmetrix.demo` - Legal Metrology Officer
- `gatc@smartmetrix.demo` - Government Approved Test Centre
- `admin@smartmetrix.demo` - Administrator

## Architecture

- `client/`: Vite + React responsive dashboard, role-aware navigation, workflow views, QR verification UI, analytics, and demo data.
- `server/`: Express API with JWT auth, bcrypt, rate limiting, security headers, upload validation, audit logging, and Mongoose-ready models.
- `ml-service/`: FastAPI advisory document/application analysis and synthetic-data expiry/anomaly endpoints.

## Prototype boundary

Certificate output is a **Digital Verification Record / Prototype Certificate**, not an official government certificate. QR verification exposes only safe public fields and checks a cryptographic integrity hash. Legal references and ML predictions must be connected to approved sources and real authorized datasets before production use.
