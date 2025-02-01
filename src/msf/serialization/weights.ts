import * as msgpack from 'msgpack-lite'

import * as tf from '@tensorflow/tfjs'
import { weights as serialization } from '../../core/serialization/index.js'
import { WeightsContainer } from '../../core/weights/weights_container.js'
import { Centroids } from '../weights/centroids.js'

export class SerializedCentroids {
  constructor (
    private readonly _positions: serialization.Serialized[],
    private readonly _radius: number[],
    private readonly _counts: number[],
    private readonly _labels: string[]
  ) {}

  get positions (): serialization.Serialized[] {
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


export async function encodeCentroids (centroids: Centroids): Promise<serialization.Encoded> {
  const serialized: serialization.Serialized[] = await Promise.all(centroids.positions.weights.map(async (t) => {
    return {
      shape: t.shape as number[],
      data: await t.data<'float32'>(),
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

export function decodeCentroids (encoded: serialization.Encoded): Centroids {
  const raw = msgpack.decode(encoded)

  const rawPositions = raw._positions

  if (!(Array.isArray(rawPositions) && rawPositions.every(serialization.isSerialized))) {
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

// Using the functions already in DISCO, the encoding would look like this:
// With the coder.encode having some extra features (extension CODEC etc)
// It is missing the creation of the centroids object !!!

// export function coderencode(serialized: unknown): serialization.Encoded {
//   return msgpack.encode(serialized, { extensionCodec: CODEC });
// }

// export function coderdecode(encoded: serialization.Encoded): unknown {
//   return msgpack.decode(encoded, { extensionCodec: CODEC });
// }

// export async function encode(weights: WeightsContainer): Promise<serialization.Encoded> {
//   const serialized: serialization.Serialized[] = await Promise.all(
//     weights.weights.map(async (t) => ({
//       shape: t.shape as number[],
//       data: await t.data<"float32">(),
//     })),
//   );

//   return coderencode(serialized);
// }

// export function decode(encoded: serialization.Encoded): WeightsContainer {
//   const raw = coderdecode(encoded);

//   if (!(Array.isArray(raw) && raw.every(serialization.isSerialized)))
//     throw new Error("expected to decode an array of serialized weights");

//   return new WeightsContainer(raw.map((w) => tf.tensor(w.data, w.shape)));
// }






// DISO encoding:
// export async function encode(weights: WeightsContainer): Promise<Encoded> {
//   const serialized: Serialized[] = await Promise.all(
//     weights.weights.map(async (t) => ({
//       shape: t.shape as number[],
//       data: await t.data<"float32">(),
//     })),
//   );

//   return coder.encode(serialized);
// }

// export function decode(encoded: Encoded): WeightsContainer {
//   const raw = coder.decode(encoded);

//   if (!(Array.isArray(raw) && raw.every(isSerialized)))
//     throw new Error("expected to decode an array of serialized weights");

//   return new WeightsContainer(raw.map((w) => tf.tensor(w.data, w.shape)));
// }

// From DISCO/coder 

// export function encode(serialized: unknown): Encoded {
//   return msgpack.encode(serialized, { extensionCodec: CODEC });
// }

// export function decode(encoded: Encoded): unknown {
//   return msgpack.decode(encoded, { extensionCodec: CODEC });
// }