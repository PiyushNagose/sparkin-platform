import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import AdminLoginPage from "@/features/auth/pages/AdminLoginPage";

export const authRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "admin-login", element: <AdminLoginPage /> },
  { path: "signup", element: <SignupPage /> },
];
