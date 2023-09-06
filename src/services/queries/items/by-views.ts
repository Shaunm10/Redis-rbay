import { itemsByViewKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const results = await client.sort(itemsByViewKey(), {
		// the projections of the sort
		GET: ['#', `${itemsKey('*')}->name`, `${itemsKey('*')}->views`],

		// how the data should be sorted in the itemsByView
		BY: 'score'
	});

	console.log(results);
};
