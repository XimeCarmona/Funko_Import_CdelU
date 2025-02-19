import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AgregarCategoria from './AgregarCategoria';
import EditarCategoria from './EditarCategoria';

function Categorias() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Obtener categorías desde la API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/colecciones/');
      console.log('Datos recibidos:', response.data); // Verifica aquí
      setCategories(response.data);
    } catch (error) {
      console.error('Detalle del error:', error.response);
    }
  };

  // Agregar categoría
  const handleAddCategory = async (newCategory) => {
    try {
      await axios.post('http://localhost:8000/api/colecciones/', {
        nombre: newCategory.nombre // Solo enviar el nombre
      });
      await fetchCategories(); // Recargar datos
      setIsAdding(false);
    } catch (error) {
      console.error('Error al agregar categoría:', error);
    }
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      await axios.put(`http://localhost:8000/api/colecciones/${updatedCategory.idColeccion}/`, {
        nombre: updatedCategory.nombre
      });
      fetchCategories(); // Recargar datos
      setIsEditing(false);
    } catch (error) {
      console.error('Error al editar categoría:', error);
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/colecciones/${id}/`);
      setCategories(categories.filter(category => category.idColeccion !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setIsEditing(true);
  };

  return (
    <div className="main-content">
      <h2 className="title-categorias">Categorías</h2>

      <div className="search-and-add-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Buscar Categoría"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-add-category" onClick={() => setIsAdding(true)}>
          Agregar Categoría
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
            {filteredCategories.map((category) => (
              <tr key={category.idColeccion} className="border-t">
                <td className="px-4 py-2">{category.nombre}</td>
                <td className="px-4 py-2">{category.cantidad || 0}</td> {/* Mostrar 0 si no hay productos */}
                <td className="px-4 py-2">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCategory(category.idColeccion)}
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
        <AgregarCategoria
          onClose={() => setIsAdding(false)}
          onAddCategory={handleAddCategory}
        />
      )}

      {isEditing && currentCategory && (
        <EditarCategoria
          category={currentCategory}
          onClose={() => setIsEditing(false)}
          onEditCategory={handleEditCategory}
        />
      )}
    </div>
  );
}

export default Categorias;