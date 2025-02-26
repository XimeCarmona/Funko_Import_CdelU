import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function EditarEdicion({ edition, onCancel, onSave }) {
  const [nombre, setNombre] = useState(edition.nombre);

  // Actualiza los valores del formulario cuando la edición cambia
  useEffect(() => {
    setNombre(edition.nombre);
  }, [edition]);

  const handleSave = () => {
    if (!nombre) {
      Swal.fire({
        title: "El nombre es obligatorio",
        icon: "warning",
        confirmButtonText: "OK"
      });
      return;
    }

    const updatedEdition = { ...edition, nombre }; // Solo actualiza el nombre
    onSave(updatedEdition); // Pasa la edición editada a la función onSave
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Edición</h3>
        
        <div className="form-group">
          <label>Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="modal-actions">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default EditarEdicion;