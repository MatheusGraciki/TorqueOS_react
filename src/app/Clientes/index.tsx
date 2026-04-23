import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, MapPin, Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import { useClientesPage } from "./hooks/useClientesPage";
import { toast } from "sonner";
import { useEffect } from "react";
import "./styles.scss";

export default function ClientesPage() {
  const {
    loading,
    error,
    open,
    setOpen,
    editId,
    form,
    setForm,
    filterNome,
    setFilterNome,
    filtered,
    openNew,
    openEdit,
    handleSave,
    handleDelete,
  } = useClientesPage();

  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar clientes", { description: error });
    }
  }, [error]);

  if (loading) {
    return (
      <div className="clientes-loading">
        <div className="clientes-loading-spinner"></div>
        <p className="clientes-loading-text">Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="clientes-page">
      <div className="clientes-header">
        <div>
          <h1 className="clientes-title">
            <Users className="clientes-title-icon" /> Clientes
          </h1>
          <p className="clientes-description">Gerencie os clientes da oficina</p>
        </div>
        <Button onClick={openNew} className="clientes-new-button gradient-primary text-primary-foreground">
          <Plus className="clientes-new-button-icon" /> Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="clientes-card-header">
          <CardTitle className="clientes-card-title">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="clientes-mobile-list">
            {filtered.length === 0 ? (
              <div className="clientes-empty-mobile">Nenhum cliente encontrado</div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="clientes-mobile-card">
                  <div className="clientes-mobile-client-header">
                    <Tooltip text={c.nome} position="top">
                      <p className="clientes-mobile-client-name" title={c.nome}>{c.nome}</p>
                    </Tooltip>
                    {c.documento ? (
                      <Tooltip text={c.documento} position="top">
                        <p className="clientes-mobile-client-document" title={c.documento}>{c.documento}</p>
                      </Tooltip>
                    ) : null}
                  </div>

                  <div className="clientes-mobile-meta">
                    <p className="clientes-mobile-meta-line">
                      <Mail className="clientes-mobile-meta-icon" />
                      <Tooltip text={c.email || "Sem email"} position="top">
                        <span className="clientes-mobile-meta-text" title={c.email || "Sem email"}>
                          {c.email || "Sem email"}
                        </span>
                      </Tooltip>
                    </p>
                    <p className="clientes-mobile-meta-line">
                      <Phone className="clientes-mobile-meta-icon" />
                      <Tooltip text={c.telefone || "Sem telefone"} position="top">
                        <span className="clientes-mobile-meta-text" title={c.telefone || "Sem telefone"}>
                          {c.telefone || "Sem telefone"}
                        </span>
                      </Tooltip>
                    </p>
                    <p className="clientes-mobile-meta-line">
                      <MapPin className="clientes-mobile-meta-icon" />
                      <Tooltip text={c.endereco || "Sem endereço"} position="top">
                        <span className="clientes-mobile-meta-text" title={c.endereco || "Sem endereço"}>
                          {c.endereco || "Sem endereço"}
                        </span>
                      </Tooltip>
                    </p>
                  </div>

                  <div className="clientes-mobile-actions">
                    <Button variant="outline" size="sm" className="clientes-mobile-action-btn" onClick={() => openEdit(c)}>
                      <Pencil className="clientes-mobile-action-icon" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="clientes-mobile-action-btn"
                      onClick={() => handleDelete(c.id, (msg) => toast.success(msg))}
                    >
                      <Trash2 className="clientes-mobile-action-icon" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="clientes-desktop-table-wrap">
            <Table className="clientes-desktop-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className="clientes-actions-head">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="clientes-empty-cell">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Tooltip text={c.nome} position="top">
                        <span className="clientes-table-ellipsis" title={c.nome}>{c.nome}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip text={c.email || "Sem email"} position="top">
                        <span className="clientes-table-ellipsis" title={c.email || "Sem email"}>{c.email || "Sem email"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip text={c.telefone || "Sem telefone"} position="top">
                        <span className="clientes-table-ellipsis" title={c.telefone || "Sem telefone"}>{c.telefone || "Sem telefone"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip text={c.endereco || "Sem endereço"} position="top">
                        <span className="clientes-table-ellipsis" title={c.endereco || "Sem endereço"}>{c.endereco || "Sem endereço"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="clientes-actions-row">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                          <Pencil className="clientes-action-icon" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(c.id, (msg) => toast.success(msg))}
                        >
                          <Trash2 className="clientes-action-icon clientes-action-icon-delete" />
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

      <Button onClick={openNew} size="icon" className="clientes-fab gradient-primary text-primary-foreground">
        <Plus className="clientes-fab-icon" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          </DialogHeader>
          <div className="clientes-form">
            <div className="clientes-form-field">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="clientes-form-field">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="clientes-form-field">
              <Label>Telefone</Label>
              <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <div className="clientes-form-field">
              <Label>Endereço</Label>
              <Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
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
