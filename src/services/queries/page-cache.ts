import { pageCacheKey } from "$services/keys";
import { client } from "$services/redis";

const cachedRoutes = ['/about', '/privacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string) => {
    if (cachedRoutes.includes(route)) {
        return client.get(pageCacheKey(route));
    }
    else return null;
};

export const setCachedPage = (route: string, page: string) => {
    if (cachedRoutes.includes(route)) {
        client.set(pageCacheKey(route), page, {
            EX: 2
        });
    }
};
