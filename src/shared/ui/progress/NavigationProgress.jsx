import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { Box } from "@mui/material";

/**
 * Thin top-bar progress indicator.
 * Shows on:
 *  - React Router navigation (lazy-route loading)
 *  - Any manual start/done calls via the exported hook
 */

let externalResolve = null;

export function NavigationProgress() {
  const navigation = useNavigation();
  const { pathname } = useLocation();

  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [fading, setFading] = useState(false);

  const timerRef = useRef(null);
  const widthRef = useRef(0);

  const isLoading = navigation.state === "loading";

  function startProgress() {
    clearTimeout(timerRef.current);
    widthRef.current = 0;
    setFading(false);
    setWidth(0);
    setVisible(true);

    // Quickly jump to 30%, then crawl to 85%
    requestAnimationFrame(() => {
      setWidth(30);
      timerRef.current = setTimeout(() => setWidth(60), 300);
      timerRef.current = setTimeout(() => setWidth(85), 800);
    });
  }

  function finishProgress() {
    clearTimeout(timerRef.current);
    setWidth(100);
    timerRef.current = setTimeout(() => {
      setFading(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setWidth(0);
        setFading(false);
      }, 380);
    }, 180);
  }

  // React Router navigation state
  useEffect(() => {
    if (isLoading) {
      startProgress();
    } else {
      finishProgress();
    }
  }, [isLoading]);

  // Also fire on direct pathname change (non-lazy navigations)
  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      if (!isLoading) {
        // Instant page — quick flash
        startProgress();
        setTimeout(() => finishProgress(), 120);
      }
    }
  }, [pathname]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: `${width}%`,
        height: 3,
        borderRadius: "0 2px 2px 0",
        background:
          "linear-gradient(90deg, #1A66E8 0%, #4F8FF7 60%, #A8C8FF 100%)",
        boxShadow:
          "0 0 12px rgba(14,86,200,0.55), 0 0 4px rgba(79,143,247,0.4)",
        opacity: fading ? 0 : 1,
        transition: fading
          ? "opacity 0.38s ease"
          : "width 0.4s cubic-bezier(0.1, 0.6, 0.4, 1)",
        pointerEvents: "none",
        // Shimmer glow dot at the tip
        "&::after": {
          content: '""',
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: "#4F8FF7",
          boxShadow: "0 0 8px 2px rgba(79,143,247,0.8)",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.38s ease",
        },
      }}
    />
  );
}
