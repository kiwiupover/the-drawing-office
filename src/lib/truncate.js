export function truncate(text, max = 155) {
	if (!text) return '';
	const s = String(text).trim();
	if (s.length <= max) return s;
	const cut = s.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(' ');
	const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
	return base.replace(/[\s,.;:\-—]+$/, '') + '…';
}
