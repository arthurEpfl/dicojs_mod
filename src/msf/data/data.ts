import { List } from 'immutable'

import { tf } from 'tfjs'
import { Base64, Pellet } from '../types'

// only supports .jpg
export async function loadPellet (base64: Base64): Promise<tf.Tensor3D> {
  const image = await loadImageBase64(base64)

  const imageTensor: tf.Tensor3D = tf.browser.fromPixels(image)
  const tensorResized: tf.Tensor3D = imageTensor.resizeBilinear([64, 64])
  return tensorResized
}

export async function loadPellets (base64: Base64[]): Promise<Pellet[]> {
  return await Promise.all(List(base64).map(async (s) => await loadPellet(s)))
}

async function loadImageBase64 (base64: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => {
      resolve(im)
    }
    im.onerror = (e) => {
      console.log('error loading image', e)
      reject(e)
    }
    im.src = `data:image/jpg;base64,${base64}`
  })
}
