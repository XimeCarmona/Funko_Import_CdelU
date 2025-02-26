import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

function DetalleFunko() {
  const { idProducto } = useParams(); // Obtener el ID desde la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [preguntas, setPreguntas] = useState([]);
  const [nuevaPregunta, setNuevaPregunta] = useState("");
  const [respuestaPregunta, setRespuestaPregunta] = useState({});

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

  // Cargar preguntas al montar el componente
  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const respuesta = await fetch(`http://localhost:8000/api/auth/obtener-preguntas-producto/${idProducto}/`);
        if (!respuesta.ok) {
          throw new Error("Error al cargar las preguntas");
        }
        const data = await respuesta.json();
        setPreguntas(data);
      } catch (error) {
        console.error("Error al cargar las preguntas:", error);
      }
    };

    fetchPreguntas();
  }, [idProducto]);

  const handleAddToCart = async () => {
    if (!userEmail) {
      Swal.fire({
        title: "Por favor, inicia sesión para añadir productos al carrito",
        icon: "warning",
        confirmButtonText: "Ok",
        timer: 1500
      });
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
        Swal.fire({
          title: "Producto añadido correctamente!",
          icon: "success",
          draggable: true,
          timer: 1500
        });
      } else {
        Swal.fire({
          title: data.message || "Error al añadir producto",
          icon: "error",
          confirmButtonText: "Ok",
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      Swal.fire({
        title: "Hubo un problema al añadir el producto",
        icon: "error",
        confirmButtonText: "Ok",
        timer: 1500
      });
    }
  };

  const handleSubmitPregunta = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      Swal.fire({
        title: "Por favor, inicia sesión para hacer una pregunta",
        icon: "warning",
        confirmButtonText: "Ok"
      });
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8000/api/auth/preguntas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pregunta: nuevaPregunta,
          id_producto: producto.idProducto,
          correo: userEmail, // Envía el correo del usuario
        }),
      });

      if (respuesta.ok) {
        const data = await respuesta.json();
        setPreguntas([...preguntas, data.pregunta]);
        setNuevaPregunta("");
        Swal.fire({
          title: "Pregunta enviada correctamente",
          icon: "success",
          confirmButtonText: "Ok",
          timer: 1500
        });
      } else {
        Swal.fire({
          title: "Error al enviar la pregunta",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } catch (error) {
      console.error("Error al enviar la pregunta:", error);
    }
  };

  const handleResponderPregunta = async (idPregunta) => {
    const respuesta = respuestaPregunta[idPregunta];
    if (!respuesta) {
      Swal.fire({
        title: "Por favor, escribe una respuesta",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      const respuestaApi = await fetch(`http://localhost:8000/api/auth/responder-pregunta/${idPregunta}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          respuesta: respuesta,
        }),
      });

      if (respuestaApi.ok) {
        const data = await respuestaApi.json();
        setPreguntas(preguntas.map(p => p.id_pregunta === idPregunta ? data.pregunta : p));
        setRespuestaPregunta({ ...respuestaPregunta, [idPregunta]: "" });
        Swal.fire({
          title: "Respuesta enviada correctamente",
          icon: "success",
          confirmButtonText: "Ok",
          timer: 1500
        });
      } else {
        Swal.fire({
          title: "Error al enviar la respuesta",
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
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

      {/* Sección de preguntas y respuestas */}
      <div className="preguntas-respuestas" style={{ marginTop: "20px", borderTop: "1px solid #ccc", paddingTop: "20px" }}>
        <h3>Preguntas y respuestas</h3>

        {/* Formulario para hacer preguntas */}
        <form onSubmit={handleSubmitPregunta} style={{ marginBottom: "20px" }}>
          <textarea
            value={nuevaPregunta}
            onChange={(e) => setNuevaPregunta(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Enviar pregunta
          </button>
        </form>

        {preguntas.length === 0 ? (
          <p>No hay preguntas para este producto.</p>
        ) : (
          preguntas.map((pregunta) => (
            <div key={pregunta.id_pregunta} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <p><strong>{pregunta.id_Usuario.nombre || pregunta.id_Usuario.correo}</strong>: {pregunta.pregunta}</p>
              {pregunta.respuesta ? (
                <p><strong>Respuesta:</strong> {pregunta.respuesta}</p>
              ) : (
                userEmail && (
                  <div>
                    <textarea
                      value={respuestaPregunta[pregunta.id_pregunta] || ""}
                      onChange={(e) => setRespuestaPregunta({ ...respuestaPregunta, [pregunta.id_pregunta]: e.target.value })}
                      placeholder="Escribe tu respuesta aquí..."
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <button
                      onClick={() => handleResponderPregunta(pregunta.id_pregunta)}
                      style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                      Responder
                    </button>
                  </div>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DetalleFunko;