export type TipoLeitura = 'NIVEL_AGUA' | 'VAZAO' | 'CONSUMO_ELETRICO';

export interface Leitura {
  id: number;
  tipo: TipoLeitura;
  valor: number;
  dataHora: string;
}

export type TipoAtuador = 'BOMBA' | 'VALVULA' | 'RELE';

export interface Atuador {
  id: number;
  nome: string;
  tipo: TipoAtuador;
  ligado: boolean;
  atualizadoEm: string;
}

export type SeveridadeFalha = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Falha {
  id: number;
  origem: string;
  descricao: string;
  severidade: SeveridadeFalha;
  resolvida: boolean;
  dataHora: string;
}