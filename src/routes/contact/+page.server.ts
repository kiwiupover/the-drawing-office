import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/email';
import { checkRateLimit } from '$lib/server/ratelimit';
import { sanity } from '$lib/sanity';
import { siteContentQuery } from '$lib/queries';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

type RawSiteContent = { contactIntro?: string } | null;

export const load: PageServerLoad = async () => {
	const content = await sanity.fetch<RawSiteContent>(siteContentQuery);
	return {
		contactIntro: content?.contactIntro ?? ''
	};
};

function validate({ name, email, message }: { name: string; email: string; message: string }) {
	const errors: Record<string, string> = {};
	if (name.length < 1 || name.length > 100) errors.name = 'required';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'invalid';
	if (message.length < 10 || message.length > 5000) errors.message = 'required';
	return errors;
}

export const actions: Actions = {
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
