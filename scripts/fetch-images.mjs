import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const outDir = path.resolve('public/images')

const images = {
  'calligraphy-wall':
    'https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1600&q=70',
  'open-manuscript':
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1600&q=70',
  'quran-stand':
    'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=70',
  'blue-mosque':
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1600&q=70',
  'mosque-dusk':
    'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1600&q=70',
  'library-rows':
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=70',
  'book-stack':
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=70',
  'writing-hand':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=70',
  'grand-library':
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=70',
  'bookshelf':
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=70',
  'open-books':
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=70',
  'books-overhead':
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1600&q=70',
  'writing-desk':
    'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=1600&q=70',
  'study-notes':
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=70',
  'dark-books':
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=70',
  'old-pages':
    'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&w=1600&q=70',
  'warm-library':
    'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=1600&q=70',
  'medina-blue':
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1600&q=70',
  'islamic-arch':
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1600&q=70',
  'geometric-pattern':
    'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1600&q=70',
  'mosque-night':
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=70',
  'palace-arches':
    'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1600&q=70',
  'pyramids-giza':
    'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1600&q=70',
  'typewriter':
    'https://images.unsplash.com/photo-1456327102063-fb5054efe647?auto=format&fit=crop&w=1600&q=70',
  'book-coffee':
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=70',
  'cairo-citadel':
    'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=1600&q=70',
  'dome-interior':
    'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1600&q=70',
  'lanterns':
    'https://images.unsplash.com/photo-1513072064285-240f87fa81e8?auto=format&fit=crop&w=1600&q=70',
  'old-map':
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=70',
  'inkwell':
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=60',
  'scholar-desk':
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=60',
}

await mkdir(outDir, { recursive: true })

const headers = {
  'User-Agent': 'Mozilla/5.0 (compatible; ArabicHeritagePreview/1.0)',
  Accept: 'image/avif,image/webp,image/*,*/*',
}

for (const [name, url] of Object.entries(images)) {
  try {
    const response = await fetch(url, { headers, redirect: 'follow' })
    if (!response.ok) {
      console.error('FAIL', name, response.status)
      continue
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const webp = await sharp(buffer)
      .rotate()
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 62 })
      .toBuffer()
    await writeFile(path.join(outDir, `${name}.webp`), webp)
    console.log('OK', name, webp.length)
  } catch (error) {
    console.error('ERR', name, error instanceof Error ? error.message : error)
  }
}
