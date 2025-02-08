import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Header = ({ setSearchTerm }) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);  
  };

  return (
    <header className="header bg-blue-800 text-white flex items-center p-4 relative">
      {/* Barra de búsqueda */}
      <div className="search-bar flex-1 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar productos..."
          className="search-input w-full max-w-xs p-2 rounded-md"
          onChange={handleSearch}  
        />
        <button className="search-btn bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded-md">
          Buscar
        </button>
      </div>

      {/* Logo centrado */}
      <div className="logo-container absolute left-1/2 transform -translate-x-1/2 text-center">
        <img
          src={logo}
          alt="Logo Mi Tienda"
          className="logo-image h-16"
        />
      </div>

      {/* Menú y carrito */}
      <div className="menu-cart flex-1 flex justify-end space-x-4">
        <Link to= "/user">
        <button className="menu-btn text-white font-bold">Menú</button>
        </Link>
        
        {/* Botón Carrito */}
        <Link to="/user/carrito">
          <button className="cart-btn text-white font-bold">
            <i className="fas fa-shopping-cart"></i> Carrito
          </button>
        </Link>

        {/* Botón Favoritos */}
        <Link to="/user/favorites">
          <button className="cart-btn text-white font-bold">
            <i className="fas fa-heart"></i> Favoritos
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;