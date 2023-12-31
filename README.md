# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Redis Setup

To connect to a redis server, you will need a `.env` file in the root with the connection details.

Example:

```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PW=
```

## When a bid is added things that must occur

- Passes `Bid Validation`
- Add the bid to bid history list
- Update the # of bids the items has
- Update the item's price
- Update the item's hightestUserBidId
- Update the item's score in the item price sorted set

## Bid Validation

- Does the item exist?
- Is the item still open for bids?
- is the bid amount greater than the exiting highest bid?
