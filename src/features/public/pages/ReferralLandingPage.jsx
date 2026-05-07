import { useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { referralsApi } from "@/features/customer/api/referralsApi";
import { saveReferralAttribution } from "@/features/customer/referrals/referralTracking";

export default function ReferralLandingPage() {
  const { referralCode } = useParams();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const channel = searchParams.get("channel") || "copy_link";

  useEffect(() => {
    saveReferralAttribution({
      referralCode,
      channel,
    });
    if (isAuthenticated && user?.role === "customer") {
      referralsApi.trackSignup({ referralCode, channel }).catch(() => {});
    }
  }, [channel, isAuthenticated, referralCode, user?.role]);

  return (
    <Navigate
      to={isAuthenticated && user?.role === "customer" ? "/booking" : "/auth/signup"}
      replace
      state={{ from: { pathname: "/booking" } }}
    />
  );
}
