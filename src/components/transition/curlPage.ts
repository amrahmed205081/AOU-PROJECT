import {
  BufferAttribute,
  BufferGeometry,
  type NormalBufferAttributes,
} from 'three'

export interface PageGeometry {
  geometry: BufferGeometry
  segmentsX: number
  segmentsY: number
}

export function createPageGeometry(segmentsX: number, segmentsY: number): PageGeometry {
  const sx = segmentsX
  const sy = segmentsY
  const grid = (sx + 1) * (sy + 1)
  const positions = new Float32Array(grid * 2 * 3)
  const uvs = new Float32Array(grid * 2 * 2)
  const indices: number[] = []

  const vertex = (face: 0 | 1, ix: number, iy: number) => face * grid + iy * (sx + 1) + ix

  for (let face = 0; face < 2; face += 1) {
    for (let iy = 0; iy <= sy; iy += 1) {
      for (let ix = 0; ix <= sx; ix += 1) {
        const index = vertex(face as 0 | 1, ix, iy)
        const u = ix / sx
        uvs[index * 2] = face === 0 ? u : 1 - u
        uvs[index * 2 + 1] = iy / sy
      }
    }
  }

  const quad = (a: number, b: number, c: number, d: number) => {
    indices.push(a, b, c, a, c, d)
  }

  for (let iy = 0; iy < sy; iy += 1) {
    for (let ix = 0; ix < sx; ix += 1) {
      quad(
        vertex(0, ix, iy),
        vertex(0, ix + 1, iy),
        vertex(0, ix + 1, iy + 1),
        vertex(0, ix, iy + 1),
      )
    }
  }
  const frontCount = indices.length

  for (let iy = 0; iy < sy; iy += 1) {
    for (let ix = 0; ix < sx; ix += 1) {
      quad(
        vertex(1, ix, iy),
        vertex(1, ix, iy + 1),
        vertex(1, ix + 1, iy + 1),
        vertex(1, ix + 1, iy),
      )
    }
  }
  const backCount = indices.length

  for (let iy = 0; iy < sy; iy += 1) {
    quad(
      vertex(0, sx, iy),
      vertex(0, sx, iy + 1),
      vertex(1, sx, iy + 1),
      vertex(1, sx, iy),
    )
    quad(
      vertex(0, 0, iy + 1),
      vertex(0, 0, iy),
      vertex(1, 0, iy),
      vertex(1, 0, iy + 1),
    )
  }
  for (let ix = 0; ix < sx; ix += 1) {
    quad(
      vertex(0, ix, sy),
      vertex(0, ix + 1, sy),
      vertex(1, ix + 1, sy),
      vertex(1, ix, sy),
    )
    quad(
      vertex(0, ix + 1, 0),
      vertex(0, ix, 0),
      vertex(1, ix, 0),
      vertex(1, ix + 1, 0),
    )
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.addGroup(0, frontCount, 0)
  geometry.addGroup(frontCount, backCount - frontCount, 1)
  geometry.addGroup(backCount, indices.length - backCount, 2)

  return { geometry, segmentsX: sx, segmentsY: sy }
}

export function deformPage(
  page: PageGeometry,
  width: number,
  height: number,
  progress: number,
  thickness: number,
  rest = 0,
) {
  const { geometry, segmentsX: sx, segmentsY: sy } = page
  const position = geometry.getAttribute('position') as BufferAttribute & NormalBufferAttributes['position']
  const grid = (sx + 1) * (sy + 1)
  const clamped = Math.min(1, Math.max(0, progress))
  const edge = rest + clamped * (Math.PI - rest * 2)
  const curl = Math.sin(clamped * Math.PI)
  const mix = curl * 0.9
  const angles = new Float32Array(sx + 1)

  for (let i = 0; i <= sx; i += 1) {
    const u = i / sx
    const shaped = Math.pow(u, 0.38)
    angles[i] = edge * ((1 - mix) + mix * shaped)
  }

  const step = width / sx
  const xs = new Float32Array(sx + 1)
  const zs = new Float32Array(sx + 1)
  for (let i = 1; i <= sx; i += 1) {
    const mid = (angles[i - 1] + angles[i]) / 2
    xs[i] = xs[i - 1] + Math.cos(mid) * step
    zs[i] = zs[i - 1] + Math.sin(mid) * step
  }

  const front = (ix: number, iy: number) => iy * (sx + 1) + ix

  for (let iy = 0; iy <= sy; iy += 1) {
    const y = (iy / sy - 0.5) * height
    const sag = Math.sin((iy / sy) * Math.PI) * 0.02 * curl
    for (let ix = 0; ix <= sx; ix += 1) {
      position.setXYZ(front(ix, iy), xs[ix], y, zs[ix] - sag)
    }
  }

  const read = (ix: number, iy: number) => {
    const index = front(ix, iy)
    return [position.getX(index), position.getY(index), position.getZ(index)]
  }

  for (let iy = 0; iy <= sy; iy += 1) {
    for (let ix = 0; ix <= sx; ix += 1) {
      const left = read(Math.max(0, ix - 1), iy)
      const right = read(Math.min(sx, ix + 1), iy)
      const below = read(ix, Math.max(0, iy - 1))
      const above = read(ix, Math.min(sy, iy + 1))
      const tx = right[0] - left[0]
      const ty = right[1] - left[1]
      const tz = right[2] - left[2]
      const bx = above[0] - below[0]
      const by = above[1] - below[1]
      const bz = above[2] - below[2]
      let nx = ty * bz - tz * by
      let ny = tz * bx - tx * bz
      let nz = tx * by - ty * bx
      const length = Math.hypot(nx, ny, nz) || 1
      nx /= length
      ny /= length
      nz /= length
      const index = front(ix, iy)
      position.setXYZ(
        grid + index,
        position.getX(index) - nx * thickness,
        position.getY(index) - ny * thickness,
        position.getZ(index) - nz * thickness,
      )
    }
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
}
