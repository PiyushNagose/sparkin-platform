import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function ForgotPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="forgot-password"
      fixedRole="customer"
      title="Forgot password"
      subtitle="Enter your email and we will prepare a password reset link for your user account."
      heroEyebrow="Account Recovery"
      heroTitle="Recover your"
      heroTitleAccent="account access."
      heroBody="Get back into your Sparkin dashboard quickly and securely with a guided password reset."
      heroStatTitle="Secure Recovery"
      heroStatBody="Reset links are time-limited for safety"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
