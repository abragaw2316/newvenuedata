// SQLite persistence via Node's built-in node:sqlite (Node >= 22.5) — zero deps.
// Keeps the engine in the same "no extra toolchain" spirit as ../data-pipeline.
import { mkdirSync } from 'node:fs'
import { PATHS } from './config.mjs'
import { nowIso, normalizeDomain } from './util.mjs'

// node:sqlite is experimental and emits a warning on import; silence just that one.
const origEmit = process.emit
process.emit = function (name, warning, ...rest) {
  if (name === 'warning' && warning && warning.name === 'ExperimentalWarning' && /SQLite/i.test(String(warning.message))) {
    return false
  }
  return origEmit.call(this, name, warning, ...rest)
}
const { DatabaseSync } = await import('node:sqlite')

let _db = null

export function getDb() {
  if (_db) return _db
  mkdirSync(PATHS.dataDir, { recursive: true })
  _db = new DatabaseSync(PATHS.dbFile)
  _db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')
  migrate(_db)
  return _db
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS prospects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      domain TEXT UNIQUE,
      website TEXT,
      email TEXT,
      phone TEXT,
      contact_page TEXT,
      address TEXT,
      city TEXT,
      county TEXT,
      state TEXT DEFAULT 'FL',
      employee_estimate TEXT,
      description TEXT,
      tech_signals TEXT,            -- JSON array
      social TEXT,                  -- JSON object
      writes_liquor_liability INTEGER DEFAULT 0,
      ll_confidence REAL DEFAULT 0,
      segment TEXT,
      source TEXT,
      source_url TEXT,
      status TEXT DEFAULT 'discovered',  -- discovered|enriched|scored|researched|drafted|approved|sent|replied|trial|won|suppressed
      discovered_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS scores (
      prospect_id INTEGER PRIMARY KEY REFERENCES prospects(id) ON DELETE CASCADE,
      fit_score INTEGER,
      confidence REAL,
      dimensions TEXT,              -- JSON {dimension: points}
      scored_at TEXT
    );

    CREATE TABLE IF NOT EXISTS research (
      prospect_id INTEGER PRIMARY KEY REFERENCES prospects(id) ON DELETE CASCADE,
      summary TEXT,
      challenges TEXT,
      opportunities TEXT,
      why_fit TEXT,
      personalization TEXT,        -- JSON array
      angle TEXT,
      model TEXT,
      confidence REAL,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prospect_id INTEGER REFERENCES prospects(id) ON DELETE CASCADE,
      step INTEGER DEFAULT 0,      -- 0 = first email, 1/2 = follow-ups
      subject TEXT,
      body TEXT,
      cta TEXT,
      status TEXT DEFAULT 'draft', -- draft|approved|sent|skipped
      model TEXT,
      created_at TEXT,
      sent_at TEXT
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prospect_id INTEGER REFERENCES prospects(id) ON DELETE CASCADE,
      type TEXT,                   -- sent|reply|positive_reply|trial|won|unsubscribed|bounced|note
      detail TEXT,
      at TEXT
    );

    CREATE TABLE IF NOT EXISTS suppression (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT UNIQUE,           -- lowercased email or domain
      reason TEXT,
      at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_prospects_status ON prospects(status);
    CREATE INDEX IF NOT EXISTS idx_prospects_county ON prospects(county);
    CREATE INDEX IF NOT EXISTS idx_drafts_prospect ON drafts(prospect_id);
    CREATE INDEX IF NOT EXISTS idx_events_prospect ON events(prospect_id);
  `)
}

/** Is this email or its domain on the suppression list? */
export function isSuppressed(db, email, domain) {
  const vals = [email, domain].filter(Boolean).map((v) => v.toLowerCase())
  if (!vals.length) return false
  const placeholders = vals.map(() => '?').join(',')
  const row = db.prepare(`SELECT 1 FROM suppression WHERE value IN (${placeholders}) LIMIT 1`).get(...vals)
  return !!row
}

/**
 * Insert or update a prospect keyed by normalized domain (falls back to a
 * synthetic key on company name when no website is known). Never overwrites a
 * non-empty existing field with an empty incoming value. Returns {id, inserted}.
 */
export function upsertProspect(db, p) {
  const domain = normalizeDomain(p.website || p.domain || '') || `name:${(p.company || '').toLowerCase().trim()}`
  const now = nowIso()
  const existing = db.prepare('SELECT * FROM prospects WHERE domain = ?').get(domain)

  if (!existing) {
    const stmt = db.prepare(`
      INSERT INTO prospects
        (company, domain, website, email, phone, contact_page, address, city, county, state,
         employee_estimate, description, tech_signals, social, writes_liquor_liability, ll_confidence,
         segment, source, source_url, status, discovered_at, updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `)
    const info = stmt.run(
      p.company || domain, domain, p.website || null, p.email || null, p.phone || null,
      p.contact_page || null, p.address || null, p.city || null, p.county || null, p.state || 'FL',
      p.employee_estimate || null, p.description || null,
      p.tech_signals ? JSON.stringify(p.tech_signals) : null,
      p.social ? JSON.stringify(p.social) : null,
      p.writes_liquor_liability ? 1 : 0, p.ll_confidence || 0,
      p.segment || null, p.source || null, p.source_url || p.website || null,
      p.status || 'discovered', now, now,
    )
    return { id: Number(info.lastInsertRowid), inserted: true }
  }

  // Merge: only fill blanks / improve, never clobber existing data with empties.
  const merged = {
    company: existing.company || p.company,
    website: existing.website || p.website,
    email: existing.email || p.email,
    phone: existing.phone || p.phone,
    contact_page: existing.contact_page || p.contact_page,
    address: existing.address || p.address,
    city: existing.city || p.city,
    county: existing.county || p.county,
    employee_estimate: existing.employee_estimate || p.employee_estimate,
    description: existing.description || p.description,
    tech_signals: p.tech_signals ? JSON.stringify(p.tech_signals) : existing.tech_signals,
    social: p.social ? JSON.stringify(p.social) : existing.social,
    writes_liquor_liability: existing.writes_liquor_liability || (p.writes_liquor_liability ? 1 : 0),
    ll_confidence: Math.max(existing.ll_confidence || 0, p.ll_confidence || 0),
    segment: existing.segment || p.segment,
  }
  // node:sqlite rejects `undefined` bindings — coalesce every value to null.
  for (const k of Object.keys(merged)) if (merged[k] === undefined) merged[k] = null
  db.prepare(`
    UPDATE prospects SET company=?, website=?, email=?, phone=?, contact_page=?, address=?, city=?,
      county=?, employee_estimate=?, description=?, tech_signals=?, social=?,
      writes_liquor_liability=?, ll_confidence=?, segment=?, updated_at=?
    WHERE id=?
  `).run(
    merged.company, merged.website, merged.email, merged.phone, merged.contact_page, merged.address,
    merged.city, merged.county, merged.employee_estimate, merged.description, merged.tech_signals,
    merged.social, merged.writes_liquor_liability, merged.ll_confidence, merged.segment, now, existing.id,
  )
  return { id: existing.id, inserted: false }
}

export function setStatus(db, id, status) {
  db.prepare('UPDATE prospects SET status=?, updated_at=? WHERE id=?').run(status, nowIso(), id)
}

/** Add an email or domain to the permanent suppression list (opt-outs / bounces). */
export function addSuppression(db, value, reason = '') {
  if (!value) return
  db.prepare('INSERT OR IGNORE INTO suppression (value, reason, at) VALUES (?,?,?)')
    .run(String(value).toLowerCase(), reason, nowIso())
}

export function logEvent(db, prospectId, type, detail = '') {
  db.prepare('INSERT INTO events (prospect_id, type, detail, at) VALUES (?,?,?,?)')
    .run(prospectId, type, detail, nowIso())
}

export function counts(db) {
  return {
    prospects: db.prepare('SELECT COUNT(*) n FROM prospects').get().n,
    scored: db.prepare('SELECT COUNT(*) n FROM scores').get().n,
    researched: db.prepare('SELECT COUNT(*) n FROM research').get().n,
    drafts: db.prepare('SELECT COUNT(*) n FROM drafts').get().n,
    suppressed: db.prepare('SELECT COUNT(*) n FROM suppression').get().n,
  }
}
