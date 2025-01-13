import React, { useState } from 'react';

function AgregarProducto({ closeModal, onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    imagen: '',
    nombre: '',
    sku: '',
    edicion: '',
    coleccion: 'Marvel',
    edicionEspecial: 'no',
    brilla: 'no',
    stock: 0,
    descripcion: '',
    precio: 0,
  });

  const handleAddProduct = () => {
    if (!newProduct.nombre || newProduct.precio <= 0 || newProduct.stock < 0) {
      alert('Por favor, complete todos los campos obligatorios correctamente.');
      return;
    }
    onAddProduct(newProduct); // Llamamos a la función para agregar el producto
    closeModal(); // Cierra el modal después de agregar el producto
  };

  return (
    <div className="modalAP fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-contentAP bg-white p-6 rounded-lg shadow-xl w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Producto</h3>
        <div className="form-gridAP grid gap-4 grid-cols-2">
          <label className="block">
            <span className="text-gray-700">Imagen del Producto:</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              onChange={(e) =>
                setNewProduct({ ...newProduct, imagen: e.target.files[0]?.name || '' })
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Nombre del Producto:</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese nombre del producto"
              value={newProduct.nombre}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nombre: e.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700">SKU:</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese SKU del producto"
              value={newProduct.sku}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sku: e.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Edición:</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese edición del producto"
              value={newProduct.edicion}
              onChange={(e) =>
                setNewProduct({ ...newProduct, edicion: e.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Colección:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.coleccion}
              onChange={(e) =>
                setNewProduct({ ...newProduct, coleccion: e.target.value })
              }
            >
              <option value="Marvel">Marvel</option>
              <option value="DC">DC</option>
              <option value="Star Wars">Star Wars</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Edición Especial:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.edicionEspecial}
              onChange={(e) =>
                setNewProduct({ ...newProduct, edicionEspecial: e.target.value })
              }
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Brilla:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={newProduct.brilla}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brilla: e.target.value })
              }
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
          <label className="block">
            <span className="text-gray-700">Stock:</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })
              }
            />
          </label>
          <label className="block col-span-2">
            <span className="text-gray-700">Descripción:</span>
            <textarea
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese descripción del producto"
              value={newProduct.descripcion}
              onChange={(e) =>
                setNewProduct({ ...newProduct, descripcion: e.target.value })
              }
            />
          </label>
          <label className="block col-span-2">
            <span className="text-gray-700">Precio:</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              value={newProduct.precio}
              onChange={(e) =>
                setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
        </div>
        <div className="modal-actionsAP flex justify-end mt-4">
          <button
            className="btn-cancelAP text-sm text-gray-600 px-4 py-2 mr-2 border border-gray-300 rounded-lg"
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className="btn-saveAP text-white bg-blue-500 px-4 py-2 rounded-lg"
            onClick={handleAddProduct}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarProducto;
