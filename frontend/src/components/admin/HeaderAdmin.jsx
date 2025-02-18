import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import '../../Admin.css';
import logoImage from '../../assets/logo.png';

const HeaderAdmin = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    console.log("Cerrar sesión");
    // Aquí puedes agregar la lógica para cerrar sesión, como redirigir al login o borrar tokens de autenticación.
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Menú */}
        <div
          className="menu-container"
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <button className="menu-button">☰</button>
          {isMenuOpen && (
            <div className="dropdown-menu">
              <ul>
                <li><Link to="home">Inicio</Link></li> {/* Cambiar de <a href="/home"> a <Link to="home"> */}
                <li><Link to="productos">Productos</Link></li> {/* Cambiar de <a href="/productos"> a <Link to="productos"> */}
                <li><Link to="categorias">Categorías</Link></li> {/* Cambiar de <a href="/categorias"> a <Link to="categorias"> */}
                <li><Link to="pedidos">Pedidos</Link></li> {/* Cambiar de <a href="/pedidos"> a <Link to="pedidos"> */}
                <li><Link to="edicion">Edición</Link></li> {/* Cambiar de <a href="/edicion"> a <Link to="edicion"> */}
                <li><Link to="descuento">Descuentos</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="logo-container absolute left-1/2 transform -translate-x-1/2 text-center">
          <img
            src={logoImage}
            alt="Logo Mi Tienda"
            className="logo-image h-16"
          />
        </div>

        {/* Barra de búsqueda y menú de usuario */}
        <div className="menu-search flex items-center justify-end">
          <div
            className="user relative"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="#888888" stroke-dasharray="28" stroke-dashoffset="28" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 21v-1c0 -3.31 2.69 -6 6 -6h4c3.31 0 6 2.69 6 6v1"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="28;0"></animate></path><path d="M12 11c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4Z"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="28;0"></animate></path></g></svg></span>
            {isUserMenuOpen && (
              <div className="dropdown-user absolute right-0 mt-2 bg-white border rounded shadow-md">
                <ul>
                  <li><Link to="/perfil" className="block px-4 py-2">Mi Perfil</Link></li> {/* Cambiar de <a href="/perfil"> a <Link to="/perfil"> */}
                  <li><a href="/" onClick={handleLogout} className="block px-4 py-2">Cerrar Sesión</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
