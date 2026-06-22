import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function ResetPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="reset-password"
      fixedRole="customer"
      title="Set a new password"
      subtitle="Choose a new password for your user account and sign back in securely."
      heroEyebrow="Account Recovery"
      heroTitle="Set your next"
      heroTitleAccent="secure login."
      heroBody="Create a fresh password and return to your Sparkin customer workspace with confidence."
      heroStatTitle="One Secure Step"
      heroStatBody="Reset completes in a single guided flow"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
