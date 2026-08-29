import { useEffect, useRef, useState } from "react";

// Animates a number counting up from 0 to `value` over `duration` ms.
// Used for stat-card polish on the dashboard overview.
export default function useCountUp(value, duration = 700) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    const target = Number(value) || 0;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return display;
}
