import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import HeroImage from "./components/HeroImage/HeroImage";
import Contact from "./components/Contact/Contact";
import Products from "./components/Product/Products";
import ProductDetails from "./components/Product/ProductDetails";
import { CartProvider } from "./components/Context/CartContext";
import { SearchProvider } from "./components/Context/SearchContext";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import Footer from "./components/Footer/Footer";
import CheckoutModal from "./components/CheckoutModal/CheckoutModal";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

function Home() {
  return (
    <>
      <HeroImage />
      <Products />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <SearchProvider> {/* 🔥 AJOUTÉ ICI */}
      <CartProvider>
        <BrowserRouter>
          <Navbar onCartClick={() => setCartOpen(true)} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>

          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            onCheckout={() => {
              setCartOpen(false);      // ferme panier
              setCheckoutOpen(true);   // ouvre checkout
            }}
          />
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
          />
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  );
}