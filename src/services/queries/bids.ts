import { bidHistoryKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon';


export const createBid = async (attrs: CreateBidAttrs) => {

	// convert to a version that we can store in Redis
	const serializedValue = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

	// add this to the linked list on the right side with the ID
	return await client.rPush(bidHistoryKey(attrs.itemId), serializedValue);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {

	// create the key for this item
	const key = bidHistoryKey(itemId);

	// get a list of all the values from this key with the start index, and number to pull back.
	const listValues = await client.lRange(key, offset, count);

	// if we don't have values
	if (listValues.length === 0) {
		// return an empty list
		return [];
	}

	const bids = listValues.map(x => deserialize(x));

	return bids;
};


const serializeHistory = (amount: number, createdAt: number) => {
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