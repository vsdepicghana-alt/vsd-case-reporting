// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- SQLite setup ---
const DB_FILE = path.join(__dirname, 'vsd.sqlite');
const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS counters (name TEXT PRIMARY KEY, last_num INTEGER)`);
  db.run(`INSERT OR IGNORE INTO counters(name, last_num) VALUES('vsd', 0)`);

  db.run(`CREATE TABLE IF NOT EXISTS cases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT UNIQUE,
    region TEXT,
    district TEXT,
    disease TEXT,
    species TEXT,
    date_reported TEXT,
    status TEXT DEFAULT 'Suspected',
    payload_json TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lab_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    payload_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(case_id) REFERENCES cases(case_id)
  )`);
});

// Helper to generate Case IDs
function generateCaseId(cb) {
  db.serialize(() => {
    db.run('BEGIN');
    db.get(`SELECT last_num FROM counters WHERE name='vsd'`, (err, row) => {
      if (err) { db.run('ROLLBACK'); return cb(err); }
      const next = (row?.last_num || 0) + 1;
      db.run(`UPDATE counters SET last_num=? WHERE name='vsd'`, [next], (err2) => {
        if (err2) { db.run('ROLLBACK'); return cb(err2); }
        db.run('COMMIT', (err3) => {
          if (err3) return cb(err3);
          const year = new Date().getFullYear();
          const id = `VSD-${year}-${String(next).padStart(6, '0')}`;
          cb(null, id);
        });
      });
    });
  });
}

// --- API Endpoints ---

// Create case (field submission)
app.post('/api/cases', (req, res) => {
  const payload = req.body || {};
  generateCaseId((err, caseId) => {
    if (err) return res.status(500).json({ error: 'Case ID error', detail: String(err) });

    const region = payload.region || null;
    const district = payload.district || null;
    const disease = payload.disease || null;
    const species = payload.species || null;
    const date_reported = payload.date_reported || null;

    const stmt = db.prepare(
      `INSERT INTO cases (case_id, region, district, disease, species, date_reported, status, payload_json)
       VALUES (?,?,?,?,?,?,?,?)`
    );
    stmt.run(
      caseId, region, district, disease, species, date_reported, 'Suspected', JSON.stringify(payload),
      function (ierr) {
        if (ierr) return res.status(500).json({ error: 'Insert failed', detail: String(ierr) });
        res.json({ case_id: caseId });
      }
    );
  });
});

// Fetch case by ID
app.get('/api/cases', (req, res) => {
  const caseId = req.query.case_id;
  if (!caseId) return res.status(400).json({ error: 'case_id query required' });
  db.get(`SELECT * FROM cases WHERE case_id=?`, [caseId], (err, row) => {
    if (err) return res.status(500).json({ error: String(err) });
    if (!row) return res.status(404).json({ error: 'Case not found' });
    db.all(`SELECT * FROM lab_results WHERE case_id=?`, [caseId], (e2, labs) => {
      if (e2) return res.status(500).json({ error: String(e2) });
      res.json({ ...row, lab_results: labs || [] });
    });
  });
});

// Lab update
app.post('/api/lab_results', (req, res) => {
  const p = req.body || {};
  if (!p.case_id) return res.status(400).json({ error: 'case_id required' });

  db.get(`SELECT 1 FROM cases WHERE case_id=?`, [p.case_id], (err, found) => {
    if (err) return res.status(500).json({ error: String(err) });
    if (!found) return res.status(404).json({ error: 'Case not found' });

    const stmt = db.prepare(`INSERT INTO lab_results (case_id, payload_json) VALUES (?,?)`);
    stmt.run(p.case_id, JSON.stringify(p), function (ierr) {
      if (ierr) return res.status(500).json({ error: 'Insert failed', detail: String(ierr) });

      // If positive, update status
      const result = (p.test_result || '').toLowerCase();
      if (result === 'positive') {
        db.run(`UPDATE cases SET status='Confirmed' WHERE case_id=?`, [p.case_id]);
      }
      res.json({ ok: true, id: this.lastID });
    });
  });
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
