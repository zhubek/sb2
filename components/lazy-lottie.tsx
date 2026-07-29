"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";

// Ленивая загрузка Lottie: плеер монтируется только при попадании в вьюпорт,
// иначе 100+ одновременных canvas-плееров положат вкладку.
export default function LazyLottie({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setVisible(true);
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible && (
        <DotLottieReact src={src} loop autoplay className="h-full w-full" />
      )}
    </div>
  );
}
