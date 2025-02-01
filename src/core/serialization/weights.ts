// import { serialization } from '@tensorflow/tfjs'

export { serialization } from '@epfml/discojs'

// have same Serialized interface as in Disco
// export interface Serialized {
//   shape: number[]
//   data: number[]
// }

// From DISCO:
export interface Serialized {
  shape: number[];
  data: Float32Array;
}

// export function isSerialized (raw: unknown): raw is Serialized {
//   if (typeof raw !== 'object' || raw === null) {
//     return false
//   }
//   if (!('shape' in raw && 'data' in raw)) {
//     return false
//   }
//   const { shape, data } = raw as Record<'shape' | 'data', unknown>

//   if (
//     !(Array.isArray(shape) && shape.every((e) => typeof e === 'number')) ||
//     !(Array.isArray(data) && data.every((e) => typeof e === 'number'))
//   ) {
//     return false
//   }

//   // eslint-disable-next-line
//   const _: Serialized = { shape, data }

//   return true
// }

// From DISCO
export function isSerialized(raw: unknown): raw is Serialized {
  if (typeof raw !== "object" || raw === null) return false;

  const { shape, data }: Partial<Record<"shape" | "data", unknown>> = raw;

  if (
    !(Array.isArray(shape) && shape.every((e) => typeof e === "number")) ||
    !(data instanceof Float32Array)
  )
    return false;

  const _: Serialized = { shape, data };

  return true;
}

export type Encoded = number[]

// export type Encoded = Uint8Array;


// export function isEncoded (raw: unknown): raw is Encoded {
//   return Array.isArray(raw) && raw.every((e) => typeof e === 'number')
// }