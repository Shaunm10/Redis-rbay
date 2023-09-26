/** Key generated to save an html page. */
export const pageCacheKey = (route: string) => `pagecache#${route}`;

/** Key generated to save a user's has */
export const userKey = (usersId: string) => `users#${usersId}`;

export const sessionKey = (sessionId: string) => `sessions#${sessionId}`;

export const userNameUniqueKey = () => 'userNames:unique';

export const userLikesKey = (userId: string) => `users:like#${userId}`;

export const usernamesKey = () => 'usernames';

// Item keys
export const itemsByViewKey = () => 'items:views';
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const itemsByEndingAtKey = () => `items:endingAt`;

export const itemsByPriceKey = () => 'items:price';

/**
 * The key for storing userId views by productId
 * Used in a HyperLogLog
 * @param itemId The productId
 * @returns the key
 */
export const itemsViewsKey = (itemId: string) => `items:views#${itemId}`;
export const bidHistoryKey = (itemId: string) => `history#${itemId}`;
