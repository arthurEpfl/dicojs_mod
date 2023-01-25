import { List } from 'immutable'
import { tf } from 'tfjs'

import { Base64, Embedding } from '../types'

// only supports .jpg
export function loadEmbedding (base64: Base64): Embedding {
  return tf.tensor(base64.split(',').map(Number))
}

export function loadEmbeddings (base64: Base64[]): List<Embedding> {
  return List(base64).map((s) => loadEmbedding(s))
}
