import 'dotenv/config'

export default async function getGif(): Promise<string | undefined> {
  const url = `https://api.giphy.com/v1/gifs/random?${new URLSearchParams({
    api_key: process.env.GIPHY_API_KEY,
    tag: 'celebrate',
    rating: 'g'
  })}`

  try {
    const response = await fetch(url)

    if (!response.ok) throw new Error(`Response status: ${response.status}`)

    const {data, errors} = await response.json()

    if (errors) throw new Error(errors.message)

    return data.images.original.url
  } catch (err) {
    console.error('Promise rejected', err)
    return undefined
  }
}
