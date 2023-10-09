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
			name: { type: SchemaFieldTypes.TEXT },
			description: { type: SchemaFieldTypes.TEXT }
		},
		{
			ON: 'HASH',
			PREFIX: itemsKey('')
		}
	);
};
