import React, { useEffect, useMemo, useState } from "react";
import "./SearchModal.css";
import { useSearch } from "../Context/Searchcontext";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwP9HFBO2yvEESAGKmSU-89NMnk_EndW3huDFjzFnpg1PySwAJV_LaheFRHVSCPPEaj/exec";

function fetchJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = "jsonp_cb_" + Math.random().toString(36).slice(2);

    window[callbackName] = (data) => {
      resolve(data);
      cleanup();
    };

    const script = document.createElement("script");
    script.src = `${url}?callback=${callbackName}`;
    script.async = true;

    script.onerror = () => {
      reject(new Error("JSONP failed"));
      cleanup();
    };

    document.body.appendChild(script);

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }
  });
}

export default function SearchModal({ open, onClose }) {
  const { search, setSearch } = useSearch();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    fetchJsonp(API_URL)
        .then((data) => {
        if (data.ok) {
            setProducts(data.products || []);
        }
        })
        .catch((err) => {
        console.error("Search fetch error:", err);
        });
    }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;

    const term = search.toLowerCase();
    return products.filter((p) =>
      (p.title || "").toLowerCase().includes(term)
    );
  }, [products, search]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>

        <div className="search-header">
          <input
            type="text"
            placeholder="Recherche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <button onClick={onClose}>✕</button>
        </div>

        <div className="search-results">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="search-item"
              onClick={() => {
                onClose();
                navigate(`/product/${p.id}`);
              }}
            >
              <img src={p.image} alt={p.title} />
              <span>{p.title}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="search-empty">Aucun produit trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
}