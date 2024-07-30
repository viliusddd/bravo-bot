# Bravo! Bot 🎉

It's a dynamic Discord bot powered by a REST API that celebrates user achievements by sending personalized congratulatory messages and celebratory GIFs whenever a sprint is completed. It integrates with a database to fetch random messages and store metadata, ensuring a lively and engaging recognition system on any Discord server.

- [Bravo! Bot 🎉](#bravo-bot-)
  - [Features](#features)
  - [Discord Setup](#discord-setup)
  - [Project Setup](#project-setup)
  - [Examples](#examples)
    - [Messages](#messages)
    - [CRUD Sprints (praises | templates | users | emojis)](#crud-sprints-praises--templates--users--emojis)
  - [Link to Peer-programming exercise repository](#link-to-peer-programming-exercise-repository)

## Features

- DB is seeded with data.
- GH Action for linting, testing and build.

## Discord Setup

1.  Create new Application at https://discord.com/developers/applications
2.  Go to your newly created application -\> OAuth2 -\> `Reset Secret` to get new token.
3.  Copy & rename `.env.example` to `.env`
4.  Paste yur app token to the `.env` and fill in the rest of the variables.
5.  Enable `GUILD_MEMBERS` intent:
    - Ensure your bot has the GUILD_MEMBERS intent enabled in the Discord Developer Portal and in your code.

## Project Setup

1.  Clone repo, `cd` and run `npm i` at project root dir.
2.  Create copy of `.env.example` and rename it to `.env`
3.  Add correct values to `.env`
4.  Seed example data to database and update types (optionally):

```sh
npm run migrate:latest
npm run gen:types
```

## Examples

### Messages

<details open>

<summary>Post new message</summary>

```sh
curl -Xs POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{"username": "vjuodz", "sprintCode": "WD-1.3.4"}' | jq
```

</details>

<details open>

<summary>Get All messages</summary>

```sh
curl -s http://localhost:3000/messages | jq
```

</details>

<details>

<summary>Get particular message</summary>

```sh
curl -s http://localhost:3000/messages/1 | jq
```

</details>

<details>

<summary>Get messages by username</summary>

```sh
curl -s http://localhost:3000/messages?username=vjuodz | jq
```

</details>

<details>

<summary>Get messages by sprintCode</summary>

```sh
curl -s http://localhost:3000/messages?sprintCode=WD-1.2.5 | jq
```

</details>

<details>

<summary>Delete message</summary>

```sh
curl -sX DELETE http://localhost:3000/messages/1 | jq
```

</details>

### CRUD Sprints (praises | templates | users | emojis)

> Replace `sprints` with any of praises, templates, users, emojis

<details>

<summary>Get all sprints</summary>

```sh
curl -s http://localhost:3000/sprints | jq
```

</details>

<details>

<summary>Get single sprint</summary>

```sh
curl -s http://localhost:3000/sprints/1 | jq
```

</details>

<details>

<summary>Update sprint</summary>

```sh
curl -sX PATCH http://localhost:3000/sprints/1 \
  -H 'Content-Type: application/json' \
  -d '{"sprintCode": "WD-1.2.9", "sprintTitle": "Foo"}' | jq
```

</details>

<details>

<summary>Delete sprint</summary>

```sh
curl -sX DELETE http://localhost:3000/sprints/1 | jq
```

</details>

## Link to Peer-programming exercise repository

- https://github.com/viliusddd/3.2.4
