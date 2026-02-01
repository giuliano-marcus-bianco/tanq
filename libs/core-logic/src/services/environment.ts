/**
 * Configuração de ambiente para API
 */

export type Platform = 'web' | 'android' | 'ios';

interface EnvironmentConfig {
  platform: Platform;
  apiBaseUrl: string;
}

// Detecta a plataforma atual
function detectPlatform(): Platform {
  // Verifica se estamos em React Native
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // Em React Native, precisamos verificar o OS
    // Isso será sobrescrito quando o mobile configurar
    return 'android'; // default para mobile
  }
  return 'web';
}

// Configurações padrão por plataforma
const platformConfigs: Record<Platform, string> = {
  web: 'http://localhost:8083/api',
  android: 'http://192.168.3.37:8083/api', // IP local da máquina
  ios: 'http://localhost:8083/api',    // iOS Simulator usa localhost
};

// Configuração atual (pode ser sobrescrita)
let currentConfig: EnvironmentConfig = {
  platform: detectPlatform(),
  apiBaseUrl: platformConfigs[detectPlatform()],
};

/**
 * Configura o ambiente da API
 */
export function configureEnvironment(config: Partial<EnvironmentConfig>): void {
  if (config.platform) {
    currentConfig.platform = config.platform;
    // Atualiza baseUrl se não foi fornecida explicitamente
    if (!config.apiBaseUrl) {
      currentConfig.apiBaseUrl = platformConfigs[config.platform];
    }
  }
  if (config.apiBaseUrl) {
    currentConfig.apiBaseUrl = config.apiBaseUrl;
  }
}

/**
 * Retorna a configuração atual do ambiente
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return { ...currentConfig };
}

/**
 * Retorna a base URL da API
 */
export function getApiBaseUrl(): string {
  return currentConfig.apiBaseUrl;
}
