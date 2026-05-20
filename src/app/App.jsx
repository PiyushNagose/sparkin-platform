import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { appRouter } from "@/app/router";

export function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
    </>
  );
}

