import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export function readArticleTree() {
  const candidates = [
    resolve(process.cwd(), 'data/articles.json'),
    resolve(process.cwd(), 'dist/data/articles.json'),
  ];
  const filePath = candidates.find((candidate) => existsSync(candidate));

  if (!filePath) {
    throw new Error('Article data file not found');
  }

  return JSON.parse(readFileSync(filePath, 'utf8'));
}
