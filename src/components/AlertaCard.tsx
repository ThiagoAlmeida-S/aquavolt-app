import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme/theme';
import { Falha, SeveridadeFalha } from '../types';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

// Cor, ícone e rótulo de cada severidade
const ESTILO_SEVERIDADE: Record<SeveridadeFalha, { cor: string; icone: NomeIcone; rotulo: string }> = {
  BAIXA: { cor: colors.aqua, icone: 'information-circle-outline', rotulo: 'BAIXA' },
  MEDIA: { cor: colors.volt, icone: 'alert-circle-outline', rotulo: 'MÉDIA' },
  ALTA: { cor: colors.warning, icone: 'warning-outline', rotulo: 'ALTA' },
  CRITICA: { cor: colors.danger, icone: 'flame-outline', rotulo: 'CRÍTICA' },
};

// "2026-11-16T18:33:36.757805" -> "16/11 18:33"
function formatarDataHora(iso: string) {
  const [data, hora] = iso.split('T');
  const [, mes, dia] = data.split('-');
  return `${dia}/${mes} ${hora.slice(0, 5)}`;
}

interface Props {
  falha: Falha;
  ocupada: boolean;       // true enquanto o comando está sendo enviado
  desabilitado: boolean;  // true quando a API está fora do ar
  aoResolver: () => void;
}

export function AlertaCard({ falha, ocupada, desabilitado, aoResolver }: Props) {
  const estilo = ESTILO_SEVERIDADE[falha.severidade];
  const cor = falha.resolvida ? colors.textMuted : estilo.cor;

  return (
    <View style={[styles.card, { borderColor: falha.resolvida ? colors.border : `${cor}88` }]}>
      <View style={styles.topo}>
        <View style={[styles.iconeBox, { backgroundColor: `${cor}22` }]}>
          <Ionicons name={estilo.icone} size={22} color={cor} />
        </View>

        <View style={styles.textos}>
          <Text style={styles.origem}>{falha.origem}</Text>
          <Text style={styles.data}>{formatarDataHora(falha.dataHora)}</Text>
        </View>

        {falha.resolvida ? (
          <View style={styles.seloResolvida}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.seloTexto, { color: colors.success }]}>RESOLVIDA</Text>
          </View>
        ) : (
          <View style={[styles.selo, { borderColor: cor }]}>
            <Text style={[styles.seloTexto, { color: cor }]}>{estilo.rotulo}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.descricao, falha.resolvida && styles.descricaoResolvida]}>
        {falha.descricao}
      </Text>

      {!falha.resolvida && (
        <Pressable
          onPress={aoResolver}
          disabled={ocupada || desabilitado}
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
            (ocupada || desabilitado) && styles.botaoDesabilitado,
          ]}
        >
          <Ionicons name="checkmark-done-outline" size={18} color={colors.aqua} />
          <Text style={styles.botaoTexto}>{ocupada ? 'Resolvendo...' : 'Marcar como resolvida'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconeBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  origem: {
    color: colors.textPrimary,
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  data: {
    color: colors.textMuted,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
  selo: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  seloResolvida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  seloTexto: {
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  descricao: {
    color: colors.textSecondary,
    fontSize: fontSize.body,
  },
  descricaoResolvida: {
    color: colors.textMuted,
  },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.aqua,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  botaoPressionado: {
    backgroundColor: `${colors.aqua}22`,
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  botaoTexto: {
    color: colors.aqua,
    fontSize: fontSize.body,
    fontWeight: '700',
  },
});