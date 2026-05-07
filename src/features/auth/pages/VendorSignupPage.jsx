import signupHeroPlaceholder from "@/shared/assets/images/auth/auth-signup-hero-placeholder.png";
import { AuthScreenShell } from "@/features/auth/pages/AuthScreenShell";

export default function VendorSignupPage() {
  return (
    <AuthScreenShell
      mode="signup"
      fixedRole="vendor"
      title="Become a partner"
      subtitle="Create your vendor account to start the Sparkin partner application."
      heroEyebrow="Partner Network"
      heroTitle="Join the trusted"
      heroTitleAccent="installer network."
      heroBody="Apply as a Sparkin partner, complete your professional onboarding, and unlock qualified residential and commercial solar demand."
      heroStatTitle="48 Hours"
      heroStatBody="Typical review window after full application submission"
      heroBackground={signupHeroPlaceholder}
    />
  );
}
