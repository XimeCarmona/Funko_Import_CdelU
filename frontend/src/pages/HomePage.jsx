// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Bienvenido a la App</h1>
      <div className="flex gap-4">
        <Link
          to="/user"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Área de Usuario
        </Link>
        <Link
          to="/admin"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Área de Administrador
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
