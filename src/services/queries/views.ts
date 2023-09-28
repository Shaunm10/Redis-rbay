import { itemsByViewKey, itemsKey, itemsViewsKey } from '$services/keys';
import { client } from '$services/redis';

const views = 'views';

const incrementView_Original = async (itemId: string, userId: string) => {
	const itemWasInserted = await client.pfAdd(itemsViewsKey(itemId), userId);

	if (itemWasInserted) {
		// do both actions in parallel
		await Promise.all([
			// update the hash set view count.
			client.hIncrBy(itemsKey(itemId), views, 1),

			// update the sorted set's view.
			client.zIncrBy(itemsByViewKey(), 1, itemId)
		]);
	}
};

export const incrementView = async (itemId: string, userId: string) => {
	client.incrementView(itemId, userId);
};
