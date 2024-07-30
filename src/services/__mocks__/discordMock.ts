process.env.DISCORD_CHANNEL_ID = 'test_channel_id'
process.env.DISCORD_SERVER_ID = 'test_server_id'
process.env.DISCORD_TOKEN = 'test_token'

vi.mock('@/services/discord', () => ({
  default: vi
    .fn()
    .mockImplementation(
      (channelId: string, serverId: string, token: string) => ({
        channelId,
        serverId,
        token,
        sendMessage: vi.fn(),
        getUserIdFromNickname: vi.fn()
      })
    )
}))
