declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined
    DB_URL: string
    PORT: string
  }
}
