import TeacherAiButton from "@/components/teacher-ai-button";
import TeacherNav from "@/components/teacher-nav";
import TeacherOnboarding from "@/components/teacher-onboarding";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <TeacherNav />
      <main className="min-w-0 flex-1 px-8 py-8 pb-24">{children}</main>
      <TeacherAiButton />
      <TeacherOnboarding />
    </div>
  );
}
