import { bidHistoryKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon';

export const createBid = async (attrs: CreateBidAttrs) => {
	const serializedValue = serialize(attrs.amount, attrs.createdAt.toMillis());

	return await client.rPush(bidHistoryKey(attrs.itemId), serializedValue);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const key = bidHistoryKey(itemId);

	const listValues = await client.lRange(key, offset, count);

	if (listValues.length === 0) {
		return [];
	}

	const bids = listValues.map(x => deserialize(x));

	return bids;
};


const serialize = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};


const deserialize = (value: string) => {

	// sanity check, if the value doesn't have a single ':', 
	// than fail fast.
	if (value.indexOf(':') === -1) {
		return { amount: 0, createdAt: DateTime.now() };
	}

	const [amount, createdAt] = value.split(':');

	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};