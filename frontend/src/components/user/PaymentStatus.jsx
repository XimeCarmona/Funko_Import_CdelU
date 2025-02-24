import React from "react";
import { useNavigate } from "react-router-dom";
import '../../app.css'

const PaymentStatus = ({ status }) => {
  const navigate = useNavigate();

  return (
    <div className="payment-status-container">
      {status === "success" && (
        <div className="payment-success">
          <h2>¡Pago exitoso!</h2>
          <p>Gracias por tu compra.</p>
          <button onClick={() => navigate("/user/profile")}>Ir a mi perfil</button>
        </div>
      )}
      {status === "failure" && (
        <div className="payment-failure">
          <h2>Pago fallido</h2>
          <p>Por favor, intenta nuevamente.</p>
          <button onClick={() => navigate("/user/carrito")}>Reintentar</button>
          <button onClick={() => navigate("/user/profile")}>Ir a mi perfil</button>
        </div>
      )}
      {status === "pending" && (
        <div className="payment-pending">
          <h2>Pago pendiente</h2>
          <p>Estamos procesando tu pago.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
