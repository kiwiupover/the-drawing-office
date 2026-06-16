import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';
import { env } from '$env/dynamic/private';

const apiVersion = '2026-06-01';

type ImageBuilder = ReturnType<typeof imageUrlBuilder>;
type ImageSource = Parameters<ImageBuilder['image']>[0];

let _client: SanityClient | null = null;
let _builder: ImageBuilder | null = null;

function client(): SanityClient {
	if (!_client) {
		if (!PUBLIC_SANITY_PROJECT_ID) {
			throw new Error(
				'Sanity client unavailable: set PUBLIC_SANITY_PROJECT_ID in your environment.'
			);
		}
		const token = env.SANITY_READ_TOKEN || env.SANITY_WRITE_TOKEN;
		_client = createClient({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET || 'production',
			apiVersion,
			useCdn: !token,
			perspective: 'published',
			token: token || undefined
		});
	}
	return _client;
}

export const sanity = {
	fetch<T = unknown>(query: string, params?: Record<string, string | number | boolean>): Promise<T> {
		return params ? client().fetch<T>(query, params) : client().fetch<T>(query);
	}
};

export function urlFor(source: ImageSource) {
	if (!_builder) _builder = imageUrlBuilder(client());
	return _builder.image(source);
}
