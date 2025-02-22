import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetalleFunko() {
  const { idProducto } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));

  // Sincronizar token al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setUserToken(token || null);
  }, []);

  // Obtener detalles del producto
  useEffect(() => {
    const id = parseInt(idProducto, 10);
    
    if (isNaN(id) || id <= 0) {
      setError("ID de producto inválido");
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auth/obtener-detalle-producto/${id}/`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Producto no encontrado`);
        }

        const data = await response.json();
        setProducto({
          ...data,
          precio: parseFloat(data.precio).toFixed(2)  // Formatear precio
        });
      } catch (err) {
        setError(err.message);
        console.error("Error fetching producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [idProducto]);

  // Añadir al carrito
  const handleAddToCart = async () => {
    if (!userToken) {
      alert("🔒 Por favor, inicia sesión para añadir productos al carrito");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/add-to-cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${userToken}`
        },
        body: JSON.stringify({
          idProducto: producto.idProducto,
          cantidad: 1
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "❌ Error al procesar la solicitud");
      }

      if (data.success) {
        alert("🛒 Producto añadido al carrito");
        // Opcional: Actualizar estado global del carrito aquí
      } else {
        alert(data.message || "⚠️ Ocurrió un error inesperado");
      }
    } catch (err) {
      console.error("Error en add-to-cart:", err);
      alert(err.message || "🔥 Error crítico al contactar al servidor");
    }
  };

  // Estados de carga y error
  if (loading) return <div className="loading">🌀 Cargando detalles del funko...</div>;
  if (error) return <div className="error">⛔ Error: {error}</div>;
  if (!producto) return <div className="error">😞 Producto no encontrado</div>;

  // Renderizado principal
  return (
    <div className="detalle-funko-container">
      <div className="imagen-container">
        <img 
          src={producto.imagen || "https://via.placeholder.com/300"} 
          alt={producto.nombre}
          onError={(e) => e.target.src = "https://via.placeholder.com/300"}
          className="funko-image"
        />
      </div>
      
      <div className="info-container">
        <h1 className="nombre-funko">{producto.nombre}</h1>
        
        <div className="detalles-seccion">
          <p className="precio">💵 Precio: ${producto.precio} USD</p>
          <p className="stock">📦 Disponibles: {producto.cantidadDisp} unidades</p>
          <p className="edicion">
            {producto.esEspecial ? "🌟 Edición especial" : "📘 Edición estándar"}
          </p>
        </div>

        <p className="descripcion">{producto.descripcion}</p>

        <button 
          onClick={handleAddToCart}
          className="btn-add-to-cart"
          disabled={producto.cantidadDisp <= 0}
        >
          {producto.cantidadDisp > 0 ? "➕ Añadir al carrito" : "🚫 Agotado"}
        </button>
      </div>
    </div>
  );
}

export default DetalleFunko;