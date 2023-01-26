import { List } from 'immutable'
import { tf } from 'tfjs'

import { Embedding } from '../types'

export function loadEmbeddings (embeddings: string): List<Embedding> {
  return List(JSON.parse(embeddings) as number[][]).map((s) => tf.tensor(s))
}
