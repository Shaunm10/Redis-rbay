import { sessionKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionKey(id));

	// determine if this is an empty object and there is no user hash
	if (!Object.keys(session).length) {
		// if we don't have an properties, return null to signify there is no session
		return null;
	}

	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
	return await client.hSet(sessionKey(session.id), serialize(session));
};

const deserialize = (id: string, session: { [key: string]: string }) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	};
};

const serialize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};
