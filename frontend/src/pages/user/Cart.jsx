import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail"); // Obtener el correo desde localStorage
        if (!userEmail) {
          alert("Usuario no autenticado");
          return;
        }
  
        const response = await fetch("http://localhost:8000/api/auth/obtener-carrito/", {
          method: "GET",
          headers: {
            "userEmail": userEmail,  // Usar el correo en lugar de el token
          },
        });
  
        const data = await response.json();
        if (data.error) {
          alert(data.error);
          setLoading(false);
          return;
        }
  
        const cartWithQuantity = data.productos.map((item) => ({ ...item, quantity: 1 }));
        setCart(cartWithQuantity);
        calcularTotal(cartWithQuantity);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        setLoading(false);
      }
    };
  
    fetchCart();
  }, []);
  

  const calcularTotal = (cart) => {
    const totalAmount = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    setTotal(totalAmount.toFixed(2));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) return;

    const updatedCart = cart.map((item) =>
      item.idProducto === productId ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    calcularTotal(updatedCart);
  };

  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.idProducto !== productId);
    setCart(updatedCart);
    calcularTotal(updatedCart);
  };

  const applyDiscount = () => {
    const validCodes = ["DESCUENTO10", "BLACKFRIDAY", "NAVIDAD2023"];
    if (validCodes.includes(discountCode.toUpperCase())) {
      setDiscountApplied(true);
      const discount = total * 0.1;
      setDiscountAmount(discount.toFixed(2));
      alert("¡Código de descuento aplicado!");
    } else {
      alert("Código de descuento no válido");
    }
  };

  const totalWithDiscount = (parseFloat(total) + 50 - discountAmount).toFixed(2);

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
            <div className="cart-header">
              <div>Producto</div>
              <div>Precio</div>
              <div>Cantidad</div>
              <div>Total</div>
              <div>Acciones</div>
            </div>

            {cart.map((item) => (
              <div key={item.idProducto} className="cart-item">
                <div className="cart-product">
                <img
                  src={`http://localhost:8000${item.imagen}`}  // Concatenando la URL base con la imagen
                  alt={item.nombre}
                  className="cart-item-img"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Imagen de reemplazo si hay un error
                />
                  <span>{item.nombre}</span>
                </div>
                <div>${item.precio}</div>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.idProducto, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.idProducto, item.quantity + 1)}>+</button>
                </div>
                <div>${(item.precio * item.quantity).toFixed(2)}</div>
                <div>
                  <button className="remove-btn" onClick={() => removeProduct(item.idProducto)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="summary-row">
                <span>Envío</span>
                <span>$50.00</span>
              </div>
              {discountApplied && (
                <div className="summary-row">
                  <span>Descuento</span>
                  <span>-${discountAmount}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalWithDiscount}</span>
              </div>
            </div>

            <div className="discount-section">
              <input
                type="text"
                placeholder="Código de descuento"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={applyDiscount} className="apply-discount-btn">
                Aplicar Descuento
              </button>
            </div>

            <div className="cart-actions">
              <button onClick={() => navigate("/")} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={() => navigate("/checkout")} className="checkout-btn">
                Pagar
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