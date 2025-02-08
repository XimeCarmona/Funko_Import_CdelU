import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
//admin
import HeaderAdmin from "./components/admin/HeaderAdmin";
import AdminHome from "./pages/admin/AdminHome";
import Productos from "./pages/admin/Productos";
import Categorias from "./pages/admin/Categorias";
import Pedidos from "./pages/admin/Pedidos";
import Edicion from "./pages/admin/Edicion";
import Perfil from "./pages/admin/Perfil";
//user
import UserHome from "./pages/user/UserHome";
import Funko from "./pages/user/Funko";
import Cart from "./pages/user/Cart";
import Favorites from "./pages/user/Favorites";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Rutas del Administrador */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="edicion" element={<Edicion />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>

        {/* Rutas del Usuario */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="funko/:id" element={<Funko />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="*" element={<Navigate to="/user" />} />
        </Route>

        {/* Ruta por defecto o no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

//Layout del Administrador
function AdminLayout() {
  return (
    <div>
      <HeaderAdmin />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// 📌 Layout del Usuario (Corregido)
function UserLayout() {
  return (
    <div>
        <Outlet />
    </div>
  );
}

export default App;
