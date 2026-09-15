import { useEffect, useState } from "react";
import api from "../../services/api";
import FoodCard from "../../components/customer/FoodCard";

export default function Menu() {
  const [items, setItems] = useState([]), [category, setCategory] = useState("All");
  useEffect(() => { api.get("/menu").then(r => setItems(r.data.data)).catch(console.error); }, []);
  const categories = ["All", ...new Set(items.map(i => i.category))];
  const visible = category === "All" ? items : items.filter(i => i.category === category);
  return <main className="content"><div className="section-heading"><div><span className="eyebrow">DAVE'S TABLE</span><h1>Our Menu</h1><p>Carefully selected dishes, ready when you are.</p></div></div>
    <div className="category-bar">{categories.map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div>
    {visible.length ? <div className="food-grid">{visible.map(item => <FoodCard key={item._id} item={item}/>)}</div> : <div className="empty-state">No menu items yet. The kitchen is getting ready.</div>}
  </main>
}