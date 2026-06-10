import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { appRouter } from "@/app/router";
import { AppCrashBoundary } from "@/app/errors/AppCrashBoundary";
import { NavigationProgress } from "@/shared/ui/progress/NavigationProgress";

export function App() {
  return (
    <AppCrashBoundary>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </AppCrashBoundary>
  );
}
