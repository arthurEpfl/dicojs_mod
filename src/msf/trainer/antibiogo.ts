import { merge } from 'immutable'

import { informant as informants } from '../../core/informant/index.js'
import { PrototypicalTrainer } from './trainer.js'
import { AntibiogoClient } from '../client/federated/antibiogo_client.js'
import { loadEmbeddings } from '../data/data.js'
import { antibiogo } from '../task.js'
import { Centroids, CentroidsJson, fromJson, toJson } from '../weights/centroids.js'
import { Config, defaultConfig } from '../../config.js'

/**
 * Convenient top-level class.
 */
export class Antibiogo {
  private constructor (
    private readonly client: AntibiogoClient,
    public readonly trainer: PrototypicalTrainer,
    public readonly config: Config
  ) {}

  static async init (
    configObject?: Config
  ): Promise<Antibiogo> {
    const config = configObject !== undefined
      ? merge(defaultConfig, { ...configObject })
      : defaultConfig

    const serverUrl = new URL(`${config.protocol}://${config.hostname}:${config.port}`)

    const client = new AntibiogoClient(serverUrl)
    const informant = new informants.FederatedInformant(antibiogo)

    let connected = true
    try {
      await client.connect()
    } catch (e) {
      console.warn('Could not connect to server. Client will work in offline mode.')
      connected = false
    }

    let prototypicalModel: Centroids

    if (!connected && (config.prototypes === undefined)) {
      throw new TypeError('unable to initialize prototypical model')
    }

    if (connected && config.prototypes === undefined) {
      prototypicalModel = await client.getLatestModel()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prototypicalModel = fromJson(config.prototypes!)
    }

    const trainer = new PrototypicalTrainer(informant, prototypicalModel)

    return new this(client, trainer, config)
  }

  /**
   * First call by the Kotlin app. The user expects the model to
   * identify its pellets.
   * @param pellets Array of base64 pellet images
   * @returns Predictions set for each given pellet
   */
  public identify (embeddings: string): string[][] {
    const dataset = loadEmbeddings(embeddings)
    return this.trainer.predict(dataset.toArray())
  }

  /**
   * Second call by the Kotlin app. The user validated the pellet labels.
   * @param pellets Array of base64 pellet images
   * @param labels Array of validated labels
   */
  public fit (embeddings: string, labels: string[]): CentroidsJson {
    const dataset = loadEmbeddings(embeddings)

    if (labels.length !== dataset.size) {
      throw new Error('length mismatch between samples and labels')
    }

    this.trainer.trainModel(dataset.toArray(), labels)

    return toJson(this.trainer.prototypes)
  }

  /**
   * Send local prototypes to the server for aggregation.
   */
  async communicate (): Promise<void> {
    if (!this.client.isConnected) {
      try {
        await this.client.connect()
      } catch (e) {
        console.error('Could not communicate the local prototypes: unable to connect to the remote server.')
        return
      }
    }

    await this.client.onRoundEndCommunication(
      this.trainer.prototypes,
      this.trainer.prototypes,
      0,
      this.trainer.trainingInformant
    )
  }
}
