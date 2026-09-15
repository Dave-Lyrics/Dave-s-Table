import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const load = async () => {
    if (!user || user.role !== "customer") { setCart({ items: [] }); return; }
    try { const { data } = await api.get("/cart"); setCart(data.data); } catch {}
  };
  useEffect(() => { load(); }, [user]);

  const add = async (menuItemId, quantity = 1) => { const { data } = await api.post("/cart", { menuItemId, quantity }); setCart(data.data); };
  const update = async (id, quantity) => { const { data } = await api.patch(`/cart/${id}`, { quantity }); setCart(data.data); };
  const remove = async (id) => { const { data } = await api.delete(`/cart/${id}`); setCart(data.data); };
  const count = cart.items.reduce((n, i) => n + i.quantity, 0);
  const total = cart.items.reduce((n, i) => n + i.quantity * i.menuItem.price, 0);

  return <CartContext.Provider value={{ cart, add, update, remove, reload: load, count, total }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);