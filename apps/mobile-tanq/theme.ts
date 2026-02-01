/**
 * Tema do Tanq para React Native Paper
 * Cores: Verde e Amarelo
 */
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const tanqColors = {
  primary: '#2E7D32',      // Verde escuro
  primaryLight: '#4CAF50', // Verde claro
  secondary: '#FBC02D',    // Amarelo
  secondaryLight: '#FFEB3B', // Amarelo claro
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#D32F2F',
  success: '#388E3C',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: tanqColors.primary,
    primaryContainer: tanqColors.primaryLight,
    secondary: tanqColors.secondary,
    secondaryContainer: tanqColors.secondaryLight,
    background: tanqColors.background,
    surface: tanqColors.surface,
    error: tanqColors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#1C1C1E',
    onSurface: '#1C1C1E',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F5F5F5',
      level3: '#EEEEEE',
      level4: '#E0E0E0',
      level5: '#BDBDBD',
    },
  },
  roundness: 12,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: tanqColors.primaryLight,
    primaryContainer: tanqColors.primary,
    secondary: tanqColors.secondary,
    secondaryContainer: tanqColors.secondaryLight,
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#282828',
      level4: '#2D2D2D',
      level5: '#323232',
    },
  },
  roundness: 12,
};

export { tanqColors };
