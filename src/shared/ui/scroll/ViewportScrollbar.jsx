import { useEffect, useRef, useState } from "react";

function getTarget(targetId) {
  return targetId ? document.getElementById(targetId) : null;
}

function getScrollMetrics(targetId) {
  const target = getTarget(targetId);
  const element = target || document.documentElement;
  const rect = target?.getBoundingClientRect();
  const scrollTop = target
    ? target.scrollTop
    : window.scrollY || element.scrollTop || 0;
  const scrollHeight = target
    ? target.scrollHeight
    : Math.max(element.scrollHeight, document.body.scrollHeight);
  const viewportHeight = target
    ? target.clientHeight
    : window.innerHeight || element.clientHeight;
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  const thumbHeight = maxScroll
    ? Math.max(44, (viewportHeight / scrollHeight) * viewportHeight)
    : 0;
  const thumbTop = maxScroll
    ? (scrollTop / maxScroll) * (viewportHeight - thumbHeight)
    : 0;

  return {
    hasScroll: maxScroll > 2,
    thumbHeight,
    thumbTop,
    top: rect?.top ?? 0,
    right: target ? Math.max(0, window.innerWidth - rect.right) : 0,
    height: rect?.height ?? window.innerHeight,
  };
}

export function ViewportScrollbar({ targetId }) {
  const timeoutRef = useRef(null);
  const frameRef = useRef(null);
  const observerRef = useRef(null);
  const [metrics, setMetrics] = useState({
    hasScroll: false,
    thumbHeight: 0,
    thumbTop: 0,
    top: 0,
    right: 0,
    height: 0,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    function update() {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        setMetrics(getScrollMetrics(targetId));
      });
    }

    function handleScroll() {
      update();
      setIsActive(true);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsActive(false), 900);
    }

    update();
    const target = getTarget(targetId);
    const scrollElement = target || window;

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", update);
    observerRef.current = new ResizeObserver(update);
    observerRef.current.observe(document.body);
    if (target) observerRef.current.observe(target);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", update);
      observerRef.current?.disconnect();
      window.clearTimeout(timeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetId]);

  if (!metrics.hasScroll) return null;

  return (
    <div
      className="viewport-scrollbar"
      aria-hidden="true"
      data-active={isActive ? "true" : "false"}
      style={{
        top: `${metrics.top}px`,
        right: `${metrics.right}px`,
        height: `${metrics.height}px`,
      }}
    >
      <div
        className="viewport-scrollbar__thumb"
        style={{
          height: `${metrics.thumbHeight}px`,
          transform: `translate3d(0, ${metrics.thumbTop}px, 0)`,
        }}
      />
    </div>
  );
}
