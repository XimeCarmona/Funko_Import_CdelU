import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "../../App.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import ShippingMethod from "../../components/user/ShippingMethod";
import PaymentMethod from "../../components/user/PaymentMethod";
import PaymentStatus from "../../components/user/PaymentStatus";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate(); // Usa useNavigate para redirecciones
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    fetch("/funkos.json") // Asegúrate de que está en la carpeta `public`
      .then((response) => response.json())
      .then((data) => {
        const cartWithQuantity = data.map((item) => ({ ...item, quantity: 1 }));
        setCart(cartWithQuantity);
        calcularTotal(cartWithQuantity);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el carrito:", error);
        setLoading(false);
      });
  }, []);

  const calcularTotal = (cart) => {
    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount.toFixed(2));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    calcularTotal(updatedCart);
  };

  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    calcularTotal(updatedCart);
  };

  if (loading) return <p>Cargando carrito...</p>;

  return (
    <>
      <Header />
      <div className="cart-container">
        <h1>Carrito de Compras</h1>
        {cart.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <div className="cart-table">
            {/* Encabezados de la tabla */}
            <div className="cart-header">
              <div>Producto</div>
              <div>Precio</div>
              <div>Cantidad</div>
              <div>Total</div>
              <div>Acciones</div>
            </div>

            {/* Lista de productos */}
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-product">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <span>{item.name}</span>
                </div>
                <div>${item.price}</div>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
                <div>
                  <button className="remove-btn" onClick={() => removeProduct(item.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Detalles de la compra */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>$50.00</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(parseFloat(total) + 50).toFixed(2)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="cart-actions">
              <button onClick={() => navigate("/")} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={() => navigate("/user/shipping")} className="next-btn">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
