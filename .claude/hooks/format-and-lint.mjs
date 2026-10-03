import { spawnSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const SKIP_DIRS = ["node_modules", ".next", "out", "build", "references"];
const JS_LIKE_EXT = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

function run(command, cwd) {
  return spawnSync(command, { cwd, encoding: "utf8", shell: true });
}

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch {
    process.exit(0);
  }

  const filePath = data?.tool_input?.file_path;
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    process.exit(0);
  }

  const projectDir = path.resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
  const resolved = path.resolve(filePath);

  if (resolved !== projectDir && !resolved.startsWith(projectDir + path.sep)) {
    process.exit(0);
  }

  const relative = path.relative(projectDir, resolved);
  if (SKIP_DIRS.some((dir) => relative.split(path.sep).includes(dir))) {
    process.exit(0);
  }

  run(`npx prettier --write --ignore-unknown "${resolved}"`, projectDir);

  const ext = path.extname(resolved);
  if (JS_LIKE_EXT.includes(ext)) {
    const eslint = run(`npx eslint --fix "${resolved}"`, projectDir);
    if (eslint.status !== 0) {
      const message = `${eslint.stdout || ""}${eslint.stderr || ""}`.trim();
      console.log(
        JSON.stringify({
          decision: "block",
          reason: `ESLint encontró errores en ${relative} que no pudo autocorregir automáticamente:\n\n${message}`,
        }),
      );
      process.exit(0);
    }
  }

  process.exit(0);
});
