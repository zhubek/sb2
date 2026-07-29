import AiAssistant from "@/components/ai-assistant";
import PlatformNav from "@/components/platform-nav";

export default function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <PlatformNav />
      <main className="mx-auto max-w-5xl px-6 py-8 pb-28">{children}</main>
      <AiAssistant />
    </div>
  );
}
