import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '../../App.css';

const Header = ({ setSearchTerm }) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);  
  };

  return (
    <header className="headerUS bg-blue-800 text-white flex items-center p-4 relative">
      {/* Barra de búsqueda */}
      <div className="search-barUS flex-1 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-inputUS w-full max-w-xs p-2 rounded-md"
          onChange={handleSearch}  
        />
        <button className="search-btnUS bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md">
          Buscar
        </button>
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
        <Link to= "/user">
        <button className="menu-btnUS text-white font-bold">Menú</button>
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
      </div>
    </header>
  );
};

export default Header;