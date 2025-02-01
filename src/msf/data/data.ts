import { List } from 'immutable'
import * as tf from '@tensorflow/tfjs'

import { Embedding } from '../types.js'

export function loadEmbeddings (embeddings: string): List<Embedding> {
  return List(JSON.parse(embeddings) as number[][]).map((s) => tf.tensor(s))
}
