import { userKey, userNameUniqueKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { attr } from 'svelte/internal';

export const getUserByUsername = async (username: string) => { };

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
		throw new Error(`'${attrs.username}' is already taken.  Please try a different name.`)
	}
	// otherwise allow it to be created.

	// store the set for this user given the new key.
	// NOTE the password is already salt'ed
	await client.hSet(userKey(newUserKey), serialize(attrs));

	// also add the name to the unique name list.
	await client.sAdd(userNameUniqueKey(), attrs.username);

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
