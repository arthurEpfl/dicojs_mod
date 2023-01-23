import { centroids } from './msf'
import { tf } from 'tfjs'

export class Config {
  public readonly serverUrl: URL

  constructor (
    protocol: 'http' | 'https',
    url: string,
    port: number,
    public readonly backbone?: tf.GraphModel,
    public readonly prototypes?: centroids.CentroidsJson
  ) {
    this.serverUrl = new URL(`${protocol}://${url}:${port}`)
  }
}

export function isConfig (raw: unknown): raw is Config {
  if (!(
    typeof raw === 'object' &&
    raw !== null
  )) {
    return false
  }

  const { protocol, url, port, backbone, prototypes } = raw as Record<string, undefined | string | number | tf.GraphModel | centroids.CentroidsJson>

  return (
    (protocol === undefined || typeof protocol === 'string') &&
    (url === undefined || typeof url === 'string') &&
    (port === undefined || typeof port === 'number') &&
    (backbone === undefined || backbone instanceof tf.GraphModel) &&
    (prototypes === undefined || centroids.isJson(prototypes))
  )
}

export const defaultConfig = new Config(
  'http',
  'localhost',
  8080
)
