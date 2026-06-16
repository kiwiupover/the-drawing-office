export const ARCHITECT_HINT =
	'Note: Matt is an Architectural Designer, not a registered Architect — the title "Architect" is protected in New Zealand by the NZRAB. Always use "Architectural Designer" (or "architectural designers" plural). "Architecture" and "architectural" are fine.';

export function avoidArchitectMention(value: unknown): true | string {
	if (typeof value !== 'string' || !value) return true;
	if (/\bArchitects?\b/i.test(value)) {
		return 'Replace "Architect" with "Architectural Designer". The title "Architect" is protected by NZ law and Matt is not registered with the NZRAB.';
	}
	return true;
}
