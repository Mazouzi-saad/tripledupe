import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-socials">

        <a
          href="https://www.instagram.com/triple.dupe?igsh=MTdlcWsyOWw3ZmF2aQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.tiktok.com/@tripledupe?_r=1&_t=ZN-94jbbq4T6QQ"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon"
        >
          <FaTiktok />
        </a>

      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} TRIPLE DUPE. All rights reserved.
      </p>

    </footer>
  );
}