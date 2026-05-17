import type { Conta } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/contas';

export const getContas = () => apiRequest<Conta[]>(BASE);

export const createConta = (c: Conta) => apiRequest<Conta>(BASE, jsonBody('POST', c));

export const updateConta = (numeroDaConta: string, c: Conta) =>
  apiRequest<Conta>(`${BASE}/${numeroDaConta}`, jsonBody('PUT', c));
