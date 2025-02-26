import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function AgregarProducto({ closeModal, onAddProduct, colecciones = [], ediciones = [] }) {
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    numero: 1,
    idEdicion: '',
    esEspecial: false,
    descripcion: '',
    brilla: false,
    precio: 0,
    cantidadDisp: 0,
    imagen: null, // Aquí se guardará el objeto File
    idColeccion: '',
    precio_original: 0
  });

  useEffect(() => {
    if (colecciones.length > 0) {
      setNewProduct(prev => ({
        ...prev,
        idColeccion: colecciones[0]?.idColeccion || ''
      }));
    }
  }, [colecciones]);

  // Función para capturar el objeto File cuando el usuario selecciona la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  const handleAddProduct = () => {
    // Validación de campos obligatorios
    if (!newProduct.nombre || newProduct.precio <= 0 || newProduct.cantidadDisp < 0 || !newProduct.idColeccion) {
      Swal.fire({
        title: "Por favor complete todos los campos obligatorios (*)",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    // Crear un objeto FormData para enviar los datos y el archivo
    const formData = new FormData();
    formData.append('nombre', newProduct.nombre);
    formData.append('numero', newProduct.numero);
    formData.append('idEdicion', newProduct.idEdicion);
    formData.append('esEspecial', newProduct.esEspecial ? 'True' : 'False');
    formData.append('descripcion', newProduct.descripcion);
    formData.append('brilla', newProduct.brilla ? 'True' : 'False');
    formData.append('precio', newProduct.precio);
    formData.append('cantidadDisp', newProduct.cantidadDisp);
    formData.append('idColeccion', newProduct.idColeccion);
    // Si existe imagen, la agregamos al FormData
    if (newProduct.imagen) {
      formData.append('imagen', newProduct.imagen);
    }

    onAddProduct(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Agregar Nuevo Producto</h3>
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
              value={newProduct.nombre}
              onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
              required
            />
          </label>

          <label className="block">
            <span>Número en Colección:</span>
            <input
              type="number"
              min="1"
              value={newProduct.numero}
              onChange={(e) => setNewProduct({ ...newProduct, numero: parseInt(e.target.value) || 1 })}
            />
          </label>

          <label className="block">
            <span>Edición:</span>
            <select
              value={newProduct.idEdicion}
              onChange={(e) => setNewProduct({ ...newProduct, idEdicion: e.target.value })}
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
              value={newProduct.idColeccion}
              onChange={(e) => setNewProduct({ ...newProduct, idColeccion: parseInt(e.target.value) })}
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
              value={newProduct.esEspecial ? 'si' : 'no'}
              onChange={(e) => setNewProduct({ ...newProduct, esEspecial: e.target.value === 'si' })}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>

          <label className="block">
            <span>Brilla en la oscuridad:</span>
            <select
              value={newProduct.brilla ? 'si' : 'no'}
              onChange={(e) => setNewProduct({ ...newProduct, brilla: e.target.value === 'si' })}
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
              value={newProduct.cantidadDisp}
              onChange={(e) => setNewProduct({ ...newProduct, cantidadDisp: parseInt(e.target.value) || 0 })}
              required
            />
          </label>

          <label className="block col-span-2">
            <span>Descripción:</span>
            <textarea
              placeholder="Ingrese descripción del producto"
              value={newProduct.descripcion}
              onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
            />
          </label>

          <label className="block col-span-2">
            <span>Precio:*</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={newProduct.precio}
              onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
              required
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={closeModal}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleAddProduct}>
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarProducto;