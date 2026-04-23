import signupHeroPlaceholder from "@/shared/assets/images/auth/auth-signup-hero-placeholder.png";
import { AuthScreenShell } from "@/features/auth/pages/AuthScreenShell";

export default function SignupPage() {
  return (
    <AuthScreenShell
      mode="signup"
      title="Create an account"
      subtitle="Start your journey towards energy independence."
      heroEyebrow="Join the Transition"
      heroTitle="Join the solar"
      heroTitleAccent="revolution."
      heroBody="Harness the future of energy. Join thousands of homeowners and vendors powering a cleaner tomorrow with intelligent solar management."
      heroStatTitle="12.4 GW"
      heroStatBody="Clean energy generated today"
      heroBackground={signupHeroPlaceholder}
    />
  );
}
