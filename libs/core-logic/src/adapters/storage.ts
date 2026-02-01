// Define a interface
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// --- IMPLEMENTAÇÃO DO SINGLETON ---
// Variável para armazenar a instância
let adapterInstance: StorageAdapter | null = null;

// Função para injetar a dependência (chamada pelo App Mobile ou Web)
export const setStorageAdapter = (adapter: StorageAdapter) => {
  console.log('[CoreLogic] Storage Adapter configurado:', adapter);
  adapterInstance = adapter;
};

// Função para recuperar a dependência (chamada pelos Services/Contexts)
export const getStorageAdapter = (): StorageAdapter => {
  if (!adapterInstance) {
    console.warn('[CoreLogic] ALERTA: StorageAdapter não foi inicializado! Usando fallback em memória.');
    // Fallback para evitar crash se chamado antes da init
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  return adapterInstance;
};
