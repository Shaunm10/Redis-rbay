import type { CreateItemAttrs } from '$services/types';

/**
 * Converts a View Model to an object to be stored in Redis
 * @param attrs 
 * @returns
 */
export const serialize = (attrs: CreateItemAttrs) => {

    return {
        ...attrs,
        // converting to store as milliseconds.
        createdAt: attrs.createdAt.toMillis(),
        // converting to store as milliseconds.
        endingAt: attrs.endingAt.toMillis()
    };
};
