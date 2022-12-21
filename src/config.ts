export class Config {
  public readonly serverUrl: URL

  constructor (
    protocol: 'http' | 'https',
    url: string,
    port: number
  ) {
    this.serverUrl = new URL(`${protocol}://${url}:${port}`)
  }
}

export function isConfig (raw: unknown): raw is Config {
  if (!(
    raw !== undefined &&
    raw !== null &&
    typeof raw === 'object'
  )) {
    return false
  }

  const { protocol, url, port } = raw as Record<string, undefined | string | number>

  return (
    (protocol === undefined || typeof protocol === 'string') &&
    (url === undefined || typeof url === 'string') &&
    (port === undefined || typeof port === 'number')
  )
}

export const defaultConfig = new Config(
  'http',
  'localhost',
  8080
)
