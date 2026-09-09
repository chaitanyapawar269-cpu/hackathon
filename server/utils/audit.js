import { AuditLog } from '../models/index.js';
export async function audit(req,action,entityType,entityId,metadata={}){ try{await AuditLog.create({actor:req.user?._id,action,entityType,entityId,metadata,ip:req.ip});}catch(error){console.error('Audit log failed',error.message);} }
