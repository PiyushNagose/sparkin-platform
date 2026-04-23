import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";

export const authRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
];
