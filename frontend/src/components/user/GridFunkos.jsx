import React, { useEffect, useState } from 'react';
import FunkoCard from '../user/FunkoCard'
import { obtenerFunkos } from '../../utils/api';
import '../../App.css';

function GridFunkos() {
  const [funkos, setFunkos] = useState([]);
  const [sortedFunkos, setSortedFunkos] = useState([]);
  const [filterOption, setFilterOption] = useState("all");

  // Cargar funkos al montar el componente
  useEffect(() => {
    obtenerFunkos().then((data) => {
      setFunkos(data);
      setSortedFunkos(data);
    });
  }, []);

  const destacado = sortedFunkos[0];
  const otrosFunkos = sortedFunkos.slice(1);

  // Ordenar funkos
  const sortFunkos = (type) => {
    let sorted = [...sortedFunkos];
    if (type === "priceAsc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (type === "priceDesc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (type === "nameAsc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === "nameDesc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    setSortedFunkos(sorted);
  };

  // Filtrar por colección
  const filterFunkos = (collection) => {
    if (collection === "all") {
      setSortedFunkos(funkos);
    } else {
      const filtered = funkos.filter((funko) => funko.collection === collection);
      setSortedFunkos(filtered);
    }
    setFilterOption(collection);
  };

  // Obtener colecciones únicas
  const getUniqueCollections = () => {
    const collections = funkos.map((funko) => funko.collection);
    return ["all", ...new Set(collections)];
  };

  return (
    <div className="grid-container">

      {destacado && (
        <div className="featured-funko">
          <div className="featured-image">
            <img src={destacado.image} alt={destacado.name} />
          </div>
          <div className="featured-description">
            <h2>{destacado.name}</h2>
            <p>{destacado.description}</p>
            <button className="btn-see-more">Ver más</button>
          </div>
        </div>
      )}
      
      <div className="nuestros-prod">
        <p>Nuestros productos</p>
      </div>
      {/* Filtros */}
      <div className="filters">
        <span>Ordenar por: </span>
        <button onClick={() => sortFunkos("nameAsc")}>A - Z</button>
        <button onClick={() => sortFunkos("nameDesc")}>Z - A</button>
        <button onClick={() => sortFunkos("priceAsc")}>Menor Precio</button>
        <button onClick={() => sortFunkos("priceDesc")}>Mayor Precio</button>
        
        <select
          onChange={(e) => filterFunkos(e.target.value)}
          value={filterOption}
        >
          {getUniqueCollections().map((col, index) => (
            <option key={index} value={col}>
              {col === "all" ? "Todas las Colecciones" : col}
            </option>
          ))}
        </select>
      </div>

      {/* Grilla de Funkos */}
      <div className="funkos-grid">
        {otrosFunkos.length > 0 ? (
          otrosFunkos.map((funko) => (
            <FunkoCard key={funko.id} funko={funko} />
          ))
        ) : (
          <p>No hay funkos disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default GridFunkos;