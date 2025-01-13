import React, { useState } from 'react';
import AgregarCategoria from './AgregarCategoria';
import EditarCategoria from './EditarCategoria';

function Categorias() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, nombre: 'Marvel', cantidad: 25 },
    { id: 2, nombre: 'DC', cantidad: 18 },
    { id: 3, nombre: 'Star Wars', cantidad: 30 },
  ]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, { id: categories.length + 1, ...newCategory }]);
    setIsAdding(false);
  };

  const handleEditCategory = (updatedCategory) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    setIsEditing(false);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
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
              <tr key={category.id} className="border-t">
                <td className="px-4 py-2">{category.nombre}</td>
                <td className="px-4 py-2">{category.cantidad}</td>
                <td className="px-4 py-2">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCategory(category.id)}
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
