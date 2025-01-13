import React from 'react';

function Pedidos() {
  const orders = [
    { id: 1, usuario: 'Juan Pérez', producto: 'Funko Pop 1', total: '$45', estado: 'Enviado' },
    { id: 2, usuario: 'Ana López', producto: 'Funko Pop 2', total: '$30', estado: 'Cancelado' },
    { id: 3, usuario: 'Jorge Gómez', producto: 'Funko Pop 3', total: '$60', estado: 'Enviado' },
    // Agrega más pedidos aquí
  ];

  return (
    <div className="main-content">
      <h2 className="title-pedidos">Pedidos</h2>

      {/* Tabla de pedidos */}
      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Orden</th>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.usuario}</td>
                <td className="px-4 py-2">{order.producto}</td>
                <td className="px-4 py-2">{order.total}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-lg ${
                      order.estado === 'Enviado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pedidos;
