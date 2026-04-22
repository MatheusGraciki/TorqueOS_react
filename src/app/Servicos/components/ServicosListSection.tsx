import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { formatDate } from "../../../lib/date";
import { Pencil, Trash2, User, Wrench } from "lucide-react";
import type { Carro, Cliente, Servico } from "@/types/types";

type Props = {
  filtered: Servico[];
  clientes: Cliente[];
  carros: Carro[];
  filterCliente: "all" | number;
  setFilterCliente: (value: "all" | number) => void;
  filterCarro: "all" | number;
  setFilterCarro: (value: "all" | number) => void;
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

export const ServicosListSection = ({
  filtered,
  clientes,
  carros,
  filterCliente,
  setFilterCliente,
  filterCarro,
  setFilterCarro,
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
    <Card>
      <CardHeader className="servicos-card-header">
        <div className="servicos-desktop-filters">
          <CardTitle className="servicos-card-title">Lista de Serviços</CardTitle>
          <div className="servicos-filters-row">
            <Select
              value={filterCliente === "all" ? "all" : String(filterCliente)}
              onValueChange={(v) => setFilterCliente(v === "all" ? "all" : Number(v))}
            >
              <SelectTrigger className="servicos-filter-select-trigger">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterCarro === "all" ? "all" : String(filterCarro)}
              onValueChange={(v) => setFilterCarro(v === "all" ? "all" : Number(v))}
            >
              <SelectTrigger className="servicos-filter-select-trigger">
                <SelectValue placeholder="Filtrar por carro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os carros</SelectItem>
                {carros.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.placa} - {c.marca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="servicos-mobile-filters">
          <Select
            value={filterCliente === "all" ? "all" : String(filterCliente)}
            onValueChange={(v) => setFilterCliente(v === "all" ? "all" : Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clientes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterCarro === "all" ? "all" : String(filterCarro)}
            onValueChange={(v) => setFilterCarro(v === "all" ? "all" : Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por carro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os carros</SelectItem>
              {carros.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.placa} - {c.marca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="servicos-mobile-list">
          {filtered.length === 0 ? (
            <div className="servicos-empty-mobile">Nenhum serviço encontrado</div>
          ) : (
            filtered.map((s) => (
              <div key={s.id} className="servicos-mobile-card">
                <div className="servicos-mobile-car-header">
                  <p className="servicos-mobile-car-name">{getCarroNome(s.carroId)}</p>
                  <p className="servicos-mobile-car-plate">{getCarroPlaca(s.carroId)}</p>
                </div>

                <div className="servicos-mobile-meta">
                  <p className="servicos-mobile-meta-line">
                    <User className="servicos-mobile-meta-icon" />
                    {clienteNomeByCarroId.get(s.carroId) ?? "-"}
                  </p>
                  <p className="servicos-mobile-meta-line">
                    <Wrench className="servicos-mobile-meta-icon" />
                    {s.descricaoServico}
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
            ))
          )}
        </div>

        <div className="servicos-desktop-table-wrap">
          <Table>
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
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{formatDate(s.dataServico)}</TableCell>
                    <TableCell>{getCarroLabel(s.carroId)}</TableCell>
                    <TableCell>{clienteNomeByCarroId.get(s.carroId) ?? "-"}</TableCell>
                    <TableCell>
                      <button type="button" onClick={() => openDetails(s)} className="servicos-descricao-button">
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
