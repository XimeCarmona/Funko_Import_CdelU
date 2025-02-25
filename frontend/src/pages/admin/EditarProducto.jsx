import React, { useState, useEffect } from 'react';

function EditarProducto({ producto, closeModal, onSave, colecciones = [], ediciones = [] }) {
  const [editedProduct, setEditedProduct] = useState({
    idProducto: producto.idProducto, 
    nombre: producto.nombre,
    numero: producto.numero,
    idEdicion: producto.idEdicion,
    esEspecial: producto.esEspecial,
    descripcion: producto.descripcion,
    brilla: producto.brilla,
    precio: producto.precio,
    cantidadDisp: producto.cantidadDisp,
    imagen: null, // Aquí se guardará el objeto File si se cambia la imagen
    idColeccion: producto.idColeccion,
    precio_original: producto.precio_original
  });

  useEffect(() => {
    if (colecciones.length > 0) {
      setEditedProduct(prev => ({
        ...prev,
        idColeccion: colecciones[0]?.idColeccion || ''
      }));
    }
  }, [colecciones]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  const handleSave = () => {
    const productData = { ...editedProduct };
    if (!productData.imagen) {
      delete productData.imagen; // Evita enviar un campo vacío
    }
    onSave(productData);
    closeModal();
  };
  

  return (
    <div className="modalAP fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-contentAP bg-white p-6 rounded-lg shadow-xl w-[600px]">
        <h3 className="text-xl font-semibold mb-4">Editar Producto</h3>
        <div className="form-gridAP grid gap-4 grid-cols-2">
          <label className="block">
            <span className="text-gray-700">Imagen del Producto:</span>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              onChange={handleFileChange}
            />
          </label>
          
          <label className="block">
            <span className="text-gray-700">Nombre del Producto:*</span>
            <input
              type="text"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              placeholder="Ingrese nombre del producto"
              value={editedProduct.nombre}
              onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Número en Colección:</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="1"
              value={editedProduct.numero}
              onChange={(e) => setEditedProduct({ ...editedProduct, numero: parseInt(e.target.value) || 1 })}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Edición:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.idEdicion}
              onChange={(e) => setEditedProduct({ ...editedProduct, idEdicion: e.target.value })}
            >
              <option value="">Seleccione edición</option>
              {ediciones.map(edicion => (
                <option key={edicion.id_edicion} value={edicion.id_edicion}>
                  {edicion.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Colección:*</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.idColeccion}
              onChange={(e) => setEditedProduct({ ...editedProduct, idColeccion: parseInt(e.target.value) })}
              required
            >
              {colecciones.map(coleccion => (
                <option key={coleccion.idColeccion} value={coleccion.idColeccion}>
                  {coleccion.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Edición Especial:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.esEspecial ? 'si' : 'no'}
              onChange={(e) => setEditedProduct({ ...editedProduct, esEspecial: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Brilla en la oscuridad:</span>
            <select
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              value={editedProduct.brilla ? 'si' : 'no'}
              onChange={(e) => setEditedProduct({ ...editedProduct, brilla: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Stock:*</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              value={editedProduct.cantidadDisp}
              onChange={(e) => setEditedProduct({ ...editedProduct, cantidadDisp: parseInt(e.target.value) || 0 })}
              required
            />
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Descripción:</span>
            <textarea
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md h-24"
              placeholder="Ingrese descripción del producto"
              value={editedProduct.descripcion}
              onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
            />
          </label>

          <label className="block col-span-2">
            <span className="text-gray-700">Precio:*</span>
            <input
              type="number"
              className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
              value={editedProduct.precio}
              onChange={(e) => setEditedProduct({ ...editedProduct, precio: parseFloat(e.target.value) || 0 })}
              required
            />
          </label>
        </div>

        <div className="modal-actionsAP flex justify-end mt-4">
          <button
            className="btn-cancelAP text-sm text-gray-600 px-4 py-2 mr-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={closeModal}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="btn-saveAP text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleSave}
            type="button"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarProducto;