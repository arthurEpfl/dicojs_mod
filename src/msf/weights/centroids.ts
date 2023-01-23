import { WeightsContainer } from '../../core/weights/weights_container'
import { CentroidsJson } from '../types'

export class Centroids {
  constructor (
    private readonly _positions: WeightsContainer,
    private readonly _radius: number[],
    private readonly _counts: number[],
    private readonly _labels: string[]
  ) {
    if (![_radius, _counts, _labels].every((e) =>
      e.length === _positions.weights.length)) {
      throw new Error('Expected args of same length')
    }
  }

  get positions (): WeightsContainer {
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

  static fromJson (json: CentroidsJson): Centroids {
    return new Centroids(
      new WeightsContainer(json.map((e) => e.position)),
      json.map((e) => e.radius),
      json.map((e) => e.count),
      json.map((e) => e.label)
    )
  }

  static isJson (raw: unknown): raw is CentroidsJson {
    if (!(
      typeof raw === 'object' &&
      raw !== null
    )) {
      return false
    }

    if (!Array.isArray(raw)) {
      return false
    }

    if (!raw.every((e) => {
      const { position, radius, count, label } = e as Record<string, string | number | number[]>
      return (
        Array.isArray(position) && position.every((p) => typeof p === 'number') &&
        typeof radius === 'number' &&
        typeof count === 'number' &&
        typeof label === 'string'
      )
    })) {
      return false
    }

    return true
  }
}
