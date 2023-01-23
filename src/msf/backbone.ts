import { tf } from 'tfjs'
import { Pellet, Embedding } from './types'

function memoryUsage (): void {
  console.log(tf.memory().numBytes / (1024 ** 2), 'MB')
}

/**
 * Basically preprocessing.
 * Converts a base64 string to an image tensor and embeds the image into some vector space.
 */
export class Backbone {
  constructor (
    private readonly model: tf.GraphModel
  ) {}

  static async init (modelURL?: string): Promise<Backbone> {
    // EfficientNet finetuned in PyTorch and converted to TF.js under the GraphModel format.
    // The model is currently hosted on a Google bucket managed by the MLO lab.
    // TODO: The Antibiogo app should provide the backbone model on download.
    const model = await tf.loadGraphModel(
      modelURL ?? 'https://storage.googleapis.com/deai-313515.appspot.com/models/msf-backbone-model/model.json'
    )

    console.log('memory usage of backbone model:')
    memoryUsage()
    return new this(model)
  }

  embedPellets (pellets: Pellet[]): Embedding[] {
    const raw = this.model.predict(tf.stack(pellets)) as tf.Tensor2D
    return (raw.arraySync() as number[][]).map((e) => tf.tensor(e))
  }
}
