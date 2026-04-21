import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/app/theme/theme";

export function AppProviders({ children }) {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
}

