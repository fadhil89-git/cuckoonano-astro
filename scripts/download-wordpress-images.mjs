import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const REPORT = 'reports/wordpress-import-posts.json';
const XML_PATH =
  '/Users/wanahmadfadhil/Downloads/cuckoomalaysiaordersenangpasangcepatservispercuma.WordPress.2026-05-25.xml';
const CONCURRENCY = 8;

const data = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
const xml = fs.existsSync(XML_PATH) ? fs.readFileSync(XML_PATH, 'utf8') : '';
const fallbackCandidates = new Map();

function normalizeWpImageUrl(url) {
  return url.replace(/^http:\/\//, 'https://').split('?')[0].replace(/-\d+x\d+(?=\.(?:jpg|jpeg|png|webp|gif)$)/i, '');
}

for (const match of xml.matchAll(/https?:\/\/[^\s"'<>\\)]+\.(?:jpg|jpeg|png|webp|gif)/gi)) {
  const url = match[0].replace(/^http:\/\//, 'https://').split('?')[0];
  const normalized = normalizeWpImageUrl(url);
  if (!fallbackCandidates.has(normalized)) fallbackCandidates.set(normalized, []);
  if (!fallbackCandidates.get(normalized).includes(url)) fallbackCandidates.get(normalized).push(url);
}

const queue = data.images.filter((image) => !fs.existsSync(image.localFile));
let completed = 0;
let failed = 0;

function download(image) {
  return new Promise((resolve) => {
    fs.mkdirSync(path.dirname(image.localFile), { recursive: true });
    const child = spawn('curl', [
      '-L',
      '-f',
      '--connect-timeout',
      '12',
      '--max-time',
      '45',
      '-o',
      image.localFile,
      image.remote,
    ]);
    child.on('close', (code) => {
      if (code === 0) {
        completed += 1;
        if (completed % 25 === 0 || completed === queue.length) {
          console.log(`Progress ${completed}/${queue.length}, failed ${failed}`);
        }
        resolve();
        return;
      }

      const candidates = (fallbackCandidates.get(image.remote) || []).filter((url) => url !== image.remote);
      if (candidates.length) {
        const fallback = candidates.shift();
        const fallbackChild = spawn('curl', [
          '-L',
          '-f',
          '--connect-timeout',
          '12',
          '--max-time',
          '45',
          '-o',
          image.localFile,
          fallback,
        ]);
        fallbackChild.on('close', (fallbackCode) => {
          completed += 1;
          if (fallbackCode !== 0) {
            failed += 1;
            try {
              if (fs.existsSync(image.localFile) && fs.statSync(image.localFile).size === 0) fs.unlinkSync(image.localFile);
            } catch {}
            console.log(`FAIL\t${image.remote}`);
          }
          if (completed % 25 === 0 || completed === queue.length) {
            console.log(`Progress ${completed}/${queue.length}, failed ${failed}`);
          }
          resolve();
        });
        return;
      }

      completed += 1;
      failed += 1;
      if (code !== 0) {
        try {
          if (fs.existsSync(image.localFile) && fs.statSync(image.localFile).size === 0) fs.unlinkSync(image.localFile);
        } catch {}
        console.log(`FAIL\t${image.remote}`);
      }
      if (completed % 25 === 0 || completed === queue.length) {
        console.log(`Progress ${completed}/${queue.length}, failed ${failed}`);
      }
      resolve();
    });
  });
}

async function run() {
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const image = queue.shift();
      await download(image);
    }
  });
  await Promise.all(workers);
  console.log(`Done. Downloaded/missing checked: ${completed}. Failed: ${failed}.`);
}

run();
