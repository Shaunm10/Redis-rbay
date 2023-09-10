import { bidHistoryKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon';

export const createBid = async (attrs: CreateBidAttrs) => {
	const serializedValue = serialize(attrs.amount, attrs.createdAt.toMillis());

	return await client.rPush(bidHistoryKey(attrs.itemId), serializedValue);
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	return [];
};


const serialize = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};


const deserialize = (value: string) => {

	// sanity check, if the value doesn't have a single ':', 
	// than fail fast.
	if (value.indexOf(':') === -1) {
		return '';
	}

	const [amount, createdAt] = value.split(':');

	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};