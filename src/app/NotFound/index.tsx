import React from "react";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">404 – Página não encontrada</h2>
      <p className="text-muted-foreground">Desculpe, a rota que você tentou acessar não existe.</p>
    </div>
  );
}
