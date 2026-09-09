import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
export function signUser(user){ return jwt.sign({sub:user._id.toString(),role:user.role},process.env.JWT_SECRET||'dev-only-secret',{expiresIn:'8h'}); }
export async function requireAuth(req,res,next){ try{ const token=req.headers.authorization?.replace('Bearer ',''); if(!token) return res.status(401).json({message:'Authentication required'}); const payload=jwt.verify(token,process.env.JWT_SECRET||'dev-only-secret'); req.user=await User.findById(payload.sub).select('-passwordHash'); if(!req.user?.active) return res.status(401).json({message:'Account inactive'}); next(); }catch{res.status(401).json({message:'Invalid or expired session'});} }
export function allowRoles(...roles){return (req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({message:'This role cannot perform that action'});}
