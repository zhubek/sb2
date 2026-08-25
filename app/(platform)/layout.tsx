import AiAssistant from "@/components/ai-assistant";
import PlatformNav from "@/components/platform-nav";

export default function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-white">
      <PlatformNav />
      <main className="mx-auto max-w-5xl px-4 py-6 pb-32 sm:px-6 sm:py-8 md:pb-28">{children}</main>
      <AiAssistant />
    </div>
  );
}
