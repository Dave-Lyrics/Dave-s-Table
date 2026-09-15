import { Minus, Plus, Trash2 } from "lucide-react";
export default function CartItem({ item, update, remove }) {
  const product = item.menuItem;
  return <div className="cart-item">
    {product.image ? <img src={product.image} alt={product.name}/> : <div className="thumb-placeholder">DT</div>}
    <div className="cart-item-main"><h3>{product.name}</h3><p>₦{product.price.toLocaleString()}</p>
      <div className="qty"><button onClick={() => update(product._id, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={15}/></button><span>{item.quantity}</span><button onClick={() => update(product._id, item.quantity + 1)}><Plus size={15}/></button></div>
    </div>
    <div className="cart-item-end"><strong>₦{(product.price * item.quantity).toLocaleString()}</strong><button className="danger-link" onClick={() => remove(product._id)}><Trash2 size={17}/></button></div>
  </div>
}