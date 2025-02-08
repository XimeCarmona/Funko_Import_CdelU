// // src/pages/HomePage.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// const HomePage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold mb-6">Bienvenido a la App</h1>
//       <div className="flex gap-4">
//         <Link
//           to="/user"
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Área de Usuario
//         </Link>
//         <Link
//           to="/admin"
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//         >
//           Área de Administrador
//         </Link>
//       </div>
//     </div>
//   );
// };

import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png"; // 📌 Verifica la ruta del logo
import "../HomePage.css"; // 📌 Importa el CSS

const HomePage = () => {
  const navigate = useNavigate();

  // const handleGoogleLogin = () => {
  //   // Aquí iría la lógica de autenticación con Google en el futuro
  //   navigate("/user"); // 📌 Redirige a la vista del usuario
  // };

  const handleGoogleLogin = async () => {
    try {
      // 📌 Simulación de obtener el email de Google OAuth (reemplázalo con el real)
      const fakeEmail = "funkoimportcdelu@gmail.com"; 

      // 📌 Hacer la petición al backend para verificar el rol
      const response = await fetch(`http://localhost:8000/funko_import/google_login/?email=${fakeEmail}`);
      const data = await response.json();

      if (data.is_admin) {
        navigate("/admin"); // Redirige al admin
      } else {
        navigate("/user"); // Redirige al usuario normal
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Logo */}
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logo" />
      </div>

      {/* Texto "Iniciar sesión" */}
      <h1 className="login-text">Iniciar sesión</h1>

      {/* Botón de Google */}
      <button onClick={handleGoogleLogin} className="google-login-button">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
          alt="Google Logo"
          className="google-icon"
        />
        <span className="text-gray-700 font-medium">Ingresar con Google</span>
      </button>
    </div>
  );
};

export default HomePage;
