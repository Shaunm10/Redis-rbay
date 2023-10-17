import { itemsIndexKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const searchItems = async (term: string, size: number = 5) => {
	if (!term) {
		return [];
	}
	// gets executed when user types in search textbox.
	const cleaned = term
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.trim()
		.split(' ')
		.map((word) => (word ? `%${word}%` : ''))
		.join('');

	// Look at cleaned and make sure it is valid
	if (cleaned === '') {
		return [];
	}

	// giving 5 times more weight to the name attribute
	const query = `(@name:(${cleaned}) => {$weight: 5.0}) |(@description:(${cleaned}))`;

	// use the client to do an actual search
	const results = await client.ft.search(itemsIndexKey(), query, {
		LIMIT: {
			from: 0,
			size
		}
	});

	// Deserialize and return the search results
	return results.documents.map(({ id, value }) => deserialize(id, value as any));
};
