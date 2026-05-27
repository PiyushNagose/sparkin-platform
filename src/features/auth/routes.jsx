import { lazy } from "react";
import { LazyRoute } from "@/shared/ui/placeholder/LazyRoute";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = lazy(() => import("@/features/auth/pages/SignupPage"));
const AdminLoginPage = lazy(
  () => import("@/features/auth/pages/AdminLoginPage"),
);

export const authRoutes = [
  { path: "login", element: <LazyRoute component={LoginPage} /> },
  { path: "admin-login", element: <LazyRoute component={AdminLoginPage} /> },
  { path: "signup", element: <LazyRoute component={SignupPage} /> },
];
