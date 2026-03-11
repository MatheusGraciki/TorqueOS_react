import { ThemeSelector } from "./ThemeSelector";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1">
      </div>
      <ThemeSelector />
    </header>
  );
}
