import 'dotenv/config'

type GiphyResponse = {
  data: {images: {original: {url: string}}}
  errors: {message: string}
}

export default async function getGif(
  api_key: string,
  tag: string
): Promise<string | undefined> {
  const url = `https://api.giphy.com/v1/gifs/random?${new URLSearchParams({api_key, tag, rating: 'g'})}`

  try {
    const response = await fetch(url)

    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const {data, errors} = (await response.json()) as GiphyResponse

    if (errors) throw new Error(errors.message)

    return data.images.original.url
  } catch (err) {
    console.error('Promise rejected', err)
    return undefined
  }
}
