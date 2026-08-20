"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/compass-marks";
import ProfessionCarousel from "@/components/profession-carousel";

// Лендинг по контент-мокапу v9 (ref/…/welcome-landing-mockup.html):
// тексты, структура секций, телефонные мокапы и переключатель ҚАЗ/РУС — из
// мокапа; визуальный язык — дизайн-система платформы (индиго + коралл,
// пастельные подложки-50, Golos, скругления 16/24/36).

type Lang = "ru" | "kk";
type Str = { ru: string; kk: string };

/* ─────────────────────────── Контент (РУС/ҚАЗ) ─────────────────────────── */

const nav = [
  { href: "#how", label: { ru: "С чего начать", kk: "Неден бастау" } },
  { href: "#what", label: { ru: "Что тут есть", kk: "Платформада не бар" } },
  { href: "#privacy", label: { ru: "Твои результаты", kk: "Сенің нәтижелерің" } },
  { href: "#codes", label: { ru: "Справочники", kk: "Анықтамалықтар" } },
];

const hero = {
  eyebrow: {
    ru: "Профориентация для школьников Казахстана",
    kk: "Қазақстан мектеп оқушыларына арналған кәсіби бағдар",
  },
  h1: {
    ru: "15 минут — и ты знаешь свои сильные стороны",
    kk: "15 минут — және өз күшті жақтарыңды білесің",
  },
  lede: {
    ru: "Узнай, в чём ты силён, какие профессии тебе подойдут и куда с этим поступать. Результат — сразу после теста «Мои навыки».",
    kk: "Неде күшті екеніңді, қандай мамандықтар саған сәйкес келетінін және осымен қайда түсуге болатынын біл. Нәтиже «Менің дағдыларым» тестінен кейін бірден шығады.",
  },
  cta: { ru: "Начать диагностику", kk: "Диагностиканы бастау" },
  micro: {
    ru: "Всё бесплатно — школа уже оплатила. На регистрацию уйдёт меньше минуты.",
    kk: "Бәрі тегін — мектеп төлеп қойған. Тіркелуге бір минуттан аз уақыт кетеді.",
  },
  meta: [
    {
      b: { ru: "Проверенные методики", kk: "Тексерілген әдістемелер" },
      s: { ru: "а не набор случайных вопросов", kk: "кездейсоқ сұрақтар жиынтығы емес" },
    },
    {
      b: { ru: "Сколько угодно раз", kk: "Қалағаныңша" },
      s: { ru: "передумал — проходи заново хоть завтра", kk: "ойың өзгерсе — ертең-ақ қайта өт" },
    },
    {
      b: { ru: "Без оценок", kk: "Бағасыз" },
      s: { ru: "на успеваемость не влияет", kk: "үлгерімге әсер етпейді" },
    },
  ],
};

const skills = [
  { name: { ru: "Креативность", kk: "Креативтілік" }, v: 92 },
  { name: { ru: "Коммуникация", kk: "Коммуникация" }, v: 88 },
  { name: { ru: "Эмпатия", kk: "Эмпатия" }, v: 85 },
];

const how = {
  eyebrow: { ru: "С чего начать", kk: "Неден бастау" },
  h2: { ru: "Один тест — и у тебя уже есть результат", kk: "Бір тест — және нәтиже дайын" },
  p: {
    ru: "Каждый следующий тест добавляет к твоему портрету что-то новое. А подбор программ открывается сразу.",
    kk: "Әр келесі тест портретіңе жаңа нәрсе қосады. Ал бағдарламаларды таңдау бірден ашылады.",
  },
  pills: [
    { ru: "С этого начинают", kk: "Осыдан бастайды" },
    { ru: "15 минут", kk: "15 минут" },
  ],
  mainTitle: { ru: "Мои навыки", kk: "Менің дағдыларым" },
  mainMeth: { ru: "методика DeBruce", kk: "DeBruce әдістемесі" },
  mainDesc: {
    ru: "Тест показывает три твоих главных навыка и выстраивает остальные по рейтингу — от самых сильных до тех, что стоит подтянуть. По этому списку система подбирает тебе отрасли, программы и учебные заведения.",
    kk: "Тест сенің үш басты дағдыңды көрсетеді және қалғандарын рейтингке орналастырады — күштілерінен бастап, дамыту керектеріне дейін. Осы тізім бойынша жүйе саған сәйкес салаларды, бағдарламаларды және оқу орындарын таңдайды.",
  },
  unlocks: [
    { ru: "Три твоих главных навыка", kk: "Үш басты дағдың" },
    { ru: "Остальные навыки по рейтингу", kk: "Қалған дағдылар рейтинг бойынша" },
    { ru: "Отрасли и программы, которые подходят", kk: "Саған сәйкес салалар мен бағдарламалар" },
    { ru: "AI-помощник", kk: "AI-көмекші" },
  ],
  optLabel: { ru: "Добавят к портрету", kk: "Портретіңе қосады" },
  opts: [
    {
      title: { ru: "Мой тип личности", kk: "Менің тұлға типім" },
      meth: { ru: "методика MBTI", kk: "MBTI әдістемесі" },
      time: { ru: "8 минут", kk: "8 минут" },
      desc: {
        ru: "Покажет, как ты принимаешь решения, как отдыхаешь и какая роль тебе ближе в командной работе.",
        kk: "Шешімді қалай қабылдайтыныңды, қалай демалатыныңды және командада қай рөл саған жақын екенін көрсетеді.",
      },
    },
    {
      title: { ru: "Мои интересы", kk: "Менің қызығушылықтарым" },
      meth: { ru: "методика Голланда", kk: "Голланд әдістемесі" },
      time: { ru: "8 минут", kk: "8 минут" },
      desc: {
        ru: "Покажет, чем тебе интересно заниматься на самом деле, в какой обстановке тебе комфортно работать — и какие профессии тебе подойдут.",
        kk: "Саған шын мәнінде немен айналысу қызық екенін, қандай ортада жұмыс істеу ыңғайлы екенін және қандай мамандықтар саған сәйкес келетінін көрсетеді.",
      },
    },
  ],
  bonusTitle: {
    ru: "Комплексный отчёт по всем трём тестам",
    kk: "Үш тест бойынша кешенді есеп",
  },
  bonusDesc: {
    ru: "Искусственный интеллект соберёт навыки, тип личности и интересы в один портрет: что у тебя получается, что тебе нравится и куда с этим можно пойти. Такой отчёт удобно обсуждать с профориентатором и дома.",
    kk: "Жасанды интеллект дағдыларыңды, тұлға типіңді және қызығушылықтарыңды бір портретке жинайды: не жақсы шығады, не ұнайды және осымен қайда баруға болады. Мұндай есепті кәсіби бағдар беру педагогымен және үйде талқылау ыңғайлы.",
  },
};

const what = {
  eyebrow: { ru: "Что тут есть", kk: "Платформада не бар" },
  h2: { ru: "От теста до конкретной программы", kk: "Тесттен нақты бағдарламаға дейін" },
};

const panes = [
  {
    q: { ru: "Какой я", kk: "Мен кіммін" },
    title: { ru: "Твой профиль", kk: "Сенің профилің" },
    desc: {
      ru: "Навыки, интересы и тип личности собираются в одном месте. После каждого теста профиль становится подробнее.",
      kk: "Дағдылар, қызығушылықтар және тұлға типі бір жерде жиналады. Әр тесттен кейін профиль толыға түседі.",
    },
    list: [
      { ru: "Что означает каждый твой навык", kk: "Әр дағдының нені білдіретіні" },
      { ru: "В чём ты силён в учёбе и в команде", kk: "Оқуда және командада неде күштісің" },
      { ru: "Сравнение с прошлыми результатами", kk: "Бұрынғы нәтижелермен салыстыру" },
      { ru: "Понятный текст без сложных слов", kk: "Қиын сөзсіз, түсінікті мәтін" },
    ],
  },
  {
    q: { ru: "Что мне подходит", kk: "Маған не сәйкес келеді" },
    title: { ru: "Рекомендации и AI-помощник", kk: "Ұсыныстар және AI-көмекші" },
    desc: {
      ru: "Платформа подбирает отрасли, профессии и программы под твой профиль, а помощник объясняет, почему именно эти.",
      kk: "Платформа профиліңе қарай салаларды, мамандықтарды және бағдарламаларды таңдайды, ал көмекші неге дәл осылар екенін түсіндіреді.",
    },
    list: [
      { ru: "Почему подходит именно это", kk: "Неге дәл осы саған сәйкес" },
      { ru: "Чем занимаются в этой профессии", kk: "Бұл мамандықта немен айналысады" },
      { ru: "Подбор по твоему вопросу", kk: "Сұрағың бойынша таңдау" },
      { ru: "Отвечает в любом разделе", kk: "Кез келген бөлімде жауап береді" },
    ],
  },
  {
    q: { ru: "Куда поступать", kk: "Қайда түсу керек" },
    title: { ru: "Навигатор", kk: "Навигатор" },
    desc: {
      ru: "Все вузы и колледжи Казахстана, а ещё зарубежные университеты. Фильтры сразу настроены под твои результаты — но их можно менять и смотреть всё подряд.",
      kk: "Қазақстанның барлық ЖОО мен колледждері, оның үстіне шетелдік университеттер. Сүзгілер бірден нәтижелеріңе қарай бапталады, бірақ оларды өзгертіп, бәрін еркін қарауға болады.",
    },
    list: [
      { ru: "Какие предметы ЕНТ нужно сдавать", kk: "Қандай ҰБТ пәндерін тапсыру керек" },
      { ru: "Стоимость обучения и города", kk: "Оқу құны және қалалар" },
      { ru: "Общежития и военные кафедры", kk: "Жатақханалар, әскери кафедралар" },
      { ru: "Программы академической мобильности", kk: "Академиялық ұтқырлық бағдарламалары" },
      { ru: "Зарубежные вузы — отдельным разделом", kk: "Шетелдік университеттер — бөлек бөлімде" },
    ],
  },
  {
    q: { ru: "Что у меня уже есть", kk: "Менде не бар" },
    title: { ru: "Портфолио", kk: "Портфолио" },
    desc: {
      ru: "Загружай грамоты, дипломы и сертификаты — всё, чего ты уже добился, хранится в одном месте.",
      kk: "Грамоталарыңды, дипломдарыңды және сертификаттарыңды жүкте — жеткен жетістіктерің бір жерде сақталады.",
    },
    list: [
      { ru: "Олимпиады, конкурсы, соревнования", kk: "Олимпиадалар, конкурстар, жарыстар" },
      { ru: "Курсы и сертификаты", kk: "Курстар мен сертификаттар" },
      { ru: "Проекты и волонтёрство", kk: "Жобалар мен волонтерлік" },
      { ru: "Всё под рукой, когда понадобится", kk: "Керек кезде бәрі қолыңның астында" },
    ],
  },
];

const paneScreens = {
  profile: {
    tag: { ru: "Профиль", kk: "Профиль" },
    h: { ru: "Твой профиль", kk: "Сенің профилің" },
    sub: { ru: "обновлён после трёх тестов", kk: "үш тесттен кейін жаңартылды" },
    p1: { ru: "Тип личности", kk: "Тұлға типі" },
    p1chips: [{ ru: "Идейный вдохновитель", kk: "Идеяларды жеткізуші" }],
    p2: { ru: "Интересы", kk: "Қызығушылықтар" },
    p2chips: [
      { ru: "Творческие", kk: "Шығармашылық" },
      { ru: "Социальные", kk: "Әлеуметтік" },
    ],
  },
  chat: {
    tag: { ru: "AI-помощник", kk: "AI-көмекші" },
    h: { ru: "Спроси что угодно", kk: "Кез келген нәрсені сұра" },
    sub: { ru: "помощник знает твои результаты", kk: "көмекші сенің нәтижелеріңді біледі" },
    bubbles: [
      { me: true, t: { ru: "Почему мне подходит дизайн?", kk: "Маған неге дизайн сәйкес келеді?" } },
      {
        me: false,
        t: {
          ru: "У тебя в топе креативность и эмпатия. В дизайне нужно как раз это: придумать идею и понять, что нужно человеку.",
          kk: "Сенде креативтілік пен эмпатия алдыңғы орында. Дизайнда дәл осы екеуі керек: идея ойлап табу және адамға не қажет екенін түсіну.",
        },
      },
      { me: true, t: { ru: "А где этому учат?", kk: "Қайда оқуға болады?" } },
      {
        me: false,
        t: {
          ru: "В Астане это три университета и два колледжа. Открыть список?",
          kk: "Астанада үш университет пен екі колледж бар. Тізімді ашайын ба?",
        },
      },
    ],
  },
  navigator: {
    tag: { ru: "Навигатор", kk: "Навигатор" },
    h: { ru: "Программы для тебя", kk: "Саған арналған бағдарламалар" },
    chips: [
      { ru: "Астана", kk: "Астана" },
      { ru: "Бакалавриат", kk: "Бакалавриат" },
      { ru: "Есть общежитие", kk: "Жатақханасы бар" },
    ],
    rows: [
      {
        b: { ru: "Дизайн", kk: "Дизайн" },
        e: { ru: "3 университета · творческий экзамен", kk: "3 университет · шығармашылық емтихан" },
      },
      {
        b: { ru: "Реклама и связи с общественностью", kk: "Жарнама және қоғаммен байланыс" },
        e: { ru: "5 университетов · есть общежитие", kk: "5 университет · жатақхана бар" },
      },
      {
        b: { ru: "Графический дизайн", kk: "Графикалық дизайн" },
        e: { ru: "2 колледжа · после 9 класса", kk: "2 колледж · 9-сыныптан кейін" },
      },
      {
        b: { ru: "Педагогика и психология", kk: "Педагогика және психология" },
        e: { ru: "7 университетов · академическая мобильность", kk: "7 университет · академиялық ұтқырлық" },
      },
    ],
  },
  portfolio: {
    tag: { ru: "Портфолио", kk: "Портфолио" },
    h: { ru: "Твои достижения", kk: "Сенің жетістіктерің" },
    sub: { ru: "7 файлов загружено", kk: "7 файл жүктелген" },
    rows: [
      {
        b: { ru: "Областная олимпиада по биологии", kk: "Биологиядан облыстық олимпиада" },
        e: { ru: "Диплом II степени · 2025", kk: "II дәрежелі диплом · 2025" },
      },
      {
        b: { ru: "Курс «Основы дизайна»", kk: "«Дизайн негіздері» курсы" },
        e: { ru: "Сертификат · 2026", kk: "Сертификат · 2026" },
      },
      {
        b: { ru: "Волонтёрский проект «Тазалық»", kk: "«Тазалық» волонтерлік жобасы" },
        e: { ru: "Благодарственное письмо · 2025", kk: "Алғыс хат · 2025" },
      },
    ],
    add: { ru: "+ Добавить достижение", kk: "+ Жетістік қосу" },
  },
};

const privacy = {
  eyebrow: { ru: "Твои результаты", kk: "Сенің нәтижелерің" },
  h2: { ru: "Что происходит с результатами", kk: "Нәтижелермен не болады" },
  p: {
    ru: "Чем честнее ответишь, тем точнее получится результат.",
    kk: "Қаншалықты шыншыл жауап берсең, нәтиже соншалықты дәл болады.",
  },
  items: [
    {
      title: { ru: "Это не экзамен", kk: "Бұл емтихан емес" },
      desc: {
        ru: "Правильных ответов тут нет, и плохой результат получить нельзя. На оценки это не влияет.",
        kk: "Мұнда дұрыс жауап жоқ, нашар нәтиже алу мүмкін емес. Бағаға әсер етпейді.",
      },
    },
    {
      title: {
        ru: "Твой профориентатор видит твой отчёт",
        kk: "Кәсіби бағдар беру педагогы есебіңді көреді",
      },
      desc: {
        ru: "Чтобы подсказать, что делать дальше, и помочь с выбором.",
        kk: "Әрі қарай не істеу керегін айтып, таңдауға көмектесу үшін.",
      },
    },
    {
      title: { ru: "Одноклассники ничего не видят", kk: "Сыныптастарың ештеңе көрмейді" },
      desc: {
        ru: "Отчёт открыт тебе и профориентатору. Нигде публично результаты не показываются.",
        kk: "Есеп саған және педагогқа ашық. Нәтижелер ешқайда жария етілмейді.",
      },
    },
    {
      title: { ru: "Проходи сколько угодно раз", kk: "Қалағаныңша қайта өт" },
      desc: {
        ru: "Тест можно перепройти в любой момент, хоть завтра. Все прошлые результаты сохранятся, и их можно сравнить.",
        kk: "Тестті кез келген сәтте қайта өтуге болады. Барлық бұрынғы нәтижелер сақталады, оларды салыстыруға болады.",
      },
    },
    {
      wide: true,
      title: {
        ru: "Отчёт — хороший повод поговорить с родителями",
        kk: "Есеп — ата-анаңмен сөйлесуге жақсы себеп",
      },
      desc: {
        ru: "Сам по себе отчёт никуда не уходит: отдельного входа для родителей нет, рассылок тоже. Но показать его стоит — в нём видно, почему тебе подходит именно это направление, и опирается он на результаты тестов, а не на «я так хочу». С таким аргументом разговор дома идёт заметно спокойнее.",
        kk: "Есеп өздігінен ешқайда кетпейді: ата-аналарға бөлек кіру де, хабарлама да жоқ. Бірақ оны көрсеткен дұрыс — онда неге дәл осы бағыт саған сәйкес келетіні көрінеді, әрі ол «мен солай қалаймын» дегенге емес, тест нәтижелеріне сүйенеді. Мұндай дәлелмен үйдегі әңгіме әлдеқайда жеңіл өтеді.",
      },
    },
  ],
  note: {
    ru: "Данные хранятся в защищённом виде и не передаются третьим лицам.",
    kk: "Деректер қорғалған түрде сақталады және үшінші тұлғаларға берілмейді.",
  },
};

const faq = {
  eyebrow: { ru: "Вопросы", kk: "Сұрақтар" },
  h2: { ru: "Коротко о главном", kk: "Ең маңыздысы туралы қысқаша" },
  qa: [
    {
      q: { ru: "Сколько времени это займёт?", kk: "Бұл қанша уақыт алады?" },
      a: {
        ru: "«Мои навыки» — примерно 15 минут, результат появится сразу, как закончишь. Два других — по 8 минут, их можно пройти когда удобно.",
        kk: "«Менің дағдыларым» — шамамен 15 минут, аяқтаған бойда нәтиже шығады. Қалған екеуі — 8 минуттан, оларды ыңғайлы кезде өтуге болады.",
      },
    },
    {
      q: { ru: "Какие рекомендации я получу?", kk: "Қандай ұсыныстар аламын?" },
      a: {
        ru: "После теста «Мои навыки» откроются подходящие тебе отрасли и образовательные программы, а вместе с ними вузы и колледжи, где на них учат. Тест «Мои интересы» добавит профессии, которые тебе подойдут. Каждый тест даёт результат сам по себе.",
        kk: "«Менің дағдыларым» тестінен кейін саған сәйкес салалар мен білім беру бағдарламалары ашылады, олармен бірге — оларды оқытатын ЖОО мен колледждер. «Менің қызығушылықтарым» тесті саған сәйкес келетін мамандықтарды қосады. Әр тест өз алдына нәтиже береді.",
      },
    },
    {
      q: { ru: "Это бесплатно?", kk: "Бұл тегін бе?" },
      a: {
        ru: "Да. Школа уже всё оплатила, с тебя и родителей ничего не нужно.",
        kk: "Иә. Мектеп бәрін төлеп қойған, сенен де, ата-анаңнан да ештеңе талап етілмейді.",
      },
    },
    {
      q: { ru: "Кто увидит мои результаты?", kk: "Нәтижелерімді кім көреді?" },
      a: {
        ru: "Ты и твой профориентатор. Другим ученикам результаты не показываются.",
        kk: "Сен және кәсіби бағдар беру педагогың. Басқа оқушыларға нәтижелер көрсетілмейді.",
      },
    },
    {
      q: { ru: "Родители увидят мои результаты?", kk: "Ата-анам нәтижелерімді көре ме?" },
      a: {
        ru: "Сами по себе — нет: отдельного входа для родителей и рассылок не существует. Показать отчёт дома — твоё решение, и мы советуем это сделать: с ним разговор о будущем идёт спокойнее.",
        kk: "Өздігінен — жоқ: ата-аналарға бөлек кіру де, хабарлама да жоқ. Есепті үйде көрсету — өз шешімің, және біз оны көрсетуді ұсынамыз: онымен болашақ туралы әңгіме әлдеқайда жеңіл өтеді.",
      },
    },
    {
      q: { ru: "Можно пройти тест заново?", kk: "Тестті қайта өтуге бола ма?" },
      a: {
        ru: "Да, в любой момент и сколько угодно раз. Прошлые результаты останутся в истории, чтобы можно было сравнить.",
        kk: "Иә, кез келген уақытта және қалағаныңша. Бұрынғы нәтижелер тарихта қалады, оларды салыстыруға болады.",
      },
    },
    {
      q: {
        ru: "Я не знаю, кем хочу быть. Мне это подойдёт?",
        kk: "Кім болғым келетінін білмеймін. Маған келе ме?",
      },
      a: {
        ru: "Как раз для этого всё и сделано. Ничего заранее знать не нужно — платформа сама покажет направления по результатам теста.",
        kk: "Дәл сол үшін жасалған. Алдын ала ештеңе білудің қажеті жоқ — платформа тест нәтижесі бойынша бағыттарды өзі көрсетеді.",
      },
    },
    {
      q: {
        ru: "Какие учебные заведения есть в навигаторе?",
        kk: "Навигаторда қандай оқу орындары бар?",
      },
      a: {
        ru: "Все вузы и колледжи Казахстана — с программами, предметами ЕНТ, стоимостью, общежитиями и академической мобильностью. Отдельным разделом — зарубежные университеты.",
        kk: "Қазақстанның барлық ЖОО мен колледждері — бағдарламалары, ҰБТ пәндері, оқу құны, жатақханалары және академиялық ұтқырлығы көрсетілген. Бөлек бөлімде — шетелдік университеттер.",
      },
    },
  ],
};

const codes = {
  h2: {
    ru: "Выбор проще, когда знаешь, из чего выбирать",
    kk: "Не бар екенін білсең, таңдау оңайырақ",
  },
  p: {
    ru: "Чем на самом деле занят человек в конкретной профессии, где этому учат, как устроено поступление и что за навыки уже сейчас требуют работодатели.",
    kk: "Нақты мамандық иесі шын мәнінде немен айналысады, қайда оқуға болады, түсу қалай өтеді және жұмыс берушілер қазірдің өзінде қандай дағдыларды талап етеді.",
  },
  // Готовые справочные страницы на smartbolashaq.kz
  cards: [
    {
      href: "/professions",
      title: { ru: "Топ профессии", kk: "Үздік мамандықтар" },
      desc: {
        ru: "Самые востребованные профессии рынка: чем занимаются, какие навыки нужны, как проходит рабочий день и где этому учат.",
        kk: "Нарықтағы ең сұранысқа ие мамандықтар: немен айналысады, қандай дағдылар керек, жұмыс күні қалай өтеді және қайда оқытады.",
      },
    },
    {
      href: "/popularuniversity",
      title: { ru: "Университеты", kk: "Университеттер" },
      desc: {
        ru: "Популярные университеты: сколько учиться, что сдавать и сколько стоит обучение. А отмечать то, что понравилось, можно в личном кабинете.",
        kk: "Танымал университеттер: қанша оқу керек, не тапсыру керек және оқу қанша тұрады. Ұнағанын белгілеп қою жеке кабинетте жұмыс істейді.",
      },
    },
    {
      href: "/workingprofessionsgen",
      title: { ru: "Рабочие профессии", kk: "Жұмысшы мамандықтар" },
      desc: {
        ru: "Востребованные рабочие специальности: чем занимаются, сколько зарабатывают и где на них учат после 9 и 11 класса.",
        kk: "Сұранысқа ие жұмысшы мамандықтар: немен айналысады, қанша табады және 9 бен 11-сыныптан кейін қайда оқытады.",
      },
    },
    {
      href: "/skills",
      title: { ru: "Навыки XXI века", kk: "XXI ғасыр дағдылары" },
      desc: {
        ru: "Что стоит за каждым навыком из теста, почему на него смотрят работодатели и как развить его самому.",
        kk: "Тесттегі әр дағдының артында не тұр, жұмыс берушілер оған неге назар аударады және оны өз бетіңше қалай дамытуға болады.",
      },
    },
  ],
};

const finalCta = {
  h2: {
    ru: "Стенд ты уже нашёл — остался один шаг",
    kk: "Стендті таптың — бір қадам қалды",
  },
  p: {
    ru: "Тест укладывается в одну перемену, а отчёт останется в личном кабинете и после выпуска.",
    kk: "Тест бір үзіліске сыяды, ал есеп мектепті бітіргеннен кейін де жеке кабинетте сақталады.",
  },
};

/* ─────────────────────────── Мелкие компоненты ─────────────────────────── */

// Экран приложения: лёгкая белая карточка с мягкой тенью — без тёмного
// «корпуса» телефона
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[330px] rounded-[28px] border border-stone-100 bg-white p-5 shadow-[0_1px_2px_rgba(38,36,89,0.06),0_24px_60px_rgba(38,36,89,0.14)]">
      {children}
    </div>
  );
}

// 3D-наклон за курсором — как у «устройства» в старом блоке шагов
function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 4, y: -12 });
  const [tracking, setTracking] = useState(false);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setRot({
      x: ((y - r.height / 2) / (r.height / 2)) * -8,
      y: ((x - r.width / 2) / (r.width / 2)) * 12,
    });
    setTracking(true);
  }
  function onLeave() {
    setRot({ x: 4, y: -12 });
    setTracking(false);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transform-gpu ${
        tracking
          ? "transition-transform duration-100 ease-out"
          : "transition-transform duration-700 ease-out"
      }`}
      style={{
        transform: `perspective(1000px) rotateY(${rot.y}deg) rotateX(${rot.x}deg)${
          tracking ? " scale(1.02)" : ""
        }`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

function ScreenTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-violet-100 px-2.5 py-1 text-[11.5px] font-medium text-violet-700">
      {children}
    </span>
  );
}

// Полосы навыков вырастают, когда карточка становится активной
function SkillBars({ lang, active = true }: { lang: Lang; active?: boolean }) {
  return (
    <>
      {skills.map((s, i) => (
        <div key={s.v} className="mt-3">
          <div className="mb-1 flex justify-between text-[13.5px]">
            <span className="text-stone-600">{s.name[lang]}</span>
            <b className="font-semibold text-stone-800">{s.v}</b>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-violet-500 transition-all duration-700 ease-out"
              style={{
                width: active ? `${s.v}%` : "0%",
                transitionDelay: `${200 + i * 180}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function NavRow({
  b,
  e,
  active = true,
  i = 0,
}: {
  b: string;
  e: string;
  active?: boolean;
  i?: number;
}) {
  return (
    <div
      className={`border-b border-stone-100 py-2.5 text-[13.5px] transition-all duration-500 ease-out ${
        active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      style={{ transitionDelay: `${200 + i * 130}ms` }}
    >
      <b className="font-semibold text-stone-800">{b}</b>
      <em className="mt-0.5 block text-[11.5px] text-stone-400 not-italic">{e}</em>
    </div>
  );
}

/* ─────────────────────────────── Страница ──────────────────────────────── */

export default function WelcomePage() {
  const [lang, setLang] = useState<Lang>("ru");
  const [pane, setPane] = useState(0);
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Появление блоков при скролле
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("in"), i * 60);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Карусель «Что тут есть»: стрелки, точки и перетаскивание
  function pickPane(i: number) {
    setPane((i + panes.length) % panes.length);
  }

  function onDragStart(e: React.PointerEvent) {
    dragX.current = e.clientX;
  }

  function onDragEnd(e: React.PointerEvent) {
    if (dragX.current === null) return;
    const delta = e.clientX - dragX.current;
    dragX.current = null;
    if (Math.abs(delta) < 50) return; // короткое движение — это клик
    pickPane(delta < 0 ? pane + 1 : pane - 1);
  }

  // Экраны телефона для колоды (по индексу карточки); active оживляет контент
  function paneScreen(i: number, active = true) {
    if (i === 0) {
      const s = paneScreens.profile;
      return (
        <>
          <ScreenTag>{s.tag[lang]}</ScreenTag>
          <p className="font-display mt-3 text-[17px] text-stone-800">{s.h[lang]}</p>
          <p className="text-xs text-stone-400">{s.sub[lang]}</p>
          <SkillBars lang={lang} active={active} />
          <div className="mt-4 rounded-xl border border-stone-100 p-3">
            <p className="mb-2 text-[11px] tracking-wider text-stone-400 uppercase">{s.p1[lang]}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.p1chips.map((c) => (
                <span key={c.ru} className="rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-700">
                  {c[lang]}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2 rounded-xl border border-stone-100 p-3">
            <p className="mb-2 text-[11px] tracking-wider text-stone-400 uppercase">{s.p2[lang]}</p>
            <div className="flex flex-wrap gap-1.5">
              {s.p2chips.map((c) => (
                <span key={c.ru} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                  {c[lang]}
                </span>
              ))}
            </div>
          </div>
        </>
      );
    }
    if (i === 1) {
      const s = paneScreens.chat;
      return (
        <>
          <ScreenTag>{s.tag[lang]}</ScreenTag>
          <p className="font-display mt-3 text-[17px] text-stone-800">{s.h[lang]}</p>
          <p className="text-xs text-stone-400">{s.sub[lang]}</p>
          <div className="mt-2">
            {s.bubbles.map((b, bi) => (
              <div
                key={b.t.ru}
                className={`mt-2 rounded-2xl px-3 py-2.5 text-[13px] leading-normal transition-all duration-500 ease-out ${
                  b.me
                    ? "ml-10 rounded-br-md bg-violet-500 text-white"
                    : "rounded-bl-md bg-stone-100 text-stone-700"
                } ${active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
                style={{ transitionDelay: `${250 + bi * 450}ms` }}
              >
                {b.t[lang]}
              </div>
            ))}
          </div>
        </>
      );
    }
    if (i === 2) {
      const s = paneScreens.navigator;
      return (
        <>
          <ScreenTag>{s.tag[lang]}</ScreenTag>
          <p className="font-display mt-3 text-[17px] text-stone-800">{s.h[lang]}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {s.chips.map((c) => (
              <span key={c.ru} className="rounded-full bg-violet-100 px-2.5 py-1 text-xs text-violet-700">
                {c[lang]}
              </span>
            ))}
          </div>
          <div className="mt-3">
            {s.rows.map((r, ri) => (
              <NavRow key={r.b.ru} b={r.b[lang]} e={r.e[lang]} active={active} i={ri} />
            ))}
          </div>
        </>
      );
    }
    const s = paneScreens.portfolio;
    return (
      <>
        <ScreenTag>{s.tag[lang]}</ScreenTag>
        <p className="font-display mt-3 text-[17px] text-stone-800">{s.h[lang]}</p>
        <p className="text-xs text-stone-400">{s.sub[lang]}</p>
        <div className="mt-3">
          {s.rows.map((r, ri) => (
            <NavRow key={r.b.ru} b={r.b[lang]} e={r.e[lang]} active={active} i={ri} />
          ))}
        </div>
        <div className="mt-3.5 rounded-xl border border-dashed border-stone-300 p-2.5 text-center text-[13px] text-stone-500">
          {s.add[lang]}
        </div>
      </>
    );
  }

  function paneText(i: number, compact = false) {
    const p = panes[i];
    return (
      <div>
        <p className="text-[11.5px] font-semibold tracking-[0.09em] text-stone-400 uppercase">
          {p.q[lang]}
        </p>
        <h3 className="font-display mt-2 mb-3.5 text-[27px] leading-tight text-stone-800">
          {p.title[lang]}
        </h3>
        <p className="text-stone-600">{p.desc[lang]}</p>
        <ul className={`mt-4 border-t border-stone-200 ${compact ? "" : ""}`}>
          {p.list.map((li) => (
            <li
              key={li.ru}
              className="border-b border-stone-200 py-2 text-[15px] text-stone-500 last:border-b-0"
            >
              {li[lang]}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbfd] text-stone-800 selection:bg-violet-200">
      {/* Навбар */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3.5">
          <span className="font-display mr-auto flex items-center gap-2 text-sm tracking-tight text-stone-800">
            <LogoMark className="h-6 w-6" />
            AI профориентатор
          </span>
          <nav className="hidden gap-6 text-sm text-stone-500 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition hover:text-stone-800">
                {n.label[lang]}
              </a>
            ))}
          </nav>
          <div className="flex overflow-hidden rounded-full border border-stone-200 text-[13px] font-medium">
            {(["kk", "ru"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 tracking-wide transition ${
                  lang === l ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {l === "kk" ? "ҚАЗ" : "РУС"}
              </button>
            ))}
          </div>
          <Link
            href="/auth"
            className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
          >
            {lang === "kk" ? "Кіру" : "Войти"}
          </Link>
        </div>
      </header>

      {/* Герой — индиговая пастельная подложка, один насыщенный акцент: коралловая кнопка */}
      <section className="px-4 pt-6 pb-6 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-violet-200/70 bg-violet-100 px-6 py-14 md:px-14 md:py-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.11em] text-violet-600 uppercase">
                {hero.eyebrow[lang]}
              </p>
              <h1 className="font-display mt-5 text-4xl leading-[1.08] text-violet-800 md:text-[56px]">
                {hero.h1[lang]}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-violet-800/70">
                {hero.lede[lang]}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/auth"
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-stone-800 transition-all hover:bg-orange-400"
                >
                  {hero.cta[lang]}
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-violet-800/50">{hero.micro[lang]}</p>
              <div className="mt-9 flex flex-wrap gap-10 border-t border-violet-100 pt-7">
                {hero.meta.map((m) => (
                  <div key={m.b.ru} className="max-w-[17em] text-sm text-violet-800/60">
                    <b className="font-display mb-0.5 block text-[21px] text-violet-800">
                      {m.b[lang]}
                    </b>
                    {m.s[lang]}
                  </div>
                ))}
              </div>
            </div>

            {/* «Отчёт генерируется»: живые графики + 3D-барабан профессий */}
            <div className="hidden justify-center lg:flex">
              <ProfessionCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* С чего начать */}
      <section id="how" className="bg-stone-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rv mb-12 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.11em] text-stone-400 uppercase">
              {how.eyebrow[lang]}
            </p>
            <h2 className="font-display mt-3 text-3xl text-stone-800 md:text-[40px] md:leading-tight">
              {how.h2[lang]}
            </h2>
            <p className="mt-4 text-lg text-stone-600">{how.p[lang]}</p>
          </div>

          {/* Главный тест */}
          <div className="rv grid items-center gap-10 rounded-[28px] border border-violet-200/70 bg-violet-100 p-8 md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <div className="mb-4 flex gap-2">
                {how.pills.map((p) => (
                  <span
                    key={p.ru}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700"
                  >
                    {p[lang]}
                  </span>
                ))}
              </div>
              <h3 className="font-display text-3xl text-violet-800">{how.mainTitle[lang]}</h3>
              <p className="mt-2 text-[13px] tracking-wide text-violet-800/60">
                {how.mainMeth[lang]}
              </p>
              <p className="mt-3.5 max-w-xl leading-relaxed text-violet-900/80">
                {how.mainDesc[lang]}
              </p>
            </div>
            <div className="flex min-w-[296px] flex-col gap-1.5">
              {how.unlocks.map((u) => (
                <div
                  key={u.ru}
                  className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-[14.5px] text-stone-700"
                >
                  <span className="flex h-[17px] w-[17px] flex-none items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {u[lang]}
                </div>
              ))}
            </div>
          </div>

          {/* Дополнительные тесты */}
          <p className="rv mt-8 mb-3.5 flex items-center gap-4 text-[13px] font-semibold tracking-[0.08em] text-stone-400 uppercase after:h-px after:flex-1 after:bg-stone-200">
            {how.optLabel[lang]}
          </p>
          <div className="grid gap-3.5 md:grid-cols-2">
            {how.opts.map((o) => (
              <div key={o.title.ru} className="rv rounded-3xl border border-stone-200 bg-white p-7">
                <h3 className="font-display text-[21px] text-stone-800">{o.title[lang]}</h3>
                <p className="mt-1.5 text-[13px] text-stone-400">{o.meth[lang]}</p>
                <p className="text-[13px] text-stone-400">{o.time[lang]}</p>
                <p className="mt-3.5 text-stone-600">{o.desc[lang]}</p>
              </div>
            ))}
          </div>

          {/* Комплексный отчёт */}
          <div className="rv mt-3.5 flex items-start gap-5 rounded-3xl border-2 border-violet-200 bg-white p-7 md:p-8">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-violet-500 text-white">
              <Star size={16} fill="currentColor" />
            </span>
            <div>
              <h3 className="font-display text-xl text-stone-800">{how.bonusTitle[lang]}</h3>
              <p className="mt-2.5 max-w-3xl text-stone-600">{how.bonusDesc[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Что тут есть — карусель карточек */}
      <section id="what" className="pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rv max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.11em] text-stone-400 uppercase">
              {what.eyebrow[lang]}
            </p>
            <h2 className="font-display mt-3 text-3xl text-stone-800 md:text-[40px] md:leading-tight">
              {what.h2[lang]}
            </h2>
          </div>
        </div>

        {/* Десктоп: обычная карусель — стрелки, точки и перетаскивание */}
        <div className="mx-auto mt-12 hidden w-full max-w-6xl px-6 pb-24 lg:block">
          <div
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            onPointerCancel={() => (dragX.current = null)}
            className="relative min-h-[560px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            {panes.map((_, i) => (
              <div
                key={i}
                className={`absolute inset-x-0 top-0 transition-all duration-500 ease-out ${
                  i === pane
                    ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                    : `pointer-events-none opacity-0 ${
                        i < pane ? "-translate-x-10 scale-[.985]" : "translate-x-10 scale-[.985]"
                      }`
                }`}
              >
                <div className="grid items-center gap-16 lg:grid-cols-[1fr_372px]">
                  {paneText(i)}
                  <div className="flex justify-center">
                    <Tilt>
                      <Phone>{paneScreen(i, i === pane)}</Phone>
                    </Tilt>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Управление: точки слева, стрелки справа */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {panes.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Карточка ${i + 1}`}
                  onClick={() => pickPane(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === pane ? "w-8 bg-violet-500" : "w-2.5 bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
              <span className="ml-3 font-mono text-[13px] text-stone-400 tabular-nums">
                {pane + 1} / {panes.length}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                aria-label="Предыдущая карточка"
                onClick={() => pickPane(pane - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Следующая карточка"
                onClick={() => pickPane(pane + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Мобайл: карточки друг под другом */}
        <div className="mx-auto mt-10 max-w-6xl space-y-14 px-6 pb-24 lg:hidden">
          {panes.map((_, i) => (
            <div key={i} className="rv">
              {paneText(i, true)}
              <div className="mt-6 flex justify-center">
                <Phone>{paneScreen(i, true)}</Phone>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Твои результаты — мятная пастельная секция */}
      <section id="privacy" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-teal-50 px-6 py-14 md:px-12 md:py-16">
          <div className="rv mb-10 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.11em] text-teal-700 uppercase">
              {privacy.eyebrow[lang]}
            </p>
            <h2 className="font-display mt-3 text-3xl text-stone-800 md:text-[40px] md:leading-tight">
              {privacy.h2[lang]}
            </h2>
            <p className="mt-4 text-lg text-stone-600">{privacy.p[lang]}</p>
          </div>
          <div className="grid gap-3.5 md:grid-cols-2">
            {privacy.items.map((it) => (
              <div
                key={it.title.ru}
                className={`rv rounded-3xl bg-white p-7 ${"wide" in it && it.wide ? "md:col-span-2" : ""}`}
              >
                <h3 className="font-display text-[19px] text-stone-800">{it.title[lang]}</h3>
                <p className="mt-2.5 text-stone-600">{it.desc[lang]}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-teal-800/60">{privacy.note[lang]}</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-stone-50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rv mb-10">
            <p className="text-xs font-semibold tracking-[0.11em] text-stone-400 uppercase">
              {faq.eyebrow[lang]}
            </p>
            <h2 className="font-display mt-3 text-3xl text-stone-800 md:text-[40px]">
              {faq.h2[lang]}
            </h2>
          </div>
          <div>
            {faq.qa.map((item, i) => (
              <details key={item.q.ru} className="group border-b border-stone-200 py-5" open={i === 0}>
                <summary className="font-display flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-stone-800 transition hover:text-stone-900">
                  {item.q[lang]}
                  <span className="flex-none text-2xl font-normal text-stone-300 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3.5 max-w-2xl leading-relaxed text-stone-600">{item.a[lang]}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Справочники */}
      <section id="codes" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rv mb-12 max-w-2xl">
            <h2 className="font-display text-3xl text-stone-800 md:text-[40px] md:leading-tight">
              {codes.h2[lang]}
            </h2>
            <p className="mt-4 text-lg text-stone-600">{codes.p[lang]}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {codes.cards.map((c) => (
              <Link
                key={c.title.ru}
                href={c.href}
                className="rv group rounded-3xl border border-stone-200 bg-white p-8 transition-all hover:border-violet-300 hover:shadow-[0_16px_40px_rgba(42,46,59,0.08)]"
              >
                <div className="flex items-start justify-between gap-5">
                  <h3 className="font-display text-[21px] text-stone-800">{c.title[lang]}</h3>
                  <span className="flex-none text-lg text-stone-300 transition group-hover:translate-x-1 group-hover:text-violet-600">
                    →
                  </span>
                </div>
                <p className="mt-3 text-stone-600">{c.desc[lang]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[36px] border border-violet-200/70 bg-violet-100 px-6 py-16 text-center md:py-20">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="rv font-display text-3xl text-violet-800 md:text-5xl">
              {finalCta.h2[lang]}
            </h2>
            <p className="rv mx-auto max-w-xl text-lg text-violet-800/70">{finalCta.p[lang]}</p>
            <Link
              href="/auth"
              className="rv group inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-9 py-4 font-bold text-stone-800 transition-all hover:bg-orange-400"
            >
              {hero.cta[lang]}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-stone-100 py-8 text-center text-xs text-stone-400">
        AI профориентатор ·{" "}
        <Link href="/teacher/login" className="transition hover:text-stone-600">
          Для педагогов
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="transition hover:text-stone-600">
          Для администраторов
        </Link>{" "}
        ·{" "}
        <Link href="/design" className="transition hover:text-stone-600">
          Дизайн-система
        </Link>
      </footer>
    </div>
  );
}
