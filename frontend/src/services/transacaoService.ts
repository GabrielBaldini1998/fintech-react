import type { Transacao } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/transacoes';

export const getTransacoes = () => apiRequest<Transacao[]>(BASE);

export const getTransacoesByUsuario = (idUsuario: number) =>
  apiRequest<Transacao[]>(`${BASE}/usuario/${idUsuario}`);

export const getTransacaoById = (id: number) =>
  apiRequest<Transacao>(`${BASE}/${id}`);

export const createTransacao = (t: Omit<Transacao, 'idTransacao'>) =>
  apiRequest<Transacao>(BASE, jsonBody('POST', t));

export const updateTransacao = (id: number, t: Omit<Transacao, 'idTransacao'>) =>
  apiRequest<Transacao>(`${BASE}/${id}`, jsonBody('PUT', t));

export const deleteTransacao = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
