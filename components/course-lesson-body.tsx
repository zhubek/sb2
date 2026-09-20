import type { Lesson } from "@/lib/course-module1";
export default function LessonBody({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-8">
      {lesson.blocks.map((b, i) => {
        if (b.kind === "note")
          return (
            <p
              key={i}
              className="rounded-r-xl border-l-4 border-slate-300 bg-slate-50 px-5 py-4 text-[15px] leading-relaxed text-slate-600"
            >
              {b.text}
            </p>
          );
        if (b.kind === "key")
          return (
            <div key={i} className="border-t-2 border-slate-800 pt-4">
              <h4 className="font-mono text-xs font-medium tracking-widest text-slate-400 uppercase">
                {b.title}
              </h4>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed">
                {b.items?.map((it) => (
                  <li key={it.t}>{it.t}</li>
                ))}
              </ol>
            </div>
          );
        return (
          <div key={i}>
            <h4 className="border-b border-slate-200 pb-2 font-mono text-xs font-medium tracking-widest text-slate-400 uppercase">
              {b.title}
            </h4>
            <ul className="mt-3.5 space-y-3">
              {b.items?.map((it) => (
                <li key={it.t} className="text-[15px] leading-relaxed">
                  <span className="font-semibold">{it.t}</span>
                  {it.d && <span className="text-slate-600"> — {it.d}</span>}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
