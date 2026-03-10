import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppRoutes } from "@/app/routes";
import { Toaster } from "sonner";



const App = () => (
    <ThemeProvider>
      <TooltipProvider>
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
            <Route path="app/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
);

export default App;
