import { json } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';
import { checkRateLimit } from '$lib/server/ratelimit';

export async function POST({ request, getClientAddress }) {
	const ip = getClientAddress();
	if (!checkRateLimit(ip)) {
		return json({ ok: false, error: 'rate_limited' }, { status: 429 });
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ ok: false, error: 'invalid_json' }, { status: 400 });
	}

	const name = String(body?.name ?? '').trim();
	const email = String(body?.email ?? '').trim();
	const message = String(body?.message ?? '').trim();
	const honeypot = String(body?.company ?? '');

	if (honeypot) return json({ ok: true });

	/** @type {Record<string, string>} */
	const errors = {};
	if (name.length < 1 || name.length > 100) errors.name = 'required';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'invalid';
	if (message.length < 10 || message.length > 5000) errors.message = 'required';
	if (Object.keys(errors).length) {
		return json({ ok: false, error: 'invalid', errors }, { status: 400 });
	}

	try {
		await sendContactEmail({ name, email, message });
		return json({ ok: true });
	} catch (e) {
		console.error('contact api error', e);
		return json({ ok: false, error: 'send_failed' }, { status: 500 });
	}
}
