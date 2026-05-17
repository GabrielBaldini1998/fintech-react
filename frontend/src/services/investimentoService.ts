import type { Investimento } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/investimentos';

export const getInvestimentos = () => apiRequest<Investimento[]>(BASE);

export const createInvestimento = (i: Omit<Investimento, 'idInvestimento'>) =>
  apiRequest<Investimento>(BASE, jsonBody('POST', i));

export const updateInvestimento = (id: number, i: Omit<Investimento, 'idInvestimento'>) =>
  apiRequest<Investimento>(`${BASE}/${id}`, jsonBody('PUT', i));

export const deleteInvestimento = (id: number) =>
  apiRequest<void>(`${BASE}/${id}`, { method: 'DELETE' });
