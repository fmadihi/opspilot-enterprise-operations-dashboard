import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, 'data');
const dbFile = path.join(dataDir, 'db.json');
const PORT = Number(process.env.API_PORT || 4000);
const SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret-before-deploying';
const DEMO_EMAIL = 'demo@opspilot.dev';
const DEMO_PASSWORD = 'OpsPilot!2026';

const seed = {
  users: [{ id: 'usr_demo', name: 'Demo Admin', email: DEMO_EMAIL, salt: 'opspilot-demo-salt', passwordHash: scryptSync(DEMO_PASSWORD, 'opspilot-demo-salt', 64).toString('hex'), role: 'admin' }],
  tasks: [
    { id: 101, title: 'Review production quality report', department: 'Production', owner: 'M. Weber', due: 'Today', status: 'In progress', priority: 'High' },
    { id: 102, title: 'Validate incoming inventory records', department: 'Warehouse', owner: 'A. Fischer', due: 'Today', status: 'Review', priority: 'Medium' },
    { id: 103, title: 'Approve maintenance checklist', department: 'Maintenance', owner: 'L. Schmidt', due: 'Nov 21', status: 'In progress', priority: 'High' }
  ]
};

async function loadDb() {
  await mkdir(dataDir, { recursive: true });
  try { return JSON.parse(await readFile(dbFile, 'utf8')); }
  catch { await writeFile(dbFile, JSON.stringify(seed, null, 2)); return structuredClone(seed); }
}
let db = await loadDb();
const persist = () => writeFile(dbFile, JSON.stringify(db, null, 2));
const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
};
function verify(token) {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  const expected = createHmac('sha256', SECRET).update(body).digest();
  let actual; try { actual = Buffer.from(signature, 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try { const payload = JSON.parse(Buffer.from(body, 'base64url').toString()); return payload.exp > Date.now() ? payload : null; } catch { return null; }
}
const send = (res, status, payload) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': process.env.CORS_ORIGIN || 'http://localhost:5173', 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS' }); res.end(JSON.stringify(payload)); };
async function body(req) { let raw = ''; for await (const chunk of req) raw += chunk; try { return raw ? JSON.parse(raw) : {}; } catch { return null; } }
function auth(req) { const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); return verify(token); }

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'access-control-allow-origin': process.env.CORS_ORIGIN || 'http://localhost:5173', 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET, POST, PATCH, DELETE, OPTIONS' }); return res.end(); }
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { status: 'ok', service: 'opspilot-api', timestamp: new Date().toISOString() });
    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const input = await body(req); if (!input) return send(res, 400, { error: 'Invalid JSON body' });
      const user = db.users.find((item) => item.email.toLowerCase() === String(input.email || '').toLowerCase());
      const candidate = user ? scryptSync(String(input.password || ''), user.salt, 64) : Buffer.alloc(64);
      if (!user || !timingSafeEqual(candidate, Buffer.from(user.passwordHash, 'hex'))) return send(res, 401, { error: 'Invalid email or password' });
      const token = sign({ sub: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 });
      return send(res, 200, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role }, expiresIn: 28800 });
    }
    if (req.method === 'GET' && url.pathname === '/api/tasks') {
      const session = auth(req); if (!session) return send(res, 401, { error: 'Authentication required' });
      return send(res, 200, { data: db.tasks, total: db.tasks.length });
    }
    if (req.method === 'POST' && url.pathname === '/api/tasks') {
      const session = auth(req); if (!session) return send(res, 401, { error: 'Authentication required' });
      const input = await body(req);
      if (!input || typeof input.title !== 'string' || !input.title.trim()) return send(res, 422, { error: 'A task title is required' });
      const task = { id: Date.now(), title: input.title.trim().slice(0, 160), department: input.department || 'Production', owner: input.owner || 'Unassigned', due: input.due || 'Not set', status: 'In progress', priority: ['High', 'Medium', 'Low'].includes(input.priority) ? input.priority : 'Medium' };
      db.tasks.unshift(task); await persist(); return send(res, 201, { data: task });
    }
    const taskMatch = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
    if (taskMatch && req.method === 'PATCH') {
      const session = auth(req); if (!session) return send(res, 401, { error: 'Authentication required' });
      const task = db.tasks.find((item) => item.id === Number(taskMatch[1])); if (!task) return send(res, 404, { error: 'Task not found' });
      const input = await body(req); if (!input) return send(res, 400, { error: 'Invalid JSON body' });
      if (input.status && !['In progress', 'Review', 'Completed'].includes(input.status)) return send(res, 422, { error: 'Invalid task status' });
      if (input.status) task.status = input.status; await persist(); return send(res, 200, { data: task });
    }
    if (taskMatch && req.method === 'DELETE') {
      const session = auth(req); if (!session) return send(res, 401, { error: 'Authentication required' });
      const before = db.tasks.length; db.tasks = db.tasks.filter((item) => item.id !== Number(taskMatch[1]));
      if (before === db.tasks.length) return send(res, 404, { error: 'Task not found' });
      await persist(); return send(res, 200, { deleted: true });
    }
    return send(res, 404, { error: 'Route not found' });
  } catch (error) { console.error(error); return send(res, 500, { error: 'Internal server error' }); }
});
server.listen(PORT, () => console.log(`OpsPilot API listening on http://localhost:${PORT}`));
