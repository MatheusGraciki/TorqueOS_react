import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LockKeyhole, Mail, Wrench } from "lucide-react";
import "./LoginPage.scss";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await api.post("auth/login", { email, senha });
      navigate("/app", { replace: true });
    } catch {
      setErro("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__background" />

      <Card className="login-card">
        <CardHeader className="login-card__header">
          <div className="login-card__brand">
            <div className="login-card__brand-icon-wrap">
              <Wrench className="login-card__brand-icon" />
            </div>
            <span className="login-card__brand-name">Oficina</span>
          </div>
          <CardTitle className="login-card__title">Entrar</CardTitle>
          <CardDescription className="login-card__description">Acesse sua conta para continuar</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="login-form">
            <div className="login-form__field">
              <Label htmlFor="login-email">Email</Label>
              <div className="login-form__input-wrap">
                <Mail className="login-form__input-icon" />
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@empresa.com"
                  className="login-form__input"
                  required
                />
              </div>
            </div>

            <div className="login-form__field">
              <Label htmlFor="login-senha">Senha</Label>
              <div className="login-form__input-wrap">
                <LockKeyhole className="login-form__input-icon" />
                <Input
                  id="login-senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="••••••••"
                  className="login-form__input"
                  required
                />
              </div>
            </div>

            {erro ? <p className="login-form__error">{erro}</p> : null}

            <Button type="submit" disabled={loading} className="login-form__submit gradient-primary text-primary-foreground">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
