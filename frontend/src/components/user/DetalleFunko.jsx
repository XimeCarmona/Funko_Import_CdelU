import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetalleFunko() {
  const { idProducto } = useParams(); // Obtener el ID desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  

  useEffect(() => {
    const handleStorageChange = () => {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
      console.log("Storage cambiado. Nuevo email:", email); // Depuración
    };

    handleStorageChange(); 

    window.addEventListener("storage", handleStorageChange);

    // Limpiar el event listener al desmontarse el componente
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Verificación del valor de userToken
  useEffect(() => {
    console.log("User email:", userEmail); // Verificar si se establece correctamente
  }, [userEmail]);

  useEffect(() => {
    // Convertir idProducto a número
    const id = parseInt(idProducto, 10);

    // Validar que idProducto sea un número válido
    if (isNaN(id) || id <= 0) {
      console.error("ID de producto inválido:", id);
      setError("ID de producto inválido");
      setLoading(false);
      return;
    }

    const fetchProducto = async () => {
      try {
        // Usar 'id' en lugar de 'idProducto'
        const respuesta = await fetch(`http://localhost:8000/api/auth/obtener-detalle-producto/${id}/`);
        if (!respuesta.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await respuesta.json();
        setProducto(data);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [idProducto]);

  const handleAddToCart = async () => {
    if (!userEmail) {
      alert("Por favor, inicia sesión para añadir productos al carrito");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/api/auth/add-to-cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: userEmail,  // Asegúrate de enviar 'correo' y no 'user_token'
          idProducto: producto.idProducto,
          cantidad: 1, // Puedes ajustar la cantidad según sea necesario
        }),
      });

      const data = await respuesta.json();
      if (data.success) {
        alert("Producto añadido al carrito");
      } else {
        alert(data.message || "Error al añadir producto");
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Hubo un problema al añadir el producto");
    }
  };


  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    console.log(producto),

    <div className="detalle-funko">
      <img 
        src={`http://localhost:8000${producto.imagen}`} 
        alt={producto.nombre} 
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")} 
      />
      <h2>{producto.nombre}</h2>
      <p>{producto.descripcion}</p>
      <p>Precio: {producto.precio} USD</p>
      <p>Cantidad disponible: {producto.cantidadDisp}</p>
      <p>{producto.esEspecial ? "Edición especial" : "Edición estándar"}</p>
      <button onClick={handleAddToCart}>Añadir al carrito</button>
    </div>
  );
}

export default DetalleFunko;