/**
 * @tanq/core-logic
 * Biblioteca compartilhada de lógica de negócios para Web e Mobile
 * 
 * NOTA: Este é o ponto de entrada principal.
 * Os bundlers (Vite/Metro) irão automaticamente escolher os arquivos 
 * .web.ts ou .native.ts corretos para cada plataforma.
 */

// Types
export * from './types';

// Adapters - Interface apenas (implementações são platform-specific)
export type { StorageAdapter } from './adapters/storage';
export { setStorageAdapter, getStorageAdapter } from './adapters/storage';

// Importar o adapter correto para a plataforma
// Vite escolherá storage.web.ts, Metro escolherá storage.native.ts
import './adapters/storage.web';

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
