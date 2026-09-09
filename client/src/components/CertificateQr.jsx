import React, { useEffect, useRef, useState } from 'react';
import { Camera, LoaderCircle, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';

export function CertificateQr({ certificateNumber, size = 45 }) {
  const verificationUrl = `${window.location.origin}/verify/${encodeURIComponent(certificateNumber)}`;
  return <span className="certificate-qr"><QRCodeSVG value={verificationUrl} size={size} bgColor="#ffffff" fgColor="#17363a" level="M"/><small>Scan to verify</small></span>;
}

export function QrScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { scannerRef.current?.stop().catch(() => {}); }, []);
  async function start() {
    setError(''); setOpen(true);
    try {
      const scanner = new Html5Qrcode('certificate-qr-reader'); scannerRef.current = scanner;
      await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 220, height: 220 } }, (decodedText) => { onScan(decodedText); scanner.stop().catch(() => {}); scanner.clear(); scannerRef.current = null; setOpen(false); }, () => {});
    } catch { setError('Camera access was unavailable. Use the certificate number field instead.'); setOpen(false); }
  }
  function close() { scannerRef.current?.stop().catch(() => {}); scannerRef.current?.clear(); scannerRef.current = null; setOpen(false); }
  return <div className="scanner-control"><button className="btn btn-secondary" onClick={start}><Camera size={16}/> Scan QR code</button>{open&&<div className="scanner-modal"><div className="scanner-card"><div className="scanner-head"><strong>Scan certificate QR</strong><button onClick={close}><X size={17}/></button></div><div id="certificate-qr-reader"></div>{error&&<p className="scanner-error">{error}</p>}<small>Allow camera access to scan a public verification record.</small></div></div>}</div>;
}
