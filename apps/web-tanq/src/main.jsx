import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Deep imports de TODOS os módulos da core-logic (evita problemas com barrel file)
import { setStorageAdapter } from '../../libs/core-logic/src/adapters/storage';
import { WebStorageAdapter } from '../../libs/core-logic/src/adapters/adapter.web';
import { AuthProvider } from '../../libs/core-logic/src/context/AuthContext';

import App from './App.jsx';
import './index.css';

// Inicializar o storage adapter ANTES de usar AuthProvider
setStorageAdapter(new WebStorageAdapter());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
