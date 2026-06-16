import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { schemaTypes } from './src/sanity/schemas';

const projectId = 'izcsyw84';
const dataset = 'production';

export default defineConfig({
	name: 'drawing-office',
	title: 'The Drawing Office',
	basePath: '/studio',
	projectId,
	dataset,
	schema: { types: schemaTypes },
	plugins: [
		structureTool({
			structure: (S, context) =>
				S.list()
					.title('Content')
					.items([
						S.listItem()
							.title('Site content')
							.child(S.document().schemaType('siteContent').documentId('siteContent')),
						S.divider(),
						orderableDocumentListDeskItem({
							type: 'project',
							title: 'Projects',
							S,
							context
						})
					])
		}),
		visionTool()
	]
});
