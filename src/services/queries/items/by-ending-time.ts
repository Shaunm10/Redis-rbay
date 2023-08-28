import { client } from '$services/redis';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	//const itemIds = await client.zRange(itemsByEndingAtKey,)
};
