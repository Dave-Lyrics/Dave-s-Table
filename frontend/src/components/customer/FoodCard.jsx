import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function FoodCard({ item }) {
  const { add } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    add(item._id);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return <article className={`food-card ${!item.availability ? "unavailable" : ""}`}>
    <div className="food-image">{item.image ? <img src={item.image} alt={item.name}/> : <div className="image-placeholder">Dave's Table</div>}</div>
    <div className="food-info">
      <div><span className="pill">{item.category}</span><h3>{item.name}</h3></div>
      <p>{item.description || "A carefully prepared Dave's Table selection."}</p>
      <div className="food-bottom"><strong>₦{item.price.toLocaleString()}</strong>
        {item.availability ? (
          <button 
            className={`icon-btn ${isAdded ? "success" : ""}`} 
            onClick={handleAdd}
            aria-label="Add to cart"
          >
            {/* The wrapper handles the rotation and smooth transition */}
            <span className={`icon-wrapper ${isAdded ? "rolled" : ""}`}>
              {isAdded ? <Check size={20} /> : <Plus size={15} />}
            </span>
          </button>
        ) : (
          <span className="sold">Unavailable</span>
        )}
      </div>
    </div>
  </article>
}
