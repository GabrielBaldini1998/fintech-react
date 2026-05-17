import type { Receita } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/receitas';

export const getReceitas = () => apiRequest<Receita[]>(BASE);

export const createReceita = (r: Omit<Receita, 'idReceita'>) =>
  apiRequest<Receita>(BASE, jsonBody('POST', r));

export const updateReceita = (id: number, r: Omit<Receita, 'idReceita'>) =>
  apiRequest<Receita>(`${BASE}/${id}`, jsonBody('PUT', r));

export const deleteReceita = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
