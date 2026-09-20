// Run explicitly after migrate deploy. Never run the destructive navigator seed here.
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: { module: "commonjs" },
});
const { PrismaClient } = require("../generated/prisma");
const {
  validateDocument,
} = require("../src/modules/content/domain/validation");
const {
  PublishEducationProgram,
} = require("../src/modules/navigator/publish-education-program.use-case");
const fs = require("node:fs"),
  path = require("node:path");
const prisma = new PrismaClient();
const project = path.resolve(__dirname, "../..");
const dir = path.resolve(
  process.env.CMS_DATA_DIR || path.join(project, ".data/cms"),
);
const defaults = JSON.parse(
  fs.readFileSync(
    path.join(project, ".data/bootstrap/content-registry.json"),
    "utf8",
  ),
);
const index = new Map(defaults.map((d) => [d.id, d]));
const projection = new PublishEducationProgram();
async function run() {
  for (let i = 0; i < defaults.length; i += 100) {
    await prisma.contentDocument.createMany({
      skipDuplicates: true,
      data: defaults
        .slice(i, i + 100)
        .map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          group: d.group,
          kind: d.kind,
          preview: d.preview,
          defaultValue: d.value,
          searchText: `${d.id} ${d.title} ${d.description} ${JSON.stringify(d.value)}`,
        })),
    });
  }
  await prisma.contentAdministrator.upsert({
    where: { id: "primary" },
    create: { id: "primary" },
    update: {},
  });
  if (!(await prisma.dataImport.findUnique({ where: { id: "cms-file-v1" } }))) {
    const file = path.join(dir, "content.json");
    const store = fs.existsSync(file)
      ? JSON.parse(fs.readFileSync(file, "utf8"))
      : { version: 1, entries: {}, history: [] };
    if (store.version !== 1 || !store.entries || !Array.isArray(store.history))
      throw new Error("Invalid legacy content store");
    for (const [id, e] of Object.entries(store.entries)) {
      const d = index.get(id);
      if (!d) throw new Error("Unknown document in legacy content: " + id);
      for (const value of [e.draft, e.published].filter(
        (v) => v !== undefined,
      )) {
        const errors = validateDocument(d, value);
        if (errors.length)
          throw new Error(
            "Invalid legacy document " + id + ": " + errors.join("; "),
          );
      }
    }
    await prisma.$transaction(
      async (tx) => {
        for (const [id, e] of Object.entries(store.entries)) {
          const d = index.get(id),
            value = e.draft ?? e.published ?? d.value;
          const updated = await tx.contentDocument.updateMany({
            where: { id, revision: 0 },
            data: {
              draft: e.draft,
              published: e.published,
              revision: e.revision,
              publishedRevision: e.published === undefined ? 0 : e.revision,
              updatedAt: e.updatedAt ? new Date(e.updatedAt) : undefined,
              publishedAt: e.publishedAt ? new Date(e.publishedAt) : undefined,
              dirty:
                JSON.stringify(e.draft ?? e.published) !==
                JSON.stringify(e.published ?? d.value),
              searchText: `${id} ${d.title} ${d.description} ${JSON.stringify(value)}`,
            },
          });
          if (updated.count !== 1)
            throw new Error("Database content already edited: " + id);
          if (e.published !== undefined)
            await projection.inTransaction(tx, id, e.published, e.revision);
          if (e.revision > 0)
            await tx.contentAudit.create({
              data: {
                documentId: id,
                actorId: "migration:cms-file-v1",
                action: "import",
                revision: e.revision,
                requestId: "cms-file-v1",
              },
            });
        }
        for (const h of store.history) {
          if (!index.has(h.documentId))
            throw new Error("Unknown history document");
          await tx.contentRevision.create({
            data: {
              id: h.id,
              documentId: h.documentId,
              title: h.title,
              action: h.action,
              at: new Date(h.at),
              value: h.value,
            },
          });
        }
        const attemptsDir = path.join(dir, "attempts");
        let attempts = 0;
        for (const name of fs.existsSync(attemptsDir)
          ? fs.readdirSync(attemptsDir)
          : []) {
          if (!/^[a-f0-9]{64}\.json$/.test(name)) continue;
          const rows = JSON.parse(
            fs.readFileSync(path.join(attemptsDir, name), "utf8"),
          );
          for (const a of rows) {
            await tx.contentTestAttempt.create({
              data: {
                id: a.id,
                ownerKey: name.slice(0, -5),
                slug: a.slug,
                name: a.name,
                at: new Date(a.at),
                values: a.values,
                snapshot: a.snapshot,
                summary: a.summary,
              },
            });
            attempts++;
          }
        }
        await tx.dataImport.create({
          data: {
            id: "cms-file-v1",
            recordCount: Object.keys(store.entries).length + attempts,
          },
        });
      },
      { timeout: 60000 },
    );
    console.log("Legacy CMS imported atomically; original files retained");
  }
  // Register missing program projections for fresh navigator databases only.
  const existing = new Set(
    (
      await prisma.institutionProgram.findMany({
        where: { contentKey: { not: null } },
        select: { contentKey: true },
      })
    ).map((p) => p.contentKey),
  );
  for (const d of defaults.filter(
    (d) => d.id.startsWith("program.") && !existing.has(d.id),
  )) {
    await prisma.$transaction((tx) =>
      projection.inTransaction(tx, d.id, d.value, 0),
    );
  }
  console.log(
    JSON.stringify({
      documents: await prisma.contentDocument.count(),
      attempts: await prisma.contentTestAttempt.count(),
      programs: await prisma.institutionProgram.count({
        where: { contentKey: { not: null } },
      }),
    }),
  );
}
run()
  .catch((e) => {
    console.error(e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
