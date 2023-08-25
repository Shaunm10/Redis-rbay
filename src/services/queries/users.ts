import { userKey, userLikesKey, userNameUniqueKey, usernamesKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { attr } from 'svelte/internal';

export const getUserByUsername = async (username: string) => {
	// use the username arg to look up the person's (numeric)UserId to get the Hash
	const numericId = await client.zScore(usernamesKey(), username);

	// make sure we actually got an ID from the lookup
	if (!numericId) {
		throw new Error('User does not exist');
	}

	// take the numeric Id and convert it back to hex
	const userId = numericId.toString(16);

	// use the id to look up the user's hash
	const user = await client.hGetAll(userKey(userId));

	// deserialize and return the hash
	return deserialize(userId, user);
};

export const getUserById = async (id: string) => {
	// get the user hash via the userId key.
	const user = await client.hGetAll(userKey(id));

	// map it to an object to be used down stream.
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	// generate a new key for this user.
	const newUserKey = genId();

	// See if this user name is already taken.
	const exists = await client.sIsMember(userNameUniqueKey(), attrs.username);
	// if it is throw an error
	if (exists) {
		throw new Error(`'${attrs.username}' is already taken.  Please try a different name.`);
	}
	// otherwise allow it to be created.

	// store the set for this user given the new key.
	// NOTE the password is already salt'ed
	await client.hSet(userKey(newUserKey), serialize(attrs));

	// also add the name to the unique name list.
	await client.sAdd(userNameUniqueKey(), attrs.username);

	// finally save the username in a sorted set with their Id
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(newUserKey, 16) // this require a number not a string
	});

	return newUserKey;
};

/**
 * Helper function that will take care of altering or removing attributes before sending to Redis
 * */
const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return { username: user.username, password: user.password, id: id };
};
