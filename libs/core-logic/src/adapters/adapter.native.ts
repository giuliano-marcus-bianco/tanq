/**
 * Native Storage Adapter - Usa expo-secure-store
 * 
 * IMPORTANTE: Este adapter NÃO se auto-inicializa.
 * Deve ser inicializado explicitamente no entry point da aplicação Mobile.
 * 
 * @example
 * // Em _layout.tsx:
 * import { setStorageAdapter } from '@tanq/core-logic';
 * import { NativeStorageAdapter } from '@tanq/core-logic/adapters/storage.native';
 * setStorageAdapter(new NativeStorageAdapter());
 */
import * as SecureStore from 'expo-secure-store';
import { StorageAdapter } from './storage';

export class NativeStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}
