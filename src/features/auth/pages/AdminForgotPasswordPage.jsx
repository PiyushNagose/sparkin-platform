import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function AdminForgotPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="forgot-password"
      fixedRole="admin"
      title="Forgot admin password"
      subtitle="Enter your admin email and we will prepare a password reset link for your control account."
      heroEyebrow="Admin Recovery"
      heroTitle="Recover your"
      heroTitleAccent="admin access."
      heroBody="Restore access to Sparkin operations, vendor oversight, payments, and customer project controls."
      heroStatTitle="Control Restored"
      heroStatBody="Secure admin recovery for operational continuity"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
