"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Обёртка для использования Lottie в серверных компонентах
export default function Lottie({
  src,
  className,
  loop = true,
}: {
  src: string;
  className?: string;
  loop?: boolean;
}) {
  return <DotLottieReact src={src} loop={loop} autoplay className={className} />;
}
