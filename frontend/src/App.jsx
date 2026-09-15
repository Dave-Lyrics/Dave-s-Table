import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import PaymentCallback from "./pages/customer/PaymentCallback";
import Auth from "./pages/auth/Auth";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MenuManager from "./pages/admin/MenuManager";

export default function App(){
 return <div className="app"><Navbar/><Routes>
  <Route path="/" element={<Home/>}/><Route path="/menu" element={<Menu/>}/>
  <Route path="/login" element={<Auth/>}/><Route path="/signup" element={<Auth mode="signup"/>}/>
  <Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/reset-password" element={<ResetPassword/>}/>
  <Route path="/payment/callback" element={<ProtectedRoute role="customer"><PaymentCallback/></ProtectedRoute>}/>
  <Route path="/cart" element={<ProtectedRoute role="customer"><Cart/></ProtectedRoute>}/>
  <Route path="/checkout" element={<ProtectedRoute role="customer"><Checkout/></ProtectedRoute>}/>
  <Route path="/orders" element={<ProtectedRoute role="customer"><Orders/></ProtectedRoute>}/>
  <Route path="/admin/login" element={<Auth admin/>}/><Route path="/admin/signup" element={<Auth admin mode="signup"/>}/>
  <Route path="/admin/forgot-password" element={<ForgotPassword/>}/>
  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>}/>
  <Route path="/admin/menu" element={<ProtectedRoute role="admin"><MenuManager/></ProtectedRoute>}/>
 </Routes><Footer/></div>
}