import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const TO = 'info@thedrawingoffice.com';
const DEFAULT_FROM = 'The Drawing Office <contact@thedrawingoffice.com>';

/** @type {Resend | null} */
let resend = null;

function getClient() {
	const key = env.RESEND_API_KEY;
	if (!key) {
		throw new Error('RESEND_API_KEY is not set');
	}
	if (!resend) resend = new Resend(key);
	return resend;
}

if (!env.RESEND_API_KEY) {
	console.warn('[email] RESEND_API_KEY is not set — contact form sends will fail at runtime');
}

/**
 * @param {{ name: string; email: string; message: string }} payload
 */
export async function sendContactEmail({ name, email, message }) {
	const client = getClient();
	const from = env.RESEND_FROM || DEFAULT_FROM;
	const subject = `New contact form submission from ${name}`;
	const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;
	const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p style="white-space: pre-wrap">${escapeHtml(message)}</p>`;
	const { data, error } = await client.emails.send({
		from,
		to: TO,
		replyTo: email,
		subject,
		text,
		html
	});
	if (error) throw error;
	return data;
}

/** @param {string} s */
function escapeHtml(s) {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
