/**
 * @tanq/core-logic - Entry point for React Native (Mobile)
 * Metro bundler irá usar este arquivo e resolver automaticamente
 * os arquivos .native.ts
 */

// Types
export * from './types';

// Adapters - Interface apenas
export type { StorageAdapter } from './adapters/storage';
export { setStorageAdapter, getStorageAdapter } from './adapters/storage';

// Importar o adapter nativo
import './adapters/storage.native';

// Services
export type { Platform } from './services/environment';
export {
  configureEnvironment,
  getEnvironmentConfig,
  getApiBaseUrl,
} from './services/environment';

export {
  postoService,
  precoService,
  authService,
  usuarioService,
  avaliacaoService,
  getApiInstance,
  reinitializeApi,
} from './services/api';

export { default as api } from './services/api';

// Context
export { AuthProvider, useAuth, AuthContext } from './context/AuthContext';
export type { AuthContextType } from './context/AuthContext';
