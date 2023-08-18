import 'dotenv/config';
import { client } from '../src/services/redis';

const runBasicCommands = async () => {
	await client.hSet('car', {
		color: 'red',
		year: 1950
	});

	const car = await client.hGetAll('car');
	console.log(car);
	console.log(await client.PING());
};

const runPipelineBatchCommands = async () => {
	// first create 3 different hashsets to fetch
	await client.hSet('car1', {
		color: 'red',
		year: 1950
	});
	await client.hSet('car2', {
		color: 'green',
		year: 1955
	});
	await client.hSet('car3', {
		color: 'blue',
		year: 1960
	});

	// now get them all at once.
	const results = await Promise.all([
		client.hGetAll('car1'),
		client.hGetAll('car2'),
		client.hGetAll('car3')
	]);

	console.log(results);
};
runPipelineBatchCommands();
//runBasicCommands();
