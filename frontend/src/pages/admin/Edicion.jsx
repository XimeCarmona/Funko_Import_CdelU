import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarEdicion from './AgregarEdicion';
import EditarEdicion from './EditarEdicion';

function Edicion() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editions, setEditions] = useState([]);
  const [currentEdition, setCurrentEdition] = useState(null);

  const filteredEditions = editions.filter((edition) =>
    edition.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Obtener ediciones desde la API
  useEffect(() => {
    fetchEditions();
  }, []);

  const fetchEditions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/ediciones/');
      setEditions(response.data);
    } catch (error) {
      console.error('Detalle del error:', error.response);
    }
  };

  // Agregar edición
  const handleAddEdition = async (newEdition) => {
    try {
      await axios.post('http://localhost:8000/api/ediciones/', {
        nombre: newEdition.nombre, // Solo enviamos el nombre
      });
      await fetchEditions(); // Recargar datos
      setIsAdding(false);
    } catch (error) {
      console.error('Error al agregar edición:', error);
    }
  };

  // Editar edición
  const handleEditEdition = async (updatedEdition) => {
    try {
      await axios.put(`http://localhost:8000/api/ediciones/${updatedEdition.id_edicion}/`, {
        nombre: updatedEdition.nombre, // Solo enviamos el nombre
      });
      fetchEditions(); // Recargar datos
      setIsEditing(false);
    } catch (error) {
      console.error('Error al editar edición:', error);
    }
  };

  // Eliminar edición
  const handleDeleteEdition = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/ediciones/${id}/`);
      setEditions(editions.filter(edition => edition.id_edicion !== id));
    } catch (error) {
      console.error('Error al eliminar edición:', error);
    }
  };

  const handleEditClick = (edition) => {
    setCurrentEdition(edition);
    setIsEditing(true);
  };

  return (
    <div className="main-content">
      <h2 className="title-edicion">Edición</h2>

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

      <div className="table-container">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEditions.map((edition) => (
              <tr key={edition.id_edicion} className="border-t">
                <td className="px-4 py-2">{edition.nombre}</td>
                <td className="px-4 py-2">{edition.cantidad}</td>
                <td className="px-4 py-2">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(edition)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteEdition(edition.id_edicion)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <AgregarEdicion
          onClose={() => setIsAdding(false)}
          onSave={handleAddEdition}
        />
      )}

      {isEditing && currentEdition && (
        <EditarEdicion
          edition={currentEdition}
          onClose={() => setIsEditing(false)}
          onSave={handleEditEdition}
        />
      )}
    </div>
  );
}

export default Edicion;