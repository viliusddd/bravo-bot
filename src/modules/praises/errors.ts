import NotFound from '@/utils/errors/NotFound'

export class PraiseNotFound extends NotFound {
  constructor(message = 'Praise not found') {
    super(message)
  }
}
