import type { SchemaTypeDefinition } from 'sanity';
import project from './project';
import siteContent from './siteContent';
import seo from './objects/seo';

export const schemaTypes: SchemaTypeDefinition[] = [project, siteContent, seo];
