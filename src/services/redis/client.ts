import { itemsByViewKey, itemsKey, itemsViewsKey } from '$services/keys';
import { createClient, defineScript } from 'redis';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
				return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
			`,
			transformArguments(key: string, value: number) {
				return [key, value.toString()];
			},
			transformReply(reply: any) {
				return reply;
			}
		}),
		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
				-- get the keys
				local itemsViewsKey = KEYS[1]
				local itemsKey = KEYS[2]
				local itemsByView = KEYS[3]

				-- get the parameters
				local itemId = ARGV[1]
				local userId = ARGV[2]

				-- insert the view into the hyperloglog
				local inserted = redis.call('PFADD',itemsViewsKey, userId)
				
				-- if it was inserted
				if inserted == 1 then
					-- update the hash by incrementing by 1.
					redis.call('HINCRBY',itemsKey,'views',1)

					-- increment the sorted set
					redis.call('ZINCRBY', itemsViewsKey, 1, itemId)
				end
			`,
			transformArguments(itemId: string, userId: string) {
				/* will evaluate to:
					EVALSHA <ID> 3 items:view#{ItemId} items#{itemId} items:views#{itemId} {itemId} {userId}
				*/
				return [itemsViewsKey(itemId), itemsKey(itemId), itemsByViewKey(), itemId, userId];
			},
			transformReply() {}
		})
	}
});

client.on('connect', async () => {
	await client.addOneAndStore('books:count', 5);
	const result = await client.get('books:count');
	console.log(`result is: ${result}`);
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
