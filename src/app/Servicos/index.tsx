import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useServicosPage } from "./hooks/useServicosPage";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import type { Servico } from "@/types/types";
import { LoadingState } from "./components/LoadingState/index";
import { ServicosHeader } from "./components/ServicosHeader/index";
import { ServicosFilters } from "./components/ServicosFilters/index";
import { ServicosList } from "./components/ServicosList/index";
import { ServicoDetailsDialog } from "./components/ServicoDetailsDialog/index.tsx";
import { ServicoEditorDialogs } from "./components/ServicoEditorDialogs/index";
import "./styles.scss";

const currency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const currencyCompact = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const ServicosPage = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  const {
    carros,
    clientes,
    loading,
    error,
    open,
    setOpen,
    editId,
    form,
    setForm,
    pecaNome,
    setPecaNome,
    pecaValor,
    setPecaValor,
    filterCliente,
    setFilterCliente,
    filterCarro,
    setFilterCarro,
    filtered,
    custoPecas,
    valorTotal,
    getCarroLabel,
    getCarroNome,
    getCarroPlaca,
    openNew,
    openEdit,
    addPeca,
    removePeca,
    openCarro,
    setOpenCarro,
    carroForm,
    setCarroForm,
    openCliente,
    setOpenCliente,
    clienteForm,
    setClienteForm,
    createCarroInline,
    createClienteInline,
    handleSave: hookHandleSave,
    handleDelete: hookHandleDelete,
  } = useServicosPage();

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar serviços", { description: error });
    }
  }, [error]);

  const handleSave = async () => {
    await hookHandleSave((msg) => toast.success(msg));
  };

  const handleDelete = async (id: number) => {
    await hookHandleDelete(id, (msg) => toast.success(msg));
  };

  const clienteNomeById = useMemo(() => {
    return new Map(clientes.map((c) => [c.id, c.nome]));
  }, [clientes]);

  const clienteNomeByCarroId = useMemo(() => {
    return new Map(
      carros.map((carro) => [carro.id, clienteNomeById.get(carro.clienteId) ?? "—"])
    );
  }, [carros, clienteNomeById]);

  const openDetails = (servico: Servico) => {
    setSelectedServico(servico);
    setDetailsOpen(true);
  };

  if (loading) {
    return <LoadingState text="Carregando serviços..." />;
  }

  return (
    <div className="servicos-page">
      <ServicosHeader onNew={openNew} />

      <Card>
        <CardHeader className="servicos-card-header">
          <ServicosFilters
            clientes={clientes}
            carros={carros}
            filterCliente={filterCliente}
            setFilterCliente={setFilterCliente}
            filterCarro={filterCarro}
            setFilterCarro={setFilterCarro}
          />
        </CardHeader>

        <CardContent>
          <ServicosList
            filtered={filtered}
            getCarroNome={getCarroNome}
            getCarroPlaca={getCarroPlaca}
            getCarroLabel={getCarroLabel}
            clienteNomeByCarroId={clienteNomeByCarroId}
            openEdit={openEdit}
            handleDelete={handleDelete}
            openDetails={openDetails}
            currency={currency}
            currencyCompact={currencyCompact}
          />
        </CardContent>
      </Card>

      <ServicoDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedServico={selectedServico}
        carroLabel={selectedServico ? getCarroLabel(selectedServico.carroId) : ""}
        clienteNome={selectedServico ? (clienteNomeByCarroId.get(selectedServico.carroId) ?? "—") : ""}
        currency={currency}
      />

      <Button onClick={openNew} size="icon" className="servicos-fab gradient-primary text-primary-foreground">
        <Plus className="servicos-fab-icon" />
      </Button>

      <ServicoEditorDialogs
        open={open}
        setOpen={setOpen}
        editId={editId}
        form={form}
        setForm={setForm}
        pecaNome={pecaNome}
        setPecaNome={setPecaNome}
        pecaValor={pecaValor}
        setPecaValor={setPecaValor}
        addPeca={addPeca}
        removePeca={removePeca}
        custoPecas={custoPecas}
        valorTotal={valorTotal}
        onSave={handleSave}
        carros={carros}
        clientes={clientes}
        openCarro={openCarro}
        setOpenCarro={setOpenCarro}
        carroForm={carroForm}
        setCarroForm={setCarroForm}
        openCliente={openCliente}
        setOpenCliente={setOpenCliente}
        clienteForm={clienteForm}
        setClienteForm={setClienteForm}
        createCarroInline={createCarroInline}
        createClienteInline={createClienteInline}
        setFilterCliente={setFilterCliente}
      />
    </div>
  );
};

export default ServicosPage;
