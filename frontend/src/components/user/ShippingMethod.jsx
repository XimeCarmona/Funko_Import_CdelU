import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const ShippingMethod = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!address) {
      alert("Por favor ingresa tu dirección");
      return;
    }
    navigate("/user/payment", { state: { address } });
  };

  return (
    <>
      <Header />
      <div className="shipping-container">
        <h2>Dirección de Envío</h2>
        <input
          type="text"
          placeholder="Ingresa tu dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="shipping-actions">
          <button onClick={() => navigate("/user/carrito")} className="back-btn">
            Volver
          </button>
          <button onClick={handleNext} className="next-btn">
            Siguiente
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingMethod;