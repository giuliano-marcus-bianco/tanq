/**
 * Web Storage Adapter - Usa localStorage
 * 
 * IMPORTANTE: Este adapter NÃO se auto-inicializa.
 * Deve ser inicializado explicitamente no entry point da aplicação Web.
 * 
 * @example
 * // Em main.jsx:
 * import { setStorageAdapter, WebStorageAdapter } from '@tanq/core-logic';
 * setStorageAdapter(new WebStorageAdapter());
 */
import { StorageAdapter } from './storage';

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
