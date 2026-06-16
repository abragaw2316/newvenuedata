// Polite, robots-respecting downloader. Single throttled pass; descriptive
// User-Agent; retry with backoff. The DBPR robots.txt allows the
// /sto/file_download/extracts/ path (verified during recon).

import { mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { USER_AGENT, REQUEST_DELAY_MS, MAX_RETRIES, PATHS } from './config.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function ensureDir(dirUrl) {
  await mkdir(fileURLToPath(dirUrl), { recursive: true })
}

/**
 * Fetch a URL to data/raw/<destName>, returning the text + metadata.
 * @param {string} url
 * @param {string} destName
 * @returns {Promise<{text:string, bytes:number, path:string, status:number}>}
 */
export async function fetchToFile(url, destName) {
  await ensureDir(PATHS.raw)
  const dest = fileURLToPath(new URL(destName, PATHS.raw))

  let lastErr
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/csv,text/plain,*/*' },
        redirect: 'follow',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
      const text = await res.text()
      await writeFile(dest, text, 'utf8')
      await sleep(REQUEST_DELAY_MS) // be a good citizen between requests
      return { text, bytes: Buffer.byteLength(text, 'utf8'), path: dest, status: res.status }
    } catch (err) {
      lastErr = err
      if (attempt < MAX_RETRIES) await sleep(REQUEST_DELAY_MS * attempt * 2)
    }
  }
  throw new Error(`Failed to fetch ${url} after ${MAX_RETRIES} attempts: ${lastErr?.message}`)
}

/** Read a previously-downloaded raw file if present (for offline re-runs). */
export async function readRaw(destName) {
  const dest = fileURLToPath(new URL(destName, PATHS.raw))
  try {
    await stat(dest)
    return await readFile(dest, 'utf8')
  } catch {
    return null
  }
}
