/**
 * @tanq/core-logic
 * Biblioteca compartilhada de lógica de negócios para Web e Mobile
 * 
 * IMPORTANTE: Este arquivo é PLATFORM-AGNOSTIC.
 * NÃO importa nem exporta adapters específicos de plataforma (storage.web, storage.native).
 * 
 * Para inicializar o storage, use DEEP IMPORTS:
 * 
 * @example Mobile (_layout.tsx):
 * import { setStorageAdapter } from '@tanq/core-logic';
 * import { NativeStorageAdapter } from '@tanq/core-logic/src/adapters/storage.native';
 * setStorageAdapter(new NativeStorageAdapter());
 * 
 * @example Web (main.jsx):
 * import { setStorageAdapter } from '@tanq/core-logic';
 * import { WebStorageAdapter } from '@tanq/core-logic/src/adapters/storage.web';
 * setStorageAdapter(new WebStorageAdapter());
 */

// Types
export * from './types';

// Adapters - APENAS a interface e funções de configuração (SEM implementações platform-specific)
export type { StorageAdapter } from './adapters/storage';
export { setStorageAdapter, getStorageAdapter } from './adapters/storage';

// Services - Environment
export type { Platform } from './services/environment';
export {
  configureEnvironment,
  getEnvironmentConfig,
  getApiBaseUrl,
} from './services/environment';

// Services - API
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
