import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";

const golos = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-golos",
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
        className={`${golos.variable} min-h-screen bg-[#fcfbfd] font-sans text-stone-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
