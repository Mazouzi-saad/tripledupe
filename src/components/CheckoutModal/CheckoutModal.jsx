import React, { useEffect, useState } from "react";
import "./CheckoutModal.css";
import { useCart } from "../Context/CartContext";

const ORDER_API_URL =
  "https://script.google.com/macros/s/AKfycbyjhcDAZI85EldVQ5TdaR4a7yS1M2CFSha5XXrwLg8u7tLyc42EqVbqkubZWGzVq7UU/exec";

export default function CheckoutModal({ open, onClose }) {
  const { cart, total, clearCart } = useCart();
  const [popup, setPopup] = useState({ type: "", title: "", message: "" });
  const shippingFee = 35;
  const finalTotal = total + shippingFee;
  

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    if (open) {
      setPopup({ type: "", title: "", message: "" });
      setForm({ fullname: "", phone: "", address: "", city: "" });
    }
  }, [open]);

  if (!open) return null;

  const isLoading = popup.type === "loading";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return;

    const payload = {
      type: "order",
      shipping: "Standard",
      shippingFee: shippingFee,
      fullname: form.fullname,
      phone: form.phone,
      address: form.address,
      city: form.city,
      subtotal: total,
      total: finalTotal,
      items: cart,
    };

    setPopup({
      type: "loading",
      title: "Envoi en cours…",
      message: "Merci de patienter quelques secondes.",
    });

    try {
      const res = await fetch(ORDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok) {
        clearCart();

        setPopup({
          type: "success",
          title: "Commande confirmée ✅",
          message: "Votre achat a été effectué avec succès."
        });
      } else {
        setPopup({
          type: "error",
          title: "Erreur",
          message: data?.error || "Une erreur est survenue.",
        });
      }
    } catch (err) {
      setPopup({
        type: "error",
        title: "Erreur réseau",
        message: "Vérifie ta connexion.",
      });
    }
  };

  return (
    <div className="ck-overlay" onClick={onClose}>
      <div className="ck-modal" onClick={(e) => e.stopPropagation()}>
        <button className="ck-close" onClick={onClose}>×</button>

        <h2 className="ck-title">Insérez votre adresse de livraison</h2>
        {popup.type === "success" && (
          <div className="ck-successPopup">
            <div className="ck-successBox">
              <div className="ck-successIcon">✔</div>
              <h3>{popup.title}</h3>
              <p>{popup.message}</p>
              <button
                onClick={() => {
                  setPopup({ type: "", title: "", message: "" });
                  onClose();
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
        <form className="ck-form" onSubmit={handleSubmit}>
          <div className="ck-field">
            <label>Nom Complet *</label>
            <input
              name="fullname"
              value={form.fullname}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="ck-field">
            <label>Téléphone *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="ck-field">
            <label>Adresse *</label>
            <input
              name="address"
              value={form.address}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="ck-field">
            <label>Ville *</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="ck-summary">
            <div className="ck-line">
              <span>Sous-total</span>
              <strong>{total.toFixed(2)} dh</strong>
            </div>

            <div className="ck-line">
              <span>Livraison</span>
              <strong>{shippingFee.toFixed(2)} dh</strong>
            </div>

            <div className="ck-total">
              <span>Total</span>
              <strong>{finalTotal.toFixed(2)} dh</strong>
            </div>
          </div>

          <button className="ck-submit" type="submit" disabled={isLoading}>
            Terminez votre achat - {finalTotal.toFixed(2)} dh
          </button>
        </form>
      </div>
    </div>
  );
}