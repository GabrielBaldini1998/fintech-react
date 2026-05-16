import type { Despesa } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/despesas';

export const getDespesas = () => apiRequest<Despesa[]>(BASE);

export const createDespesa = (d: Omit<Despesa, 'idDespesa'>) =>
  apiRequest<Despesa>(BASE, jsonBody('POST', d));
