export const SITE_URL = 'https://thedrawingoffice.com';
export const SITE_NAME = 'The Drawing Office';
export const SITE_TAGLINE = 'Architectural Design Studio, Auckland NZ';
export const SITE_DESCRIPTION =
	'Architectural design studio in Browns Bay, Auckland. A selected portfolio of residential and commercial projects by The Drawing Office.';

export const BUSINESS = {
	name: 'The Drawing Office Ltd',
	streetAddress: '21 Sandiache Way',
	addressLocality: 'Browns Bay',
	addressRegion: 'Auckland',
	postalCode: '',
	addressCountry: 'NZ',
	telephone: '+64 9 970 9515',
	email: 'info@thedrawingoffice.com'
};

export const DEFAULT_OG_IMAGE = '/og-default.jpg';

export function absUrl(path = '/') {
	if (!path) return SITE_URL;
	if (/^https?:\/\//i.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
