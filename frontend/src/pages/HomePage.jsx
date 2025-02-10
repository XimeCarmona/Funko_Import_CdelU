import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Importar GoogleLogin
import * as jwtDecode from "jwt-decode";
import logoImage from "../assets/logo.png";
import "../HomePage.css"; 

const HomePage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = (response) => {
    if (response?.credential) {
      console.log("Token recibido de Google:", response.credential);
      fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Respuesta del backend:", data);
          if (data.user?.is_admin) {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        })
        .catch((error) => {
          console.error("Error al autenticar:", error);
        });
    } else {
      console.error("No se recibió el token de Google.");
    }
  };
  
  

  return (
    <div className="home-container-HP">
      {/* Logo */}
      <div className="logo-containerHP">
        <img src={logoImage} alt="Logo" className="logoHP" />
      </div>

      {/* Texto "Iniciar sesión" */}
      <h1 className="login-textHP">Iniciar sesión</h1>

      {/* Botón de Google */}
      <GoogleLogin 
        onSuccess={handleGoogleLogin} 
        onError={() => console.log("Error en login con Google")} 
        useOneTap
      />
    </div>
  );
};

export default HomePage;
