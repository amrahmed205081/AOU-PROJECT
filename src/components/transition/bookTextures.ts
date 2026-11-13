import { CanvasTexture, NoColorSpace, SRGBColorSpace, Texture } from 'three'

export interface BookTextures {
  coverColor: Texture
  coverRoughness: Texture
  coverMetalness: Texture
  coverNormal: Texture
  leather: Texture
  pageFront: Texture
  pageBack: Texture
  pageSecond: Texture
  pageBlank: Texture
}

let cached: BookTextures | null = null

function hashNoise(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return value - Math.floor(value)
}

function smoothNoise(x: number, y: number) {
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const fx = x - x0
  const fy = y - y0
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = hashNoise(x0, y0)
  const b = hashNoise(x0 + 1, y0)
  const c = hashNoise(x0, y0 + 1)
  const d = hashNoise(x0 + 1, y0 + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function fbm(x: number, y: number) {
  let value = 0
  let amplitude = 0.5
  let px = x
  let py = y
  for (let octave = 0; octave < 4; octave += 1) {
    value += amplitude * smoothNoise(px, py)
    px *= 2.03
    py *= 2.03
    amplitude *= 0.5
  }
  return value
}

function canvasTexture(canvas: HTMLCanvasElement, colorTexture: boolean) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = colorTexture ? SRGBColorSpace : NoColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function star(ctx: CanvasRenderingContext2D, cx: number, cy: number, outer: number, inner: number, points: number) {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = -Math.PI / 2 + (i * Math.PI) / points
    const x = cx + Math.cos(angle) * radius
    const y = cy + Math.sin(angle) * radius
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function traceOrnament(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const margin = width * 0.045
  const radius = 18
  ctx.beginPath()
  ctx.roundRect(margin, margin, width - margin * 2, height - margin * 2, radius)
  ctx.roundRect(margin + 18, margin + 18, width - (margin + 18) * 2, height - (margin + 18) * 2, 12)
  const cx = width / 2
  const cy = height / 2
  star(ctx, cx, cy, width * 0.2, width * 0.09, 8)
  ctx.moveTo(cx + width * 0.075, cy)
  ctx.arc(cx, cy, width * 0.075, 0, Math.PI * 2)
  ctx.moveTo(cx + width * 0.28, cy)
  ctx.arc(cx, cy, width * 0.28, 0, Math.PI * 2)

  const corners = [
    [margin + 36, margin + 36],
    [width - margin - 36, margin + 36],
    [margin + 36, height - margin - 36],
    [width - margin - 36, height - margin - 36],
  ]
  for (const [x, y] of corners) {
    star(ctx, x, y, 22, 9, 4)
  }
}

function drawOrnament(ctx: CanvasRenderingContext2D, width: number, height: number, stroke: string, widthPx: number) {
  ctx.save()
  ctx.strokeStyle = stroke
  ctx.lineWidth = widthPx
  ctx.lineJoin = 'round'
  traceOrnament(ctx, width, height)
  ctx.stroke()
  ctx.restore()
}

function makeCoverMaps() {
  const width = 640
  const height = 880
  const color = document.createElement('canvas')
  const rough = document.createElement('canvas')
  const metal = document.createElement('canvas')
  const heightMap = document.createElement('canvas')
  for (const canvas of [color, rough, metal, heightMap]) {
    canvas.width = width
    canvas.height = height
  }

  const colorCtx = color.getContext('2d')
  const roughCtx = rough.getContext('2d')
  const metalCtx = metal.getContext('2d')
  const heightCtx = heightMap.getContext('2d')
  if (!colorCtx || !roughCtx || !metalCtx || !heightCtx) {
    throw new Error('تعذر تجهيز خامة الغلاف')
  }

  const pixels = colorCtx.createImageData(width, height)
  const data = pixels.data
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const grain = fbm(x * 0.035, y * 0.035)
      const pore = fbm(x * 0.12 + 20, y * 0.12 + 8)
      const wear = fbm(x * 0.008, y * 0.008)
      const spine = Math.exp(-x / 42)
      const edge = Math.min(x, y, width - x, height - y)
      const vignette = Math.min(1, edge / 70)
      const tone = 0.72 + grain * 0.38 + pore * 0.08 + wear * 0.12 - spine * 0.45
      const shade = Math.max(0, Math.min(1, tone * (0.55 + vignette * 0.45)))
      const index = (y * width + x) * 4
      data[index] = 92 * shade + 18
      data[index + 1] = 18 * shade
      data[index + 2] = 14 * shade
      data[index + 3] = 255
    }
  }
  colorCtx.putImageData(pixels, 0, 0)

  roughCtx.fillStyle = '#c8c8c8'
  roughCtx.fillRect(0, 0, width, height)
  metalCtx.fillStyle = '#050505'
  metalCtx.fillRect(0, 0, width, height)
  const grain = heightCtx.createImageData(width, height)
  const grainData = grain.data
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const bump = 96 + fbm(x * 0.07, y * 0.07) * 36
      const index = (y * width + x) * 4
      grainData[index] = bump
      grainData[index + 1] = bump
      grainData[index + 2] = bump
      grainData[index + 3] = 255
    }
  }
  heightCtx.putImageData(grain, 0, 0)

  drawOrnament(colorCtx, width, height, '#d7b56a', 7)
  drawOrnament(colorCtx, width, height, '#f0d9a0', 2)
  drawOrnament(roughCtx, width, height, '#3a3a3a', 9)
  drawOrnament(metalCtx, width, height, '#f2f2f2', 9)
  drawOrnament(heightCtx, width, height, '#f4f4f4', 8)

  colorCtx.strokeStyle = 'rgba(232, 196, 122, 0.35)'
  colorCtx.lineWidth = 1
  for (let i = 0; i < 7; i += 1) {
    colorCtx.beginPath()
    colorCtx.moveTo(80 + i * 70, 120)
    colorCtx.bezierCurveTo(140, 300 + i * 40, 420, 200, 520, 700 - i * 20)
    colorCtx.stroke()
  }

  const heightData = heightCtx.getImageData(0, 0, width, height)
  const normal = document.createElement('canvas')
  normal.width = width
  normal.height = height
  const normalCtx = normal.getContext('2d')
  if (!normalCtx) throw new Error('تعذر تجهيز خامة النقش')
  const normalImage = normalCtx.createImageData(width, height)
  const source = heightData.data
  const dest = normalImage.data
  const sample = (x: number, y: number) => {
    const sx = Math.max(0, Math.min(width - 1, x))
    const sy = Math.max(0, Math.min(height - 1, y))
    return source[(sy * width + sx) * 4] / 255
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = sample(x + 1, y) - sample(x - 1, y)
      const dy = sample(x, y + 1) - sample(x, y - 1)
      let nx = -dx * 2.4
      let ny = dy * 2.4
      let nz = 1
      const length = Math.hypot(nx, ny, nz)
      nx /= length
      ny /= length
      nz /= length
      const index = (y * width + x) * 4
      dest[index] = (nx * 0.5 + 0.5) * 255
      dest[index + 1] = (ny * 0.5 + 0.5) * 255
      dest[index + 2] = (nz * 0.5 + 0.5) * 255
      dest[index + 3] = 255
    }
  }
  normalCtx.putImageData(normalImage, 0, 0)

  return { color, rough, metal, normal }
}

function paintPage(lines: string[], stained: boolean) {
  const width = 640
  const height = 880
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('تعذر تجهيز صفحة المخطوط')

  const image = ctx.createImageData(width, height)
  const data = image.data
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const fiber = fbm(x * 0.05, y * 0.05)
      const blot = fbm(x * 0.01 + 4, y * 0.01)
      const edge = Math.min(x, y, width - 1 - x, height - 1 - y)
      const age = Math.min(1, edge / 48)
      const warm = 232 + fiber * 18 - (1 - age) * 28 - blot * 10
      const index = (y * width + x) * 4
      data[index] = warm
      data[index + 1] = warm * 0.9
      data[index + 2] = warm * 0.68
      data[index + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)

  if (stained) {
    ctx.fillStyle = 'rgba(92, 58, 28, 0.08)'
    ctx.beginPath()
    ctx.ellipse(140, 220, 70, 36, 0.4, 0, Math.PI * 2)
    ctx.ellipse(480, 640, 90, 40, -0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(118, 36, 24, 0.45)'
  ctx.lineWidth = 3
  ctx.strokeRect(36, 36, width - 72, height - 72)
  ctx.strokeStyle = 'rgba(168, 124, 58, 0.7)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(48, 48, width - 96, height - 96)

  ctx.strokeStyle = 'rgba(90, 62, 36, 0.16)'
  ctx.lineWidth = 1
  for (let lineY = 118; lineY < height - 70; lineY += 52) {
    ctx.beginPath()
    ctx.moveTo(78, lineY + 10)
    ctx.lineTo(width - 72, lineY + 10)
    ctx.stroke()
  }

  ctx.fillStyle = '#2a1a12'
  ctx.direction = 'rtl'
  ctx.textAlign = 'right'
  ctx.font = '700 40px Tajawal, "Segoe UI", Tahoma, "Noto Naskh Arabic", sans-serif'
  let y = 128
  for (const line of lines) {
    ctx.fillText(line, width - 74, y)
    y += 52
  }

  return canvas
}

const frontLines = [
  'هذا سفر في علم اللسان',
  'العربية هوية من نطق بها',
  'وحرف الضاد عنوان بيانها',
  'تُقام المعاني على أبنية الكلام',
  'ويحفظ النحو حدود العبارة',
  'واللهجات ذاكرة الدار والسوق',
  'والأمثال خلاصة ما عاش الناس',
  'فمن قرأها قرأ تاريخ أهلها',
]

const backLines = [
  'وقد جرت عادة الكتّاب أن يضبطوا',
  'اللفظ قبل أن يرسلوه إلى الناس',
  'فإن الكلمة إذا مالت مال معناها',
  'وهذا وجه العناية بالعبارة',
  'فاقرأ الصفحة ثم اقلب التي تليها',
  'فالمعرفة تنتقل مع الورق',
]

const secondLines = [
  'وفي طيات الكتب خبر الأولين',
  'من النحو والصرف وبيان العرب',
  'ومن سيرة أهل اللسان والقلم',
  'فاقلب الورقة تجد أثرهم',
  'حبراً على رقّ لا يبلى',
  'ونوراً يبقى بعد أن يُطوى السفر',
]

function makeLeatherSwatch() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('تعذر تجهيز خامة الجلد')
  const image = ctx.createImageData(256, 256)
  const data = image.data
  for (let y = 0; y < 256; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const grain = fbm(x * 0.06, y * 0.06)
      const shade = 0.65 + grain * 0.4
      const index = (y * 256 + x) * 4
      data[index] = 88 * shade + 16
      data[index + 1] = 16 * shade
      data[index + 2] = 12 * shade
      data[index + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  return canvas
}

export async function preloadBookAssets() {
  if (document.fonts?.ready) await document.fonts.ready
  getBookTextures()
}

export function peekBookTextures() {
  return cached
}

export function getBookTextures() {
  if (cached) return cached
  const cover = makeCoverMaps()
  cached = {
    coverColor: canvasTexture(cover.color, true),
    coverRoughness: canvasTexture(cover.rough, false),
    coverMetalness: canvasTexture(cover.metal, false),
    coverNormal: canvasTexture(cover.normal, false),
    leather: canvasTexture(makeLeatherSwatch(), true),
    pageFront: canvasTexture(paintPage(frontLines, true), true),
    pageBack: canvasTexture(paintPage(backLines, false), true),
    pageSecond: canvasTexture(paintPage(secondLines, true), true),
    pageBlank: canvasTexture(paintPage([], false), true),
  }
  return cached
}
