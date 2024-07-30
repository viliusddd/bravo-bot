import {Client, Events, GatewayIntentBits, TextChannel} from 'discord.js'

export default class BotClient extends Client {
  private readonly channelId: string

  private readonly guildId: string

  private readonly discordToken: string

  constructor(channelId: string, guildId: string, discordToken: string) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
    this.channelId = channelId
    this.guildId = guildId
    this.discordToken = discordToken

    this.start()
  }

  private start() {
    this.once(Events.ClientReady, readyClient => {
      console.log(`Discord bot is ready. Logged in as ${readyClient.user.tag}.`)
    })
    this.login(this.discordToken)
  }

  public async getUserIdFromNickname(globalName: string) {
    try {
      const guild = await this.guilds.fetch(this.guildId)
      const members = await guild.members.fetch()

      const member = members.find(gm => gm.user.globalName === globalName)
      if (!member) return null

      return member.id
    } catch (error) {
      console.error('Error fetching guild members:', error)
      return null
    }
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

  public async sendImage(imgUrl: string, channelId: string = this.channelId) {
    const channel = this.channels.cache.get(channelId) as TextChannel
    if (!channel) console.error('Channel not found')

    try {
      await channel.send(imgUrl)
    } catch (error) {
      console.error(
        `Failed to send image to channel with id of ${channelId}:`,
        error
      )
    }
  }
}
