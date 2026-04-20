const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/** @type {Map<string, number[]>} */
const hits = new Map();

/**
 * @param {string} key
 * @returns {boolean} true when the request is allowed, false when rate-limited
 */
export function checkRateLimit(key) {
	const now = Date.now();
	const cutoff = now - WINDOW_MS;
	const recent = (hits.get(key) ?? []).filter((t) => t > cutoff);
	if (recent.length >= MAX_PER_WINDOW) {
		hits.set(key, recent);
		return false;
	}
	recent.push(now);
	hits.set(key, recent);
	return true;
}
