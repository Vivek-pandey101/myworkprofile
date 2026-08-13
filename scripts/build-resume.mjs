/**
 * Print resume/resume.html to public/Vivek_Kumar_Pandey.pdf.
 *
 *   npm run resume
 *
 * public/ is the path the site already links to (profile.resume in
 * src/data/content.js), so rebuilding the PDF updates the portfolio's
 * "Resume" button too.
 *
 * Uses the installed Chrome/Edge directly instead of Puppeteer: the resume is
 * a static file, so a ~300 MB dev dependency would buy nothing.
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, statSync, readFileSync, copyFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const source = path.join(root, 'resume', 'resume.html')
const output = path.join(root, 'public', 'Vivek_Kumar_Pandey.pdf')
// Print to temp first: Chrome exits 0 even when it cannot write the target,
// and a PDF left open in a viewer is locked on Windows.
const staged = path.join(tmpdir(), `resume-${process.pid}.pdf`)

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chrome) {
  console.error('No Chrome or Edge found. Set CHROME_PATH to a Chromium binary and retry.')
  process.exit(1)
}

mkdirSync(path.dirname(output), { recursive: true })

await new Promise((resolve, reject) => {
  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer', // no browser URL/date furniture on the page
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=12000', // let the webfonts land before the snapshot
      `--print-to-pdf=${staged}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'inherit' },
  )
  child.on('error', reject)
  child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`chrome exited ${code}`))))
})

if (!existsSync(staged)) {
  console.error('Chrome produced no PDF. Check resume/resume.html for a load error.')
  process.exit(1)
}

// A CV that spills onto a second page is a design bug, so surface the count.
const pdf = readFileSync(staged).toString('latin1')
const pages = Number(pdf.match(/\/Count\s+(\d+)/)?.[1] ?? 0)

try {
  copyFileSync(staged, output)
} catch (err) {
  console.error(
    err.code === 'EBUSY' || err.code === 'EPERM'
      ? `Cannot write ${path.relative(root, output)} — close it in your PDF viewer and rerun.`
      : err.message,
  )
  process.exit(1)
} finally {
  rmSync(staged, { force: true })
}

const kb = Math.round(statSync(output).size / 1024)
console.log(`✓ ${path.relative(root, output)} — ${pages} page(s), ${kb} KB`)
if (pages > 1) {
  console.log('  ⚠ More than one page: trim content or tighten spacing in resume.html')
  process.exitCode = 1
}
