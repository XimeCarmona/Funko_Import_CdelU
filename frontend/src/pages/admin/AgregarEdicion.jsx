import React, { useState } from 'react';

function AgregarEdicion({ onCancel, onSave }) {
  const [newEdition, setNewEdition] = useState({
    nombre: '',
    cantidad: 0,
  });

  const handleSave = () => {
    if (newEdition.nombre.trim() === '' || newEdition.cantidad <= 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }
    onSave(newEdition);
    setNewEdition({ nombre: '', cantidad: 0 }); // Resetear el formulario
  };

  return (
    <div className="modalAE">
      <div className="modal-contentAE">
        <h3>Agregar Nueva Edición</h3>
        <label className="blockAE my-2">
          Nombre:
          <input
            type="text"
            placeholder="Ingrese nombre de la edición"
            className="input-fieldAE"
            value={newEdition.nombre}
            onChange={(e) =>
              setNewEdition({ ...newEdition, nombre: e.target.value })
            }
          />
        </label>
        <label className="blockAE my-2">
          Cantidad:
          <input
            type="number"
            min="1"
            placeholder="Ingrese cantidad"
            className="input-field"
            value={newEdition.cantidad}
            onChange={(e) =>
              setNewEdition({ ...newEdition, cantidad: parseInt(e.target.value) })
            }
          />
        </label>
        <div className="modal-actionsAE">
          <button className="btn-cancelAE" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-saveAE" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarEdicion;
