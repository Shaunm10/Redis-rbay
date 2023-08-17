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
export const getItems = async (ids: string[]) => { };

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
