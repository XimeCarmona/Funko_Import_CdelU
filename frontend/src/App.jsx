import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../src/pages/HomePage";
import HeaderAdmin from "./components/admin/HeaderAdmin";
import AdminHome from "../src/pages/admin/AdminHome";
import Productos from "../src/pages/admin/Productos";
import Categorias from "../src/pages/admin/Categorias";
import Pedidos from "../src/pages/admin/Pedidos";
import Edicion from "../src/pages/admin/Edicion";
import Perfil from "../src/pages/admin/Perfil";

import UserHome from "../src/pages/user/UserHome";
import Funko from "../src/pages/user/Funko";
import Cart from "../src/pages/user/Cart";
import Favorites from "../src/pages/user/Favorites";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Rutas del Administrador */}
        <Route path="/admin/*" element={<AdminArea />} />

        {/* Rutas del Usuario */}
        <Route path="/user/*" element={<UserArea />} />

        {/* Ruta por defecto o no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function AdminArea() {
  return (
    <div>
      <HeaderAdmin />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="edicion" element={<Edicion />} />
          <Route path="perfil" element={<Perfil />} />
        </Routes>
      </main>
    </div>
  );
}

function UserArea() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/funko/:id" element={<Funko />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default App;
