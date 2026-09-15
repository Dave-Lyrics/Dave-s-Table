import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  async function signOut() { 
    await logout(); 
    setIsOpen(false);
    navigate("/"); 
  }

  return (
    <header className="nav-container">
      <div className="nav-bar-inner">
        
        {/* Brand Logo */}
        <Link to="/" className="brand" onClick={() => setIsOpen(false)}>
          <span className="brand-logo">DT</span>
          <div className="brand-text">
            Dave's Table
            <small>CURATED • FRESH • SIMPLE</small>
          </div>
        </Link>

        {/* Hamburger Menu Toggle Button */}
        <button 
          className="hamburger-btn" 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation Menu Drawer */}
        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link>
          
          {/* Customer View links */}
          {user?.role === "customer" && (
            <>
              <Link to="/orders" onClick={() => setIsOpen(false)}>Orders</Link>
              <Link to="/cart" className="cart-link" onClick={() => setIsOpen(false)}>
                <ShoppingBag size={18}/> Cart <b className="cart-badge">{count}</b>
              </Link>
            </>
          )}
          
          {/* Admin View links */}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <LayoutDashboard size={18}/> Admin
            </Link>
          )}

          {/* Mobile Logout Button (Shows at the bottom of the list when open) */}
          {user ? (
            <button className="mobile-logout-btn" onClick={signOut}>
              <LogOut size={18}/> Logout
            </button>
          ) : (
            <Link to="/login" className="mobile-login-link" onClick={() => setIsOpen(false)}>
              <User size={18}/> Login
            </Link>
          )}
        </nav>

        {/* Desktop-Only Action Buttons Area */}
        <div className="nav-actions-desktop">
          {user ? (
            <button className="ghost-btn" onClick={signOut}>
              <LogOut size={17}/> Logout
            </button>
          ) : (
            <Link to="/login" className="desktop-login-link">
              <User size={17}/> Login
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
