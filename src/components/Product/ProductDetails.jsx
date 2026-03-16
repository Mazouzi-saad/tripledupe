import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";
import Contact from "../Contact/Contact";
import CheckoutModal from "../CheckoutModal/CheckoutModal"; // ajuste le chemin
import { useCart } from "../Context/CartContext";
import CartDrawer from "../CartDrawer/CartDrawer";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwP9HFBO2yvEESAGKmSU-89NMnk_EndW3huDFjzFnpg1PySwAJV_LaheFRHVSCPPEaj/exec";

function fetchJsonp(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_cb_" + Math.random().toString(36).slice(2);
    const sep = url.includes("?") ? "&" : "?";

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP timeout"));
    }, timeoutMs);

    window[callbackName] = (data) => {
      clearTimeout(timer);
      resolve(data);
      cleanup();
    };

    const script = document.createElement("script");
    script.src = `${url}${sep}callback=${encodeURIComponent(callbackName)}`;
    script.async = true;

    script.onerror = () => {
      clearTimeout(timer);
      cleanup();
      reject(new Error("JSONP failed"));
    };

    document.body.appendChild(script);

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }
  });
}

const formatPrice = (p) => `${p.price.toFixed(2)} ${p.currency || "dh"}`;


export default function ProductDetails() {
  const { addToCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  // const openCheckout = () => setCheckoutOpen(true);
  const closeCheckout = () => setCheckoutOpen(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJsonp(API_URL);
        if (!data.ok) throw new Error(data.error || "API error");

        setProducts(data.products || []);
      } catch (e) {
        setError("Impossible de charger le produit.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  useEffect(() => {
    if (product) {
      const max = Math.max(1, Number(product.quantity || 1));
      setQty((q) => Math.min(q, max));
    }
  }, [product]);

  const maxQty = product ? Math.max(1, Number(product.quantity || 1)) : 1;

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(maxQty, q + 1));

  const handleAddToCart = () => {
    addToCart(product, qty);   // ajoute au panier global
    setCartOpen(true);         // ouvre le drawer
  };

  if (loading) {
    return (
      <main className="pd-page pd-loaderPage">
        <div className="pd-loader">
          <img src="/logo.png" alt="Loading" />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pd-page">
        <p className="pd-state error">{error || "Produit introuvable."}</p>
        <button className="pd-back" onClick={() => navigate(-1)}>
          Retour
        </button>
      </main>
    );
  }

  return (
    <main className="pd-page">
      <div className="pd-container">
        <section className="pd-left">
          <div className="pd-imageWrap">
            <img src={product.image} alt={product.title} />
          </div>
        </section>

        <section className="pd-right">
          <p className="pd-brand">TRIPLE DUPE</p>
          <h1 className="pd-title">{product.title}</h1>

          <p className="pd-price">{formatPrice(product)}</p>
          <p className="pd-ship">Frais d'expédition calculés à l’étape de paiement.</p>

          <div className="pd-qtyBlock">
            <p className="pd-qtyLabel">Quantité</p>
            <div className="pd-qty">
              <button type="button" onClick={dec} aria-label="moins">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={inc} aria-label="plus">
                +
              </button>
            </div>
            <p className="pd-stock">Stock: {product.quantity}</p>
          </div>

          <button className="pd-btnOutline" onClick={handleAddToCart}>
            Ajouter au panier
          </button>

          {/* <button className="pd-btnSolid" onClick={openCheckout}>
            ACHETER MAINTENANT
          </button> */}

          {product.description && (
            <div className="pd-desc">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <button className="pd-back" onClick={() => navigate(-1)}>
            ← Retour
          </button>
        </section>
      </div>
    <div className="pd-contact">
      <Contact />
    </div>
    <CheckoutModal
      open={checkoutOpen}
      onClose={closeCheckout}
      product={product}
      qty={qty}
      apiUrl={API_URL}
    />
    <CartDrawer
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      onCheckout={() => {
        setCartOpen(false);
        setCheckoutOpen(true);
      }}
    />
    </main>
  );
}