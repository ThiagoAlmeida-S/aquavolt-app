import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { leiturasApi } from './src/api/aquavolt';
import { BannerApiForaDoAr } from './src/components/BannerApiForaDoAr';
import { LeituraCard } from './src/components/LeituraCard';
import { NivelReservatorio } from './src/components/NivelReservatorio';
import { usePolling } from './src/hooks/usePolling';
import { colors, spacing } from './src/theme/theme';
import { Leitura, TipoLeitura } from './src/types';

// Procura a leitura de um tipo na lista recebida da API
const valorDe = (leituras: Leitura[] | null, tipo: TipoLeitura) =>
  leituras?.find((l) => l.tipo === tipo)?.valor ?? null;

export default function App() {
  const { dados, foraDoAr } = usePolling(leiturasApi.ultimas, 3000);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  linha: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});