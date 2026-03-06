import React, { useEffect, useMemo, useState } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../Context/SearchContext";


const API_URL =
  "https://script.google.com/macros/s/AKfycbwP9HFBO2yvEESAGKmSU-89NMnk_EndW3huDFjzFnpg1PySwAJV_LaheFRHVSCPPEaj/exec"; // <-- colle ton URL ici


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

const formatPrice = (p) => `${p.price.toFixed(2)} ${p.currency || "dh"}`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const { search } = useSearch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ ICI c'est bon

  const goToDetails = (id) => {
    navigate(`/product/${id}`);
  };
  // filtres/tri
  const [availability, setAvailability] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("az");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJsonp(API_URL); // ✅ seulement JSONP

        if (!data.ok) throw new Error(data.error || "API error");
        setProducts(data.products || []);
      } catch (e) {
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    let list = products.map((p) => ({
      ...p,
      price: Number(p.price) || 0,
      quantity: Number(p.quantity) || 0,
      available:
        p.available === true ||
        String(p.available).toLowerCase().trim() === "true" ||
        p.quantity > 0,
    }));

    // 🔥 RECHERCHE PAR TITLE
    if (search && search.trim() !== "") {
      const term = search.toLowerCase().trim();

      list = list.filter((p) =>
        p.title.toLowerCase().includes(term)
      );
    }

    // 🔹 FILTRE DISPONIBILITÉ
    if (availability === "in") {
      list = list.filter((p) => p.available && p.quantity > 0);
    }

    if (availability === "out") {
      list = list.filter((p) => !p.available || p.quantity === 0);
    }

    // 🔹 FILTRE PRIX
    if (priceRange !== "all") {
      if (priceRange === "0-200") {
        list = list.filter((p) => p.price <= 200);
      }

      if (priceRange === "200-500") {
        list = list.filter((p) => p.price > 200 && p.price <= 500);
      }

      if (priceRange === "500+") {
        list = list.filter((p) => p.price > 500);
      }
    }

    // 🔹 TRI
    if (sort === "az") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "za") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (sort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, availability, priceRange, sort, search]);

  return (
    <main className="products-page">
      <div className="products-header">
        <h1 className="products-title">Produits</h1>

        <div className="products-toolbar">
          <div className="toolbar-left">
            <span className="toolbar-label">Filtre :</span>

            <div className="select-wrap">
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="all">Disponibilité</option>
                <option value="in">En stock</option>
                <option value="out">Rupture</option>
              </select>
            </div>

            <div className="select-wrap">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">Prix</option>
                <option value="0-200">≤ 200 dh</option>
                <option value="200-500">200 – 500 dh</option>
                <option value="500+">+ 500 dh</option>
              </select>
            </div>
          </div>

          <div className="toolbar-right">
            <span className="toolbar-label">Trier par :</span>

            <div className="select-wrap">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="az">Alphabétique, A → Z</option>
                <option value="za">Alphabétique, Z → A</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            <div className="products-count">{filtered.length} produits</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="products-loaderPage">
          <div className="products-loader">
            <img src="/logo.png" alt="Loading" />
          </div>
        </div>
      )}
      {error && <p className="products-state error">{error}</p>}

      {!loading && !error && (
        <section className="products-grid">
          {filtered.map((p) => (
            <article
              className="product-card"
              key={p.id}
              onClick={() => goToDetails(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToDetails(p.id);
              }}
            >
              <div className="product-image">
                <img src={p.image} alt={p.title} />
                {!p.available && <span className="badge">Rupture</span>}
              </div>

              <div className="product-body">
                <h3 className="product-name">{p.title}</h3>
                {p.description && (
                  <p className="product-desc">{p.description}</p>
                )}

                <div className="product-meta">
                  <p className="product-price">{formatPrice(p)}</p>
                  <p className="product-qty">
                    Stock: {p.quantity > 0 ? p.quantity : 0}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Products;