import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar GoogleOAuthProvider
import App from './App'; // AsegÃºrate de la ruta correcta
import './index.css';

const clientId = "CLIENT_ID"; // Sustituye por tu Client ID

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}> {/* Envuelve tu app con GoogleOAuthProvider */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);