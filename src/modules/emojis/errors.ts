import NotFound from '@/utils/errors/NotFound'

export class EmojiNotFound extends NotFound {
  constructor(message = 'Emoji not found') {
    super(message)
  }
}
