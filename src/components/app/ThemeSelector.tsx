import { useTheme, type ColorTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const THEME_LABELS: Record<ColorTheme, { label: string; color: string }> = {
  blueolympic: { label: "Blue Olympic", color: "#4caee5" },
  blueyale: { label: "Blue Yale", color: "#145388" },
  bluenavy: { label: "Blue Navy", color: "#00365a" },
  greenlime: { label: "Green Lime", color: "#6fb327" },
  greenmoss: { label: "Green Moss", color: "#576a3d" },
  greysteel: { label: "Grey Steel", color: "#48494b" },
  orangecarrot: { label: "Orange Carrot", color: "#ed7117" },
  purplemonster: { label: "Purple Monster", color: "#922c88" },
  redruby: { label: "Red Ruby", color: "#900604" },
  yellowgranola: { label: "Yellow Granola", color: "#c0a145" },
};

export function ThemeSelector() {
  const { colorTheme, mode, setColorTheme, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggleMode} title="Alternar modo">
        {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title="Selecionar tema">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Tema de Cores</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(THEME_LABELS).map(([key, { label, color }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setColorTheme(key as ColorTheme)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span
                className="h-3 w-3 rounded-full border border-border flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="flex-1">{label}</span>
              {colorTheme === key && <span className="text-xs">✓</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
