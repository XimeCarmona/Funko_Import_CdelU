import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FunkoCard({ funko }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar favoritos desde localStorage al cargar el componente
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.some((f) => f.id === funko.id)) {
      setIsFavorite(true);
    }
  }, [funko.id]);

  // Alternar favorito
  const toggleFavorite = (e) => {
    e.stopPropagation();  // Evitar que el click pase al contenedor padre
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((f) => f.id !== funko.id);
    } else {
      favorites.push(funko);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="funko-card">
      {/* Icono de favorito en esquina superior derecha */}
      <button
        onClick={toggleFavorite}
        className={'fav-btn ${isFavorite ? "active" : ""}'}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <img src={funko.image} alt={funko.name} />
      <h3>{funko.name}</h3>
      <p>{funko.price} USD</p>

      <Link to={`/funko/${funko.id}`}>
        <button className="buy-button">Comprar</button>
      </Link>
    </div>
  );
}

export default FunkoCard;