class Config {
  public readonly serverUrl: URL

  constructor (
    protocol: 'http' | 'https',
    url: string,
    port: number
  ) {
    this.serverUrl = new URL(`${protocol}://${url}:${port}`)
  }
}

export const CONFIG = new Config(
  'http',
  'localhost',
  8080
)
