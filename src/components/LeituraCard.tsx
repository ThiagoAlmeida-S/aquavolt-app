import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme/theme';

interface Props {
  titulo: string;
  valor: number | null;
  unidade: string;
  icone: ComponentProps<typeof Ionicons>['name'];
  cor: string;
}

export function LeituraCard({ titulo, valor, unidade, icone, cor }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconeBox, { backgroundColor: `${cor}22` }]}>
        <Ionicons name={icone} size={22} color={cor} />
      </View>

      <Text style={styles.titulo}>{titulo}</Text>

      <View style={styles.linhaValor}>
        <Text style={[styles.valor, { color: cor }]}>
          {valor === null ? '--' : valor.toFixed(1)}
        </Text>
        <Text style={styles.unidade}>{unidade}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, // dois cartões lado a lado dividem a largura
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconeBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  linhaValor: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  valor: {
    fontSize: fontSize.title + 6,
    fontWeight: '800',
  },
  unidade: {
    color: colors.textMuted,
    fontSize: fontSize.body,
    marginBottom: 4,
  },
});