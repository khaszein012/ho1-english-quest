import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuest } from "@/lib/quest/store";

/** Sun/moon switch between the deep-indigo default and the paper-white light palette. */
export function ThemeToggle() {
  const { state, setTheme } = useQuest();
  const light = state.theme === "light";
  const label = light ? "Switch to dark mode" : "Switch to light mode";
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => setTheme(light ? "dark" : "light")}
      aria-label={label}
      title={label}
    >
      {light ? <Moon /> : <Sun />}
    </Button>
  );
}
