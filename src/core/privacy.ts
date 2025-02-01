import { WeightsContainer } from './weights/weights_container.js'
import { Task } from './task/task.js'
import { DataType } from '@epfml/discojs'

import * as tf from '@tensorflow/tfjs'
// import { training } from '@epfml/discojs'

/**
 * Add task-parametrized Gaussian noise to and clip the weights update between the previous and current rounds.
 * The previous round's weights are the last weights pulled from server/peers.
 * The current round's weights are obtained after a single round of training, from the previous round's weights.
 * @param updatedWeights weights from the current round
 * @param staleWeights weights from the previous round
 * @param task the task
 * @returns the noised weights for the current round
 */
// export function addDifferentialPrivacy (updatedWeights: WeightsContainer, staleWeights: WeightsContainer, task: Task<DataType>): WeightsContainer {
//   const noiseScale = task.trainingInformation?.noiseScale
//   const clippingRadius = task.trainingInformation?.clippingRadius

//   const weightsDiff = updatedWeights.sub(staleWeights)
//   let newWeightsDiff: WeightsContainer

//   if (clippingRadius !== undefined) {
//     // Frobenius norm
//     const norm = weightsDiff.frobeniusNorm()

//     newWeightsDiff = weightsDiff.map((w) => {
//       const clipped = w.div(Math.max(1, norm / clippingRadius))
//       if (noiseScale !== undefined) {
//         // Add clipping and noise
//         const noise = tf.randomNormal(w.shape, 0, (noiseScale * noiseScale) * (clippingRadius * clippingRadius))
//         return clipped.add(noise)
//       } else {
//         // Add clipping without any noise
//         return clipped
//       }
//     })
//   } else {
//     if (noiseScale !== undefined) {
//       // Add noise without any clipping
//       newWeightsDiff = weightsDiff.map((w) => tf.randomNormal(w.shape, 0, (noiseScale * noiseScale)))
//     } else {
//       return updatedWeights
//     }
//   }

//   return staleWeights.add(newWeightsDiff)
// }

// Simplified to ignore clipping and noise scaling (byzantine, privcacy part)

export function addDifferentialPrivacy (updatedWeights: WeightsContainer, staleWeights: WeightsContainer, task: Task<DataType>): WeightsContainer {
  return staleWeights.add(updatedWeights)
}

// Since privacy not applied, function is basically just a return of the input weights
// Use applyPrivacy function from DISCO instead
// applyPrivacy function not explicitly exported in DISCO

import { training } from '@epfml/discojs';
