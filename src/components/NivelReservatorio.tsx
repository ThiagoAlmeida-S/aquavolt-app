import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/theme';

interface Props {
  nivel: number | null; // de 0 a 100 (%)
}

function statusDoNivel(nivel: number) {
  if (nivel < 20) return { texto: 'CRÍTICO', cor: colors.danger };
  if (nivel < 35) return { texto: 'BAIXO', cor: colors.warning };
  return { texto: 'NORMAL', cor: colors.aqua };
}

export function NivelReservatorio({ nivel }: Props) {
  const altura = useRef(new Animated.Value(0)).current;

  // Sempre que o nível muda, a água sobe ou desce suavemente
  useEffect(() => {
    Animated.timing(altura, {
      toValue: nivel ?? 0,
      duration: 800,
      useNativeDriver: false, // a propriedade "height" não usa o driver nativo
    }).start();
  }, [nivel, altura]);

  const status = nivel === null ? null : statusDoNivel(nivel);
  const cor = status?.cor ?? colors.textMuted;

  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>NÍVEL DO RESERVATÓRIO</Text>
        {status && (
          <View style={[styles.selo, { borderColor: cor }]}>
            <Text style={[styles.seloTexto, { color: cor }]}>{status.texto}</Text>
          </View>
        )}
      </View>

      <View style={[styles.tanque, { borderColor: cor }]}>
        <Animated.View
          style={[
            styles.agua,
            {
              backgroundColor: `${cor}55`, // a mesma cor, com transparência
              height: altura.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        <Text style={styles.valor}>{nivel === null ? '--' : `${nivel.toFixed(1)}%`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  selo: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  seloTexto: {
    fontSize: fontSize.caption,
    fontWeight: '700',
    letterSpacing: 1,
  },
  tanque: {
    height: 160,
    borderRadius: radius.md,
    borderWidth: 2,
    backgroundColor: colors.background,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agua: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  valor: {
    color: colors.textPrimary,
    fontSize: fontSize.display,
    fontWeight: '800',
  },
});