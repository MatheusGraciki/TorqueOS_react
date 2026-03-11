import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppRoutes } from "@/app/routes";
import LoginPage from "@/app/LoginPage";
import { api } from "@/lib/api";
import { Toaster } from "sonner";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

function PrivateRoute() {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    api
      .get<{ usuario: { id: number } }>("auth/me")
      .then(() => {
        if (mounted) setStatus("authenticated");
      })
      .catch(() => {
        if (mounted) setStatus("unauthenticated");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return <div className="p-6">Carregando...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <AppRoutes />;
}

function LoginRoute() {
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    api
      .get<{ usuario: { id: number } }>("auth/me")
      .then(() => {
        if (mounted) setStatus("authenticated");
      })
      .catch(() => {
        if (mounted) setStatus("unauthenticated");
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return <div className="p-6">Carregando...</div>;
  }

  if (status === "authenticated") {
    return <Navigate to="/app" replace />;
  }

  return <LoginPage />;
}


const App = () => (
    <ThemeProvider>
      <Toaster
        position="top-right"
        duration={2000}
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "flex flex-row items-center",
            closeButton: "ml-auto",
          },
        }}
        visibleToasts={1}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app" replace />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/app/*" element={<PrivateRoute />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
);

export default App;
