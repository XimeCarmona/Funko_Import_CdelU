import React, { useState } from 'react';

const DetalleFunko = ({ funko }) => {
  const [cantidad, setCantidad] = useState(1);

  if (!funko) return <p>Cargando...</p>;

  const manejarCambioCantidad = (nuevaCantidad) => {
    if (nuevaCantidad > 0) {
      setCantidad(nuevaCantidad);
    }
  };

  return (
    <div className="detalle-funko-contenedor">
      <div className="detalle-imagen">
        <img src={funko.image} alt={funko.name} />
      </div>

      <div className="detalle-info">
        <p>{funko.name}</p>
        <p>{funko.description}</p>
        <p>Precio: {funko.price} USD</p>
        <p>Número de colección: {funko.coleccion || 'N/A'}</p>
        <p>{funko.edicionEspecial ? 'Edición Especial' : 'Edición Regular'}</p>
        <p>{funko.brilla ? 'Brilla en la Oscuridad' : 'No Brilla'}</p>

        <div className="acciones">
          <div className="cantidad-wrapper">
            <label className="cantidad-label">Cantidad:</label>
            <div className="cantidad-control">
              <button onClick={() => manejarCambioCantidad(cantidad - 1)}>-</button>
              <input
                type="number"
                value={cantidad}
                min="1"
                readOnly
              />
              <button onClick={() => manejarCambioCantidad(cantidad + 1)}>+</button>
            </div>
          </div>
          <div className="botones-compra">
            <button className="boton-comprar">Comprar</button>
            <button className="boton-carrito">Añadir al Carrito</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleFunko;