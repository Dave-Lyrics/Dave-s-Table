import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try { const { data } = await api.get("/auth/me"); setUser(data.user); }
    catch { setUser(null); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  const login = async (payload) => { const { data } = await api.post("/auth/login", payload); setUser(data.user); return data; };
  const signup = async (payload) => { const { data } = await api.post("/auth/signup", payload); setUser(data.user); return data; };
  const logout = async () => { await api.post("/auth/logout"); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout, refresh }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);