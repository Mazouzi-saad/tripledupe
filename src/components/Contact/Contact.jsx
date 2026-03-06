import React, { useEffect, useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [popup, setPopup] = useState({
    open: false,
    type: "success", // "success" | "error" | "loading"
    title: "",
    message: "",
  });

  const closePopup = () => setPopup((p) => ({ ...p, open: false }));

  // Fermer avec ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const payload = {
      type: "contact",
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    // Popup loading
    setPopup({
      open: true,
      type: "loading",
      title: "Envoi en cours…",
      message: "Merci de patienter quelques secondes.",
    });

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwZleiml8LYCHOAabXdC-NZSMBrKgknlCIeqRB8qum0rDhsL4EljV4e47KI6DQWm2Zv/exec",
        {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.ok) {
        form.reset();
        setPopup({
          open: true,
          type: "success",
          title: "Message envoyé ",
          message: "On te répondra dès que possible.",
        });
      } else {
        setPopup({
          open: true,
          type: "error",
          title: "Oups…",
          message: "Une erreur est survenue. Réessaie dans quelques instants.",
        });
      }
    } catch (err) {
      setPopup({
        open: true,
        type: "error",
        title: "Erreur réseau",
        message: "Vérifie ta connexion puis réessaie.",
      });
    }
  };

  return (
    <main className="contact-page" id="contact">
      <section className="contact-container">
        <h1 className="contact-title">Contact</h1>
        <p className="contact-subtitle">
          Une question ? Laisse-nous un message et on te répond rapidement.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-row">
            <div className="field">
              <label htmlFor="name">Nom</label>
              <input id="name" name="name" type="text" placeholder="Nom" />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="E-mail"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Numéro de téléphone"
            />
          </div>

          <div className="field">
            <label htmlFor="message">Commentaire</label>
            <textarea
              id="message"
              name="message"
              placeholder="Écris ton message ici..."
              rows="6"
            />
          </div>

          <button className="contact-btn" type="submit" disabled={popup.type === "loading" && popup.open}>
            {popup.type === "loading" && popup.open ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </section>

      {/* POPUP */}
      {popup.open && (
        <div className="popup-overlay" onClick={closePopup} role="presentation">
          <div className="popup-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="popup-close" onClick={closePopup} aria-label="Fermer">
              ×
            </button>

            <div className={`popup-badge ${popup.type}`}>
              {popup.type === "success" && "✓"}
              {popup.type === "error" && "!"}
              {popup.type === "loading" && <span className="spinner" />}
            </div>

            <h3 className="popup-title">{popup.title}</h3>
            <p className="popup-message">{popup.message}</p>

            <div className="popup-actions">
              <button className="popup-btn" onClick={closePopup}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Contact;