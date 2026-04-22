import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { formatDate } from "../../../../lib/date";
import { Pencil, Trash2, User, Wrench } from "lucide-react";
import type { Servico } from "@/types/types";
import "./styles.scss";

type Props = {
  filtered: Servico[];
  getCarroNome: (id: number) => string;
  getCarroPlaca: (id: number) => string;
  getCarroLabel: (id: number) => string;
  clienteNomeByCarroId: Map<number, string>;
  openEdit: (servico: Servico) => void;
  handleDelete: (id: number) => Promise<void>;
  openDetails: (servico: Servico) => void;
  currency: (value: number) => string;
  currencyCompact: (value: number) => string;
};

export const ServicosList = ({
  filtered,
  getCarroNome,
  getCarroPlaca,
  getCarroLabel,
  clienteNomeByCarroId,
  openEdit,
  handleDelete,
  openDetails,
  currency,
  currencyCompact,
}: Props) => {
  return (
    <>
      <div className="servicos-mobile-list">
        {filtered.length === 0 ? (
          <div className="servicos-empty-mobile">Nenhum serviço encontrado</div>
        ) : (
          filtered.map((s) => {
            const carroNome = getCarroNome(s.carroId);
            const carroPlaca = getCarroPlaca(s.carroId);
            const clienteNome = clienteNomeByCarroId.get(s.carroId) ?? "—";

            return (
              <div key={s.id} className="servicos-mobile-card">
                <div className="servicos-mobile-car-header">
                  <p className="servicos-mobile-car-name" title={carroNome}>
                    {carroNome}
                  </p>
                  <p className="servicos-mobile-car-plate" title={carroPlaca}>
                    {carroPlaca}
                  </p>
                </div>

                <div className="servicos-mobile-meta">
                  <p className="servicos-mobile-meta-line">
                    <User className="servicos-mobile-meta-icon" />
                    <span className="servicos-mobile-meta-text" title={clienteNome}>
                      {clienteNome}
                    </span>
                  </p>
                  <p className="servicos-mobile-meta-line">
                    <Wrench className="servicos-mobile-meta-icon" />
                    <span className="servicos-mobile-meta-text" title={s.descricaoServico}>
                      {s.descricaoServico}
                    </span>
                  </p>
                </div>

                <div className="servicos-mobile-footer">
                  <p className="servicos-mobile-date">{formatDate(s.dataServico)}</p>
                  <p className="servicos-mobile-total">{currencyCompact(s.valorTotal)}</p>
                </div>

                <div className="servicos-mobile-actions">
                  <Button variant="outline" size="sm" className="servicos-mobile-action-btn" onClick={() => openEdit(s)}>
                    <Pencil className="servicos-mobile-action-icon" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="servicos-mobile-action-btn" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="servicos-mobile-action-icon" />
                    Excluir
                  </Button>
                </div>

                <button type="button" onClick={() => openDetails(s)} className="servicos-mobile-details-link">
                  Ver detalhes
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="servicos-desktop-table-wrap">
        <Table className="servicos-desktop-table">
          <colgroup>
            <col className="servicos-col-data" />
            <col className="servicos-col-carro" />
            <col className="servicos-col-cliente" />
            <col className="servicos-col-servico" />
            <col className="servicos-col-total" />
            <col className="servicos-col-acoes" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Carro</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead className="servicos-total-head">Total</TableHead>
              <TableHead className="servicos-actions-head">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="servicos-empty-cell">
                  Nenhum serviço encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => {
                const carroLabel = getCarroLabel(s.carroId);
                const clienteNome = clienteNomeByCarroId.get(s.carroId) ?? "—";

                return (
                  <TableRow key={s.id}>
                    <TableCell>{formatDate(s.dataServico)}</TableCell>
                    <TableCell>
                      <span className="servicos-table-ellipsis" title={carroLabel}>
                        {carroLabel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="servicos-table-ellipsis" title={clienteNome}>
                        {clienteNome}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button type="button" onClick={() => openDetails(s)} className="servicos-descricao-button" title={s.descricaoServico}>
                        {s.descricaoServico}
                      </button>
                    </TableCell>
                    <TableCell className="servicos-total-cell">
                      <Tooltip
                        position="top"
                        text={
                          <div className="servicos-tooltip-content">
                            <div className="servicos-tooltip-row">
                              <span>Peças</span>
                              <span>{currency(s.custoPecas)}</span>
                            </div>
                            <div className="servicos-tooltip-row">
                              <span>Mão de obra</span>
                              <span>{currency(s.valorHora * s.horasTrabalhadas)}</span>
                            </div>
                          </div>
                        }
                      >
                        <span className="c-pointer">{currency(s.valorTotal)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="servicos-actions-row">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="servicos-action-icon" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="servicos-action-icon servicos-action-icon-delete" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
