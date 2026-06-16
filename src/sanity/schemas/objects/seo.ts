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
				'Optional. Overrides the page <title> and og:title. Leave blank to use the page default.',
			validation: (Rule) =>
				Rule.max(70).warning('Search engines truncate titles after ~70 characters.')
		}),
		defineField({
			name: 'description',
			title: 'Description override',
			type: 'text',
			rows: 3,
			description:
				'Optional. Overrides the meta description and og:description. 110–160 characters reads best in search results.',
			validation: (Rule) =>
				Rule.max(200).warning('Search engines truncate descriptions after ~160 characters.')
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
