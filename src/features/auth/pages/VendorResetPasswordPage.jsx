import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { PasswordRecoveryShell } from "@/features/auth/pages/PasswordRecoveryShell";

export default function VendorResetPasswordPage() {
  return (
    <PasswordRecoveryShell
      mode="reset-password"
      fixedRole="vendor"
      title="Set a new partner password"
      subtitle="Choose a new password for your vendor account and return to your partner workspace."
      heroEyebrow="Partner Recovery"
      heroTitle="Protect your"
      heroTitleAccent="partner login."
      heroBody="Create a strong new password and continue managing Sparkin installation work without delay."
      heroStatTitle="Trusted Access"
      heroStatBody="Secure vendor recovery built into the platform"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
