import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiForaDoArError } from '../api/client';

interface EstadoPolling<T> {
  dados: T | null;
  carregando: boolean;
  foraDoAr: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
}

// Chama `buscar` agora e depois a cada `intervaloMs` milissegundos.
export function usePolling<T>(buscar: () => Promise<T>, intervaloMs = 5000): EstadoPolling<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [foraDoAr, setForaDoAr] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Guarda sempre a versão mais recente da função, sem reiniciar o intervalo
  const buscarRef = useRef(buscar);
  useEffect(() => {
    buscarRef.current = buscar;
  });

  const atualizar = useCallback(async () => {
    try {
      const resultado = await buscarRef.current();
      setDados(resultado);
      setForaDoAr(false);
      setErro(null);
    } catch (e) {
      // Não apagamos `dados`: a tela continua mostrando o último valor conhecido
      if (e instanceof ApiForaDoArError) {
        setForaDoAr(true);
      } else {
        setErro(e instanceof Error ? e.message : 'Erro desconhecido');
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    atualizar();
    const id = setInterval(atualizar, intervaloMs);
    return () => clearInterval(id); // para de atualizar quando a tela sai
  }, [atualizar, intervaloMs]);

  return { dados, carregando, foraDoAr, erro, recarregar: atualizar };
}