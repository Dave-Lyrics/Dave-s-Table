import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Leaf, ShieldCheck } from "lucide-react";
// 1. Import your useAuth hook
import { useAuth } from "../../context/AuthContext"; 

export default function Home() {
  // 2. Destructure the user from your auth context
  const { user } = useAuth(); 

  return <main>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">WELCOME TO DAVE'S TABLE</span>
        <h1>Good food,<br/><em>beautifully</em> served.</h1>
        <p>A simple, sophisticated table for carefully selected dishes, prepared with fresh ingredients and delivered with care.</p>
        
        <div className="hero-actions">
          <Link className="primary-btn" to="/menu">Explore the menu <ArrowRight size={18}/></Link>
          
          {/* 3. If there is NO user, show the Create an account button */}
          {!user && (
            <Link className="secondary-btn" to="/signup">Create an account</Link>
          )}
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-circle"><span>DT</span></div>
        <div className="floating-note">CURATED<br/><b>DAILY</b></div>
      </div>
    </section>
    
    <section className="feature-grid">
      <div><Leaf/><h3>Freshly selected</h3><p>Thoughtful dishes made from quality ingredients.</p></div>
      <div><Clock3/><h3>Made to order</h3><p>Your order moves from our kitchen to your table with care.</p></div>
      <div><ShieldCheck/><h3>Secure checkout</h3><p>Pay safely online through Paystack.</p></div>
    </section>
    
    <section className="home-cta">
      <div><span className="eyebrow">THE TABLE IS SET</span><h2>Find your next favourite.</h2></div>
      <Link className="primary-btn" to="/menu">View menu <ArrowRight size={18}/></Link>
    </section>
  </main>
}
