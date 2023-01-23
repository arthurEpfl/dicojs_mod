import { tf } from 'tfjs'

export type Base64 = string
export type Pellet = tf.Tensor3D
export type Embedding = tf.Tensor1D
export type CentroidsJson = Array<{ position: number[], label: string, radius: number, count: number }>
