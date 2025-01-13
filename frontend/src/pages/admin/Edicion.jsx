import React, { useState } from 'react';
import AgregarEdicion from './AgregarEdicion'; 
import EditarEdicion from './EditarEdicion'; 

function Edicion() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false); // mostrar/ocultar el modal de agregar
  const [isEditing, setIsEditing] = useState(false); // mostrar/ocultar el modal de editar
  const [editionToEdit, setEditionToEdit] = useState(null); // almacenar la edición seleccionada para editar

  const [editions, setEditions] = useState([
    { id: 1, nombre: 'Edición Especial', cantidad: 10 },
    { id: 2, nombre: 'Edición Limitada', cantidad: 5 },
    { id: 3, nombre: 'Edición Standard', cantidad: 20 },
  ]);

  const filteredEditions = editions.filter((edition) =>
    edition.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteEdition = (id) => {
    setEditions(editions.filter((edition) => edition.id !== id));
  };

  const handleAddEdition = (newEdition) => {
    setEditions([...editions, { ...newEdition, id: Date.now() }]);
    setIsAdding(false);
  };

  const handleEditEdition = (edition) => {
    setEditionToEdit(edition); // Establece la edición que se va a editar
    setIsEditing(true); // Abre el modal de editar
  };

  return (
    <div className="main-content">
      <h2 className="title-edicion">Edición</h2>

      {/* Barra de búsqueda y botón de agregar edición */}
      <div className="search-and-add-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar Edición"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-add-edition" onClick={() => setIsAdding(true)}>
          Agregar Edición
        </button>
      </div>

      {/* Tabla de ediciones */}
      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-center">Cantidad</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEditions.map((edition) => (
              <tr key={edition.id} className="border-t">
                <td className="px-4 py-2 text-left">{edition.nombre}</td>
                <td className="px-4 py-2 text-center">{edition.cantidad}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    className="btn-edit mr-2"
                    onClick={() => handleEditEdition(edition)} // Pasa la edición seleccionada
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteEdition(edition.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Modal para agregar edición */}
      {isAdding && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
          <AgregarEdicion
            onCancel={() => setIsAdding(false)}
            onSave={handleAddEdition}
          />
        </div>
      )}

      {/* Modal para editar edición */}
      {isEditing && editionToEdit && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50">
          <EditarEdicion
            edition={editionToEdit} // Pasa los datos de la edición a editar
            onCancel={() => setIsEditing(false)} // Cierra el modal
            onSave={(editedEdition) => {
              setEditions(
                editions.map((e) =>
                  e.id === editedEdition.id ? { ...e, ...editedEdition } : e
                )
              );
              setIsEditing(false); // Cierra el modal después de guardar
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Edicion;
