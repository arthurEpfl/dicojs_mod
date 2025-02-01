import { Antibiogo } from './msf/trainer/antibiogo.js'

import * as tf from '@tensorflow/tfjs'
export * from './core/index.js'
export { Config, defaultConfig } from './config.js'

export * as msf from './msf/index.js'

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'Antibiogo', { value: Antibiogo })
}
