// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// // import { initMercadoPago } from "@mercadopago/sdk-react";
// import Header from "../../components/user/Header";
// import Footer from "../../components/user/Footer";

// const PaymentMethod = ({ setPaymentStatus }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { address } = location.state || {}; // Obtener la dirección desde el estado

//   const [cardholderName, setCardholderName] = useState("");
//   const [cardNumber, setCardNumber] = useState("");
//   const [expirationDate, setExpirationDate] = useState("");
//   const [securityCode, setSecurityCode] = useState("");
//   const [installments, setInstallments] = useState(1);
//   const [loading, setLoading] = useState(false);

//   // Inicializar Mercado Pago con tu Public Key
//   initMercadoPago("Credenciales de mercado pago", { locale: "es-AR" });

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       const tokenResponse = await window.Mercadopago.createToken({
//         cardholderName,
//         cardNumber,
//         expirationDate,
//         securityCode,
//       });

//       if (tokenResponse.status === 200) {
//         const token = tokenResponse.id;
//         const paymentResponse = await fetch("/api/process_payment/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             transaction_amount: 100,
//             token: token,
//             description: "Compra en Mi Tienda",
//             installments: installments,
//             payment_method_id: "visa",
//             payer: {
//               email: "comprador@example.com",
//               identification: { type: "DNI", number: "12345678" },
//             },
//           }),
//         });

//         const paymentData = await paymentResponse.json();
//         if (paymentData.status === "approved") {
//           setPaymentStatus("success");
//           navigate("/user/payment-status", { state: { status: "success" } });
//         } else {
//           setPaymentStatus("failure");
//           navigate("/user/payment-status", { state: { status: "failure" } });
//         }
//       } else {
//         console.error("Error al generar el token:", tokenResponse);
//         setPaymentStatus("failure");
//         navigate("/user/payment-status", { state: { status: "failure" } });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setPaymentStatus("failure");
//       navigate("/user/payment-status", { state: { status: "failure" } });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="payment-method">
//         <h2>Método de Pago</h2>
//         <p>Dirección de envío: {address}</p>
//         <div className="payment-form">
//           <input type="text" placeholder="Nombre del titular" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
//           <input type="text" placeholder="Número de tarjeta" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
//           <input type="text" placeholder="Fecha de expiración (MM/YY)" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
//           <input type="text" placeholder="Código de seguridad" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} />
//           <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
//             <option value={1}>1 cuota</option>
//             <option value={2}>2 cuotas</option>
//             <option value={3}>3 cuotas</option>
//           </select>
//           <div className="payment-actions">
//             <button onClick={() => navigate("/user/shipping")} className="back-btn">
//               Volver
//             </button>
//             <button onClick={handlePayment} className="pay-btn" disabled={loading}>
//               {loading ? "Procesando..." : "Pagar"}
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default PaymentMethod;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { initMercadoPago } from "@mercadopago/sdk-react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const PaymentMethod = () => {
  const navigate = useNavigate(); // Usa useNavigate para redirecciones
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [installments, setInstallments] = useState(1);
  const [loading, setLoading] = useState(false);

  // Inicializar Mercado Pago con tu Public Key
  initMercadoPago("TEST-7e6511d3-5717-4f58-ba74-d531855de360", { locale: "es-AR" });

  const handlePayment = async () => {
    setLoading(true);
    try {
      const tokenResponse = await window.Mercadopago.createToken({
        cardholderName,
        cardNumber,
        expirationDate,
        securityCode,
      });

      if (tokenResponse.status === 200) {
        const token = tokenResponse.id;
        const paymentResponse = await fetch("/api/process_payment/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_amount: 100,
            token: token,
            description: "Compra en Mi Tienda",
            installments: installments,
            payment_method_id: "visa",
            payer: {
              email: "comprador@example.com",
              identification: { type: "DNI", number: "12345678" },
            },
          }),
        });

        const paymentData = await paymentResponse.json();
        if (paymentData.status === "approved") {
          // Redirige a PaymentStatus con estado "success"
          navigate("/user/payment-status", { state: { status: "success" } });
        } else {
          // Redirige a PaymentStatus con estado "failure"
          navigate("/user/payment-status", { state: { status: "failure" } });
        }
      } else {
        console.error("Error al generar el token:", tokenResponse);
        // Redirige a PaymentStatus con estado "failure"
        navigate("/user/payment-status", { state: { status: "failure" } });
      }
    } catch (error) {
      console.error("Error:", error);
      // Redirige a PaymentStatus con estado "failure"
      navigate("/user/payment-status", { state: { status: "failure" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="payment-method">
        <h2>Método de Pago</h2>
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