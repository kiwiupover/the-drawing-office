import { defineField, defineType } from 'sanity';
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list';

export default defineType({
	name: 'project',
	title: 'Project',
	type: 'document',
	groups: [
		{ name: 'content', title: 'Content', default: true },
		{ name: 'seo', title: 'SEO' }
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			group: 'content',
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			group: 'content',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required()
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			group: 'content'
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			group: 'content',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
				}
			]
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			group: 'seo'
		}),
		orderRankField({ type: 'project' })
	],
	orderings: [orderRankOrdering],
	preview: {
		select: { title: 'title', media: 'gallery.0' }
	}
});
