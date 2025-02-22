import React, { useEffect, useState } from "react";
import FunkoCard from "../user/FunkoCard";
import "../../App.css";

function GridFunkos({ searchTerm }) {
  const [productos, setProductos] = useState([]);
  const [sortedProductos, setSortedProductos] = useState([]);
  const [filterOption, setFilterOption] = useState("all");

  // Cargar productos desde la API de Django
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respuesta = await fetch("http://localhost:8000/api/auth/obtener-productos/");
        const data = await respuesta.json();
        setProductos(data);
        setSortedProductos(data);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };
    fetchData();
  }, []);

  // Filtrar por término de búsqueda
  const filteredProductos = sortedProductos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const destacado = filteredProductos.length > 0 ? filteredProductos[0] : null;
  const otrosProductos = filteredProductos.length > 1 ? filteredProductos.slice(1) : filteredProductos;

  // Ordenar productos
  const sortProductos = (type) => {
    let sorted = [...filteredProductos];
    if (type === "priceAsc") sorted.sort((a, b) => a.precio - b.precio);
    if (type === "priceDesc") sorted.sort((a, b) => b.precio - a.precio);
    if (type === "nameAsc") sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (type === "nameDesc") sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
    setSortedProductos(sorted);
  };

  // Filtrar por colección
  const filterProductos = (collection) => {
    if (collection === "all") {
      setSortedProductos(productos);
    } else {
      const filtrado = productos.filter((producto) => producto.idColeccion === collection);
      setSortedProductos(filtrado);
    }
    setFilterOption(collection);
  };

  // Obtener colecciones únicas
  const getUniqueCollections = () => {
    const collections = productos.map((producto) => producto.idColeccion);
    return ["all", ...new Set(collections)];
  };

  return (
    <div className="grid-container">
      {destacado && searchTerm === "" && filterOption === "all" && (
        <div className="featured-funko">
          <div className="featured-image">
            <img src={destacado.imagen} alt={destacado.nombre} />
          </div>
          <div className="featured-description">
            <h2>{destacado.nombre}</h2>
            <p>{destacado.descripcion}</p>
            <button className="btn-see-more">Ver más</button>
          </div>
        </div>
      )}

      <div className="nuestros-prod">
        <p>Nuestros productos</p>
      </div>

      <div className="filters">
        <span>Ordenar por: </span>
        <button onClick={() => sortProductos("nameAsc")}>A - Z</button>
        <button onClick={() => sortProductos("nameDesc")}>Z - A</button>
        <button onClick={() => sortProductos("priceAsc")}>Menor Precio</button>
        <button onClick={() => sortProductos("priceDesc")}>Mayor Precio</button>
        <select onChange={(e) => filterProductos(e.target.value)} value={filterOption}>
          {getUniqueCollections().map((col, index) => (
            <option key={index} value={col}>
              {col === "all" ? "Todas las Colecciones" : col}
            </option>
          ))}
        </select>
      </div>

      <div className="funkos-grid">
        {otrosProductos.length > 0 ? (
          otrosProductos.map((producto) => <FunkoCard key={producto.idProducto} producto={producto} />)
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default GridFunkos;