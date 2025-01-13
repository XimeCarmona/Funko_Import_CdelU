import React, { useState, useEffect } from 'react';
import '../../App.css';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

const Cart = () => {
  const [step, setStep] = useState(0);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [loading, setLoading] = useState(true); // Estado para mostrar loading

  // Cargar productos desde el JSON al montar el componente
  useEffect(() => {
    fetch('/funkos.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);  // Ocultar loading cuando se cargan los productos
      })
      .catch((error) => {
        console.error('Error al cargar los productos:', error);
        setLoading(false);  // Ocultar loading aunque haya error
      });
  }, []);

  const nextStep = () => {
    if (step === 0 && products.length > 0) {
      setStep(1);
    } else if (step === 1 && paymentMethod) {
      setStep(2);
    } else if (step === 2 && shippingMethod) {
      alert('Compra confirmada');
    }
  };

  const manejarCambioCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    const nuevosProductos = [...products];
    nuevosProductos[index].stock = nuevaCantidad;
    setProducts(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = products.filter((_, i) => i !== index);
    setProducts(nuevosProductos);
  };

  return (
    <>
      <Header />
      <div className="cart-container">

        {step === 0 && (
          <div className="step">
            <h1>Carrito de compras</h1>
            
            {loading ? (
              <p>Cargando productos...</p>
            ) : products.length > 0 ? (
              <div className="cart-container">
                <div className="cart-header">
                </div>
                <div className="cart-table">
                  <div className="cart-row cart-header-row">
                    <span>Producto</span>
                    <span>Precio</span>
                    <span>Cantidad</span>
                    <span>Acciones</span>
                  </div>
                  {products.map((product, index) => (
                    <div key={product.id} className="cart-row">
                      <div className="cart-product">
                        <img src={product.image} alt={product.name} className="cart-product-image" />
                        <span>{product.name}</span>
                      </div>
                      <span>${product.price.toFixed(2)}</span>
                      <div className="cart-quantity">
                        <button onClick={() => manejarCambioCantidad(index, product.stock - 1)}>-</button>
                        <input type="number" value={product.stock} readOnly />
                        <button onClick={() => manejarCambioCantidad(index, product.stock + 1)}>+</button>
                      </div>
                      <button onClick={() => eliminarProducto(index)} className="delete-button">🗑️</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Detalles de la compra</h3>
                  <p>Subtotal: ${products.reduce((acc, prod) => acc + prod.price * prod.stock, 0).toFixed(2)}</p>
                  <p>Envío: $50.00</p>
                  <p>Total: ${(products.reduce((acc, prod) => acc + prod.price * prod.stock, 0) + 50).toFixed(2)}</p>
                </div>
                <div className="cart-actions">
                  <button className="cancel-button">Cancelar</button>
                  <button className="next-button" onClick={nextStep}>Siguiente</button>
                </div>
              </div>
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="step">
            <h2>Método de Pago</h2>
            <p>Selecciona tu método de pago:</p>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="payment-method"
                  value="mercadopago"
                  checked={paymentMethod === 'mercadopago'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Mercado Pago
              </label>
            </div>
            <div className="next-button-container-right">
              <button onClick={nextStep} disabled={!paymentMethod}>Siguiente</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step">
            <h2>Envío</h2>
            <p>Selecciona tu método de envío:</p>
            <div className="shipping-options">
              <label>
                <input
                  type="radio"
                  name="shipping-method"
                  value="correo-argentino"
                  checked={shippingMethod === 'correo-argentino'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                Correo Argentino
              </label>
            </div>
            <div className="next-button-container-right">
              <button onClick={nextStep} disabled={!shippingMethod}>Confirmar Compra</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;