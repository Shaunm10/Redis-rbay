import { randomBytes } from 'crypto';
import { client } from './client';
const buildClientProxy = () => {};

export const withLock = async (key: string, cb: () => any) => {
	// initialize a few variables to control retry behavior
	const retryDelayMs = 100;
	let retries = 20;

	// Generate a random value for lock key
	const token = randomBytes(6).toString('hex');

	// create the lock key
	const lockKey = `lock:${key}`;

	// set up the while loop to keep retrying
	while (retries >= 0) {
		retries--;

		// try to do a SET NX operation
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});

		if (acquired) {
			// if the set is successful, then run the callback

			try {
				const result = await cb();
				return result;
			} finally {
				// then unset the locked set
				await client.del(lockKey);
			}
		} else {
			// else brief pause (retry)
			await pause(retryDelayMs);
			continue;
		}
	}
};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
