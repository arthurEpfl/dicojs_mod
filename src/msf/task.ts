import { data } from '../core/index.js'
// import { Task } from '../core/task/task.js'

import { type Task, type DataType, type TrainingInformation, type DisplayInformation } from '@epfml/discojs'

// export const antibiogo: Task = {
//   taskID: 'antibiogo',
//   trainingInformation: {
//     modelID: 'antibiogo-model',
//     batchSize: 4,
//     epochs: 0,
//     preprocessingFunctions: [data.ImagePreprocessing.Resize],
//     LABEL_LIST: ['0', '1'],
//     validationSplit: 0,
//     roundDuration: 5,
//     dataType: 'image',
//     scheme: 'federated',
//     modelCompileData: {
//       optimizer: 'rmsprop',
//       loss: 'categoricalCrossentropy',
//       metrics: ['accuracy']
//     },
//     IMAGE_H: 64,
//     IMAGE_W: 64
//   },
//   displayInformation: {}
// }

// Create 'artificial' task characteristics
export const antibiogo: Task<DataType> = {
  id: 'antibiogo',
  trainingInformation: {
    batchSize: 4,
    epochs: 0,
    minNbOfParticipants: 1,
    tensorBackend: 'tfjs',
    LABEL_LIST: ['0', '1'],
    validationSplit: 0,
    roundDuration: 5,
    dataType: 'image',
    scheme: 'federated',
    IMAGE_H: 64,
    IMAGE_W: 64
  },
  displayInformation: {
    taskTitle: "Antibiogo",
    summary: {preview: 'mockprev', overview: 'mockov'}
  }
}
