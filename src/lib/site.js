export const SITE_URL = 'https://www.thedrawingoffice.com';
export const SITE_NAME = 'The Drawing Office';
export const SITE_TAGLINE = 'Architectural Design Studio, Auckland NZ';
export const SITE_DESCRIPTION =
	'Architectural design studio in Browns Bay, Auckland. A selected portfolio of residential and commercial projects by The Drawing Office.';

export const BUSINESS = {
	name: 'The Drawing Office Ltd',
	addressLocality: 'Browns Bay',
	addressRegion: 'Auckland',
	postalCode: '',
	addressCountry: 'NZ',
	telephone: '+64 9 970 9515',
	email: 'info@thedrawingoffice.com',
	geo: { latitude: -36.7186, longitude: 174.7488 },
	areaServed: ['Auckland', 'Northland', 'Waikato', 'Bay of Plenty', 'New Zealand'],
	sameAs: []
};

export const DEFAULT_OG_IMAGE = '/og-default.jpg';

export function absUrl(path = '/') {
	if (!path) return SITE_URL;
	if (/^https?:\/\//i.test(path)) return path;
	return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
