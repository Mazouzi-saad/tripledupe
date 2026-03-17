import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = "Bonjour, j'ai une question concernant vos produits.";
    const url = `https://wa.me/212706712456?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="whatsapp-float" onClick={handleClick}>
      <FaWhatsapp />
    </div>
  );
}