import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";

/**
 * Wraps page content with a smooth fade + subtle slide-up on every route change.
 * Lightweight — no library needed, just CSS transitions.
 */
export function PageTransition({ children }) {
  const { pathname } = useLocation();
  const [phase, setPhase] = useState("visible"); // "hidden" | "visible"
  const firstMount = useRef(true);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    // On route change: snap to hidden, then animate in
    setPhase("hidden");
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("visible"));
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <Box
      sx={{
        opacity: phase === "visible" ? 1 : 0,
        transform: phase === "visible" ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.28s ease, transform 0.28s ease",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Box>
  );
}
