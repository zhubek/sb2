import { notFound } from "next/navigation";
import GopView, { type GopUni } from "@/components/navigator/gop-view";
import { getGop, getInstitution } from "@/lib/nav/server";

export default async function GopPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const g = getGop(code);
  if (!g) notFound();

  const unis: GopUni[] = Object.entries(g.univ)
    .map(([ui, u]) => {
      const d = getInstitution(Number(ui));
      if (!d) return null;
      const ps = u.ops.map((o) => o.p).filter((x): x is number => x != null);
      const gs = u.ops.map((o) => o.g).filter((x): x is number => x != null);
      return { d, k: u.k, p: ps.length ? Math.min(...ps) : null, g: gs.length ? Math.min(...gs) : null };
    })
    .filter((x): x is GopUni => x !== null)
    .sort((a, b) => b.k - a.k);

  const { univ: _univ, ...info } = g;
  void _univ;
  return <GopView g={info} unis={unis} />;
}
