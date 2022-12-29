import * as msgpack from 'msgpack-lite'

import { tf } from 'tfjs'
import { WeightsContainer, Centroids } from '..'

interface Serialized {
  shape: number[]
  data: number[]
}

export class SerializedCentroids {
  constructor (
    private readonly _positions: Serialized[],
    private readonly _radius: number[],
    private readonly _counts: number[],
    private readonly _labels: string[]
  ) {}

  get positions (): Serialized[] {
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

function isSerialized (raw: unknown): raw is Serialized {
  if (typeof raw !== 'object' || raw === null) {
    return false
  }
  if (!('shape' in raw && 'data' in raw)) {
    return false
  }
  const { shape, data } = raw as Record<'shape' | 'data', unknown>

  if (
    !(Array.isArray(shape) && shape.every((e) => typeof e === 'number')) ||
    !(Array.isArray(data) && data.every((e) => typeof e === 'number'))
  ) {
    return false
  }

  // eslint-disable-next-line
  const _: Serialized = {shape, data}

  return true
}

export type Encoded = number[]

export function isEncoded (raw: unknown): raw is Encoded {
  return Array.isArray(raw) && raw.every((e) => typeof e === 'number')
}

export async function encodeCentroids (centroids: Centroids): Promise<Encoded> {
  const serialized: Serialized[] = await Promise.all(centroids.positions.weights.map(async (t) => {
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

export function decodeCentroids (encoded: Encoded): Centroids {
  const raw = msgpack.decode(encoded)

  const rawPositions = raw._positions

  if (!(Array.isArray(rawPositions) && rawPositions.every(isSerialized))) {
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
