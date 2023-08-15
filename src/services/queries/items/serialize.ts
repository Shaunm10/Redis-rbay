import type { CreateItemAttrs } from '$services/types';

/**
 * Converts a View Model to an object to be stored in Redis
 * @param attrs 
 * @returns
 */
export const serialize = (attrs: CreateItemAttrs) => {

    return {
        ...attrs,
        createdAt: attrs.createdAt.toMillis(),
        endingAt: attrs.endingAt.toMillis()
    };
};
