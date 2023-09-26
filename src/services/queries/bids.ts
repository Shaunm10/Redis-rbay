import { bidHistoryKey, itemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateBidAttrs, Bid, CreateItemAttrs } from '$services/types';
import { DateTime } from 'luxon';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	// this will create a client connection to participate in a transaction.
	return client.executeIsolated(async (isolatedClient) => {
		// create a "WATCH" for this item's key
		await isolatedClient.watch(itemsKey(attrs.itemId));

		const item = await getItem(attrs.itemId);

		if (!item) {
			throw new Error('Item does not exist');
		}

		if (item.price >= attrs.amount) {
			throw new Error('Bid price too low.');
		}

		if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
			throw new Error('Item closed to bidding.');
		}

		// convert to a version that we can store in Redis
		const serializedValue = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

		// updating certain properties on the bid
		const itemPartial: Partial<CreateItemAttrs> = {
			bids: item.bids + 1,
			price: attrs.amount,
			highestBidUserId: attrs.userId
		};

		// note this new from, instead of Promise.all(), we can chain these.
		return isolatedClient
			.multi()
			.rPush(bidHistoryKey(attrs.itemId), serializedValue) // add this to the linked list on the right side with the ID
			.hSet(itemsKey(item.id), itemPartial as {}) // update data about this item
			.exec();
	});
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	// create the key for this item
	const key = bidHistoryKey(itemId);

	const startIndex = -1 * offset - count;

	const endIndex = -1 - offset;
	// get a list of all the values from this key with the start index, and number to pull back.
	const listValues = await client.lRange(key, startIndex, endIndex);

	// if we don't have values
	if (listValues.length === 0) {
		// return an empty list
		return [];
	}

	const bids = listValues.map((bid) => deserializeHistory(bid));

	return bids;
};

const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (value: string) => {
	// sanity check, if the value doesn't have a single ':',
	// than fail fast.
	if (value.indexOf(':') === -1) {
		// empty object basically.
		return { amount: 0, createdAt: DateTime.now() };
	}

	const [amount, createdAt] = value.split(':');

	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(parseInt(createdAt))
	};
};
