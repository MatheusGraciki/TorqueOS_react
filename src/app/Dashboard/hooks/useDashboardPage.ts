import { useEffect, useMemo, useState } from "react";
import { getCarros, getClientes, getServicos, type DashboardStats } from "../api";
import type { Carro, Cliente, Servico } from "@/types/types";

function toDateInputValue(date: Date) {
  return date.toISOString().split("T")[0];
}

function inRange(dateStr: string | undefined, from: Date, to: Date) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return normalized >= from && normalized <= to;
}

export function useDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clientesRaw, setClientesRaw] = useState<Cliente[]>([]);
  const [carrosRaw, setCarrosRaw] = useState<Carro[]>([]);
  const [servicosRaw, setServicosRaw] = useState<Servico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const ultimoDiaMesAtual = useMemo(
    () => new Date(today.getFullYear(), today.getMonth() + 1, 0),
    [today]
  );
  const [dataInicio, setDataInicio] = useState<string>(
    toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1))
  );
  const [dataFim, setDataFim] = useState<string>(toDateInputValue(ultimoDiaMesAtual));

  useEffect(() => {
    let mounted = true;

    Promise.all([getClientes(), getCarros(), getServicos()])
      .then(([clientes, carros, servicos]) => {
        if (!mounted) return;
        setClientesRaw(clientes);
        setCarrosRaw(carros);
        setServicosRaw(servicos);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const from = new Date(`${dataInicio}T00:00:00`);
    const to = new Date(`${dataFim}T23:59:59`);

    const clientes = clientesRaw.filter((item) => inRange(item.createdAt, from, to));
    const carros = carrosRaw.filter((item) => inRange(item.createdAt, from, to));
    const servicos = servicosRaw.filter((item) => inRange(item.dataServico, from, to));

    const faturamento = servicos.reduce((sum, s) => sum + Number(s.valorTotal || 0), 0);
    const faturamentoPecas = servicos.reduce((sum, s) => sum + Number(s.custoPecas || 0), 0);
    const faturamentoMaoDeObra = servicos.reduce(
      (sum, s) => sum + Number((s.valorHora || 0) * (s.horasTrabalhadas || 0)),
      0
    );

    setStats({
      clientes: clientes.length,
      carros: carros.length,
      servicos: servicos.length,
      faturamento,
      faturamentoPecas,
      faturamentoMaoDeObra,
    });
  }, [clientesRaw, carrosRaw, servicosRaw, dataInicio, dataFim]);

  return { stats, loading, error, dataInicio, setDataInicio, dataFim, setDataFim };
}
