import { itemsKey, userLikesKey } from "$services/keys";
import { client } from "$services/redis";

const likes = 'likes';
/** If a user has liked a particular item. */
export const userLikesItem = async (itemId: string, userId: string) => {
    // we are seeing if this item's Id is in their liked Set to determine if they like it.
    const isItemLiked = await client.sIsMember(userLikesKey(userId), itemId);
    return isItemLiked;
};

export const likedItems = async (userId: string) => { };

/** Adds a liked item for a user. */
export const likeItem = async (itemId: string, userId: string) => {

    // Add's the itemId to a user's set list.
    const isValueInserted = await client.sAdd(userLikesKey(userId), itemId);

    // also increment the product's like count.
    if (isValueInserted) {
        return client.hIncrBy(itemsKey(itemId), likes, 1);
    }
};

/** Removes a liked item for a user. */
export const unlikeItem = async (itemId: string, userId: string) => {

    // Remove's the itemId to a user's set list.
    const removed = await client.sRem(userLikesKey(userId), itemId);

    // also decrement the product's like count.
    if (removed) {
        return client.hIncrBy(itemsKey(itemId), likes, -1);
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => { };
