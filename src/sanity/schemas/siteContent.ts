import { defineField, defineType } from 'sanity';
import { ARCHITECT_HINT, avoidArchitectMention } from './lib/terminology';

export default defineType({
	name: 'siteContent',
	title: 'Site content',
	type: 'document',
	fields: [
		defineField({
			name: 'homeIntro',
			title: 'Home intro',
			type: 'text',
			rows: 4,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'about',
			title: 'About',
			type: 'text',
			rows: 12,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'contactIntro',
			title: 'Contact intro',
			type: 'text',
			rows: 4,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'servicesIntro',
			title: 'Services intro',
			type: 'text',
			rows: 4,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'services',
			title: 'Services',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							title: 'Title',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'body',
							title: 'Body',
							type: 'text',
							rows: 4,
							description: ARCHITECT_HINT,
							validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
						}),
						defineField({
							name: 'image',
							title: 'Image',
							type: 'image',
							options: { hotspot: true },
							description:
								'A photo illustrating this service. Falls back to a project photo if left empty.',
							fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
						})
					],
					preview: {
						select: { title: 'title', subtitle: 'body', media: 'image' }
					}
				}
			]
		}),
		defineField({
			name: 'processIntro',
			title: 'Process intro',
			type: 'text',
			rows: 4,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'processHero',
			title: 'Process hero image',
			type: 'image',
			options: { hotspot: true },
			description: 'Lead image for the Process page. Falls back to a project photo if left empty.',
			fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
		}),
		defineField({
			name: 'process',
			title: 'Process stages',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'name',
							title: 'Stage name',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'body',
							title: 'Body',
							type: 'text',
							rows: 4,
							description: ARCHITECT_HINT,
							validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
						})
					],
					preview: {
						select: { title: 'name', subtitle: 'body' }
					}
				}
			]
		}),
		defineField({
			name: 'faqIntro',
			title: 'FAQ intro',
			type: 'text',
			rows: 4,
			description: ARCHITECT_HINT,
			validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
		}),
		defineField({
			name: 'faqHero',
			title: 'FAQ hero image',
			type: 'image',
			options: { hotspot: true },
			description: 'Lead image for the FAQ page. Falls back to a project photo if left empty.',
			fields: [{ name: 'alt', title: 'Alt text', type: 'string' }]
		}),
		defineField({
			name: 'faq',
			title: 'FAQ items',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'q',
							title: 'Question',
							type: 'string',
							validation: (Rule) => Rule.required()
						}),
						defineField({
							name: 'a',
							title: 'Answer',
							type: 'text',
							rows: 4,
							description: ARCHITECT_HINT,
							validation: (Rule) => Rule.custom(avoidArchitectMention).warning()
						})
					],
					preview: {
						select: { title: 'q', subtitle: 'a' }
					}
				}
			]
		})
	],
	preview: {
		prepare: () => ({ title: 'Site content' })
	}
});
