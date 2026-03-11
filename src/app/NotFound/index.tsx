import React from "react";
import "./styles.scss";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h2 className="notfound-title">404 – Página não encontrada</h2>
      <p className="notfound-description">Desculpe, a rota que você tentou acessar não existe.</p>
    </div>
  );
}
