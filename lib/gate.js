/**
 * Shared gate helpers, used by middleware.js (edge) and api/verify.js (node).
 * Uses Web Crypto, available in both runtimes. Contains no secrets.
 */
import { GATES, SESSION_HOURS } from '../gates.config.js';

// Longest configured path that contains `pathname`, or null.
export function findGate(pathname) {
  let best = null;
  for (const g of GATES) {
    const p = g.path.replace(/\/+$/, '');
    if ((pathname === p || pathname.startsWith(p + '/')) && (!best || p.length > best.path.length)) {
      best = { ...g, path: p };
    }
  }
  return best;
}

export function findGateByKey(key) {
  const g = GATES.find((x) => x.key === key);
  return g ? { ...g, path: g.path.replace(/\/+$/, '') } : null;
}

// One cookie per gate, so one password never opens another folder.
export function cookieName(gate) {
  return 'gate_' + gate.path.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Cookie value: "<expiry-unix-seconds>.<hmac(path|expiry)>"
export async function makeToken(gate, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600;
  return { value: `${exp}.${await hmacHex(secret, `${gate.path}|${exp}`)}`, maxAge: SESSION_HOURS * 3600 };
}

export async function checkToken(gate, secret, value) {
  if (!secret || !value) return false;
  const [expStr, sig] = value.split('.');
  const exp = Number(expStr);
  if (!Number.isInteger(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, await hmacHex(secret, `${gate.path}|${exp}`));
}

export function readCookie(header, name) {
  for (const part of (header || '').split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

// Constant-time password compare (hash first so lengths always match).
export async function passwordMatches(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string' || !expected) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([given, expected].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))));
  return safeEqual([...new Uint8Array(a)].join(','), [...new Uint8Array(b)].join(','));
}
