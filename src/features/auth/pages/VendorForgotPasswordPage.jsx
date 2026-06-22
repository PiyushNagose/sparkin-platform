import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function VendorForgotPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="forgot-password"
      fixedRole="vendor"
      title="Forgot partner password"
      subtitle="Enter your vendor email and we will prepare a password reset link for your partner account."
      heroEyebrow="Partner Recovery"
      heroTitle="Recover your"
      heroTitleAccent="partner access."
      heroBody="Reset your vendor password and get back to leads, quotes, onboarding, and project operations."
      heroStatTitle="Partner Access"
      heroStatBody="Fast recovery for active vendor workspaces"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
