import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "@/app/theme/theme";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { BookingDraftProvider } from "@/features/public/booking/BookingDraftProvider";
import { SocketProvider } from "@/shared/websocket/SocketProvider";

export function AppProviders({ children }) {
  return (
    <ThemeProvider theme={appTheme}>
      <AuthProvider>
        <SocketProvider>
          <BookingDraftProvider>{children}</BookingDraftProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
