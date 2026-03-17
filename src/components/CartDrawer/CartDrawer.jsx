import React from "react";
import { useCart } from "../Context/CartContext";
import "./CartDrawer.css";

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>

        <div className="cart-header">
          <h2>Votre panier</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        {cart.length === 0 && (
          <p className="cart-empty">Votre panier est vide.</p>
        )}

        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.title} />

            <div className="cart-info">
              <h4>{item.title}</h4>
              <p>{item.price.toFixed(2)} dh</p>

              <div className="cart-qty">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
            </div>

            <div className="cart-right">
              <p>{(item.price * item.qty).toFixed(2)} dh</p>
              <button
                className="cart-delete"
                onClick={() => removeFromCart(item.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total estimé</span>
                <strong>{total.toFixed(2)} dh</strong>
              </div>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={onCheckout}
            >
              ACHETER MAINTENANT
            </button>
          </>
        )}

      </div>
    </div>
  );
}