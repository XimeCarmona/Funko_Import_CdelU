import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function FunkoCard({ funko }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.some((f) => f.idProducto === funko.idProducto)) {
      setIsFavorite(true);
    }
  }, [funko.idProducto]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((f) => f.idProducto !== funko.idProducto);
    } else {
      favorites.push(funko);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Construye la URL completa de la imagen
  const imageUrl = funko.imagen 
  ? `http://localhost:8000/media/productos/${funko.imagen}`
  : "https://via.placeholder.com/150";

  return (
    <div className="funko-card">
      <button
        onClick={toggleFavorite}
        className={`fav-btn ${isFavorite ? "active" : ""}`}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <img 
        src={imageUrl} 
        alt={funko.nombre} 
        className="funko-image" 
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";  // Imagen de respaldo si falla la carga
        }}
      />
      <h3>{funko.nombre}</h3>
      <p>{funko.precio} USD</p>

      <Link to={`/user/funko/${funko.id}`}>
        <button className="buy-button">Comprar</button>
      </Link>
    </div>
  );
}

export default FunkoCard;
