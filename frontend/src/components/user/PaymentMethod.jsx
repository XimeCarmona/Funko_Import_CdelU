import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrae la dirección y el total desde location.state
  const { address, total } = location.state || {};

  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Obtener el correo electrónico del usuario autenticado
      const userEmail = localStorage.getItem("userEmail");
  
      if (!userEmail) {
        throw new Error("Usuario no autenticado");
      }
  
      // Crear la preferencia de pago en el backend
      const response = await fetch("http://localhost:8000/api/auth/create-payment-preference/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total: total, // El total a pagar
          items: [
            {
              title: "Compra de Funko",
              quantity: 1,
              unit_price: parseFloat(total),
            },
          ],
          payer: {
            email: userEmail, // Usar el correo del usuario autenticado
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Error al crear la preferencia de pago");
      }
  
      // Redirigir al usuario a la página de pago de Mercado Pago
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error al procesar el pago:", error.message);
      alert("Error al procesar el pago: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="payment-method">
        <h2>Método de Pago</h2>
        <p>Total a pagar: ${total}</p> {/* Muestra el total */}
        <div className="payment-form">
          <input
            type="text"
            placeholder="Nombre del titular"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Fecha de expiración (MM/YY)"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="Código de seguridad"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
          />
          <select
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
          >
            <option value={1}>1 cuota</option>
            <option value={2}>2 cuotas</option>
            <option value={3}>3 cuotas</option>
          </select>
          <div className="payment-actions">
            <button
              onClick={() => navigate("/user/shipping")} // Volver a ShippingMethod
              className="back-btn"
            >
              Volver
            </button>
            <button
              onClick={handlePayment} // Manejar el pago y redirigir
              className="pay-btn"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Pagar"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentMethod;
