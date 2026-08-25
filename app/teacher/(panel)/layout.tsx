import TeacherAiButton from "@/components/teacher-ai-button";
import TeacherNav from "@/components/teacher-nav";
import TeacherOnboarding from "@/components/teacher-onboarding";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <TeacherNav />
      <main className="min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      <TeacherAiButton />
      <TeacherOnboarding />
    </div>
  );
}
