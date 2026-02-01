import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { lightTheme, tanqColors } from '../theme';

// Importar o adapter nativo para inicializar o storage
import '@tanq/core-logic';

// Importar o AuthProvider da core-logic
import { AuthProvider, configureEnvironment } from '@tanq/core-logic';
import { Platform } from 'react-native';

// Configurar ambiente baseado na plataforma
configureEnvironment({
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: tanqColors.primary,
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: '⛽ Tanq',
                headerShown: true,
              }} 
            />
            <Stack.Screen 
              name="login" 
              options={{ 
                title: 'Entrar',
                presentation: 'modal',
              }} 
            />
            <Stack.Screen 
              name="register" 
              options={{ 
                title: 'Criar Conta',
                presentation: 'modal',
              }} 
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
              }} 
            />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
