[![Lint & Test](https://github.com/viliusddd/bravo-bot/actions/workflows/deploy.yaml/badge.svg)](https://github.com/viliusddd/bravo-bot/actions/workflows/deploy.yaml)

# Bravo! Bot 🎉

<img align=right src="src/assets/discord-message.gif" width="40%"/>

It's a dynamic Discord bot powered by a REST API that celebrates user achievements by sending personalized congratulatory messages and celebratory GIFs whenever a sprint is completed. It integrates with a database to fetch random messages and store metadata, ensuring a lively and engaging recognition system on any Discord server.

- [Bravo! Bot 🎉](#bravo-bot-)
  - [Features](#features)
  - [TL;DR SETUP](#tldr-setup)
  - [Discord Setup](#discord-setup)
  - [Examples](#examples)
    - [Messages](#messages)
    - [CRUD Sprints (praises | templates | users | emojis)](#crud-sprints-praises--templates--users--emojis)

## Features

- DB is seeded with data.
- GH Action for linting and testing.

## TL;DR SETUP

1. Join test server https://discord.gg/vAxt2mvsNe
2. Clone repo, setup and run app:

```sh
   git clone git@github.com:viliusddd/bravo-bot.git && \
   cd bravo-bot && \
   cp .env.example .env && \
   npm i && \
   npm run migrate:latest && \
   npm run dev
```

> [!IMPORTANT]
> It appears that discord know when token is exposed in public github repo and resets it, even if it's a throw-away token.

3. Execute cUrl POST in cli (or any other cmd from [Examples](#examples)):

```sh
curl -sX POST http://localhost:3000/messages \
  -H 'Content-Type: application/json' \
  -d '{"username": "vjuodz", "sprintCode": "WD-1.3.4"}' | jq
```

4. Voila! Check message at discord server.

## Discord Setup

1.  Create a copy of `.env.example` and rename it to `.env`
2.  Fill-in `DISCORD_SERVER_ID`, `DISCORD_CHANNEL_ID` variables.
3.  Get giphy api key from [here](https://developers.giphy.com/dashboard/?create=true)
4.  Create new Discord bot Application at https://discord.com/developers/applications
5.  On the left-side meniu go to `Bot` and:
    1.  enable `SERVER MEMBERS INTENT`
    2.  enable `MESSAGE CONTENT INTENT`
    3.  press `Reset Token`, then add it to `.env`, `DISCORD_TOKEN`
6.  On the left-side menu, go to `OAuth` and, under `OAuth2 URL Generator`:
    1.  choose `bot`
    2.  choose `applications.commands`
    3.  at the bottom, under `GENERATED URL` press copy (it should look similar to `https://discord.com/oauth2/authorize?client_id=1267831555741581382&permissions=0&integration_type=0&scope=bot`)
    4.  paste copied url at you internet browser, choose channel you want your bot to reside.
7.  Paste yur app token to the `.env` and fill in the rest of the variables.

## Examples

### Messages

<details open>

<summary>Post new message</summary>

```sh
curl -sX POST http://localhost:3000/messages \
  -H 'Content-Type: application/json' \
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
