import { request } from './client';
import { Atuador, Falha, Leitura } from '../types';

export const leiturasApi = {
  ultimas: () => request<Leitura[]>('/leituras/ultimas'),
};

export const atuadoresApi = {
  listar: () => request<Atuador[]>('/atuadores'),
  ligar: (id: number) => request<Atuador>(`/atuadores/${id}/ligar`, { method: 'PUT' }),
  desligar: (id: number) => request<Atuador>(`/atuadores/${id}/desligar`, { method: 'PUT' }),
};

export const falhasApi = {
  listar: () => request<Falha[]>('/falhas'),
  ativas: () => request<Falha[]>('/falhas/ativas'),
  resolver: (id: number) => request<Falha>(`/falhas/${id}/resolver`, { method: 'PUT' }),
};