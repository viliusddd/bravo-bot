# Bravo! Bot

It's a dynamic Discord bot powered by a REST API that celebrates user achievements by sending personalized congratulatory messages and celebratory GIFs whenever a sprint is completed. It integrates with a database to fetch random messages and store metadata, ensuring a lively and engaging recognition system on any Discord server.

## Features

- DB is seeded with data.
- GH Action for linting, testing and build.

## Discord Setup

1. Enable `GUILD_MEMBERS` intent:
   1. Ensure your bot has the GUILD_MEMBERS intent enabled in the Discord Developer Portal and in your code.

## Project Setup

1. Clone repo, `cd` and run `npm i` at project root dir.
2. Create copy of `.env.example` and rename it to `.env`
3. Add correct values to `.env`
4. Seed example data to database and update types (optionally):

```sh
npm run migrate:latest
npm run gen:types
```

## Test functionality

1. Use `POST` metod with `/messages` endpoint for `http://localhost:3000/messages`, use following as body:

```json
{
  "username": "vjuodz",
  "sprintCode": "WD-1.4.4"
}
```

## Link to Peer-programming exercise repository

- https://github.com/viliusddd/3.2.4
