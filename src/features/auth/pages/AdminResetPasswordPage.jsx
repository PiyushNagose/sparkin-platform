import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function AdminResetPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="reset-password"
      fixedRole="admin"
      title="Set a new admin password"
      subtitle="Choose a new password for your admin account and return to platform control."
      heroEyebrow="Admin Recovery"
      heroTitle="Re-secure your"
      heroTitleAccent="admin console."
      heroBody="Reset your administrator password safely and return to monitoring the Sparkin network."
      heroStatTitle="Admin Security"
      heroStatBody="Fresh credentials for operational access"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
