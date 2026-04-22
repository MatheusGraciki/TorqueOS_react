import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { Carro, Cliente } from "@/types/types";
import type { Dispatch, SetStateAction } from "react";
import type { ClienteInlineForm, CreateServicoInput } from "../../types";
import "./styles.scss";

const currency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editId: number | null;
  form: CreateServicoInput;
  setForm: Dispatch<SetStateAction<CreateServicoInput>>;
  pecaNome: string;
  setPecaNome: (value: string) => void;
  pecaValor: string;
  setPecaValor: (value: string) => void;
  addPeca: () => void;
  removePeca: (id: string | number) => void;
  custoPecas: number;
  valorTotal: number;
  onSave: () => Promise<void>;
  carros: Carro[];
  clientes: Cliente[];
  openCarro: boolean;
  setOpenCarro: (open: boolean) => void;
  carroForm: Partial<Carro>;
  setCarroForm: Dispatch<SetStateAction<Partial<Carro>>>;
  openCliente: boolean;
  setOpenCliente: (open: boolean) => void;
  clienteForm: ClienteInlineForm;
  setClienteForm: Dispatch<SetStateAction<ClienteInlineForm>>;
  createCarroInline: (data: Partial<Carro>) => Promise<Carro | null>;
  createClienteInline: (data: ClienteInlineForm) => Promise<Cliente | null>;
  setFilterCliente: (value: "all" | number) => void;
};

export const ServicoEditorDialogs = ({
  open,
  setOpen,
  editId,
  form,
  setForm,
  pecaNome,
  setPecaNome,
  pecaValor,
  setPecaValor,
  addPeca,
  removePeca,
  custoPecas,
  valorTotal,
  onSave,
  carros,
  clientes,
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
  setFilterCliente,
}: Props) => {
  return (
    <>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o carro" />
                    </SelectTrigger>
                    <SelectContent>
                      {carros.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.placa} — {c.marca} {c.modelo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => setOpenCarro(true)}>
                    <Plus className="servicos-inline-add-icon" />
                  </Button>
                </div>
              </div>
              <div className="servicos-form-field">
                <Label>Data do Serviço</Label>
                <Input type="date" value={form.dataServico} onChange={(e) => setForm({ ...form, dataServico: e.target.value })} />
              </div>
            </div>

            <div className="servicos-form-field">
              <Label>Descrição do Serviço *</Label>
              <Textarea
                value={form.descricaoServico}
                onChange={(e) => setForm({ ...form, descricaoServico: e.target.value })}
                placeholder="Descreva o serviço realizado..."
                rows={3}
              />
            </div>

            <div className="servicos-form-field">
              <Label>Peças Utilizadas</Label>
              <div className="servicos-pecas-add-row">
                <Input
                  value={pecaNome}
                  onChange={(e) => setPecaNome(e.target.value)}
                  placeholder="Nome da peça"
                  className="servicos-pecas-nome-input"
                />
                <Input
                  type="number"
                  value={pecaValor}
                  onChange={(e) => setPecaValor(e.target.value)}
                  placeholder="Valor"
                  className="servicos-pecas-valor-input"
                  min={0}
                  step={0.01}
                />
                <Button type="button" variant="outline" onClick={addPeca} size="icon">
                  <Plus className="servicos-inline-add-icon" />
                </Button>
              </div>
              {form.pecasUtilizadas.length > 0 && (
                <div className="servicos-pecas-list">
                  {form.pecasUtilizadas.map((p) => (
                    <div key={p.id} className="servicos-peca-item-row">
                      <span>{p.nome}</span>
                      <div className="servicos-peca-item-actions">
                        <span className="servicos-peca-item-valor">{currency(p.valor)}</span>
                        <Button variant="ghost" size="icon" className="servicos-peca-remove-btn" onClick={() => removePeca(p.id)}>
                          <X className="servicos-peca-remove-icon" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="servicos-form-grid-two">
              <div className="servicos-form-field">
                <Label>Valor/Hora (R$)</Label>
                <Input
                  type="number"
                  value={form.valorHora || ""}
                  onChange={(e) => setForm({ ...form, valorHora: Number(e.target.value) })}
                  min={0}
                  step={0.01}
                />
              </div>
              <div className="servicos-form-field">
                <Label>Horas Trabalhadas</Label>
                <Input
                  type="number"
                  value={form.horasTrabalhadas || ""}
                  onChange={(e) => setForm({ ...form, horasTrabalhadas: Number(e.target.value) })}
                  min={0}
                  step={0.5}
                />
              </div>
            </div>

            <div className="servicos-resumo-box">
              <div className="servicos-resumo-row">
                <span className="servicos-resumo-label">Custo das Peças</span>
                <span className="servicos-resumo-value">{currency(custoPecas)}</span>
              </div>
              <div className="servicos-resumo-row">
                <span className="servicos-resumo-label">
                  Mão de Obra ({form.horasTrabalhadas}h × {currency(form.valorHora)})
                </span>
                <span className="servicos-resumo-value">{currency(form.valorHora * form.horasTrabalhadas)}</span>
              </div>
              <div className="servicos-resumo-total-row">
                <span>Valor Total</span>
                <span className="servicos-resumo-total-value">{currency(valorTotal)}</span>
              </div>
            </div>

            <div className="servicos-form-field">
              <Label>Observações</Label>
              <Textarea
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Observações adicionais..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave} className="servicos-primary-button gradient-primary text-primary-foreground">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openCarro}
        onOpenChange={(isOpen) => {
          setOpenCarro(isOpen);
          if (!isOpen) setCarroForm({});
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Carro</DialogTitle>
          </DialogHeader>
          <div className="servicos-form">
            <div className="servicos-form-field">
              <Label>Cliente *</Label>
              <div className="servicos-inline-add-row">
                <Select value={String(carroForm.clienteId || "")} onValueChange={(v) => setCarroForm({ ...carroForm, clienteId: Number(v) })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="icon" variant="outline" onClick={() => setOpenCliente(true)}>
                  <Plus className="servicos-inline-add-icon" />
                </Button>
              </div>
            </div>
            <div className="servicos-form-grid-two">
              <div className="servicos-form-field">
                <Label>Marca *</Label>
                <Input value={carroForm.marca || ""} onChange={(e) => setCarroForm({ ...carroForm, marca: e.target.value })} />
              </div>
              <div className="servicos-form-field">
                <Label>Modelo</Label>
                <Input value={carroForm.modelo || ""} onChange={(e) => setCarroForm({ ...carroForm, modelo: e.target.value })} />
              </div>
            </div>
            <div className="servicos-form-grid-two">
              <div className="servicos-form-field">
                <Label>Placa *</Label>
                <Input value={carroForm.placa || ""} onChange={(e) => setCarroForm({ ...carroForm, placa: e.target.value })} />
              </div>
              <div className="servicos-form-field">
                <Label>Cor</Label>
                <Input value={carroForm.cor || ""} onChange={(e) => setCarroForm({ ...carroForm, cor: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenCarro(false);
                setCarroForm({});
              }}
            >
              Cancelar
            </Button>
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

      <Dialog
        open={openCliente}
        onOpenChange={(isOpen) => {
          setOpenCliente(isOpen);
          if (!isOpen) setClienteForm({ tipoPessoa: "PF" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="servicos-form">
            <div className="servicos-form-field">
              <Label>Tipo de Cliente *</Label>
              <Select
                value={clienteForm.tipoPessoa || "PF"}
                onValueChange={(v: "PF" | "PJ") => setClienteForm({ ...clienteForm, tipoPessoa: v, documento: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="servicos-form-field">
              <Label>Nome *</Label>
              <Input value={clienteForm.nome || ""} onChange={(e) => setClienteForm({ ...clienteForm, nome: e.target.value })} />
            </div>
            <div className="servicos-form-field">
              <Label>{clienteForm.tipoPessoa === "PJ" ? "CNPJ *" : "CPF *"}</Label>
              <Input
                value={clienteForm.documento || ""}
                onChange={(e) => setClienteForm({ ...clienteForm, documento: e.target.value })}
                placeholder={clienteForm.tipoPessoa === "PJ" ? "00.000.000/0000-00" : "000.000.000-00"}
              />
            </div>
            <div className="servicos-form-field">
              <Label>Email</Label>
              <Input value={clienteForm.email || ""} onChange={(e) => setClienteForm({ ...clienteForm, email: e.target.value })} />
            </div>
            <div className="servicos-form-field">
              <Label>Telefone</Label>
              <Input value={clienteForm.telefone || ""} onChange={(e) => setClienteForm({ ...clienteForm, telefone: e.target.value })} />
            </div>
            <div className="servicos-form-field">
              <Label>Endereço *</Label>
              <Input value={clienteForm.endereco || ""} onChange={(e) => setClienteForm({ ...clienteForm, endereco: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenCliente(false);
                setClienteForm({ tipoPessoa: "PF" });
              }}
            >
              Cancelar
            </Button>
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
    </>
  );
};
