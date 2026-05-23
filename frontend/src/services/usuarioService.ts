import type { Usuario } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/usuarios';

export const getUsuarios = () => apiRequest<Usuario[]>(BASE);

export const getUsuarioById = (id: number) => apiRequest<Usuario>(`${BASE}/${id}`);

export const createUsuario = (u: Omit<Usuario, 'idUsuario'>) =>
  apiRequest<Usuario>(BASE, jsonBody('POST', u));

export const updateUsuario = (id: number, u: Omit<Usuario, 'idUsuario'>) =>
  apiRequest<Usuario>(`${BASE}/${id}`, jsonBody('PUT', u));

export const deleteUsuario = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
