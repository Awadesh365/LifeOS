const fs = require('fs');
const path = require('path');

const seedersDir = path.resolve(__dirname, 'seeders');
const scriptsDir = path.resolve(__dirname);

const forbiddenRules = [
  {
    name: 'bulkDelete',
    regex: /\bbulkDelete\s*\(/
  },
  {
    name: 'modelDestroy',
    regex: /\bdestroy\s*\(/
  },
  {
    name: 'truncate',
    regex: /\bTRUNCATE\b/i
  },
  {
    name: 'deleteFrom',
    regex: /\bDELETE\s+FROM\b/i
  }
];

const collectJsFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectJsFiles(fullPath));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
};

const collectSeedLikeRootScripts = () => {
  const entries = fs.readdirSync(scriptsDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.js')) continue;
    if (!entry.name.toLowerCase().includes('seed')) continue;
    if (entry.name === path.basename(__filename)) continue;
    files.push(path.join(scriptsDir, entry.name));
  }

  return files;
};

const isCommentLine = (line) => {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('*/')
  );
};

const validateSeeders = () => {
  const jsFiles = [
    ...collectJsFiles(seedersDir),
    ...collectSeedLikeRootScripts()
  ];
  const violations = [];

  for (const filePath of jsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (isCommentLine(line)) return;

      for (const rule of forbiddenRules) {
        if (rule.regex.test(line)) {
          violations.push({
            file: path.relative(process.cwd(), filePath),
            line: index + 1,
            rule: rule.name,
            code: line.trim()
          });
        }
      }
    });
  }

  if (violations.length > 0) {
    console.error('Seeder safety validation failed. Destructive operations are not allowed in seeders.\n');

    for (const violation of violations) {
      console.error(
        `- ${violation.file}:${violation.line} [${violation.rule}] ${violation.code}`
      );
    }

    process.exit(1);
  }

  console.log('Seeder safety validation passed.');
};

validateSeeders();
