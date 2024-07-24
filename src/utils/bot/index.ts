import {Client, Events, GatewayIntentBits, TextChannel} from 'discord.js'

export default class BotClient extends Client {
  private readonly channelId: string

  private readonly discordToken: string

  constructor(channelId: string, discordToken: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    this.channelId = channelId
    this.discordToken = discordToken

    this.start()
  }

  public start() {
    this.once(Events.ClientReady, readyClient => {
      console.log(`Discord bot is ready. Logged in as ${readyClient.user.tag}.`)
    })
    this.login(this.discordToken)
  }

  public async sendMessage(
    message: string,
    channelId: string = this.channelId
  ) {
    const channel = this.channels.cache.get(channelId) as TextChannel

    if (!channel) console.error('Channel not found')

    try {
      await channel.send(message)
      console.log(`Message sent to #${channel.name}: ${message}`)
    } catch (error) {
      console.error(
        `Failed to send message to channel with id of ${channelId}:`,
        error
      )
    }
  }
}
