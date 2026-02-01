/**
 * Web Storage Adapter - Usa localStorage
 * Este arquivo é carregado automaticamente pelo Vite (Web bundler)
 */
import { StorageAdapter, setStorageAdapter } from './storage';

export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  }
}

// Auto-initialize para Web
const webAdapter = new WebStorageAdapter();
setStorageAdapter(webAdapter);

export { webAdapter };
