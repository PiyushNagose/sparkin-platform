import loginHeroPlaceholder from "@/shared/assets/images/auth/auth-login-hero-placeholder.png";
import { AuthScreenShell } from "@/features/auth/pages/AuthScreenShell";

export default function AdminLoginPage() {
  return (
    <AuthScreenShell
      mode="login"
      fixedRole="admin"
      title="Admin Login"
      subtitle="Access Sparkin operational control with your admin credentials."
      heroEyebrow="Operational Control"
      heroTitle="Manage the"
      heroTitleAccent="solar network."
      heroBody="Monitor leads, vendors, bidding, payments, and customer projects from one secure admin workspace."
      heroStatTitle="Admin Console"
      heroStatBody="Real-time platform operations"
      heroBackground={loginHeroPlaceholder}
    />
  );
}
