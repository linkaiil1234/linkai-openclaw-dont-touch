import { useTheme } from "next-themes";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";

export const SwitchTheme = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeToggleButton
      variant="circle-blur"
      className="cursor-pointer"
      start="top-right"
      theme={theme as "dark" | "light"}
      onClick={handleThemeToggle}
    />
  );
};
