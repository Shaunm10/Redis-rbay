import { itemsIndexKey, itemsKey } from '$services/keys';
import { SchemaFieldTypes } from 'redis';
import { client } from './client';

export const createIndexes = async () => {
	const indexesInDatabase = await client.ft._list();

	const exists = indexesInDatabase.find((index) => index === itemsIndexKey());

	if (exists) {
		return;
	}

	// creates the index.
	return client.ft.CREATE(
		itemsIndexKey(),
		{
			name: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			description: { type: SchemaFieldTypes.TEXT, SORTABLE: false },
			ownerId: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			endingAt: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			bids: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			views: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			price: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			likes: { type: SchemaFieldTypes.TEXT, SORTABLE: true }
		} as any,
		{
			ON: 'HASH',
			PREFIX: itemsKey('')
		}
	);
};
