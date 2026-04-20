import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';
import { checkRateLimit } from '$lib/server/ratelimit';

export const prerender = false;

/**
 * @param {{ name: string; email: string; message: string }} input
 */
function validate({ name, email, message }) {
	/** @type {Record<string, string>} */
	const errors = {};
	if (name.length < 1 || name.length > 100) errors.name = 'required';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'invalid';
	if (message.length < 10 || message.length > 5000) errors.message = 'required';
	return errors;
}

export const actions = {
	send: async ({ request, getClientAddress }) => {
		const ip = getClientAddress();
		if (!checkRateLimit(ip)) return fail(429, { error: 'rate_limited' });

		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const message = String(data.get('message') ?? '').trim();
		const honeypot = String(data.get('company') ?? '');

		if (honeypot) return { success: true };

		const errors = validate({ name, email, message });
		if (Object.keys(errors).length) {
			return fail(400, { errors, values: { name, email, message } });
		}

		try {
			await sendContactEmail({ name, email, message });
			return { success: true };
		} catch (e) {
			console.error('contact form error', e);
			return fail(500, { error: 'send_failed', values: { name, email, message } });
		}
	}
};
