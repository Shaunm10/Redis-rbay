/** Key generated to save an html page. */
export const pageCacheKey = (route: string) => `pagecache#${route}`;

/** Key generated to save a user's has */
export const userKey = (usersId: string) => `users#${usersId}`;

export const sessionKey = (sessionId: string) => `sessions#${sessionId}`;

export const itemsKey = (itemId: string) => `items#${itemId}`;

export const userNameUniqueKey = () => 'userNames:unique';