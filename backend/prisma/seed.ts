// Наполнение БД реальными данными прототипа:
// - тесты и вопросы из lib/mock-data.ts фронтенда
// - навигатор из lib/nav/*.json (938 заведений, ГОПы, специальности колледжей)
// - курс педагога из lib/course-module1.ts
// - достижения и бонусная система из lib/teacher-mock-data.ts
// Запуск: npm run seed (ts-node -T, импортирует фронтенд-модули напрямую)

import { readFileSync } from "fs";
import { join } from "path";
import {
  OrgLogGroup,
  PrismaClient,
  ProgramLevel,
  QuestionType,
  InstitutionType,
} from "@prisma/client";
import {
  checklist,
  debruceSections,
  hollandSections,
  mbtiSections,
  tests as testMeta,
} from "../../lib/mock-data";
import {
  module1Lessons,
  module1Meta,
  module1Quiz,
} from "../../lib/course-module1";
import {
  pointsRules,
  teacherBadges,
  trainingGuides,
} from "../../lib/teacher-mock-data";

const prisma = new PrismaClient();

const nav = (f: string) =>
  JSON.parse(readFileSync(join(__dirname, "../../lib/nav", f), "utf8"));

const LIKERT = [
  { value: 1, label: "Совсем не про меня" },
  { value: 2, label: "Скорее нет" },
  { value: 3, label: "Нейтрально" },
  { value: 4, label: "Скорее да" },
  { value: 5, label: "Точно про меня" },
];

async function clear() {
  // Порядок — от зависимых к базовым
  const tables = [
    prisma.userQuizAnswer,
    prisma.userQuizQuestion,
    prisma.userQuiz,
    prisma.userLesson,
    prisma.userModule,
    prisma.userCourse,
    prisma.quizAnswer,
    prisma.quizQuestion,
    prisma.quiz,
    prisma.lesson,
    prisma.courseModule,
    prisma.course,
    prisma.manual,
    prisma.userAnswer,
    prisma.userQuestion,
    prisma.userTest,
    prisma.answer,
    prisma.question,
    prisma.test,
    prisma.institutionProgram,
    prisma.program,
    prisma.institution,
    prisma.industry,
    prisma.message,
    prisma.chat,
    prisma.organizationLog,
    prisma.orgLogType,
    prisma.organizationOrgAchievement,
    prisma.orgAchievement,
    prisma.userStudentAchievement,
    prisma.studentAchievement,
    prisma.diploma,
    prisma.organizationAdmin,
    prisma.user,
    prisma.organization,
    prisma.city,
    prisma.region,
  ];
  for (const t of tables) await (t as { deleteMany: () => Promise<unknown> }).deleteMany();
}

async function seedProfile() {
  const region = await prisma.region.create({ data: { name: "г. Астана" } });
  const city = await prisma.city.create({
    data: { name: "Астана", regionId: region.id },
  });
  const org = await prisma.organization.create({
    data: { name: "НИШ ФМН Астана", cityId: city.id },
  });
  const student = await prisma.user.create({
    data: {
      name: "Айгерим",
      surname: "Сатпаева",
      email: "aigerim@example.kz",
      grade: "10",
      organizationId: org.id,
    },
  });
  const teacher = await prisma.user.create({
    data: {
      name: "Гульнара",
      surname: "Ахметова",
      email: "gulnara@school.kz",
      role: "TEACHER",
      organizationId: org.id,
    },
  });
  await prisma.organization.update({
    where: { id: org.id },
    data: { ownerUserId: teacher.id },
  });
  await prisma.organizationAdmin.create({
    data: { organizationId: org.id, userId: teacher.id },
  });
  console.log("profile: org + 2 users");
  return { org, student, teacher };
}

async function seedTests() {
  const sectionsBySlug: Record<string, typeof debruceSections> = {
    debruce: debruceSections,
    mbti: mbtiSections,
    holland: hollandSections,
  };
  for (const meta of testMeta) {
    const sections = sectionsBySlug[meta.id];
    const test = await prisma.test.create({
      data: {
        slug: meta.id,
        name: meta.name,
        description: meta.tagline,
        duration: Number(meta.duration.replace(/\D/g, "")) || 10,
        instructions: {
          method: meta.method,
          sections: sections.map(({ id, title, description, icon }) => ({
            id,
            title,
            description,
            icon,
          })),
        },
      },
    });
    let order = 0;
    for (const section of sections) {
      for (const text of section.questions) {
        const question = await prisma.question.create({
          data: {
            testId: test.id,
            questionType: QuestionType.LIKERT,
            order: order++,
            content: { text, sectionId: section.id, sectionTitle: section.title },
          },
        });
        await prisma.answer.createMany({
          data: LIKERT.map((option, i) => ({
            questionId: question.id,
            order: i,
            content: option,
          })),
        });
      }
    }
  }
  console.log("tests: 3 теста с вопросами и шкалой Ликерта");
}

interface NavInstitution {
  i: number;
  name: string;
  kind: "v" | "c" | "a";
  city?: string;
  obl?: string;
  price?: number;
  th?: number;
  dorm?: boolean;
  mil?: boolean;
  mob?: boolean;
}

interface NavOp {
  code: string;
  name: string;
  p?: number;
  t?: number;
  e?: string[];
  l?: string;
  g?: string;
  dur?: number;
}

async function seedNavigator() {
  const meta = nav("meta.json") as {
    industries: { name: string; short: string; desc: string }[];
  };
  const institutions = nav("institutions.json") as NavInstitution[];
  const details = nav("details.json") as Record<
    string,
    { about?: string; addr?: string; phone?: string; email?: string; site?: string; ig?: string; ops?: NavOp[] }
  >;
  const gops = nav("gops-compact.json") as {
    code: string;
    name: string;
    ind: number;
  }[];
  const collegePrograms = nav("college-programs.json") as {
    programs: { code: string; name: string; g: string; ind: number; cols: number[] }[];
    agg: Record<string, unknown>;
  };

  // Отрасли
  const industryIds: number[] = [];
  for (const ind of meta.industries) {
    const row = await prisma.industry.create({
      data: { name: ind.name, short: ind.short, description: ind.desc },
    });
    industryIds.push(row.id);
  }

  // Заведения
  const kindMap: Record<string, InstitutionType> = {
    v: InstitutionType.UNIVERSITY,
    c: InstitutionType.COLLEGE,
    a: InstitutionType.INTERNATIONAL,
  };
  await prisma.institution.createMany({
    data: institutions.map((inst) => {
      const d = details[String(inst.i)] ?? {};
      return {
        extId: inst.i,
        name: inst.name,
        type: kindMap[inst.kind],
        city: inst.city,
        region: inst.obl,
        price: inst.price,
        threshold: inst.th,
        dorm: !!inst.dorm,
        military: !!inst.mil,
        mobility: !!inst.mob,
        about: d.about,
        address: d.addr,
        phone: d.phone,
        email: d.email,
        site: d.site,
        instagram: d.ig,
      };
    }),
  });
  const instIdByExt = new Map(
    (await prisma.institution.findMany({ select: { id: true, extId: true } })).map(
      (r) => [r.extId, r.id]
    )
  );

  // Программы: ГОПы вузов + специальности колледжей
  await prisma.program.createMany({
    data: gops.map((g) => ({
      code: g.code,
      name: g.name,
      level: ProgramLevel.BACHELOR,
      industryId: industryIds[g.ind],
    })),
  });
  await prisma.program.createMany({
    data: collegePrograms.programs.map((p) => ({
      code: p.code,
      name: p.name,
      level: ProgramLevel.COLLEGE,
      industryId: industryIds[p.ind],
      description: (collegePrograms.agg[p.code] ?? undefined) as object | undefined,
    })),
    skipDuplicates: true,
  });
  const programIdByCode = new Map(
    (await prisma.program.findMany({ select: { id: true, code: true } })).map(
      (r) => [r.code, r.id]
    )
  );

  // Связи заведение ↔ программа
  const links: {
    institutionId: number;
    programId: number;
    opCode?: string;
    opName?: string;
    price?: number;
    seats?: number;
    languages?: string;
    duration?: number;
    exams?: object;
  }[] = [];
  for (const [ext, d] of Object.entries(details)) {
    const institutionId = instIdByExt.get(Number(ext));
    if (!institutionId || !d.ops) continue;
    for (const op of d.ops) {
      const programId = op.g ? programIdByCode.get(op.g) : undefined;
      if (!programId) continue;
      links.push({
        institutionId,
        programId,
        opCode: op.code,
        opName: op.name,
        price: op.p,
        seats: op.t,
        languages: op.l,
        duration: op.dur,
        exams: op.e ? { subjects: op.e } : undefined,
      });
    }
  }
  for (const p of collegePrograms.programs) {
    const programId = programIdByCode.get(p.code);
    if (!programId) continue;
    for (const col of p.cols) {
      const institutionId = instIdByExt.get(col);
      if (!institutionId) continue;
      links.push({ institutionId, programId });
    }
  }
  // Порциями — связей много
  for (let i = 0; i < links.length; i += 2000) {
    await prisma.institutionProgram.createMany({
      data: links.slice(i, i + 2000),
    });
  }
  console.log(
    `navigator: ${institutions.length} заведений, ${gops.length + collegePrograms.programs.length} программ, ${links.length} связей`
  );
}

async function seedCourse() {
  const course = await prisma.course.create({
    data: {
      title: module1Meta.title,
      content: { source: module1Meta.source },
    },
  });
  const mod = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: `${module1Meta.num} · ${module1Meta.title}`,
      order: 1,
      content: { passport: module1Meta.passport, source: module1Meta.source },
    },
  });
  for (let i = 0; i < module1Lessons.length; i++) {
    const lesson = module1Lessons[i];
    await prisma.lesson.create({
      data: {
        moduleId: mod.id,
        title: lesson.title,
        order: i,
        content: {
          num: lesson.num,
          short: lesson.short,
          source: lesson.source,
          blocks: lesson.blocks,
        },
      },
    });
  }
  const quiz = await prisma.quiz.create({
    data: {
      moduleId: mod.id,
      content: { threshold: 0.7, title: "Итоговая проверка модуля" },
    },
  });
  const typeMap: Record<string, QuestionType> = {
    single: QuestionType.SINGLE,
    multi: QuestionType.MULTIPLE,
    open: QuestionType.SINGLE, // открытый вопрос: без вариантов, ответ в pickedValue
  };
  for (let i = 0; i < module1Quiz.length; i++) {
    const { id, type, options, ...rest } = module1Quiz[i];
    const question = await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        type: typeMap[type] ?? QuestionType.SINGLE,
        order: i,
        content: { ...rest, open: type === "open" },
      },
    });
    if (options) {
      await prisma.quizAnswer.createMany({
        data: options.map((option, j) => ({
          quizQuestionId: question.id,
          order: j,
          content: option,
        })),
      });
    }
  }
  for (const guide of trainingGuides) {
    await prisma.manual.create({
      data: {
        title: guide.title,
        content: { icon: guide.icon, desc: guide.desc, length: guide.length },
      },
    });
  }
  console.log(
    `course: 1 курс, ${module1Lessons.length} уроков, квиз ${module1Quiz.length} вопросов, ${trainingGuides.length} руководств`
  );
}

async function seedAchievements(orgId: number, teacherId: number) {
  for (let i = 0; i < checklist.length; i++) {
    await prisma.studentAchievement.create({
      data: { name: checklist[i].label, order: i },
    });
  }
  for (const badge of teacherBadges) {
    await prisma.orgAchievement.create({
      data: {
        name: badge.name,
        content: { desc: badge.desc, icon: badge.icon },
      },
    });
  }
  const groupMap: Record<string, OrgLogGroup> = {
    students: OrgLogGroup.STUDENTS,
    coverage: OrgLogGroup.REACH,
  };
  const orderGroups = [
    OrgLogGroup.STUDENTS,
    OrgLogGroup.REACH,
    OrgLogGroup.REPORT,
    OrgLogGroup.LEARN,
    OrgLogGroup.CONSISTENCY,
  ];
  let logTypes = 0;
  for (let i = 0; i < pointsRules.length; i++) {
    const rule = pointsRules[i];
    const group = groupMap[rule.id] ?? orderGroups[i] ?? OrgLogGroup.CONSISTENCY;
    for (const item of rule.items) {
      await prisma.orgLogType.create({
        data: {
          name: item.action,
          point: Number(String(item.points).replace(/\D/g, "")) || 0,
          group,
        },
      });
      logTypes++;
    }
  }
  console.log(
    `achievements: ${checklist.length} ученических, ${teacherBadges.length} значков, ${logTypes} типов начислений`
  );
}

async function main() {
  await clear();
  const { org, teacher } = await seedProfile();
  await seedTests();
  await seedNavigator();
  await seedCourse();
  await seedAchievements(org.id, teacher.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
