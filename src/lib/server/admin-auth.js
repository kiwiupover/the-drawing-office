import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';

export const SESSION_COOKIE = 'do_admin_session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

if (!env.ADMIN_PASSWORD) {
	console.warn('[admin-auth] ADMIN_PASSWORD is not set — /studio login will always fail');
}
if (!env.ADMIN_SESSION_SECRET) {
	console.warn('[admin-auth] ADMIN_SESSION_SECRET is not set — session tokens will be rejected');
}

/**
 * @param {string} password
 * @returns {boolean}
 */
export function verifyPassword(password) {
	const expected = env.ADMIN_PASSWORD;
	if (!expected) return false;
	const a = Buffer.from(password, 'utf8');
	const b = Buffer.from(expected, 'utf8');
	if (a.length !== b.length) {
		const pad = Buffer.alloc(b.length);
		timingSafeEqual(pad, b);
		return false;
	}
	return timingSafeEqual(a, b);
}

/** @param {string} input */
function sign(input) {
	const secret = env.ADMIN_SESSION_SECRET;
	if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
	return createHmac('sha256', secret).update(input).digest('base64url');
}

/**
 * @returns {{ token: string; expiresAt: Date }}
 */
export function createSessionToken() {
	const exp = Date.now() + SESSION_TTL_MS;
	const payload = Buffer.from(JSON.stringify({ exp }), 'utf8').toString('base64url');
	const sig = sign(payload);
	return {
		token: `${payload}.${sig}`,
		expiresAt: new Date(exp)
	};
}

/**
 * @param {string | undefined | null} token
 * @returns {boolean}
 */
export function verifySessionToken(token) {
	if (!token) return false;
	const secret = env.ADMIN_SESSION_SECRET;
	if (!secret) return false;
	const parts = token.split('.');
	if (parts.length !== 2) return false;
	const [payload, sig] = parts;
	let expected;
	try {
		expected = sign(payload);
	} catch {
		return false;
	}
	const a = Buffer.from(sig, 'utf8');
	const b = Buffer.from(expected, 'utf8');
	if (a.length !== b.length) return false;
	if (!timingSafeEqual(a, b)) return false;
	try {
		const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
		if (typeof decoded?.exp !== 'number') return false;
		if (Date.now() > decoded.exp) return false;
		return true;
	} catch {
		return false;
	}
}
