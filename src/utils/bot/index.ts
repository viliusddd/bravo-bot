import 'dotenv/config'
import {Client, GatewayIntentBits, TextChannel} from 'discord.js'

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
  }

  public start() {
    this.once('ready', () => {
      console.log('Bot is online!')
      // this.sendMessageToChannel('once msg')
    })
    this.login(this.discordToken)
  }

  private async sendMessageToChannel(
    message: string,
    channelId: string = this.channelId
  ) {
    const channel = this.channels.cache.get(channelId) as TextChannel

    if (channel) {
      try {
        await channel.send(message)
        console.log(`Message sent to #${channel.name}: ${message}`)
      } catch (error) {
        console.error(
          `Failed to send message to channel with id of ${channelId}:`,
          error
        )
      }
    } else {
      console.error('Channel not found')
    }
  }

  public sendMessage(message: string, channelId: string = this.channelId) {
    this.on('ready', () => {
      this.sendMessageToChannel(message, channelId)
    })
  }
}
