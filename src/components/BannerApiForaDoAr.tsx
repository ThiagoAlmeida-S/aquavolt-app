import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radius, spacing } from '../theme/theme';

export function BannerApiForaDoAr() {
  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={22} color={colors.danger} />
      <View style={styles.textos}>
        <Text style={styles.titulo}>API fora do ar</Text>
        <Text style={styles.subtitulo}>
          Mostrando os últimos dados recebidos. Tentando reconectar...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.4)',
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
  },
  textos: {
    flex: 1,
  },
  titulo: {
    color: colors.danger,
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  subtitulo: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    marginTop: 2,
  },
});