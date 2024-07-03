declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined
    DATABASE_URL: string
    PORT: string
    DISCORD_BOT_ID: string
  }
}
