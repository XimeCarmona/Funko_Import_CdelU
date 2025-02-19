import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar GoogleOAuthProvider
import App from './App'; // AsegÃºrate de la ruta correcta
import './index.css';

const clientId = "308782491837-3ii9ji9967ectsmh546rqk866245rj4u.apps.googleusercontent.com"; // Sustituye por tu Client ID

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}> {/* Envuelve tu app con GoogleOAuthProvider */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);