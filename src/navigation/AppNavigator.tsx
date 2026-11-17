import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { PainelScreen } from '../screens/PainelScreen';
import { colors } from '../theme/theme';

const Tab = createBottomTabNavigator();

// Tema do navegador com as cores do AquaVolt
const temaAquaVolt = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.aqua,
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer theme={temaAquaVolt}>
      <Tab.Navigator
        screenOptions={{
          headerTitle: 'AquaVolt',
          headerTitleStyle: { fontWeight: '800', letterSpacing: 1 },
          tabBarActiveTintColor: colors.aqua,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tab.Screen
          name="Painel"
          component={PainelScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="speedometer-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}