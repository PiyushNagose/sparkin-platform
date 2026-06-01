import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { App } from "@/app/App";
import { AppProviders } from "@/app/providers/AppProviders";
import "@/shared/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AppProviders>
    <CssBaseline />
    <App />
  </AppProviders>,
);
