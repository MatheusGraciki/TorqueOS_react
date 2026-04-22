import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, CarFront, ClipboardList, Wrench } from "lucide-react";
import type { Servico } from "@/types/types";
import "./styles.scss";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedServico: Servico | null;
  carroLabel: string;
  clienteNome: string;
  currency: (value: number) => string;
};

export const ServicoDetailsDialog = ({
  open,
  onOpenChange,
  selectedServico,
  carroLabel,
  clienteNome,
  currency,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="servicos-details-dialog-content">
        <DialogHeader className="servicos-details-content">
          <div className="servicos-details-header">
            <div className="servicos-details-title-wrap">
              <span className="servicos-details-eyebrow">Resumo do atendimento</span>
              <DialogTitle>Detalhes do Serviço</DialogTitle>
            </div>
            <Badge variant="secondary" className="servicos-details-badge">
              Concluído
            </Badge>
          </div>
        </DialogHeader>

        {selectedServico && (
          <div className="servicos-details-content pt-0">
            <div className="servicos-details-hero">
              <div className="servicos-details-hero-top">
                <div className="servicos-details-hero-title-block">
                  <p className="servicos-details-hero-kicker">Serviço principal</p>
                  <h3 className="servicos-details-hero-title">{selectedServico.descricaoServico || "Serviço realizado"}</h3>
                </div>
                <div className="servicos-details-hero-total">
                  <span className="servicos-details-metric-label">Valor total</span>
                  <span className="servicos-details-hero-value">{currency(selectedServico.valorTotal)}</span>
                </div>
              </div>

              <div className="servicos-details-chip-row">
                <div className="servicos-details-chip">
                  <CarFront className="servicos-details-chip-icon" />
                  <span>{carroLabel || "—"}</span>
                </div>
                <div className="servicos-details-chip">
                  <ClipboardList className="servicos-details-chip-icon" />
                  <span>{clienteNome || "—"}</span>
                </div>
                <div className="servicos-details-chip">
                  <CalendarDays className="servicos-details-chip-icon" />
                  <span>{new Date(selectedServico.dataServico).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="servicos-row servicos-details-metrics-row">
              <div className="servicos-col servicos-col-6">
                <div className="servicos-details-metric-card">
                  <p className="servicos-details-metric-label">Peças</p>
                  <p className="servicos-details-metric-value">{selectedServico.pecasUtilizadas.length}</p>
                </div>
              </div>
              <div className="servicos-col servicos-col-6">
                <div className="servicos-details-metric-card">
                  <p className="servicos-details-metric-label">Custo peças</p>
                  <p className="servicos-details-metric-value">{currency(selectedServico.custoPecas)}</p>
                </div>
              </div>
              <div className="servicos-col servicos-col-6">
                <div className="servicos-details-metric-card">
                  <p className="servicos-details-metric-label">Mão de obra</p>
                  <p className="servicos-details-metric-value">
                    {currency(selectedServico.valorHora * selectedServico.horasTrabalhadas)}
                  </p>
                </div>
              </div>
              <div className="servicos-col servicos-col-6">
                <div className="servicos-details-metric-card">
                  <p className="servicos-details-metric-label">Horas trabalhadas</p>
                  <p className="servicos-details-metric-value">{selectedServico.horasTrabalhadas.toFixed(1)}h</p>
                </div>
              </div>
            </div>

            <div className="servicos-details-grid-2col">
              <div className="servicos-details-panel servicos-details-panel-description">
                <p className="servicos-details-section-title">Descrição</p>
                <p className="servicos-details-description-text">{selectedServico.descricaoServico || "—"}</p>
              </div>

              <div className="servicos-details-panel">
                <p className="servicos-details-section-title">Peças usadas</p>
                {selectedServico.pecasUtilizadas.length === 0 ? (
                  <p className="servicos-details-empty">Nenhuma peça registrada</p>
                ) : (
                  <div className="servicos-details-parts-list">
                    {selectedServico.pecasUtilizadas.map((peca) => (
                      <div key={peca.id} className="servicos-details-part-row">
                        <span className="servicos-details-part-name">
                          <Wrench className="servicos-details-part-icon" />
                          {peca.nome}
                        </span>
                        <span className="servicos-details-part-value">{currency(peca.valor)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="servicos-details-panel servicos-details-panel-secondary">
              <p className="servicos-details-section-title">Observações</p>
              <p className="servicos-details-observations-text">
                {selectedServico.observacoes || "Sem observações para este serviço."}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
