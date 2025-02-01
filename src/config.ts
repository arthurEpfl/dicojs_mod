import { CentroidsJson } from './msf/weights/centroids.js'

export interface Config {
  protocol: 'http' | 'https'
  hostname: string
  port: number
  prototypes?: CentroidsJson
}

export const defaultConfig: Config = {
  protocol: 'http',
  hostname: 'localhost',
  port: 8080
}
