import { userKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	// get the user hash via the userId key.
	const user = await client.hGetAll(userKey(id));

	// map it to an object to be used down stream.
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	// generate a new key for this user.
	const newUserKey = genId();

	// TODO: verify username is unique

	// store the set for this user given the new key.
	// NOTE the password is already salt'ed
	await client.hSet(userKey(newUserKey), serialize(attrs));

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
