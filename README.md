<div align="left">
  <a href="https://github.com/viliusddd/bravo-bot/actions/workflows/deploy.yaml">
    <img src="https://github.com/viliusddd/bravo-bot/actions/workflows/deploy.yaml/badge.svg" alt="Lint & Test">
  </a>
  <a href="https://codecov.io/gh/viliusddd/bravo-bot">
    <img src="https://codecov.io/gh/viliusddd/bravo-bot/graph/badge.svg?token=QHATJ4FVU2" alt="codecov">
  </a>
</div><br>

# Bravo! Bot 🎉

<img align=right src="src/assets/discord-message.gif" width="40%"/>

It's a dynamic Discord bot powered by a REST API that celebrates user achievements by sending personalized congratulatory messages and celebratory GIFs whenever a sprint is completed. It integrates with a database to fetch random messages and store metadata, ensuring a lively and engaging recognition system on any Discord server.

- [Bravo! Bot 🎉](#bravo-bot-)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [TL;DR Setup](#tldr-setup)
  - [Discord Setup](#discord-setup)
  - [Examples](#examples)
    - [Messages](#messages)
    - [CRUD Sprints (praises | templates | users | emojis)](#crud-sprints-praises--templates--users--emojis)

## Features

- Congratulate a user on a configured Discord server with the GIF and a message.
- Fetch a random GIF of success from an external GIF.
- Highlight mentioned username in Discord message.
- DB is seeded with data.
- Github Workflow for linting and testing.

## Tech Stack

![TypeScript] ![SQLite] ![Zod] ![Express.js] ![Kysely] ![discord.js] ![Vitest]

[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white
[SQLite]: https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=66B0E4
[Zod]: https://img.shields.io/badge/Zod-000000?logo=Zod&logoColor=3068B7
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white
[Vitest]: https://img.shields.io/badge/-Vitest-6E9F18?logo=vitest&logoColor=FCC72B
[discord.js]: https://img.shields.io/badge/discord.js-000?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBmaWxsPSIjYjc1Y2ZmIiBkPSJtMzUgODUtMyAxLTYgMmMyIDcgMTEgMTQgMjEgMTMgOSAwIDE2LTUgMjAtMTEtMTAtMS0yNSA0LTMyLTV6bTkyIDEtMTIgMmMtMTQgNi0yOCAxLTMyIDAtMiAwLTItMi01IDFsLTIgMmM3IDYgMTcgMTAgMjYgMTAgMTMgMCAyMi02IDI1LTE1eiIvPjxwYXRoIGZpbGw9IiM1YzZjZmYiIGQ9Ik0xMjggNzVjLTgtNS0xMC0xLTE0IDNsMSAzYzAgNi00IDktMTIgOS03IDAtMTQtMy0xOS04bC02IDcgMjQgMmM5IDAgMjEtMyAyNS01YTIwIDIwIDAgMCAwIDEtNnYtNXptLTU4IDBjLTUtMy05LTItMTMgM3YxYzAgNi01IDExLTExIDExYTExIDExIDAgMCAxLTEwLTVzMCAwLTEgMGMzIDQgNyA2IDE0IDZsMTgtMWMyLTQgMy05IDMtMTR6Ii8+PHBhdGggZmlsbD0iIzVjZmY5ZCIgZD0iTTcwIDYyYy00LTQtOC01LTEzIDF2MTVsMTMtM3ptNDggMWMtNi0zLTI1IDAtMjggMWEzNCAzNCAwIDAgMCA0IDJsMTAgNGM1IDMgOSA0IDEwIDhsMTAtMiA0LTFjLTItNi01LTktMTAtMTJ6Ii8+PHBhdGggZmlsbD0iI2ZmZGI1YyIgZD0iTTgwIDQ4YzAgOCA0IDEzIDEwIDE2bDEyIDEgMTYtMmEzOCAzOCAwIDAgMC01LTNsLTktNGMtNS0yLTktMy0xMS03LTEwLTUtMy04LTEzLTFabS0xMCAxYy00LTMtOC0yLTEzIDJ2MTJsMTMtMXoiLz48cGF0aCBmaWxsPSIjZjc5NDU0IiBkPSJNODQgMzVhMTggMTggMCAwIDAtNCAxM2wxMyAxYTcgNyAwIDAgMS0xLTNjMC01IDUtOCAxMi04IDYgMCAxMSAyIDE1IDZsNS02Yy0xNC00LTI2LTctNDAtM1ptLTE0IDNjLTUtNS05LTEtMTMgNXY4bDEzLTJ6Ii8+PHBhdGggZmlsbD0iI2ZmNWM1YyIgZD0iTTU3IDI3djE2bDEzLTVWMjdabTQ3IDBjLTkgMC0xNiAzLTIwIDhsMTggMiAyMiAxIDItMmMtNi02LTE0LTktMjItOXoiLz48cGF0aCBmaWxsPSIjNTg2NWYyIiBkPSJNMCAyN3Y1NWgyMWM1IDAgOS0xIDEzLTNhMTEgMTEgMCAwIDEgMTItMTJjMi00IDMtOCAzLTEzIDAtNi0xLTEwLTMtMTRzLTUtOC05LTEwLTktMy0xNS0zWm0xMyAxMmg4YzUgMCA4IDEgMTEgNCAyIDIgMyA2IDMgMTFzLTEgOS0zIDEyYy0zIDMtNyA0LTExIDRoLTh6bTMzIDMyYTcgNyAwIDEgMCAwIDE1IDcgNyAwIDAgMCAwLTE1eiIvPjwvc3ZnPg==
[Kysely]: https://img.shields.io/badge/Kysely-000.svg?logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMzIiIGhlaWdodD0iMTMyIiBmaWxsPSJub25lIj48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB4PSIyIiB5PSIyIiBmaWxsPSIjZmZmIiByeD0iMTYiLz48cGF0aCBmaWxsPSIjMDAwIiBkPSJNNDEuMyAxMDlWMjRoNS4ydjQ5LjNoLjZMOTEuOSAyNGg3bC0zNyA0MC4zTDk4LjUgMTA5SDkyTDU4LjYgNjggNDYuNSA4MS4yVjEwOWgtNS4yWiIvPjwvZz48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeD0iMiIgeT0iMiIgc3Ryb2tlPSIjMTIxMjEyIiBzdHJva2Utd2lkdGg9IjQiIHJ4PSIxNiIvPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHg9IjIiIHk9IjIiIGZpbGw9IiNmZmYiIHJ4PSIxNiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==

## TL;DR Setup

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
