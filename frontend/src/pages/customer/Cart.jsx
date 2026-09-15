import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/customer/CartItem";

export default function Cart() {
  const { cart, update, remove, total } = useCart();
  return <main className="content narrow"><div className="section-heading"><div><span className="eyebrow">YOUR SELECTION</span><h1>Shopping Cart</h1></div></div>
    {!cart.items.length ? <div className="empty-state">Your table is waiting. <Link to="/menu">Browse the menu</Link>.</div> :
    <div className="checkout-layout"><div>{cart.items.map(item => <CartItem key={item.menuItem._id} item={item} update={update} remove={remove}/>)}</div>
      <aside className="summary"><span className="eyebrow">ORDER SUMMARY</span><h2>Ready to checkout?</h2><div className="summary-line"><span>Subtotal</span><b>₦{total.toLocaleString()}</b></div><div className="summary-line total"><span>Total</span><b>₦{total.toLocaleString()}</b></div><Link className="primary-btn full" to="/checkout">Continue <ArrowRight size={18}/></Link></aside>
    </div>}
  </main>
}