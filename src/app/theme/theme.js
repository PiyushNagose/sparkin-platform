import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { colors, radius, shadows } from "@/app/theme/tokens";

let appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.brand.blue,
      dark: colors.brand.blueDark,
      contrastText: colors.brand.white,
    },
    secondary: {
      main: colors.brand.green,
      dark: colors.brand.greenDark,
      contrastText: colors.brand.white,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    background: {
      default: "#F2F7F4",
      paper: colors.brand.white,
    },
    text: {
      primary: colors.brand.ink,
      secondary: "#5D677A",
    },
    divider: colors.brand.line,
  },
  shape: {
    borderRadius: radius.md,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h1: {
      fontSize: "3.5rem",
      lineHeight: 1.05,
      fontWeight: 800,
    },
    h2: {
      fontSize: "2.75rem",
      lineHeight: 1.1,
      fontWeight: 800,
    },
    h3: {
      fontSize: "2rem",
      lineHeight: 1.15,
      fontWeight: 700,
    },
    h4: {
      fontSize: "1.5rem",
      lineHeight: 1.2,
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: radius.md,
          boxShadow: "none",
          paddingInline: 20,
        },
        containedPrimary: {
          boxShadow: shadows.strong,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          boxShadow: shadows.card,
          border: `1px solid ${colors.brand.line}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: radius.lg,
        },
      },
    },
  },
});

appTheme = responsiveFontSizes(appTheme);

export { appTheme };
