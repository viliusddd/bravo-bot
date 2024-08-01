import 'dotenv/config'
import type {Response, Request, NextFunction, RequestHandler} from 'express'
import {StatusCodes} from 'http-status-codes'
import type BotClient from '@/services/discord'
import getGifUrl from '@/services/giphy'
import MethodNotAllowed from './errors/MethodNotAllowed'

type JsonHandler<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>

/**
 * Wraps a request handler that returns an object and
 * sends it as JSON. Handles async errors.
 * @param handler Request handler that returns a serializable object.
 * @returns Request handler that sends the result as JSON.
 */
export function jsonRoute<T>(
  handler: JsonHandler<T>,
  statusCode = StatusCodes.OK
): RequestHandler {
  return async (req: Request, res: Response, next) => {
    try {
      const result = await handler(req, res, next)
      res.status(statusCode)
      res.json(result as T)
    } catch (error) {
      next(error)
    }
  }
}

export function unsupportedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  next(new MethodNotAllowed())
}

type DiscordHandler = (
  bot: BotClient
) => (req: Request, res: Response, next: NextFunction) => void

export const discordHandler: DiscordHandler =
  (bot: BotClient) => (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      const gifUrl = await getGifUrl(process.env.GIPHY_API_KEY, 'celebrate')
      if (!gifUrl) throw new Error('Gif URL is unavailable.')

      bot.sendMessage(res.locals.msg)
      bot.sendMessage(gifUrl)
    })
    next()
  }
