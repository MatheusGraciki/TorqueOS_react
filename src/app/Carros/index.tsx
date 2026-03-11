import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Car } from "lucide-react";
import { useCarrosPage } from "./hooks/useCarrosPage";
import { toast } from "sonner";
import { useEffect } from "react";
import "./styles.scss";

export default function CarrosPage() {
  const {
    clientes,
    loading,
    error,
    open,
    setOpen,
    editId,
    form,
    setForm,
    filterCliente,
    setFilterCliente,
    filtered,
    getClienteNome,
    openNew,
    openEdit,
    handleSave,
    handleDelete,
  } = useCarrosPage();

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar carros", { description: error });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="carros-loading">
        <div className="carros-loading-spinner"></div>
        <p className="carros-loading-text">Carregando veículos...</p>
      </div>
    );
  }

  return (
    <div className="carros-page">
      <div className="carros-header">
        <div>
          <h1 className="carros-title">
            <Car className="carros-title-icon" /> Carros
          </h1>
          <p className="carros-description">Gerencie os veículos cadastrados</p>
        </div>
        <Button onClick={openNew} className="carros-new-button gradient-primary text-primary-foreground">
          <Plus className="carros-new-button-icon" /> Novo Carro
        </Button>
      </div>

      <Card>
        <CardHeader className="carros-card-header">
          <div className="carros-filters-row">
            <CardTitle className="carros-card-title">Lista de Carros</CardTitle>
            <Select
              value={filterCliente === "all" ? "all" : String(filterCliente)}
              onValueChange={(v) => setFilterCliente(v === "all" ? "all" : Number(v))}
            >
              <SelectTrigger className="carros-filter-select-trigger">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>KM</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="carros-actions-head">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="carros-empty-cell">
                    Nenhum carro encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="carros-placa-cell">{c.placa}</TableCell>
                    <TableCell>{c.marca} {c.modelo}</TableCell>
                    <TableCell>{c.ano}</TableCell>
                    <TableCell>{c.cor}</TableCell>
                    <TableCell>{c.quilometragem.toLocaleString("pt-BR")} km</TableCell>
                    <TableCell>{getClienteNome(c.clienteId)}</TableCell>
                    <TableCell>
                      <div className="carros-actions-row">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                          <Pencil className="carros-action-icon" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id, (msg) => toast.success(msg))}
                        >
                          <Trash2 className="carros-action-icon carros-action-icon-delete" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Carro" : "Novo Carro"}</DialogTitle>
          </DialogHeader>
          <div className="carros-form">
            <div className="carros-form-field">
              <Label>Cliente *</Label>
              <Select value={String(form.clienteId || "")} onValueChange={(v) => setForm({ ...form, clienteId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="carros-form-grid-two">
              <div className="carros-form-field">
                <Label>Marca *</Label>
                <Input value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} placeholder="Ex: Fiat" />
              </div>
              <div className="carros-form-field">
                <Label>Modelo</Label>
                <Input value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} placeholder="Ex: Uno" />
              </div>
            </div>
            <div className="carros-form-grid-three">
              <div className="carros-form-field">
                <Label>Placa *</Label>
                <Input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value })} placeholder="ABC-1234" />
              </div>
              <div className="carros-form-field">
                <Label>Ano</Label>
                <Input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} />
              </div>
              <div className="carros-form-field">
                <Label>Cor</Label>
                <Input value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} placeholder="Prata" />
              </div>
            </div>
            <div className="carros-form-field">
              <Label>Quilometragem</Label>
              <Input type="number" value={form.quilometragem} onChange={(e) => setForm({ ...form, quilometragem: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSave((msg) => toast.success(msg))} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
