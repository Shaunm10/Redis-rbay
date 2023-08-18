import { itemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { deserialize } from './deserialize';
import { serialize } from './serialize';

/**
 * Get's single item.
 * @param id The Id of the item.
 */
export const getItem = async (id: string) => {
	const itemFromRedis = await client.hGetAll(itemsKey(id));

	// protect against Redis returning a new object
	if (Object.keys(itemFromRedis).length === 0) {
		return null;
	}

	const viewModel = deserialize(id, itemFromRedis);

	return viewModel;
};

/**
 * Gets multiple Items
 * @param ids the Id's of the items to retrieve.
 */
export const getItems = async (ids: string[]) => {
	// create a command from each Id, not awaited.
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});

	// await all in parallel
	var results = await Promise.all(commands);

	const returnResults = [];

	results.forEach((redisItem, i) => {
		// check to see if this object has keys.
		if (Object.keys(redisItem).length !== 0) {
			// deserialize the item
			const deserializedItem = deserialize(ids[i], redisItem);

			// add it to the list.
			returnResults.push(deserialize);
		}
	});

	return returnResults;
};

/**
 * Creates a brand new item.
 * @param attrs the data about the item
 * @param userId The user's Id who is creating the item
 */
export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const Id = genId();

	// map it to Redis friendly object.
	const createdItem = serialize(attrs);

	await client.hSet(itemsKey(Id), createdItem);

	return Id;
};
