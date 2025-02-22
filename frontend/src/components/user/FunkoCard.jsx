import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function FunkoCard({ producto }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.some((p) => p.idProducto === producto.idProducto)) {
      setIsFavorite(true);
    }
  }, [producto.idProducto]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      favorites = favorites.filter((p) => p.idProducto !== producto.idProducto);
    } else {
      favorites.push(producto);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Construye la URL completa de la imagen
  const imageUrl = producto.imagen 
    ? producto.imagen
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
        alt={producto.nombre} 
        className="funko-image" 
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />
      <h3>{producto.nombre}</h3>
      <p>{producto.precio} USD</p>

      <button onClick={() => navigate(`/user/funko/${producto.idProducto}`)}>
        Comprar
      </button>
    
    </div>
  );
}

export default FunkoCard;