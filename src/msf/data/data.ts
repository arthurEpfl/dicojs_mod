import { Base64, Pellet } from '../types'
import { tf } from 'tfjs'

// only supports .jpg
export function loadPellet (base64: Base64): Pellet {
  const image = new Image()
  image.src = `data:image/jpg;base64,${base64}`
  return tf.browser.fromPixels(image).resizeBilinear([64, 64])
}

export function loadPellets (base64: Base64[]): Pellet[] {
  return base64.map(loadPellet)
}
