import axios from 'axios';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((config) => { const token = localStorage.getItem('smartmetrix_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

export function mediaUrl(storagePath) {
	if (!storagePath) return '';
	if (/^https?:\/\//i.test(storagePath)) return storagePath;
	const baseURL = api.defaults.baseURL || '/api';
	if (baseURL.startsWith('/')) return storagePath;
	return `${baseURL.replace(/\/api\/?$/, '')}${storagePath}`;
}
