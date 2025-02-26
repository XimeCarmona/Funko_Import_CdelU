import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Admin.css";

const VentasAdmin = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchVentas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/get-ventas/", {
          params: { admin: true },
        });
        setVentas(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las ventas:", err);
        setError("Error al cargar las ventas.");
        setLoading(false);
      }
    };

    fetchVentas();
  }, [navigate]);

  if (loading) return <div className="ventas-container">Cargando...</div>;
  if (error) return <div className="ventas-container error">{error}</div>;

  return (
    <div className="ventas-container">
      <h1 className="ventas-title">Todas las Ventas</h1>

      {ventas.length > 0 ? (
        <table className="ventas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.usuario}</td>
                <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                <td>${venta.total}</td>
                <td>
                  <ul className="productos-list">
                    {venta.productos.map((producto) => (
                      <li key={producto.id}>
                        {producto.nombre} x{producto.cantidad} - ${producto.total}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay ventas registradas.</p>
      )}

      <button onClick={() => navigate("/admin")} className="volver-btn">
        Volver al panel
      </button>
    </div>
  );
};

export default VentasAdmin;
