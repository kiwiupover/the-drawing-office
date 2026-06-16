import { defineField, defineType } from 'sanity';

export default defineType({
	name: 'siteContent',
	title: 'Site content',
	type: 'document',
	fields: [
		defineField({ name: 'homeIntro', title: 'Home intro', type: 'text', rows: 4 }),
		defineField({ name: 'about', title: 'About', type: 'text', rows: 12 }),
		defineField({ name: 'contactIntro', title: 'Contact intro', type: 'text', rows: 4 })
	],
	preview: {
		prepare: () => ({ title: 'Site content' })
	}
});
