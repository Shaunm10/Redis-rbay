import type { CreateItemAttrs } from '$services/types';

/**
 * Get's single item.
 * @param id The Id of the item.
 */
export const getItem = async (id: string) => { };

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
export const createItem = async (attrs: CreateItemAttrs, userId: string) => { };
