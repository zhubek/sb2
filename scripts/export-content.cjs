// Export immutable application defaults; database edits are never read or overwritten.
require("../backend/node_modules/ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    moduleResolution: "node",
    resolveJsonModule: true,
    esModuleInterop: true,
    jsx: "react-jsx",
  },
});
const { allDocuments } = require("../lib/cms/registry.ts");
const fs = require("node:fs");
const path = require("node:path");
const dir = path.resolve(".data/bootstrap");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  path.join(dir, "content-registry.json"),
  JSON.stringify(allDocuments()),
);
console.log(`Exported ${allDocuments().length} content defaults`);
