"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart2, Users, Settings, Truck } from "lucide-react";
import { useDashboardPage } from "./hooks/useDashboardPage";
import { toast } from "sonner";
import "./styles.scss";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip";

export default function Dashboard() {
  // use notifications instead of toast

  const { stats, loading, error, dataInicio, setDataInicio, dataFim, setDataFim } = useDashboardPage();

  useEffect(() => {
    if (error) {
      toast.warning("Erro ao carregar dados do dashboard", {
        description: error,
      });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading-spinner"></div>
        <p className="dashboard-loading-text">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-description">Visão mensal por padrão. Ajuste o período abaixo:</p>
        <div className="dashboard-filters-grid">
          <div className="dashboard-filter-field">
            <Label htmlFor="dataInicio">Data inicial</Label>
            <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div className="dashboard-filter-field">
            <Label htmlFor="dataFim">Data final</Label>
            <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <Card>
          <div className="dashboard-stat-card-content">
            <Users className="dashboard-stat-icon" />
            <div>
              <p className="dashboard-stat-label">Clientes</p>
              <p className="dashboard-stat-value">{stats?.clientes ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="dashboard-stat-card-content">
            <Truck className="dashboard-stat-icon" />
            <div>
              <p className="dashboard-stat-label">Carros</p>
              <p className="dashboard-stat-value">{stats?.carros ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="dashboard-stat-card-content">
            <Settings className="dashboard-stat-icon" />
            <div>
              <p className="dashboard-stat-label">Serviços</p>
              <p className="dashboard-stat-value">{stats?.servicos ?? 0}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="dashboard-stat-card-content">
            <BarChart2 className="dashboard-stat-icon" />
            <div>
              <p className="dashboard-stat-label">Faturamento</p>
              <Tooltip
                position="top"
                text={
                  <div className="dashboard-tooltip-content">
                    <div className="dashboard-tooltip-row">
                      <span>Peças</span>
                      <span>
                        {(stats?.faturamentoPecas ?? 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className="dashboard-tooltip-row">
                      <span>Mão de obra</span>
                      <span>
                        {(stats?.faturamentoMaoDeObra ?? 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                }
              >
                <p className="dashboard-stat-value dashboard-stat-value-clickable">
                  {(stats?.faturamento ?? 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </Tooltip>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}