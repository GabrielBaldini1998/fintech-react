import type { Despesa } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/despesas';

export const getDespesas = () => apiRequest<Despesa[]>(BASE);

export const getDespesaById = (id: number) => apiRequest<Despesa>(`${BASE}/${id}`);

export const createDespesa = (d: Omit<Despesa, 'idDespesa'>) =>
  apiRequest<Despesa>(BASE, jsonBody('POST', d));

export const updateDespesa = (id: number, d: Omit<Despesa, 'idDespesa'>) =>
  apiRequest<Despesa>(`${BASE}/${id}`, jsonBody('PUT', d));

export const deleteDespesa = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
