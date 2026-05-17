import type { Usuario } from '@/types/finance';
import { apiRequest, jsonBody } from './apiClient';

const BASE = 'http://localhost:8080/api/usuarios';

export const getUsuarios = () => apiRequest<Usuario[]>(BASE);

export const createUsuario = (u: Omit<Usuario, 'idUsuario'>) =>
  apiRequest<void>(BASE, jsonBody('POST', u));
