import React, { useEffect, useState } from 'react';
import { FileText, Gauge, Image as ImageIcon, LoaderCircle, MapPin, RefreshCw } from 'lucide-react';
import { api, mediaUrl } from '../services/api';

export default function InstrumentGallery(){
  const [instruments,setInstruments]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  async function load(){setLoading(true);setError('');try{const {data}=await api.get('/instruments');setInstruments(data)}catch(e){setError(e.response?.data?.message||'Could not load instruments.')}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  if(loading)return <div className="instrument-loading"><LoaderCircle className="spin" size={18}/> Loading instruments and uploaded evidence...</div>;
  if(error)return <div className="form-error">{error}<button className="text-btn" onClick={load}><RefreshCw size={13}/> Retry</button></div>;
  if(!instruments.length)return <div className="panel empty-state">No instruments registered yet. Use “New application” to register one.</div>;
  return <div className="instrument-grid">{instruments.map(instrument=>{const images=(instrument.documents||[]).filter(document=>document.mimeType?.startsWith('image/'));return <article className="instrument-card" key={instrument._id}><div className="instrument-image">{images[0]?<img src={mediaUrl(images[0].storagePath)} alt={`${instrument.type} ${instrument.serialNumber}`}/>:<div className="instrument-image-empty"><Gauge size={30}/><span>No instrument photo</span></div>}<span className="image-count"><ImageIcon size={12}/> {images.length}</span></div><div className="instrument-top"><div className="instrument-symbol"><Gauge size={21}/></div><span className={`status ${instrument.status?.toLowerCase()}`}><i></i>{instrument.status||'PENDING'}</span></div><h3>{instrument.type}</h3><p>Serial no. <strong>{instrument.serialNumber}</strong></p><div className="instrument-meta"><span>{instrument.capacity||'Capacity not provided'}</span><span><MapPin size={11}/> {instrument.installationLocation||'Location not provided'}</span></div><div className="instrument-docs">{(instrument.documents||[]).map(document=><a href={mediaUrl(document.storagePath)} target="_blank" rel="noreferrer" key={document._id}>{document.mimeType?.startsWith('image/')?<ImageIcon size={13}/>:<FileText size={13}/>} {document.originalName}</a>)}</div></article>})}</div>;
}
