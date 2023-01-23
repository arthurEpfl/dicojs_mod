import { List } from 'immutable'

import { aggregation } from '../../core'
import { Centroids, CentroidEntry, fromEntries, toEntries } from './centroids'

export function aggregateCentroids (
  centroids: Centroids,
  contributions: List<Centroids>,
  tauPercentile?: number
): Centroids {
  if (!contributions.every((contribution) =>
    contribution.positions.weights[0].shape[0] === centroids.positions.weights[0].shape[0])) {
    throw new Error('Centroid positions shape mismatch')
  }
  if (!contributions.every((contribution) => contribution.counts.length >= centroids.counts.length)) {
    throw new Error('Centroids counts length mismatch')
  }

  // Handle updated centroids with known labels
  const knownCentroids = contributions
    .map((contribution) => toEntries(contribution)
      .take(centroids.labels.length))
    .filter((es) => es
      .zip(List(centroids.labels))
      .every(([e, l]) => e[3] === l))

  const knownPositions = knownCentroids.map((clientCentroids) =>
    clientCentroids.map((e) => e[0]))

  const averagedPositions = tauPercentile !== undefined && tauPercentile > 0 && tauPercentile < 1
    ? aggregation.avgClippingWeights(knownPositions, centroids.positions, tauPercentile)
    : aggregation.avg(knownPositions)

  const knownCounts = knownCentroids.map((contribution) =>
    contribution.map((e, idx) =>
      e[2] - centroids.counts[idx]))
    .reduce((acc: number[], counts) =>
      acc.map((count, idx) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        count + counts.get(idx)!), centroids.counts)

  const updatedCentroids = toEntries(new Centroids(
    averagedPositions,
    centroids.radius,
    knownCounts,
    centroids.labels
  ))

  // Handle new labels
  const unknownCentroids = contributions
    .map((contribution) => toEntries(contribution)
      .slice(centroids.labels.length))
    .filter((e) => e.size > 0)

  if (unknownCentroids.size === 0) {
    // Reorder everything by label and update model
    return fromEntries(updatedCentroids)
  } else {
    const perLabel = unknownCentroids.flatMap((e) => e).groupBy((e) => e[3])
    const newCentroids = perLabel
      .map((es) => {
        const [p, r, c, l]: CentroidEntry = es.reduce((acc: CentroidEntry, e) => [
          acc[0].add(e[0]),
          acc[1] + e[1],
          acc[2] + e[2],
          acc[3]
        ])
        const size = es.count()
        return [p.div(size), r / size, c, l] as CentroidEntry
      })
      .toList()

    // Reorder everything by label and update model
    return fromEntries(updatedCentroids.concat(newCentroids).sortBy((e) => e[3]))
  }
}
