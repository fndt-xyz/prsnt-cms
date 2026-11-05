/**
 * POST /api/verify
 *   { lookupKey, code }        -> checks the password, sets a signed cookie for that folder
 *   { lookupKey, check: true } -> tells the gate page whether the visitor is already logged in
 *
 * lookupKey must be one of the keys in gates.config.js; the password is read
 * from the Vercel environment variable with that name.
 */
import { webcrypto } from 'node:crypto';
import { findGateByKey, cookieName, makeToken, checkToken, readCookie, passwordMatches } from '../lib/gate.js';

// Older Node runtimes have no global Web Crypto.
if (!globalThis.crypto) globalThis.crypto = webcrypto;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const { code, lookupKey, check } = req.body || {};
    if (!lookupKey) return res.status(400).json({ error: "No lookup key provided" });

    const secret = process.env.SESSION_SECRET;
    if (!secret) return res.status(500).json({ error: "Gate not configured" });

    // Only keys listed in gates.config.js are accepted.
    const gate = findGateByKey(String(lookupKey));
    if (!gate) return res.status(401).json({ granted: false });

    const name = cookieName(gate);

    // Already logged in?
    if (check) {
        const ok = await checkToken(gate, secret, readCookie(req.headers.cookie, name));
        return res.status(200).json({ granted: ok });
    }

    if (await passwordMatches(code, process.env[gate.key])) {
        const { value, maxAge } = await makeToken(gate, secret);
        res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
        return res.status(200).json({ granted: true });
    }

    // Small delay on a wrong password to slow down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return res.status(401).json({ granted: false });
}
