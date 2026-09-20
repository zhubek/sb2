// Integration checks use a newly created, disposable database, never application records.
const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const { randomUUID, createHmac } = require("node:crypto");
const fs = require("node:fs"),
  path = require("node:path");
const { PrismaClient } = require("../generated/prisma");
const base = new URL(process.env.DATABASE_URL);
if (!["127.0.0.1", "localhost"].includes(base.hostname) || base.port !== "5437")
  throw new Error("Run on the isolated remote development cluster (5437)");
const database = "sb2_framework_check_" + Date.now();
const admin = new PrismaClient();
const url = new URL(base);
url.pathname = "/" + database;
const env = {
  ...process.env,
  DATABASE_URL: url.toString(),
  PORT: "3031",
  HOST: "127.0.0.1",
  CMS_AUTH_SECRET: randomUUID() + randomUUID(),
  NODE_ENV: "test",
};
const db = new PrismaClient({ datasourceUrl: url.toString() });
let child,
  webChild,
  passed = 0;
const check = (condition, name) => {
  assert.ok(condition, name);
  console.log("PASS " + name);
  passed++;
};
const jwt = claims => {
  const header = Buffer.from(JSON.stringify({alg:"HS256",typ:"JWT"})).toString("base64url");
  const payload = Buffer.from(JSON.stringify({iss:"sb2-web",iat:Math.floor(Date.now()/1000),...claims})).toString("base64url");
  return header + "." + payload + "." + createHmac("sha256",env.CMS_AUTH_SECRET).update(header+"."+payload).digest("base64url");
};
const cookie = () => "sb-admin=" + jwt({sub:"primary",aud:"sb2-admin",exp:Math.floor(Date.now()/1000)+3600});
const identity = (userId, subject, expires = Date.now()+60000, extra={}) => "Bearer " + jwt({userId,subject,exp:Math.floor(expires/1000),aud:"sb2-api",...extra});
const headers = () => ({
  "Content-Type": "application/json",
  cookie: cookie(),
});
async function gql(query, variables = {}, auth = headers()) {
  const res = await fetch("http://127.0.0.1:3031/api/graphql", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}
const doc = (id) =>
  gql(
    "query($id:String!){contentDocument(id:$id){id value published revision history capabilities{canEdit canPublish canRestore}}}",
    { id },
  );
const edit = (id, value, revision, action = "save", historyId) =>
  gql("mutation($input:JSON!){editContent(input:$input)}", {
    input: { id, value, revision, action, historyId },
  });
const publicValues = () =>
  gql("{publishedContent}", {}, { "Content-Type": "application/json" });
async function run() {
  await admin.$executeRawUnsafe("CREATE DATABASE " + database);
  const migrate = spawnSync(
    process.execPath,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    { env, encoding: "utf8" },
  );
  if (migrate.status !== 0) throw new Error(migrate.stderr);
  const defaults = JSON.parse(
    fs.readFileSync(
      path.resolve("../.data/bootstrap/content-registry.json"),
      "utf8",
    ),
  );
  const ids = [
    "test.debruce",
    "test.mbti",
    "test.holland",
    "program.0.0",
    "course-module1.module1Quiz",
  ];
  const definitions = [
    ...new Map(
      defaults.filter((d) => ids.includes(d.id)).map((d) => [d.id, d]),
    ).values(),
  ];
  assert.equal(definitions.length, 5);
  await db.contentDocument.createMany({
    data: definitions.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      group: d.group,
      kind: d.kind,
      preview: d.preview,
      defaultValue: d.value,
      searchText: d.id + " " + d.title,
    })),
  });
  await db.contentAdministrator.create({ data: { id: "primary" } });
  await db.institution.create({
    data: {
      extId: 0,
      name: "Framework test institution",
      type: "UNIVERSITY",
      city: "Test",
    },
  });
  const u1 = await db.user.create({
      data: {
        email: "framework-one@example.test",
        name: "One",
        surname: "Test",
      },
    }),
    u2 = await db.user.create({
      data: {
        email: "framework-two@example.test",
        name: "Two",
        surname: "Test",
      },
    });
  const log = fs.openSync("/mnt/sb2dev/backups/framework-check.log", "w");
  child = spawn(process.execPath, ["dist/main.js"], {
    env,
    stdio: ["ignore", log, log],
  });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await publicValues()).data) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
    if (i === 79) throw new Error("Test API did not start");
  }
  let r = await gql(
    "{contentBackup}",
    {},
    { "Content-Type": "application/json" },
  );
  check(
    r.errors?.[0]?.extensions?.status === 401,
    "anonymous cannot read draft backup",
  );
  r = await gql(
    "{contentLibrary}",
    {},
    {
      "Content-Type": "application/json",
      cookie: "sb-admin=9999999999999.forged",
    },
  );
  check(
    r.errors?.[0]?.extensions?.status === 401,
    "forged administrator rejected",
  );
  r = await doc("test.extra");
  check(
    r.errors?.[0]?.extensions?.status === 404,
    "unknown test IDs unavailable",
  );
  r = await gql('{contentLibrary(filter:{group:"tests"})}');
  check(r.data.contentLibrary.total === 3, "only three predefined tests");
  r = await gql('{contentLibrary(filter:{category:"program"})}');
  check(
    r.data.contentLibrary.items[0].questions === undefined &&
      r.data.contentLibrary.items[0].sections === undefined,
    "catalog summaries omit test-only metadata",
  );
  let d = (await doc("test.debruce")).data.contentDocument;
  check(
    d.capabilities.canEdit && d.capabilities.canPublish,
    "server policy returns capabilities",
  );
  const original = structuredClone(d.value),
    changed = { ...d.value, name: "Edited test name" };
  r = await edit("test.debruce", changed, 0);
  check(
    r.data?.editContent.revision === 1,
    "draft saved with incremented revision",
  );
  check(
    !(await publicValues()).data.publishedContent["test.debruce"],
    "draft absent from public snapshot",
  );
  const before = await db.contentAudit.count();
  r = await edit("test.debruce", { ...changed, sections: [] }, 1);
  check(
    r.errors?.[0]?.extensions?.status === 422,
    "invalid questions rejected",
  );
  check(
    (await db.contentAudit.count()) === before &&
      (await db.contentDocument.findUnique({ where: { id: "test.debruce" } }))
        .revision === 1,
    "rejected edit leaves audit and content unchanged",
  );
  const race = await Promise.all([
    edit("test.debruce", { ...changed, name: "Concurrent A" }, 1),
    edit("test.debruce", { ...changed, name: "Concurrent B" }, 1),
  ]);
  check(
    race.filter((r) => r.data?.editContent).length === 1 &&
      race.filter((r) => r.errors?.[0]?.extensions?.status === 409).length ===
        1,
    "concurrent writes have one winner and one conflict",
  );
  d = (await doc("test.debruce")).data.contentDocument;
  const mixed = structuredClone(d.value);
  mixed.sections[0].questions = [
    { id: "likert", text: "Scale question", type: "likert" },
    {
      id: "single",
      text: "Single question",
      type: "single",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
    },
    {
      id: "multiple",
      text: "Multiple question",
      type: "multiple",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
    },
    { id: "text", text: "Text question", type: "text" },
  ];
  r = await edit(d.id, mixed, d.revision, "publish");
  check(!!r.data?.editContent, "all four question types publish");
  check(
    (await publicValues()).data.publishedContent[d.id].sections[0].questions[3]
      .type === "text",
    "published questions visible publicly",
  );
  const answers = mixed.sections
    .flatMap((s) => s.questions)
    .map((q) =>
      typeof q === "string" || q.type === "likert"
        ? 3
        : q.type === "single"
          ? "a"
          : q.type === "multiple"
            ? ["a", "b"]
            : "Written answer",
    );
  const attemptInput = {
    snapshot: mixed,
    values: answers,
    requestKey: randomUUID(),
  };
  const userHeaders = {
    "Content-Type": "application/json",
    authorization: identity(u1.id, "framework-one@example.test"),
  };
  r = await gql(
    "mutation($input:JSON!){saveContentTestAttempt(input:$input)}",
    { input: attemptInput },
    userHeaders,
  );
  const attemptId = r.data?.saveContentTestAttempt.id;
  check(!!attemptId, "mixed answer snapshot stored durably");
  const retry = await gql(
    "mutation($input:JSON!){saveContentTestAttempt(input:$input)}",
    { input: attemptInput },
    userHeaders,
  );
  check(
    retry.data?.saveContentTestAttempt.id === attemptId,
    "same request key does not duplicate attempt",
  );
  r = await gql(
    "{contentTestAttempts}",
    {},
    {
      "Content-Type": "application/json",
      authorization: identity(u2.id, "framework-two@example.test"),
    },
  );
  check(
    r.data.contentTestAttempts.length === 0,
    "another student cannot read attempts",
  );
  r = await gql("{contentBackup}", {}, userHeaders);
  check(
    r.errors?.[0]?.extensions?.status === 403,
    "student cannot read admin content",
  );
  r = await gql(
    "{contentTestAttempts}",
    {},
    {
      "Content-Type": "application/json",
      authorization: identity(u1.id, "framework-one@example.test", Date.now() - 1000),
    },
  );
  check(!!r.error, "expired identity rejected");
  const privateRes = await fetch("http://127.0.0.1:3031/api/users/" + u1.id, {
    headers: { authorization: identity(u2.id, "framework-two@example.test") },
  });
  check(
    privateRes.status === 403,
    "compatibility REST enforces user ownership",
  );
  const spoof = await fetch("http://127.0.0.1:3031/api/users", {
    headers: { "x-user-id": String(u1.id), "x-role": "ADMIN" },
  });
  check(spoof.status === 401, "demo headers cannot grant access");
  const legacyTest = await db.test.create({
    data: {
      slug: "debruce",
      name: "Legacy test",
      description: "Fixture",
      instructions: {},
      duration: 5,
    },
  });
  const q1 = await db.question.create({
    data: {
      testId: legacyTest.id,
      content: { text: "First" },
      questionType: "SINGLE",
      answers: { create: [{ content: { label: "A" } }] },
    },
    include: { answers: true },
  });
  const q2 = await db.question.create({
    data: {
      testId: legacyTest.id,
      content: { text: "Second" },
      questionType: "SINGLE",
      answers: { create: [{ content: { label: "B" } }] },
    },
    include: { answers: true },
  });
  const legacyAttempt = await db.userTest.create({
    data: { testId: legacyTest.id, userId: u1.id },
  });
  const invalidAnswer = await fetch(
    "http://127.0.0.1:3031/api/attempts/" + legacyAttempt.id + "/answers",
    {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({
        questionId: q1.id,
        answerIds: [q2.answers[0].id],
      }),
    },
  );
  check(
    invalidAnswer.status === 400 && (await db.userQuestion.count()) === 0,
    "foreign answer rejection leaves legacy attempt untouched",
  );
  const validResponse = await fetch(
    "http://127.0.0.1:3031/api/attempts/" + legacyAttempt.id + "/answers",
    {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({
        questionId: q1.id,
        answerIds: [q1.answers[0].id],
      }),
    },
  );
  check(
    validResponse.status === 201 && (await db.userAnswer.count()) === 1,
    "valid legacy answer commits atomically",
  );
  d = (await doc("test.debruce")).data.contentDocument;
  const history = d.history.find((h) => h.action === "publish");
  const publishedBefore = (await publicValues()).data.publishedContent[d.id];
  r = await edit(d.id, null, d.revision, "restore", history.id);
  check(!!r.data?.editContent, "restore creates a new draft");
  check(
    JSON.stringify((await publicValues()).data.publishedContent[d.id]) ===
      JSON.stringify(publishedBefore),
    "restore preserves published value",
  );
  const p = (await doc("program.0.0")).data.contentDocument;
  r = await edit(
    p.id,
    { ...p.value, name: "New education program", price: 0, threshold: 91 },
    p.revision,
    "publish",
  );
  const program = await db.institutionProgram.findUnique({
    where: { contentKey: p.id },
  });
  check(
    !!r.data?.editContent &&
      program?.opName === "New education program" &&
      program.price === 0 &&
      program.threshold === 91,
    "program publication commits navigator projection",
  );
  const counts = [
    await db.contentAudit.count(),
    await db.contentRevision.count(),
  ];
  await db.institutionProgram.deleteMany();
  await db.institution.deleteMany();
  r = await edit(p.id, { ...p.value, name: "Must roll back" }, 1, "publish");
  check(
    r.errors?.[0]?.extensions?.status === 404,
    "missing institution prevents program publication",
  );
  check(
    (await db.contentDocument.findUnique({ where: { id: p.id } })).revision ===
      1 &&
      (await db.contentAudit.count()) === counts[0] &&
      (await db.contentRevision.count()) === counts[1],
    "projection failure rolls back content history and audit",
  );
  const backupBefore = (await doc("test.mbti")).data.contentDocument;
  r = await gql(
    "mutation($backup:JSON!){importContentBackup(backup:$backup)}",
    {
      backup: {
        version: 1,
        entries: {
          "test.mbti": {
            draft: { ...backupBefore.value, name: "Should roll back" },
          },
          "zz.invalid": { draft: {} },
        },
      },
    },
  );
  check(
    !!r.errors && (await doc("test.mbti")).data.contentDocument.revision === 0,
    "backup import is all-or-nothing",
  );
  await db.contentAdministrator.update({
    where: { id: "primary" },
    data: { enabled: false },
  });
  r = await doc("test.debruce");
  check(
    r.errors?.[0]?.extensions?.status === 401,
    "disabled administrator loses access with existing cookie",
  );
  r = await gql("{a:publishedContent b:publishedContent c:publishedContent}");
  check(!!r.errors, "query cost limit rejects repeated expensive roots");
  // Exercise the production Next build against this same isolated fixture database.
  const webBase = "http://localhost:3026";
  const webEnv = {
    ...env,
    AUTH_SECRET: env.CMS_AUTH_SECRET,
    API_URL: "http://127.0.0.1:3031/api",
    AUTH_URL: webBase,
    NEXTAUTH_URL: webBase,
    NODE_ENV: "production",
    NEXT_DIST_DIR: ".next-build",
    NEXT_TELEMETRY_DISABLED: "1",
  };
  const webLog = fs.openSync(
    "/mnt/sb2dev/backups/framework-web-check.log",
    "w",
  );
  webChild = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "localhost",
      "--port",
      "3026",
    ],
    { cwd: path.resolve(".."), env: webEnv, stdio: ["ignore", webLog, webLog] },
  );
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(webBase + "/auth")).status === 200) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
    if (i === 79) throw new Error("Production web fixture did not start");
  }
  const { encode } = await import(
    require("node:url").pathToFileURL(
      path.resolve("../node_modules/next-auth/jwt.js"),
    ).href
  );
  await db.user.update({ where: { id: u2.id }, data: { role: "TEACHER", credential: { create: { passwordHash: await require("../dist/modules/auth/password").hashPassword("Fixture-teacher-928!") } } } });
  const studentSession = await encode({
    secret: env.CMS_AUTH_SECRET,
    salt: "authjs.session-token",
    token: {
      id: "framework-one@example.test",
      sub: "framework-one@example.test",
      email: u1.email,
      role: "student",
      backendId: u1.id,
    },
  });
  const teacherSession = await encode({
    secret: env.CMS_AUTH_SECRET,
    salt: "authjs.session-token",
    token: {
      id: "framework-two@example.test",
      sub: "framework-two@example.test",
      email: u2.email,
      role: "teacher",
      credentialVersion: 1,
      backendId: u2.id,
    },
  });
  for (const route of [
    "/tests",
    "/tests/debruce",
    "/tests/attempts/" + attemptId,
    "/universities/0",
    "/universities/program/program.0.0",
    "/teacher",
    "/teacher/course/module1",
    "/teacher/handbook/0",
  ]) {
    const res = await fetch(webBase + route, {
      redirect: "manual",
      headers: {
        cookie:
          "authjs.session-token=" +
          (route.startsWith("/teacher") ? teacherSession : studentSession),
      },
    });
    const html = await res.text();
    if (res.status !== 200) {
      console.log({ route, status: res.status, location: res.headers.get("location") });
    }
    check(
      res.status === 200 &&
        !html.includes("Application error:") &&
        !html.includes(":E{"),
      "production SSR renders " + route.replace(attemptId, "saved-attempt"),
    );
    if (route === "/tests") {
      check(html.includes("Legacy test"), "legacy test history survives the authenticated API migration");
    }
  }
  await db.contentAdministrator.update({
    where: { id: "primary" },
    data: { enabled: true },
  });
  const preview = await fetch(webBase + "/api/admin/preview", {
    method: "POST",
    headers: { ...headers(), origin: webBase },
    body: JSON.stringify({
      id: "institution.0",
      value: defaults.find((d) => d.id === "institution.0").value,
    }),
  });
  check(
    preview.status === 200 && (await preview.json()).type === "institution",
    "navigator draft preview runs in request-scoped content context",
  );
  const adminDocument = await fetch(
    webBase + "/api/admin/content/test.debruce",
    { headers: headers() },
  );
  check(
    adminDocument.status === 200 &&
      (await adminDocument.json()).capabilities.canEdit,
    "production BFF delegates content query",
  );
  for (const provider of ["otp", "teacher"]) {
    const csrf = await fetch(webBase + "/api/auth/csrf");
    const token = (await csrf.json()).csrfToken;
    const authCookies = csrf.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    const login = await fetch(webBase + "/api/auth/callback/" + provider, {
      method: "POST",
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
        cookie: authCookies,
        origin: webBase,
      },
      body: new URLSearchParams({
        csrfToken: token,
        email: "production-shortcut@example.test",
        code: "000000",
        password: "arbitrary-demo-password",
        callbackUrl: webBase,
      }),
    });
    const result = await login.text();
    check(
      result.includes("CredentialsSignin") &&
        !login.headers
          .getSetCookie()
          .some((c) => c.startsWith("authjs.session-token=")),
      "production rejects " + provider + " demo credentials",
    );
  }
  await require("./check-authorization.cjs")({ db, gql, check, identity, jwt, u1, u2, webBase });
  await require("./check-localization.cjs")({ db, gql, check, headers, webBase, defaults, identity, u1 });
  await require("./check-page-previews.cjs")({db,check,headers,webBase,defaults});
  if(process.env.CHECK_LANGUAGE_UI==='1')await require('../../scripts/check-language-flow.cjs')({db,defaults,headers,webBase,check,studentSession,teacherSession});
  console.log("Framework integration checks passed: " + passed);
}
run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (webChild) {
      webChild.kill("SIGTERM");
      await new Promise((resolve) => webChild.once("exit", resolve));
    }
    if (child) {
      child.kill("SIGTERM");
      await new Promise((resolve) => child.once("exit", resolve));
    }
    await db.$disconnect();
    await admin.$executeRawUnsafe(
      "DROP DATABASE IF EXISTS " + database + " WITH (FORCE)",
    );
    await admin.$disconnect();
  });
