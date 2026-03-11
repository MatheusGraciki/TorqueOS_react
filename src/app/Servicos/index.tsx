import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { Plus, Pencil, Trash2, Wrench, X, User } from "lucide-react";
import { useServicosPage } from "./hooks/useServicosPage";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import type { Servico } from "@/types/types";
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
    getCarroNome,
    getCarroPlaca,
    getClienteFromCarro,
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
    return (
      <div className="servicos-loading">
        <div className="servicos-loading-spinner"></div>
        <p className="servicos-loading-text">Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="servicos-page">
      <div className="servicos-header">
        <div>
          <h1 className="servicos-title">
            <Wrench className="servicos-title-icon" /> Serviços
          </h1>
          <p className="servicos-description">Gerencie os serviços da oficina</p>
        </div>
        <Button onClick={openNew} className="servicos-new-button gradient-primary text-primary-foreground">
          <Plus className="servicos-new-button-icon" /> Novo Serviço
        </Button>
      </div>

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
                    <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
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
                    <SelectItem key={c.id} value={String(c.id)}>{c.placa} — {c.marca}</SelectItem>
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
                  <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
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
                  <SelectItem key={c.id} value={String(c.id)}>{c.placa} — {c.marca}</SelectItem>
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
                    <p className="servicos-mobile-meta-line"><User className="servicos-mobile-meta-icon" />{clienteNomeByCarroId.get(s.carroId) ?? "—"}</p>
                    <p className="servicos-mobile-meta-line"><Wrench className="servicos-mobile-meta-icon" />{s.descricaoServico}</p>
                  </div>

                  <div className="servicos-mobile-footer">
                    <p className="servicos-mobile-date">{new Date(s.dataServico).toLocaleDateString("pt-BR")}</p>
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

                  <button type="button" onClick={() => openDetails(s)} className="servicos-mobile-details-link">Ver detalhes</button>
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
                    <TableCell colSpan={6} className="servicos-empty-cell">Nenhum serviço encontrado</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{new Date(s.dataServico).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{getCarroLabel(s.carroId)}</TableCell>
                      <TableCell>{clienteNomeByCarroId.get(s.carroId) ?? "—"}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => openDetails(s)} className="servicos-descricao-button">{s.descricaoServico}</button>
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
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="servicos-action-icon" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="servicos-action-icon servicos-action-icon-delete" /></Button>
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="servicos-details-dialog-content">
          <DialogHeader>
            <DialogTitle>Detalhes do Serviço</DialogTitle>
          </DialogHeader>
          {selectedServico && (
            <div className="servicos-details-content">
              <div className="servicos-details-row"><span className="servicos-details-label">Peças</span><span>{selectedServico.pecasUtilizadas.length}</span></div>
              <div className="servicos-details-row"><span className="servicos-details-label">Custo peças</span><span>{currency(selectedServico.custoPecas)}</span></div>
              <div className="servicos-details-row"><span className="servicos-details-label">Mão de obra</span><span>{currency(selectedServico.valorHora * selectedServico.horasTrabalhadas)}</span></div>
              <div className="servicos-details-description-wrap">
                <p className="servicos-details-description-label">Descrição</p>
                <p>{selectedServico.descricaoServico || "—"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button onClick={openNew} size="icon" className="servicos-fab gradient-primary text-primary-foreground">
        <Plus className="servicos-fab-icon" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="servicos-form-dialog-content">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="servicos-form">
            <div className="servicos-form-grid-two">
              <div className="servicos-form-field">
                <Label>Carro *</Label>
                <div className="servicos-inline-add-row">
                  <Select value={String(form.carroId || "")} onValueChange={(v) => setForm({ ...form, carroId: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o carro" /></SelectTrigger>
                    <SelectContent>
                      {carros.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.placa} — {c.marca} {c.modelo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => setOpenCarro(true)}><Plus className="servicos-inline-add-icon" /></Button>
                </div>
              </div>
              <div className="servicos-form-field">
                <Label>Data do Serviço</Label>
                <Input type="date" value={form.dataServico} onChange={(e) => setForm({ ...form, dataServico: e.target.value })} />
              </div>
            </div>

            <div className="servicos-form-field">
              <Label>Descrição do Serviço *</Label>
              <Textarea value={form.descricaoServico} onChange={(e) => setForm({ ...form, descricaoServico: e.target.value })} placeholder="Descreva o serviço realizado..." rows={3} />
            </div>

            <div className="servicos-form-field">
              <Label>Peças Utilizadas</Label>
              <div className="servicos-pecas-add-row">
                <Input value={pecaNome} onChange={(e) => setPecaNome(e.target.value)} placeholder="Nome da peça" className="servicos-pecas-nome-input" />
                <Input type="number" value={pecaValor} onChange={(e) => setPecaValor(e.target.value)} placeholder="Valor" className="servicos-pecas-valor-input" min={0} step={0.01} />
                <Button type="button" variant="outline" onClick={addPeca} size="icon"><Plus className="servicos-inline-add-icon" /></Button>
              </div>
              {form.pecasUtilizadas.length > 0 && (
                <div className="servicos-pecas-list">
                  {form.pecasUtilizadas.map((p) => (
                    <div key={p.id} className="servicos-peca-item-row">
                      <span>{p.nome}</span>
                      <div className="servicos-peca-item-actions">
                        <span className="servicos-peca-item-valor">{currency(p.valor)}</span>
                        <Button variant="ghost" size="icon" className="servicos-peca-remove-btn" onClick={() => removePeca(p.id)}><X className="servicos-peca-remove-icon" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="servicos-form-grid-two">
              <div className="servicos-form-field">
                <Label>Valor/Hora (R$)</Label>
                <Input type="number" value={form.valorHora || ""} onChange={(e) => setForm({ ...form, valorHora: Number(e.target.value) })} min={0} step={0.01} />
              </div>
              <div className="servicos-form-field">
                <Label>Horas Trabalhadas</Label>
                <Input type="number" value={form.horasTrabalhadas || ""} onChange={(e) => setForm({ ...form, horasTrabalhadas: Number(e.target.value) })} min={0} step={0.5} />
              </div>
            </div>

            <div className="servicos-resumo-box">
              <div className="servicos-resumo-row"><span className="servicos-resumo-label">Custo das Peças</span><span className="servicos-resumo-value">{currency(custoPecas)}</span></div>
              <div className="servicos-resumo-row"><span className="servicos-resumo-label">Mão de Obra ({form.horasTrabalhadas}h × {currency(form.valorHora)})</span><span className="servicos-resumo-value">{currency(form.valorHora * form.horasTrabalhadas)}</span></div>
              <div className="servicos-resumo-total-row"><span>Valor Total</span><span className="servicos-resumo-total-value">{currency(valorTotal)}</span></div>
            </div>

            <div className="servicos-form-field">
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Observações adicionais..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="servicos-primary-button gradient-primary text-primary-foreground">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCarro} onOpenChange={(isOpen) => { setOpenCarro(isOpen); if (!isOpen) setCarroForm({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Carro</DialogTitle></DialogHeader>
          <div className="servicos-form">
            <div className="servicos-form-field">
              <Label>Cliente *</Label>
              <div className="servicos-inline-add-row">
                <Select value={String(carroForm.clienteId || "")} onValueChange={(v) => setCarroForm({ ...carroForm, clienteId: Number(v) })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="outline" onClick={() => setOpenCliente(true)}><Plus className="servicos-inline-add-icon" /></Button>
              </div>
            </div>
            <div className="servicos-form-grid-two">
              <div className="servicos-form-field"><Label>Marca *</Label><Input value={carroForm.marca || ""} onChange={(e) => setCarroForm({ ...carroForm, marca: e.target.value })} /></div>
              <div className="servicos-form-field"><Label>Modelo</Label><Input value={carroForm.modelo || ""} onChange={(e) => setCarroForm({ ...carroForm, modelo: e.target.value })} /></div>
            </div>
            <div className="servicos-form-grid-two">
              <div className="servicos-form-field"><Label>Placa *</Label><Input value={carroForm.placa || ""} onChange={(e) => setCarroForm({ ...carroForm, placa: e.target.value })} /></div>
              <div className="servicos-form-field"><Label>Cor</Label><Input value={carroForm.cor || ""} onChange={(e) => setCarroForm({ ...carroForm, cor: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenCarro(false); setCarroForm({}); }}>Cancelar</Button>
            <Button
              onClick={async () => {
                const newCar = await createCarroInline(carroForm);
                setOpenCarro(false);
                if (newCar) {
                  toast.success("Carro criado");
                  if (open) setForm((f) => ({ ...f, carroId: newCar.id }));
                }
                setCarroForm({});
              }}
              className="servicos-primary-button gradient-primary text-primary-foreground"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCliente} onOpenChange={(isOpen) => { setOpenCliente(isOpen); if (!isOpen) setClienteForm({ tipoPessoa: "PF" }); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Cliente</DialogTitle></DialogHeader>
          <div className="servicos-form">
            <div className="servicos-form-field">
              <Label>Tipo de Cliente *</Label>
              <Select value={clienteForm.tipoPessoa || "PF"} onValueChange={(v: "PF" | "PJ") => setClienteForm({ ...clienteForm, tipoPessoa: v, documento: "" })}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="servicos-form-field"><Label>Nome *</Label><Input value={clienteForm.nome || ""} onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })} /></div>
            <div className="servicos-form-field">
              <Label>{clienteForm.tipoPessoa === "PJ" ? "CNPJ *" : "CPF *"}</Label>
              <Input value={clienteForm.documento || ""} onChange={(e) => setClienteForm({ ...clienteForm, documento: e.target.value })} placeholder={clienteForm.tipoPessoa === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"} />
            </div>
            <div className="servicos-form-field"><Label>Email</Label><Input value={clienteForm.email || ""} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} /></div>
            <div className="servicos-form-field"><Label>Telefone</Label><Input value={clienteForm.telefone || ""} onChange={(e) => setClienteForm({ ...clienteForm, telefone: e.target.value })} /></div>
            <div className="servicos-form-field"><Label>Endereço *</Label><Input value={clienteForm.endereco || ""} onChange={(e) => setClienteForm({ ...clienteForm, endereco: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenCliente(false); setClienteForm({ tipoPessoa: "PF" }); }}>Cancelar</Button>
            <Button
              onClick={async () => {
                const newCli = await createClienteInline(clienteForm);
                setOpenCliente(false);
                if (newCli) {
                  toast.success("Cliente criado");
                  setFilterCliente(newCli.id);
                  if (openCarro) {
                    setCarroForm((f) => ({ ...f, clienteId: newCli.id }));
                  }
                }
                setClienteForm({ tipoPessoa: "PF" });
              }}
              className="servicos-primary-button gradient-primary text-primary-foreground"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicosPage;
