import type { Metadata } from "next";
import { Golos_Text, Unbounded } from "next/font/google";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  variable: "--font-golos",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "AI профориентатор",
  description:
    "Цифровая платформа профориентации для казахстанских школьников: диагностика, AI-сопровождение и навигатор по университетам.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${golos.variable} ${unbounded.variable} min-h-screen bg-[#faf8f5] font-sans text-stone-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
