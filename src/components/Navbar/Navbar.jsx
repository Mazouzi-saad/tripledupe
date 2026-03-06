import React from "react";
import "./Navbar.css";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { useSearch } from "../Context/SearchContext";
import { useNavigate } from "react-router-dom";
import SearchModal from "../SearchModal/SearchModal";
import { useState } from "react";


const Navbar = ({ onCartClick }) => {
  const { cart } = useCart();
  const { search, setSearch } = useSearch();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  
  return (
    <header className="navbar">

      <div className="navbar-main">
        
        <div className="navbar-icon" onClick={() => setSearchOpen(true)}>
          <FiSearch />
        </div>

        <div className="navbar-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* 🔥 ICI */}
        <div className="navbar-icon" onClick={onCartClick}>
          <FiShoppingBag />
          {count > 0 && <span className="cart-badge">{count}</span>}
        </div>

      </div>

      <nav className="navbar-menu">
        <Link to="/" className="active">Accueil</Link>
        <button
          className="nav-link-btn"
          onClick={() => {
            if (window.location.pathname !== "/") {
              navigate("/");
              setTimeout(() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            } else {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          Contact
        </button>
      </nav>
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
};

export default Navbar;