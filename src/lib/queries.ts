export const projectListQuery = `*[_type == "project"] | order(orderRank asc, title asc) {
	"slug": slug.current,
	title,
	description,
	"coverImage": gallery[0]
}`;

export const projectListFullQuery = `*[_type == "project"] | order(orderRank asc, title asc) {
	"slug": slug.current,
	title,
	description,
	seo,
	"images": gallery[]{ ..., asset->{ ..., metadata { dimensions } } }
}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
	"slug": slug.current,
	title,
	description,
	"images": gallery[]{ ..., asset-> }
}`;

export const siteContentQuery = `*[_type == "siteContent"][0] {
	homeIntro,
	about,
	contactIntro
}`;
