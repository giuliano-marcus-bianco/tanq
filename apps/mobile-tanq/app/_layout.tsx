import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { lightTheme, tanqColors } from '../theme';

// Deep imports de TODOS os módulos da core-logic para evitar problemas de resolução do Metro
import { setStorageAdapter } from '../../../libs/core-logic/src/adapters/storage';
import { NativeStorageAdapter } from '../../../libs/core-logic/src/adapters/adapter.native';
import { AuthProvider } from '../../../libs/core-logic/src/context/AuthContext';
import { configureEnvironment } from '../../../libs/core-logic/src/services/environment';

// Configurar ambiente baseado na plataforma (pode ficar no nível do módulo)
configureEnvironment({
  platform: Platform.OS === 'ios' ? 'ios' : 'android',
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Inicializar o storage adapter dentro do useEffect para garantir ordem correta
    setStorageAdapter(new NativeStorageAdapter());
    setIsReady(true);
  }, []);

  // Aguardar inicialização do storage antes de renderizar
  if (!isReady) {
    return null;
  }

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
