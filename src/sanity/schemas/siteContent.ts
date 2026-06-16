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
		})
	],
	preview: {
		prepare: () => ({ title: 'Site content' })
	}
});
