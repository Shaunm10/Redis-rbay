import { userLikesKey } from "$services/keys";
import { client } from "$services/redis";

export const userLikesItem = async (itemId: string, userId: string) => { };

export const likedItems = async (userId: string) => { };

/** Adds a liked item for a user. */
export const likeItem = async (itemId: string, userId: string) => {

    //userLikesKey(userId)
    //client.sInter
};

export const unlikeItem = async (itemId: string, userId: string) => { };

export const commonLikedItems = async (userOneId: string, userTwoId: string) => { };
