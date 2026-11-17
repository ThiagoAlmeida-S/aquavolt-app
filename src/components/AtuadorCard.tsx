import { ComponentProps } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme/theme';
import { Atuador, TipoAtuador } from '../types';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

// Um ícone para cada tipo de atuador
const ICONES: Record<TipoAtuador, NomeIcone> = {
  BOMBA: 'cog-outline',
  VALVULA: 'funnel-outline',
  RELE: 'power-outline',
};

interface Props {
  atuador: Atuador;
  ocupado: boolean;       // true enquanto o comando está sendo enviado
  desabilitado: boolean;  // true quando a API está fora do ar
  aoAlternar: (ligar: boolean) => void;
}

export function AtuadorCard({ atuador, ocupado, desabilitado, aoAlternar }: Props) {
  const ligado = atuador.ligado;
  const cor = ligado ? colors.aqua : colors.textMuted;

  return (
    <View style={[styles.card, ligado && styles.cardLigado]}>
      <View style={[styles.iconeBox, { backgroundColor: `${cor}22` }]}>
        <Ionicons name={ICONES[atuador.tipo]} size={24} color={cor} />
      </View>

      <View style={styles.textos}>
        <Text style={styles.nome}>{atuador.nome}</Text>
        <Text style={[styles.estado, { color: cor }]}>{ligado ? 'LIGADO' : 'DESLIGADO'}</Text>
      </View>

      <Switch
        value={ligado}
        onValueChange={aoAlternar}
        disabled={ocupado || desabilitado}
        trackColor={{ false: colors.border, true: `${colors.aqua}88` }}
        thumbColor={ligado ? colors.aqua : colors.textSecondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardLigado: {
    borderColor: colors.aqua,
  },
  iconeBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  nome: {
    color: colors.textPrimary,
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  estado: {
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
});