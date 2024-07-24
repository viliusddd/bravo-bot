declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined
    DATABASE_URL: string
    PORT: string
    DISCORD_TOKEN: string
    DISCORD_CHANNEL_ID: string
    GIPHY_API_KEY: string
  }
}
