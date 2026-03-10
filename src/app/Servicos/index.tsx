import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Wrench, X } from "lucide-react";
import { useServicosPage } from "./hooks/useServicosPage";
import { toast } from "sonner";
import { useEffect } from "react";

const currency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ServicosPage = () => {
  const {
    servicos,
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

  const handleDelete = async (id: string) => {
    await hookHandleDelete(id, (msg) => toast.success(msg));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" /> Serviços
          </h1>
          <p className="text-muted-foreground">Registre e acompanhe os serviços realizados</p>
        </div>
        <Button onClick={openNew} className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Novo Serviço
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lista de Serviços</CardTitle>
            <div className="flex items-center gap-2">
            {/* client filter + create */}
            <Select value={filterCliente} onValueChange={setFilterCliente}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filtrar por cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* car filter + create */}
            <Select value={filterCarro} onValueChange={setFilterCarro}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filtrar por carro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os carros</SelectItem>
                {carros.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.placa} — {c.marca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Carro</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Peças</TableHead>
                <TableHead className="text-right">Custo Peças</TableHead>
                <TableHead className="text-right">Mão de Obra</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Nenhum serviço encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{new Date(s.dataServico).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{getCarroLabel(s.carroId)}</TableCell>
                    <TableCell>{clientes.find(c=>c.id===getClienteFromCarro(s.carroId))?.nome||"—"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{s.descricaoServico}</TableCell>
                    <TableCell>{s.pecasUtilizadas.length}</TableCell>
                    <TableCell className="text-right">{currency(s.custoPecas)}</TableCell>
                    <TableCell className="text-right">{currency(s.valorHora * s.horasTrabalhadas)}</TableCell>
                    <TableCell className="text-right font-semibold">{currency(s.valorTotal)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Carro *</Label>
                <div className="flex items-center gap-2">
                  <Select value={form.carroId} onValueChange={(v) => setForm({ ...form, carroId: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o carro" /></SelectTrigger>
                    <SelectContent>
                      {carros.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.placa} — {c.marca} {c.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => setOpenCarro(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data do Serviço</Label>
                <Input type="date" value={form.dataServico} onChange={(e) => setForm({ ...form, dataServico: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição do Serviço *</Label>
              <Textarea value={form.descricaoServico} onChange={(e) => setForm({ ...form, descricaoServico: e.target.value })} placeholder="Descreva o serviço realizado..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label>Peças Utilizadas</Label>
              <div className="flex gap-2">
                <Input value={pecaNome} onChange={(e) => setPecaNome(e.target.value)} placeholder="Nome da peça" className="flex-1" />
                <Input type="number" value={pecaValor} onChange={(e) => setPecaValor(e.target.value)} placeholder="Valor" className="w-28" min={0} step={0.01} />
                <Button type="button" variant="outline" onClick={addPeca} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.pecasUtilizadas.length > 0 && (
                <div className="rounded-md border divide-y">
                  {form.pecasUtilizadas.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span>{p.nome}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{currency(p.valor)}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePeca(p.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor/Hora (R$)</Label>
                <Input type="number" value={form.valorHora || ""} onChange={(e) => setForm({ ...form, valorHora: Number(e.target.value) })} min={0} step={0.01} />
              </div>
              <div className="space-y-2">
                <Label>Horas Trabalhadas</Label>
                <Input type="number" value={form.horasTrabalhadas || ""} onChange={(e) => setForm({ ...form, horasTrabalhadas: Number(e.target.value) })} min={0} step={0.5} />
              </div>
            </div>

            <div className="rounded-md bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Custo das Peças</span>
                <span className="font-medium">{currency(custoPecas)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mão de Obra ({form.horasTrabalhadas}h × {currency(form.valorHora)})</span>
                <span className="font-medium">{currency(form.valorHora * form.horasTrabalhadas)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-base font-semibold">
                <span>Valor Total</span>
                <span className="text-primary">{currency(valorTotal)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Observações adicionais..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* car creation dialog */}
      <Dialog open={openCarro} onOpenChange={(open) => { setOpenCarro(open); if(!open) setCarroForm({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Carro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <div className="flex items-center gap-2">
                <Select value={carroForm.clienteId || ""} onValueChange={(v) => setCarroForm({ ...carroForm, clienteId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="outline" onClick={() => setOpenCliente(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca *</Label>
                <Input value={carroForm.marca || ""} onChange={(e) => setCarroForm({ ...carroForm, marca: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Modelo</Label>
                <Input value={carroForm.modelo || ""} onChange={(e) => setCarroForm({ ...carroForm, modelo: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Placa *</Label>
                <Input value={carroForm.placa || ""} onChange={(e) => setCarroForm({ ...carroForm, placa: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <Input value={carroForm.cor || ""} onChange={(e) => setCarroForm({ ...carroForm, cor: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenCarro(false); setCarroForm({}); }}>Cancelar</Button>
            <Button onClick={async () => {
                const newCar = await createCarroInline(carroForm);
                setOpenCarro(false);
                if (newCar) {
                  toast.success("Carro criado");
                  if (open) setForm(f => ({ ...f, carroId: newCar.id }));
                }
                setCarroForm({});
              }} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* client creation dialog */}
      <Dialog open={openCliente} onOpenChange={(open) => { setOpenCliente(open); if(!open) setClienteForm({}); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={clienteForm.nome || ""} onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={clienteForm.email || ""} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={clienteForm.telefone || ""} onChange={(e) => setClienteForm({ ...clienteForm, telefone: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenCliente(false); setClienteForm({}); }}>Cancelar</Button>
            <Button onClick={async () => {
                const newCli = await createClienteInline(clienteForm);
                setOpenCliente(false);
                if (newCli) {
                  toast.success("Cliente criado");
                  setFilterCliente(newCli.id);
                  if (openCarro) {
                    setCarroForm(f => ({ ...f, clienteId: newCli.id }));
                  }
                }
                setClienteForm({});
              }} className="gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicosPage;
