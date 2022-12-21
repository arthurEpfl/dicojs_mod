import { WeightsContainer } from './weights_container'

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
}
