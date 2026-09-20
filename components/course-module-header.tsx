import type { module1Meta } from "@/lib/course-module1";
export default function CourseModuleHeader({meta}:{meta:typeof module1Meta}){return (<div className="mt-4 border-b-2 border-slate-800 pb-6">
        <p className="font-mono text-xs font-semibold tracking-widest text-teal-600 uppercase">
          {meta.num}
        </p>
        <h1 className="font-display mt-1.5 text-3xl font-semibold tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{meta.source}</p>
        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 sm:grid-cols-4">
          {meta.passport.map((p) => (
            <div
              key={p.k}
              className="border-slate-200 bg-white p-4 not-last:border-r max-sm:odd:border-r max-sm:[&:nth-child(-n+2)]:border-b"
            >
              <p className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                {p.k}
              </p>
              <p className="mt-1 text-sm font-semibold">{p.v}</p>
            </div>
          ))}
        </div>
      </div>);}
