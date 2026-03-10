import { useState, useEffect } from "react";
import { getC } from "@/helpers/conexao";
import type { DashboardStats } from "../api";

export function useDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const [cliPromise, cliCtrl] = getC("/clientes");
    const [carPromise, carCtrl] = getC("/carros");
    const [servPromise, servCtrl] = getC("/servicos");

    Promise.all([cliPromise, carPromise, servPromise])
      .then(([cliRes, carRes, servRes]) => {
        const clientes = cliRes.data.length;
        const carros = carRes.data.length;
        const servicosArr = servRes.data;
        const servicos = servicosArr.length;
        const faturamento = servicosArr.reduce((sum: number, s: any) => sum + (s.valorTotal || 0), 0);
        setStats({ clientes, carros, servicos, faturamento });
      })
      .catch((err: any) => {
        setError(err.message || String(err));
      })
      .finally(() => setLoading(false));

    return () => {
      cliCtrl.abort();
      carCtrl.abort();
      servCtrl.abort();
    };
  }, []);

  return { stats, loading, error };
}
