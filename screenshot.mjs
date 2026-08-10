import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3];

function nextIndex() {
  const files = fs.readdirSync(outDir).filter(f => /^screenshot-\d+/.test(f));
  const nums = files.map(f => parseInt(f.match(/^screenshot-(\d+)/)[1], 10));
  return nums.length ? Math.max(...nums) + 1 : 1;
}

const idx = nextIndex();
const fileName = label ? `screenshot-${idx}-${label}.png` : `screenshot-${idx}.png`;
const outPath = path.join(outDir, fileName);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved ${outPath}`);
