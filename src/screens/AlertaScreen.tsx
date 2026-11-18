import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { falhasApi } from '../api/aquavolt';
import { ApiForaDoArError } from '../api/client';
import { AlertaCard } from '../components/AlertaCard';
import { BannerApiForaDoAr } from '../components/BannerApiForaDoAr';
import { usePolling } from '../hooks/usePolling';
import { colors, fontSize, radius, spacing } from '../theme/theme';

type Filtro = 'ativas' | 'historico';

interface BotaoFiltroProps {
  rotulo: string;
  selecionado: boolean;
  aoPressionar: () => void;
}

function BotaoFiltro({ rotulo, selecionado, aoPressionar }: BotaoFiltroProps) {
  return (
    <Pressable
      onPress={aoPressionar}
      style={[styles.filtro, selecionado && styles.filtroSelecionado]}
    >
      <Text style={[styles.filtroTexto, selecionado && styles.filtroTextoSelecionado]}>
        {rotulo}
      </Text>
    </Pressable>
  );
}

export function AlertasScreen() {
  const { dados, carregando, foraDoAr, recarregar } = usePolling(falhasApi.listar, 5000);
  const [filtro, setFiltro] = useState<Filtro>('ativas');
  const [ocupadaId, setOcupadaId] = useState<number | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  const ativas = dados?.filter((falha) => !falha.resolvida) ?? [];
  const lista = filtro === 'ativas' ? ativas : dados ?? [];

  async function resolver(id: number) {
    setOcupadaId(id);
    setErroAcao(null);
    try {
      await falhasApi.resolver(id);
      await recarregar();
    } catch (e) {
      setErroAcao(
        e instanceof ApiForaDoArError
          ? 'Não foi possível resolver o alerta: API fora do ar.'
          : 'Não foi possível resolver o alerta. Tente novamente.',
      );
    } finally {
      setOcupadaId(null);
    }
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View>
        <Text style={styles.titulo}>Alertas</Text>
        <Text style={styles.subtitulo}>Falhas registradas na estação</Text>
      </View>

      {foraDoAr && <BannerApiForaDoAr />}

      <View style={styles.filtros}>
        <BotaoFiltro
          rotulo={`Ativas (${ativas.length})`}
          selecionado={filtro === 'ativas'}
          aoPressionar={() => setFiltro('ativas')}
        />
        <BotaoFiltro
          rotulo="Histórico"
          selecionado={filtro === 'historico'}
          aoPressionar={() => setFiltro('historico')}
        />
      </View>

      {erroAcao && <Text style={styles.erro}>{erroAcao}</Text>}

      {carregando && <ActivityIndicator color={colors.aqua} size="large" />}

      {!carregando && dados !== null && lista.length === 0 && (
        <View style={styles.vazio}>
          <Ionicons name="shield-checkmark-outline" size={48} color={colors.success} />
          <Text style={styles.vazioTitulo}>
            {filtro === 'ativas' ? 'Nenhum alerta ativo' : 'Nenhum alerta registrado'}
          </Text>
          <Text style={styles.vazioTexto}>Tudo certo com a estação.</Text>
        </View>
      )}

      {lista.map((falha) => (
        <AlertaCard
          key={falha.id}
          falha={falha}
          ocupada={ocupadaId === falha.id}
          desabilitado={foraDoAr}
          aoResolver={() => resolver(falha.id)}
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
  filtros: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
  },
  filtro: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  filtroSelecionado: {
    backgroundColor: `${colors.aqua}22`,
  },
  filtroTexto: {
    color: colors.textMuted,
    fontSize: fontSize.body,
    fontWeight: '700',
  },
  filtroTextoSelecionado: {
    color: colors.aqua,
  },
  erro: {
    color: colors.danger,
    fontSize: fontSize.body,
  },
  vazio: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  vazioTitulo: {
    color: colors.textPrimary,
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  vazioTexto: {
    color: colors.textMuted,
    fontSize: fontSize.body,
  },
});