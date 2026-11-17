import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { leiturasApi } from '../api/aquavolt';
import { BannerApiForaDoAr } from '../components/BannerApiForaDoAr';
import { LeituraCard } from '../components/LeituraCard';
import { NivelReservatorio } from '../components/NivelReservatorio';
import { usePolling } from '../hooks/usePolling';
import { colors, fontSize, radius, spacing } from '../theme/theme';
import { Leitura, TipoLeitura } from '../types';

// Procura a leitura de um tipo na lista recebida da API
const valorDe = (leituras: Leitura[] | null, tipo: TipoLeitura) =>
  leituras?.find((l) => l.tipo === tipo)?.valor ?? null;

export function PainelScreen() {
  const { dados, foraDoAr, recarregar } = usePolling(leiturasApi.ultimas, 3000);
  const [atualizando, setAtualizando] = useState(false);

  // Hora da última resposta bem-sucedida (não muda enquanto a API estiver fora do ar)
  const horaAtualizacao = useMemo(
    () => (dados ? new Date().toLocaleTimeString('pt-BR') : null),
    [dados],
  );

  async function aoPuxarParaAtualizar() {
    setAtualizando(true);
    await recarregar();
    setAtualizando(false);
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={aoPuxarParaAtualizar}
          tintColor={colors.aqua}
          colors={[colors.aqua]}
        />
      }
    >
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoTextos}>
          <Text style={styles.titulo}>Painel da estação</Text>
          <Text style={styles.subtitulo}>Smart Water & Energy Station</Text>
        </View>

        <View style={styles.status}>
          <View
            style={[styles.ponto, { backgroundColor: foraDoAr ? colors.danger : colors.success }]}
          />
          <Text style={styles.statusTexto}>{foraDoAr ? 'OFFLINE' : 'AO VIVO'}</Text>
        </View>
      </View>

      {foraDoAr && <BannerApiForaDoAr />}

      <NivelReservatorio nivel={valorDe(dados, 'NIVEL_AGUA')} />

      <View style={styles.linha}>
        <LeituraCard
          titulo="VAZÃO"
          valor={valorDe(dados, 'VAZAO')}
          unidade="L/min"
          icone="water-outline"
          cor={colors.aqua}
        />
        <LeituraCard
          titulo="CONSUMO"
          valor={valorDe(dados, 'CONSUMO_ELETRICO')}
          unidade="kW"
          icone="flash-outline"
          cor={colors.volt}
        />
      </View>

      {horaAtualizacao && (
        <Text style={styles.atualizado}>Última atualização às {horaAtualizacao}</Text>
      )}
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
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cabecalhoTextos: {
    flex: 1,
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
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusTexto: {
    color: colors.textPrimary,
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  linha: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  atualizado: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    textAlign: 'center',
  },
});