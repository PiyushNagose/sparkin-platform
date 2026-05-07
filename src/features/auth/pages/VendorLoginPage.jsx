import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { AuthScreenShell } from "@/features/auth/pages/AuthScreenShell";

export default function VendorLoginPage() {
  return (
    <AuthScreenShell
      mode="login"
      fixedRole="vendor"
      title="Partner Login"
      subtitle="Access your Sparkin partner workspace and track your application status."
      heroEyebrow="Partner Network"
      heroTitle="Build the next"
      heroTitleAccent="solar market."
      heroBody="Sign in to manage onboarding, review leads, submit proposals, and grow your regional presence with Sparkin."
      heroStatTitle="500+ Partners"
      heroStatBody="Installers building trust across the network"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
