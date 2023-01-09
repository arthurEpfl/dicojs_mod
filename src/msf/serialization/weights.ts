import * as msgpack from 'msgpack-lite'

import { tf } from 'tfjs'
import { WeightsContainer, serialization } from '../../core'
import { Centroids } from '..'

export class SerializedCentroids {
  constructor (
    private readonly _positions: serialization.weights.Serialized[],
    private readonly _radius: number[],
    private readonly _counts: number[],
    private readonly _labels: string[]
  ) {}

  get positions (): serialization.weights.Serialized[] {
    return this._positions
  }

  get radius (): number[] {
    return this._radius
  }

  get counts (): number[] {
    return this._counts
  }

  get labels (): string[] {
    return this._labels
  }
}

export async function encodeCentroids (centroids: Centroids): Promise<serialization.weights.Encoded> {
  const serialized: serialization.weights.Serialized[] = await Promise.all(centroids.positions.weights.map(async (t) => {
    return {
      shape: t.shape as number[],
      data: [...await t.data<'float32'>()]
    }
  }))

  const payload = new SerializedCentroids(
    serialized,
    centroids.radius,
    centroids.counts,
    centroids.labels
  )

  return [...msgpack.encode(payload).values()]
}

export function decodeCentroids (encoded: serialization.weights.Encoded): Centroids {
  const raw = msgpack.decode(encoded)

  const rawPositions = raw._positions

  if (!(Array.isArray(rawPositions) && rawPositions.every(serialization.weights.isSerialized))) {
    throw new Error('expected to decode an array of serialized weights')
  }

  const positions = new WeightsContainer(
    rawPositions.map((w) => tf.tensor(w.data, w.shape))
  )

  return new Centroids(
    positions,
    raw._radius,
    raw._counts,
    raw._labels
  )
}
