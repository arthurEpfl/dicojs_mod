export interface Serialized {
  shape: number[]
  data: number[]
}

export function isSerialized (raw: unknown): raw is Serialized {
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
  const _: Serialized = { shape, data }

  return true
}

export type Encoded = number[]

export function isEncoded (raw: unknown): raw is Encoded {
  return Array.isArray(raw) && raw.every((e) => typeof e === 'number')
}
