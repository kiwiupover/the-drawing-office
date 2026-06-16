export function safeTerminology(text) {
	if (!text) return text;
	return String(text).replace(/\bArchitects?\b/gi, (match) => {
		const plural = match.toLowerCase().endsWith('s');
		const titleCase = /^[A-Z]/.test(match);
		const base = titleCase ? 'Architectural Designer' : 'architectural designer';
		return plural ? base + 's' : base;
	});
}
