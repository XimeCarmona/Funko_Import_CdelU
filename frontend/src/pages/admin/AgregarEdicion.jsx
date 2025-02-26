import React, { useState } from 'react';
import Swal from 'sweetalert2';

function AgregarEdicion({ onCancel, onSave }) {
  const [newEdition, setNewEdition] = useState({
    nombre: '', // Solo necesitamos el nombre
  });

  const handleSave = () => {
    if (newEdition.nombre.trim() === '') {
      Swal.fire({
        title: "El nombre de la edición es obligatorio",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }
    onSave(newEdition); // Enviamos solo el nombre
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Agregar Nueva Edición</h3>
        <div className="form-group">
          <label>
            Nombre:
            <input
              type="text"
              placeholder="Ingrese nombre de la edición"
              value={newEdition.nombre}
              onChange={(e) =>
                setNewEdition({ ...newEdition, nombre: e.target.value })
              }
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgregarEdicion;