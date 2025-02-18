import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarDescuento from './AgregarDescuento';
import EditarDescuento from './EditarDescuento';

function Descuentos() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [descuentos, setDescuentos] = useState([]);
  const [currentDescuento, setCurrentDescuento] = useState(null);

  useEffect(() => {
    fetchDescuentos();
  }, []);

  const fetchDescuentos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/descuentos/');
      setDescuentos(response.data);
    } catch (error) {
      console.error('Error obteniendo descuentos:', error);
    }
  };

  const handleAddDescuento = async (newDescuento) => {
    try {
      await axios.post('http://localhost:8000/api/descuentos/', newDescuento);
      await fetchDescuentos();
      setIsAdding(false);
    } catch (error) {
      console.error('Error agregando descuento:', error);
    }
  };

  const handleEditDescuento = async (updatedDescuento) => {
    try {
      await axios.put(`http://localhost:8000/api/descuentos/${updatedDescuento.idDescuento}/`, updatedDescuento);
      fetchDescuentos();
      setIsEditing(false);
    } catch (error) {
      console.error('Error editando descuento:', error);
    }
  };

  const handleDeleteDescuento = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/descuentos/${id}/`);
      setDescuentos(descuentos.filter(d => d.idDescuento !== id));
    } catch (error) {
      console.error('Error eliminando descuento:', error);
    }
  };

  return (
    <div className="main-content">
      <h2>Gestión de Descuentos</h2>

      <div className="search-and-add-container">
        <input
          type="text"
          placeholder="Buscar por código"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setIsAdding(true)}>
          Nuevo Descuento
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Porcentaje</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {descuentos
            .filter(d => d.codigoDescuento.toLowerCase().includes(search.toLowerCase()))
            .map(descuento => (
              <tr key={descuento.idDescuento}>
                <td>{descuento.codigoDescuento}</td>
                <td>{new Date(descuento.fechaInicio).toLocaleDateString()}</td>
                <td>{new Date(descuento.fechaFin).toLocaleDateString()}</td>
                <td>{(descuento.porcentaje * 100).toFixed(0)}%</td>
                <td>
                  <button onClick={() => {
                    setCurrentDescuento(descuento);
                    setIsEditing(true);
                  }}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteDescuento(descuento.idDescuento)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isAdding && (
        <AgregarDescuento
          onClose={() => setIsAdding(false)}
          onAddDescuento={handleAddDescuento}
        />
      )}

      {isEditing && currentDescuento && (
        <EditarDescuento
          descuento={currentDescuento}
          onClose={() => setIsEditing(false)}
          onEditDescuento={handleEditDescuento}
        />
      )}
    </div>
  );
}

export default Descuentos;