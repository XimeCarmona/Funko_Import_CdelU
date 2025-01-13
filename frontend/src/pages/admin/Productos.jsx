import React, { useState } from 'react';
import AgregarProducto from './AgregarProducto';
import EditarProducto from './EditarProducto';

function Productos() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [productos, setProductos] = useState([
    { id: 1, imagen: '/path-to-image1.jpg', nombre: 'Funko Pop 1', categoria: 'Marvel', precio: '$15', stock: 20 },
    { id: 2, imagen: '/path-to-image2.jpg', nombre: 'Funko Pop 2', categoria: 'DC', precio: '$12', stock: 15 },
    { id: 3, imagen: '/path-to-image3.jpg', nombre: 'Funko Pop 3', categoria: 'Star Wars', precio: '$20', stock: 10 },
  ]);

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProductClick = () => setIsAdding(true);
  const handleEditProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const addNewProduct = (product) => {
    setProductos([...productos, { id: productos.length + 1, ...product }]);
  };

  const saveEditedProduct = (editedProduct) => {
    setProductos(productos.map((producto) =>
      producto.id === editedProduct.id ? editedProduct : producto
    ));
  };

  return (
    <div className="main-content">
      <h2 className="title-productos">Productos</h2>

      <div className="search-and-add-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar Funko Pop"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-add-product" onClick={handleAddProductClick}>
          Agregar Producto
        </button>
      </div>

      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.id}>
                <td className="px-4 py-2">
                  <img src={producto.imagen} alt={producto.nombre} className="w-16 h-16 object-cover" />
                </td>
                <td className="px-4 py-2">{producto.nombre}</td>
                <td className="px-4 py-2">{producto.categoria}</td>
                <td className="px-4 py-2">{producto.precio}</td>
                <td className="px-4 py-2">{producto.stock}</td>
                <td className="px-4 py-2">
                  <button className="btn-edit" onClick={() => handleEditProductClick(producto)}>Editar</button>
                  <button className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && <AgregarProducto closeModal={closeModal} onAddProduct={addNewProduct}/>}
      {isEditing && (
        <EditarProducto
          producto={selectedProduct}
          closeModal={closeModal}
          onSave={saveEditedProduct}
        />
      )}
    </div>
  );
}

export default Productos;
