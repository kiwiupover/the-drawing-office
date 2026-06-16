import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'seo',
	title: 'SEO',
	type: 'object',
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: 'title',
			title: 'Title override',
			type: 'string',
			description:
				'Optional. Overrides the page <title> and og:title. Aim for ≤60 characters — Google truncates around 580px in search results, and the title is published verbatim (no truncation in code).',
			validation: (Rule) =>
				Rule.max(60).warning(
					'Keep titles ≤60 characters. Google truncates after ~60 and the title is published as written.'
				)
		}),
		defineField({
			name: 'description',
			title: 'Description override',
			type: 'text',
			rows: 3,
			description:
				'Optional. Overrides the meta description and og:description. ≤125 reads best in social previews; ≤155 keeps search results untruncated.',
			validation: (Rule) =>
				Rule.max(155).warning(
					'Keep descriptions ≤155 characters for search results, and ≤125 to avoid truncation in social previews.'
				)
		}),
		defineField({
			name: 'image',
			title: 'Social share image',
			type: 'image',
			description:
				'Optional. 1200×630 reads best. For project pages, leave blank to use the first gallery image automatically.',
			options: { hotspot: true },
			fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
		})
	]
});
