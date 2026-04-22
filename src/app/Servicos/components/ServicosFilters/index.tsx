import { CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Carro, Cliente } from "@/types/types";
import "./styles.scss";

type Props = {
  clientes: Cliente[];
  carros: Carro[];
  filterCliente: "all" | number;
  setFilterCliente: (value: "all" | number) => void;
  filterCarro: "all" | number;
  setFilterCarro: (value: "all" | number) => void;
};

export const ServicosFilters = ({
  clientes,
  carros,
  filterCliente,
  setFilterCliente,
  filterCarro,
  setFilterCarro,
}: Props) => {
  return (
    <>
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
                  {c.placa} — {c.marca}
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
                {c.placa} — {c.marca}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
