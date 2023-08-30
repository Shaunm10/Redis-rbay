import { itemsByEndingAtKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	//const itemIds = await client.zRange(itemsByEndingAtKey,)

	// retrieving items that are ending soon
	const ids = await client.zRange(itemsByEndingAtKey(), Date.now(), '+inf', {
		BY: 'SCORE',
		LIMIT: { count, offset }
	});

	const results = await Promise.all(ids.map((id) => client.hGetAll(itemsKey(id))));

	console.log(results);

	return results.map((item, index) => deserialize(ids[index], item));
};
