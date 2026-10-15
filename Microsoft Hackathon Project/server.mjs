import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Optional local .env support; the secret is never sent to the browser.
const root = dirname(fileURLToPath(import.meta.url));
if (existsSync(resolve(root, '.env'))) {
  const envText = await readFile(resolve(root, '.env'), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !match[1].startsWith('#') && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

const endpoint = (process.env.FOUNDRY_ENDPOINT || '').replace(/\/$/, '');
const model = process.env.FOUNDRY_MODEL || '';
const apiKey = process.env.FOUNDRY_API_KEY || '';
const foundryConfigured = Boolean(endpoint && model && apiKey);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };

function send(res, status, body, type='application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type':type, 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

async function readJson(req, maxBytes=24000) {
  let raw='', size=0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error('request_too_large');
    raw += chunk;
  }
  return JSON.parse(raw || '{}');
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/api/status') {
    return send(res, 200, { configured: foundryConfigured });
  }
  if (req.method === 'POST' && url.pathname === '/api/question') {
    if (!foundryConfigured) return send(res, 503, { error:'Foundry is not configured. The local answer is still available.' });
    let data;
    try { data = await readJson(req); }
    catch { return send(res, 400, { error:'Question request is invalid or too large.' }); }
    const question = typeof data.question === 'string' ? data.question.trim().slice(0, 500) : '';
    const matchData = data.match;
    if (!question || !matchData || !Array.isArray(matchData.events) || matchData.events.length > 200) {
      return send(res, 400, { error:'A question and a valid match event list are required.' });
    }
    const language = data.language === 'mr' ? 'Marathi' : 'English';
    const system = `You are Neural Ninjas, an explainable football match assistant. Answer in ${language}. Use only facts in the supplied synthetic match JSON. Do not invent events, positions, tactics, injuries, player attributes, shot quality, or causes. Separate recorded facts from interpretations. Cite the relevant team, count, player, or minute in the answer. Say when the sample cannot answer confidently. Mention that the data is synthetic and event-only. Keep the answer clear and under 150 words.`;
    try {
      const response = await fetch(`${endpoint}/openai/v1/chat/completions`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'api-key':apiKey },
        body:JSON.stringify({ model, temperature:0.2, max_tokens:350, messages:[
          { role:'system', content:system },
          { role:'user', content:`MATCH DATA (synthetic):\n${JSON.stringify(matchData)}\n\nQUESTION: ${question}` }
        ] }),
        signal:AbortSignal.timeout(25000)
      });
      if (!response.ok) return send(res, 502, { error:'The configured Foundry model did not return an answer. The local answer remains available.' });
      const result = await response.json();
      const answer = result.choices?.[0]?.message?.content;
      if (typeof answer !== 'string' || !answer.trim()) return send(res, 502, { error:'The configured model returned an empty answer.' });
      return send(res, 200, { answer:answer.trim(), engine:'Microsoft Foundry' });
    } catch {
      return send(res, 502, { error:'The configured Foundry model could not be reached. The local answer remains available.' });
    }
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error:'Method not allowed.' });
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return send(res, 400, 'Invalid path.','text/plain; charset=utf-8'); }
  const requested = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (requested !== root && !requested.startsWith(root + sep)) return send(res, 403, 'Forbidden.','text/plain; charset=utf-8');
  if (requested.split(sep).some(part=>part.startsWith('.'))) return send(res, 404, 'Not found.','text/plain; charset=utf-8');
  try {
    if (!(await stat(requested)).isFile()) return send(res, 404, 'Not found.','text/plain; charset=utf-8');
    const content = await readFile(requested);
    res.writeHead(200, { 'Content-Type':mime[extname(requested)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff' });
    return req.method === 'HEAD' ? res.end() : res.end(content);
  } catch { return send(res, 404, 'Not found.','text/plain; charset=utf-8'); }
});

const port = Number(process.env.PORT || 8000);
// Keep local development private by default; container platforms need a public
// interface inside the isolated container so their ingress can reach it.
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
server.listen(port, host, () => {
  console.log(`Neural Ninjas listening at http://${host}:${port}`);
  console.log(`Microsoft Foundry: ${foundryConfigured ? 'configured' : 'not configured (local fallback active)'}`);
});
