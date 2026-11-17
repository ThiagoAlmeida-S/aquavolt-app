import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { atuadoresApi } from '../api/aquavolt';
import { ApiForaDoArError } from '../api/client';
import { AtuadorCard } from '../components/AtuadorCard';
import { BannerApiForaDoAr } from '../components/BannerApiForaDoAr';
import { usePolling } from '../hooks/usePolling';
import { colors, fontSize, spacing } from '../theme/theme';
import { Atuador } from '../types';

export function ControlesScreen() {
  const { dados, carregando, foraDoAr, recarregar } = usePolling(atuadoresApi.listar, 5000);
  const [ocupadoId, setOcupadoId] = useState<number | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  async function alternar(atuador: Atuador, ligar: boolean) {
    setOcupadoId(atuador.id);
    setErroAcao(null);
    try {
      if (ligar) {
        await atuadoresApi.ligar(atuador.id);
      } else {
        await atuadoresApi.desligar(atuador.id);
      }
      await recarregar(); // atualiza a lista com o novo estado
    } catch (e) {
      setErroAcao(
        e instanceof ApiForaDoArError
          ? 'Não foi possível enviar o comando: API fora do ar.'
          : 'Não foi possível acionar o atuador. Tente novamente.',
      );
    } finally {
      setOcupadoId(null);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View>
        <Text style={styles.titulo}>Controles</Text>
        <Text style={styles.subtitulo}>
          Ligue a bomba e acompanhe o nível do reservatório subir no Painel.
        </Text>
      </View>

      {foraDoAr && <BannerApiForaDoAr />}

      {erroAcao && <Text style={styles.erro}>{erroAcao}</Text>}

      {carregando && <ActivityIndicator color={colors.aqua} size="large" />}

      {!carregando && dados?.length === 0 && (
        <Text style={styles.vazio}>Nenhum atuador cadastrado.</Text>
      )}

      {dados?.map((atuador) => (
        <AtuadorCard
          key={atuador.id}
          atuador={atuador}
          ocupado={ocupadoId === atuador.id}
          desabilitado={foraDoAr}
          aoAlternar={(ligar) => alternar(atuador, ligar)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.md,
    gap: spacing.md,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: fontSize.title,
    fontWeight: '800',
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
    marginTop: 2,
  },
  erro: {
    color: colors.danger,
    fontSize: fontSize.body,
  },
  vazio: {
    color: colors.textMuted,
    fontSize: fontSize.body,
    textAlign: 'center',
  },
});