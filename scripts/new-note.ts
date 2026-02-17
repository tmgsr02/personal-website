import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';

const NOTES_DIR = path.join(process.cwd(), 'src/content/notes');

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function main() {
  const title = await ask('Note title: ');
  if (!title) {
    console.error('Title is required.');
    process.exit(1);
  }

  const slug = slugify(title);
  const date = today();
  const filePath = path.join(NOTES_DIR, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const content = `---
title: "${title}"
date: "${date}"
summary: ""
tags: []
---

##
`;

  fs.mkdirSync(NOTES_DIR, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Created: ${filePath}`);

  try {
    execSync(`code "${filePath}"`);
  } catch {
    // VS Code not available — no problem
  }

  rl.close();
}

main();
