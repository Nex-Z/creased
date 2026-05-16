import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const candidates = ['dist', join('dist', 'client')];

function countHtmlFiles(directory) {
  if (!existsSync(directory)) {
    return 0;
  }

  let count = 0;
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      count += countHtmlFiles(fullPath);
    } else if (entry.endsWith('.html')) {
      count += 1;
    }
  }

  return count;
}

function listTopLevel(directory) {
  if (!existsSync(directory)) {
    return '(missing)';
  }

  return readdirSync(directory).join(', ') || '(empty)';
}

const selected = candidates
  .map((site) => ({
    site,
    blogHtmlCount: countHtmlFiles(join(site, 'blog')),
  }))
  .find(({ blogHtmlCount }) => blogHtmlCount > 0);

if (!selected) {
  console.error('Pagefind could not find generated blog HTML files.');
  console.error(`dist contains: ${listTopLevel('dist')}`);
  console.error(`dist/client contains: ${listTopLevel(join('dist', 'client'))}`);
  process.exit(1);
}

console.log(
  `Building Pagefind index from ${selected.site} (${selected.blogHtmlCount} blog HTML files).`,
);

const result = spawnSync(
  `pnpm exec pagefind --site ${selected.site} --glob "blog/**/*.html"`,
  { shell: true, stdio: 'inherit' },
);

process.exit(result.status ?? 1);
