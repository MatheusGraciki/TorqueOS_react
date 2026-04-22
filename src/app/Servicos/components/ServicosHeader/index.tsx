import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import "./styles.scss";

type Props = {
  onNew: () => void;
};

export const ServicosHeader = ({ onNew }: Props) => {
  return (
    <div className="servicos-header">
      <div>
        <h1 className="servicos-title">
          <Wrench className="servicos-title-icon" /> Serviços
        </h1>
        <p className="servicos-description">Gerencie os serviços da oficina</p>
      </div>
      <Button onClick={onNew} className="servicos-new-button gradient-primary text-primary-foreground">
        <Plus className="servicos-new-button-icon" /> Novo Serviço
      </Button>
    </div>
  );
};
