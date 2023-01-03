import { Backbone, PrototypicalTrainer, Base64, client as clients, data, antibiogo } from '..'
import { informant as informants } from '../../core'
import { Config, defaultConfig, isConfig } from '../../config'

/**
 * Convenient top-level class.
 */
export class Antibiogo {
  private constructor (
    public readonly trainer: PrototypicalTrainer,
    private readonly backbone: Backbone,
    public readonly config: Config
  ) {}

  static async init (configObject?: unknown): Promise<Antibiogo> {
    const config = isConfig(configObject)
      ? { ...defaultConfig, configObject }
      : defaultConfig

    const client = new clients.AntibiogoClient(config.serverUrl)
    const informant = new informants.FederatedInformant(antibiogo)

    const prototypicalModel = await client.getLatestModel()

    const trainer = new PrototypicalTrainer(informant, client, prototypicalModel)

    await client.connect()

    return new this(
      trainer,
      await Backbone.init(),
      config
    )
  }

  /**
   * First call by the Kotlin app. The user expects the model to
   * identify its pellets.
   * @param pellets Array of base64 pellet images
   * @returns Predictions set for each given pellet
   */
  public identify (pellets: Base64[], dimensions: Array<[number, number]>): string[][] {
    if (pellets.length !== dimensions.length) {
      throw new Error('Length mismatch between inputs')
    }

    // Load and embed pellets
    const embeddings = this.backbone.embedPellets(data.loadPellets(pellets, dimensions))

    // Get prediction sets from the prototypical model
    return this.trainer.predict(embeddings)
  }

  /**
   * Second call by the Kotlin app. The user validated the pellet labels.
   * @param pellets Array of base64 pellet images
   * @param labels Array of validated labels
   */
  public fit (samples: Base64[], dimensions: Array<[number, number]>, labels: string[]): void {
    if (
      samples.length !== dimensions.length ||
      dimensions.length !== labels.length ||
      labels.length !== samples.length
    ) {
      throw new Error('Length mismatch between inputs')
    }

    // Load and embed pellets
    // Note: If the WebView is preserved between calls, then embeddings from
    // "idenfity" can be stored for a later "fit"
    const embeddings = this.backbone.embedPellets(data.loadPellets(samples, dimensions))

    // Train the prototypical model with a labelled dataset
    this.trainer.trainModel(embeddings, labels)
  }

  /**
   * Send local prototypes to the server for aggregation.
   */
  async communicate (): Promise<void> {
    await this.trainer.communicatePrototypes()
  }
}
