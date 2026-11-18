// Função base para falar com o backend.
// Se a API estiver parada, o app não trava: ele recebe um erro "API fora do ar".

// O endereço da API vem do arquivo .env (veja o README):
//   navegador ou simulador iOS -> localhost
//   emulador Android           -> 10.0.2.2
//   celular de verdade         -> IPv4 do PC (rode `ipconfig`)
const HOST = process.env.EXPO_PUBLIC_API_HOST ?? 'localhost';

export const API_URL = `http://${HOST}:8080/api`;

const TIMEOUT_MS = 5000;

// O servidor respondeu, mas com erro (ex.: 404 ou 500)
export class ApiHttpError extends Error {
  constructor(public status: number) {
    super(`Erro ${status} ao acessar a API`);
    this.name = 'ApiHttpError';
  }
}

// Não conseguimos falar com o servidor (parado, sem rede, demorou demais)
export class ApiForaDoArError extends Error {
  constructor() {
    super('API fora do ar');
    this.name = 'ApiForaDoArError';
  }
}

export async function request<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  // Cancela a requisição se passar do tempo limite
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...(opcoes.headers ?? {}) },
      signal: controller.signal,
    });

    if (!resposta.ok) {
      throw new ApiHttpError(resposta.status);
    }

    return (await resposta.json()) as T;
  } catch (erro) {
    if (erro instanceof ApiHttpError) {
      throw erro;
    }
    // Rede caiu, servidor parado ou timeout: tratamos tudo como "API fora do ar"
    throw new ApiForaDoArError();
  } finally {
    clearTimeout(timer);
  }
}