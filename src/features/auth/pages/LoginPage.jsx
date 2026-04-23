import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { AuthScreenShell } from "@/features/auth/pages/AuthScreenShell";

export default function LoginPage() {
  return (
    <AuthScreenShell
      mode="login"
      title="Welcome Back"
      subtitle="Please enter your details to access your dashboard."
      heroEyebrow="Atmospheric Precision"
      heroTitle="Harnessing the"
      heroTitleAccent="Future of Energy."
      heroBody="Experience the next generation of solar management with Sparkin Solar's refined ecosystem."
      heroStatTitle="2.4 GW Managed"
      heroStatBody="Clean energy distributed globally"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
