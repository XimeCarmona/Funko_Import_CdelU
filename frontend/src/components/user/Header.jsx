import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../App.css";

const Header = ({ setSearchTerm }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Verifica si el usuario ha iniciado sesión
  const isUserLoggedIn = !!localStorage.getItem("user_token");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("user_token"); // Elimina solo el token del usuario
    localStorage.removeItem("user_email"); // Elimina solo el email del usuario
    navigate("/login"); // Redirige al login
  };

  return (
    <header className="headerUS bg-blue-800 text-white flex items-center p-4 relative">
      {/* Barra de búsqueda */}
      {/* Barra de búsqueda */}
      <div className="search-barUS flex-1 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-inputUS w-full max-w-xs p-2 rounded-md"
          onChange={handleSearch}  
        />
      </div>

      {/* Logo centrado */}
      <div className="logo-containerUS absolute left-1/2 transform -translate-x-1/2 text-center">
        <img
          src={logo}
          alt="Logo Mi Tienda"
          className="logo-imageUS h-16"
        />
      </div>

      {/* Menú y carrito */}
      <div className="menu-cartUS flex-1 flex justify-end space-x-4">
        <Link to="/user">
          <button className="menu-btnUS text-white font-bold">Inicio</button>
        </Link>

        {/* Botón Carrito */}
        <Link to="/user/carrito">
          <button className="cart-btnUS text-white font-bold">
            <i className="fas fa-shopping-cart"></i> Carrito
          </button>
        </Link>

        {/* Botón Favoritos */}
        <Link to="/user/favorites">
          <button className="cart-btnUS text-white font-bold">
            <i className="fas fa-heart"></i> Favoritos
          </button>
        </Link>

        {/* Ícono de usuario con menú desplegable */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="user-iconUS text-white font-bold"
          >
            <i className="fas fa-user"></i>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menuUS absolute right-0 bg-white text-black rounded-md shadow-md mt-2">
              {/* Mostrar "Mi Perfil" solo si el usuario ha iniciado sesión */}
              {isUserLoggedIn && (
                <Link
                  to="/user/perfil"
                  className="block px-4 py-2 hover:bg-gray-200"
                >
                  Mi Perfil
                </Link>
              )}

              {/* Mostrar "Cerrar Sesión" o "Iniciar Sesión" según el estado de autenticación */}
              {isUserLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;