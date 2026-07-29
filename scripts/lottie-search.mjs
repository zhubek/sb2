// Поиск анимаций в публичном GraphQL API LottieFiles
// Использование: node scripts/lottie-search.mjs "ключевые слова" [количество]

const query = process.argv[2];
const first = Number(process.argv[3] ?? 10);
if (!query) {
  console.error('Usage: node scripts/lottie-search.mjs "keywords" [count]');
  process.exit(1);
}

const gql = `query($q: String!, $n: Int!) {
  searchPublicAnimations(query: $q, first: $n) {
    edges { node { id name jsonUrl lottieUrl url downloads likesCount } }
  }
}`;

const res = await fetch("https://graphql.lottiefiles.com/2022-08", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: gql, variables: { q: query, n: first } }),
});
const json = await res.json();
const nodes = (json.data?.searchPublicAnimations?.edges ?? []).map(
  (e) => e.node
);
nodes.sort((a, b) => b.likesCount - a.likesCount || b.downloads - a.downloads);

for (const n of nodes) {
  console.log(
    `♥${String(n.likesCount).padStart(4)} ⬇${String(n.downloads).padStart(5)}  ${n.name}\n      preview:  ${n.url}\n      download: ${n.lottieUrl}\n`
  );
}
