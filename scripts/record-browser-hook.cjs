// Preload for existing Playwright checks. Records the real UI and a navigation timeline.
const fs = require("node:fs"), path = require("node:path");
const { chromium } = require("playwright");
const directory = process.env.RECORD_DIR;
if (!directory) throw new Error("RECORD_DIR is required");
fs.mkdirSync(directory, { recursive: true });
const prefix = process.env.RECORD_PREFIX || "walkthrough";
const launch = chromium.launch.bind(chromium);
let sequence = 0;
chromium.launch = async options => {
  const browser = await launch({ ...options, slowMo: 180 });
  const contexts = [];
  const browserClose = browser.close.bind(browser);
  browser.close = async (...args) => {
    for (const context of contexts) await context.close();
    return browserClose(...args);
  };
  const create = browser.newContext.bind(browser);
  browser.newContext = async options => {
    const number = ++sequence, started = Date.now();
    const context = await create({ ...options, viewport: { width: 1440, height: 1000 },
      recordVideo: { dir: directory, size: { width: 1440, height: 1000 } } });
    contexts.push(context);
    const pages = [], timeline = [];
    context.on("page", page => {
      pages.push(page);
      page.on("framenavigated", frame => {
        if (frame === page.mainFrame()) timeline.push({ seconds: (Date.now()-started)/1000, url: frame.url() });
      });
      const goto = page.goto.bind(page);
      page.goto = async (...args) => { const response = await goto(...args); await page.waitForTimeout(1100); return response; };
    });
    const close = context.close.bind(context);
    let closed = false;
    context.close = async (...args) => {
      if (closed) return;
      closed = true;
      const videos = pages.map(p => p.video());
      await close(...args);
      for (let i=0;i<videos.length;i++) if (videos[i]) {
        const name = `${prefix}-${String(number).padStart(2,"0")}-${i+1}`;
        await videos[i].saveAs(path.join(directory, name+".webm"));
        fs.writeFileSync(path.join(directory,name+".json"),JSON.stringify(timeline,null,2));
      }
    };
    return context;
  };
  return browser;
};
