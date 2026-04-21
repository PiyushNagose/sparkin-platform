import { Typography } from "@mui/material";

function LoginPage() {
  return (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Welcome Back
      </Typography>
      <Typography color="text.secondary">
        Auth screen scaffold for the split-screen login experience from the references.
      </Typography>
    </>
  );
}

function SignupPage() {
  return (
    <>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Create an Account
      </Typography>
      <Typography color="text.secondary">
        Auth screen scaffold for the signup journey with user and vendor role entry points.
      </Typography>
    </>
  );
}

export const authRoutes = [
  { path: "login", element: <LoginPage /> },
  { path: "signup", element: <SignupPage /> },
];

