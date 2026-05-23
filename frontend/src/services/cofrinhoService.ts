import type { Cofrinho } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/cofrinhos';

export const getCofrinhos = () => apiRequest<Cofrinho[]>(BASE);

export const getCofrinhosByUsuario = (idUsuario: number) =>
  apiRequest<Cofrinho[]>(`${BASE}/usuario/${idUsuario}`);

export const getCofrinhoById = (id: number) =>
  apiRequest<Cofrinho>(`${BASE}/${id}`);

export const createCofrinho = (c: Omit<Cofrinho, 'idCofrinho'>) =>
  apiRequest<Cofrinho>(BASE, jsonBody('POST', c));

export const updateCofrinho = (id: number, c: Omit<Cofrinho, 'idCofrinho'>) =>
  apiRequest<Cofrinho>(`${BASE}/${id}`, jsonBody('PUT', c));

export const deleteCofrinho = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
