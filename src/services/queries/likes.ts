import { userLikesKey } from "$services/keys";
import { client } from "$services/redis";

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
    await client.sAdd(userLikesKey(userId), itemId);
};

/** Removes a liked item for a user. */
export const unlikeItem = async (itemId: string, userId: string) => {

    // Remove's the itemId to a user's set list.
    await client.sRem(userLikesKey(userId), itemId);
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => { };
