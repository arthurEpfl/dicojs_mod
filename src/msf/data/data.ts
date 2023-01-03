import { Base64, Pellet } from '../types'
import { tf } from 'tfjs'
import { List } from 'immutable'

// only supports .jpg
export function loadPellet (base64: Base64, dimension: [number, number]): Pellet {
  const image = new Image(dimension[0], dimension[1])
  image.src = `data:image/jpg;base64,${base64}`
  return tf.browser.fromPixels(image).resizeBilinear([64, 64])
}

export function loadPellets (base64: Base64[], dimensions: Array<[number, number]>): Pellet[] {
  return List(base64).zip(List(dimensions)).map(([s, d]) => loadPellet(s, d)).toArray()
}
