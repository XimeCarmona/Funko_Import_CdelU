import React, { useEffect, useState } from "react";
import axios from "axios"; // Para hacer las peticiones HTTP
import { useNavigate } from "react-router-dom";

const MisCompras = () => {
  const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el correo electrónico del usuario desde el localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login"); // Si no hay correo, redirigir a login
      return;
    }

    // Hacer la petición al backend para obtener las ventas
    const fetchVentas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/get-ventas/", {
          params: {
            email: userEmail, // Enviar el correo como parámetro
          },
        });
        setVentas(response.data); // Establecer las ventas obtenidas
        setLoading(false); // Actualizar estado de carga
      } catch (err) {
        console.error("Error al cargar las ventas:", err);
        setError("Error al cargar las ventas.");
        setLoading(false); // Dejar de cargar en caso de error

        // Si el error es 401, redirigir al usuario a la página de inicio de sesión
        if (err.response && err.response.status === 401) {
          navigate("/login"); // Redirigir al usuario a la página de inicio de sesión
        }
      }
    };

    fetchVentas();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mis-compras">
      <h1>Mis Compras</h1>

      {ventas.length > 0 ? (
        <ul>
          {ventas.map((venta) => (
            <li key={venta.id}>
              <h2>Venta ID: {venta.id}</h2>
              <p>Fecha de compra: {new Date(venta.fecha_venta).toLocaleDateString()}</p>
              <p>Total: ${venta.total}</p>
              <h3>Productos:</h3>
              <ul>
                {venta.productos.map((producto) => (
                  <li key={producto.id}>
                    <p>Producto: {producto.nombre}</p>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>Precio unitario: ${producto.precio_unitario}</p>
                    <p>Total: ${producto.total}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes compras realizadas.</p>
      )}
    </div>
  );
};

export default MisCompras;