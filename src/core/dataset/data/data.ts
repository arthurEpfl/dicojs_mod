import { Task } from '../../task/task.js'
import { Dataset } from '../dataset.js'

import { DataType } from '@epfml/discojs'

export abstract class Data {
  protected constructor (
    public readonly dataset: Dataset,
    public readonly task: Task<DataType>,
    public readonly size?: number) {}

  static async init (
    dataset: Dataset,
    task: Task<DataType>,
    size?: number
  ): Promise<Data> {
    throw new Error('abstract')
  }

  abstract batch (): Data

  abstract preprocess (): Data
}
