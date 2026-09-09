import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [user,setUser]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ const token=localStorage.getItem('smartmetrix_token'); if(!token){setLoading(false);return;} api.get('/auth/me').then(({data})=>setUser(data.user)).catch(()=>localStorage.removeItem('smartmetrix_token')).finally(()=>setLoading(false)); },[]);
  async function login(email,password){const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('smartmetrix_token',data.token);setUser(data.user);return data.user;}
  async function register(payload){const {data}=await api.post('/auth/register',payload);localStorage.setItem('smartmetrix_token',data.token);setUser(data.user);return data.user;}
  function logout(){localStorage.removeItem('smartmetrix_token');setUser(null);}
  return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){return useContext(AuthContext);}
