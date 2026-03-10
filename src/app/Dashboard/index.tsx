"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart2, Users, Settings, Truck } from "lucide-react";
import { useDashboardPage } from "./hooks/useDashboardPage";
import { toast } from "sonner";

export default function Dashboard() {
  // use notifications instead of toast

  const { stats, loading, error } = useDashboardPage();

  useEffect(() => {
    if (error) {
      toast.warning("Erro ao carregar dados do dashboard", {
        description: error,
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <div className="p-4 flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Clientes</p>
              <p className="text-xl font-semibold">{stats?.clientes ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center gap-3">
            <Truck className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Carros</p>
              <p className="text-xl font-semibold">{stats?.carros ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Serviços</p>
              <p className="text-xl font-semibold">{stats?.servicos ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 flex items-center gap-3">
            <BarChart2 className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-xl font-semibold">
                {(stats?.faturamento ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}