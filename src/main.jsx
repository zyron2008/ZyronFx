import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { HelmetProvider } from 'react-helmet-async';
import EncryptedMessage from '@/components/EncryptedMessage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <EncryptedMessage />
      <App />
    </HelmetProvider>
  </React.StrictMode>
);