import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/app/theme/theme";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { BookingDraftProvider } from "@/features/public/booking/BookingDraftProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <AuthProvider>
        <BookingDraftProvider>{children}</BookingDraftProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
