import crypto from 'crypto';
export function hashCertificate(data){ return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'); }
export function certificatePayload(certificate){ return {certificateNumber:certificate.certificateNumber,...certificate.publicData,status:certificate.status}; }
export function verifyCertificate(certificate){ return Boolean(certificate && hashCertificate(certificatePayload(certificate))===certificate.certificateHash); }
