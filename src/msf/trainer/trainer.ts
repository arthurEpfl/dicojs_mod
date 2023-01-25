import { List, Map } from 'immutable'

import { tf } from 'tfjs'
import { informant, WeightsContainer } from '../../core'
import { centroids } from '..'

export class PrototypicalTrainer {
  constructor (
    public readonly trainingInformant: informant.FederatedInformant,
    // Do we want the Antibiogo app to provide starting prototypes on download?
    private _prototypes: centroids.Centroids,
    private readonly radiusCoefficient: number = 2
  ) {

  }

  /**
   * @param dataset Collection of embedded pellets
   * @returns The predictions set for each pellet
   */
  predict (dataset: tf.Tensor1D[]): string[][] {
    return dataset.map((tensor) =>
      this._prototypes.positions.weights
        .map((centroid, idx) =>
          [
            centroid.sub(tensor).norm(2).dataSync()[0],
            this._prototypes.labels[idx]
          ] as [number, string])
        .filter(([distance, _], idx) =>
          distance <= this._prototypes.radius[idx])
        .map(([_, label]) => label))
  }

  /**
   * Performs a K-Means update on the held prototypes.
   * @param dataset The pellets to train on
   * @param labels The labels corresponding to the given pellets
   */
  trainModel (dataset: tf.Tensor[], labels: string[]): void {
    // Get a list of data points for each label
    const pelletsPerLabel = Map(List(labels)
      .zip(List(dataset))
      .groupBy(([label, _]) => label))
      .map((es) => es.map(([_, sample]) => sample).toList())

    // New labels entered by the user
    const newLabels = List(labels)
      .filter((label) => !this._prototypes.labels.includes(label))

    // Update local prototypes
    const updatedCentroids = List(this._prototypes.positions.weights)
      .zip(List(this._prototypes.counts))
      .map(([centroid, count], idx) => {
        const label = this._prototypes.labels[idx]
        if (label === undefined) {
          throw new Error(`Centroid ${idx} does not have a label`)
        }

        const pellets = pelletsPerLabel.get(label)

        if (pellets === undefined) {
          return [undefined, undefined] as [undefined, undefined]
        }

        const newCount = count + pellets.size
        return [
          centroid
            .mul(count)
            .add(pellets.reduce((acc: tf.Tensor, e) => acc.add(e)))
            .mul(pellets.size)
            .div(newCount),
          newCount
        ] as [tf.Tensor, number]
      })
    const updatedPositions = updatedCentroids
      .map(([position, _], idx) => position ?? this._prototypes.positions.get(idx)) as List<tf.Tensor>
    const updatedCounts = updatedCentroids
      .map(([_, count], idx) => count ?? this._prototypes.counts[idx])

    // Add prototypes for new labels
    const newCentroids = newLabels
      .map((label) => {
        const pellets = pelletsPerLabel.get(label) as List<tf.Tensor>
        const position = pellets.reduce((acc: tf.Tensor, t) => acc.add(t)).div(pellets.size)

        const distances = pellets
          .map((p) => p.sub(position).norm(2).dataSync()[0])
        const avgDistance = distances
          .reduce((acc: number, e) => acc + e) / pellets.size
        const stddev = Math.sqrt(distances
          .map((d) => (d - avgDistance) ** 2)
          .reduce((acc: number, e) => acc + e) / Math.max(pellets.size - 1, 1))
        return [
          position,
          pellets.size,
          avgDistance + this.radiusCoefficient * stddev
        ] as [tf.Tensor, number, number]
      })
    const newPositions = newCentroids.map(([position, c, r]) => position)
    const newRadiuses = newCentroids.map(([p, c, radius]) => radius)
    const newCounts = newCentroids.map(([p, count, r]) => count)

    this._prototypes = new centroids.Centroids(
      new WeightsContainer(updatedPositions.concat(newPositions)),
      this._prototypes.radius.concat(newRadiuses.toArray()),
      updatedCounts.concat(newCounts).toArray(),
      this._prototypes.labels.concat(newLabels.toArray())
    )
  }

  get prototypes (): centroids.Centroids {
    return this._prototypes
  }
}
