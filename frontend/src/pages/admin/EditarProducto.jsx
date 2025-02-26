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
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Producto</h3>
        <div className="form-grid">
          <label className="block">
            <span>Imagen del Producto:</span>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </label>
          
          <label className="block">
            <span>Nombre del Producto:*</span>
            <input
              type="text"
              placeholder="Ingrese nombre del producto"
              value={editedProduct.nombre}
              onChange={(e) => setEditedProduct({ ...editedProduct, nombre: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span>Número en Colección:</span>
            <input
              type="number"
              min="1"
              value={editedProduct.numero}
              onChange={(e) => setEditedProduct({ ...editedProduct, numero: parseInt(e.target.value) || 1 })}
            />
          </label>

          <label className="block">
            <span>Edición:</span>
            <select
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
            <span>Colección:*</span>
            <select
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
            <span>Edición Especial:</span>
            <select
              value={editedProduct.esEspecial ? 'si' : 'no'}
              onChange={(e) => setEditedProduct({ ...editedProduct, esEspecial: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span>Brilla en la oscuridad:</span>
            <select
              value={editedProduct.brilla ? 'si' : 'no'}
              onChange={(e) => setEditedProduct({ ...editedProduct, brilla: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span>Stock:*</span>
            <input
              type="number"
              min="0"
              value={editedProduct.cantidadDisp}
              onChange={(e) => setEditedProduct({ ...editedProduct, cantidadDisp: parseInt(e.target.value) || 0 })}
              required
            />
          </label>

          <label className="block col-span-2">
            <span>Descripción:</span>
            <textarea
              placeholder="Ingrese descripción del producto"
              value={editedProduct.descripcion}
              onChange={(e) => setEditedProduct({ ...editedProduct, descripcion: e.target.value })}
            />
          </label>

          <label className="block col-span-2">
            <span>Precio:*</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editedProduct.precio}
              onChange={(e) => setEditedProduct({ ...editedProduct, precio: parseFloat(e.target.value) || 0 })}
              required
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={closeModal}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarProducto;