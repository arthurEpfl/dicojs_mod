import { centroids } from './msf'

export interface Config {
  protocol: 'http' | 'https'
  hostname: string
  port: number
  prototypes?: centroids.CentroidsJson
}

export const defaultConfig: Config = {
  protocol: 'http',
  hostname: 'localhost',
  port: 8080
}
