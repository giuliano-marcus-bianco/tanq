/**
 * Native Storage Adapter - Usa expo-secure-store
 * Este arquivo é carregado automaticamente pelo Metro (React Native bundler)
 */
import * as SecureStore from 'expo-secure-store';
import { StorageAdapter, setStorageAdapter } from './storage';

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

// Auto-initialize para Native
const nativeAdapter = new NativeStorageAdapter();
setStorageAdapter(nativeAdapter);

export { nativeAdapter };
