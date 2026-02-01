/**
 * Storage Adapter Interface
 * Abstração para storage que funciona em Web (localStorage) e Mobile (SecureStore)
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Singleton para o adapter atual
let currentAdapter: StorageAdapter | null = null;

export function setStorageAdapter(adapter: StorageAdapter): void {
  currentAdapter = adapter;
}

export function getStorageAdapter(): StorageAdapter {
  if (!currentAdapter) {
    throw new Error('Storage adapter not initialized. Call setStorageAdapter first or import a platform-specific module.');
  }
  return currentAdapter;
}

// Re-export para facilitar imports
export type { StorageAdapter as IStorageAdapter };
