import "./Footer.css";
import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";

function Footer() {
  const currentYear = new Date().getFullYear();
  const ctx = useContext(ModeContext);

  return (
    // <div className={`footer-class` }></div>
    <footer>
      <p className={`footer-class ${ctx.mode}`}>© {currentYear} Blog Post | All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
