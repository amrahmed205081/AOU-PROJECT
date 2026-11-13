import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Box3,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Vector2,
  Vector3,
} from 'three'
import type { Group } from 'three'
import type { BookTextures } from './bookTextures.ts'
import { createPageGeometry, deformPage, type PageGeometry } from './curlPage.ts'

const PAGE_W = 0.92
const PAGE_H = 1.26
const COVER_W = 1.14
const COVER_H = 1.5
const STACK = 8
const LAYER = 0.013
const OPEN = 0.2
const FLIP_WINDOW = 0.72

function ease(value: number) {
  const t = Math.min(1, Math.max(0, value))
  return t * t * (3 - 2 * t)
}

function PageStack({
  side,
  map,
}: {
  side: 1 | -1
  map: BookTextures['pageFront']
}) {
  const topZ = 0.02 + STACK * LAYER
  return (
    <group>
      {Array.from({ length: STACK }, (_, index) => (
        <mesh
          key={index}
          position={[side * PAGE_W * 0.5, 0, 0.02 + index * LAYER]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[PAGE_W - 0.02, PAGE_H - 0.03, LAYER * 0.86]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#f6ead4' : '#e6d2ae'}
            roughness={0.96}
          />
        </mesh>
      ))}
      <mesh position={[side * PAGE_W * 0.5, 0, topZ]} receiveShadow>
        <planeGeometry args={[PAGE_W - 0.03, PAGE_H - 0.04]} />
        <meshStandardMaterial map={map} roughness={0.93} />
      </mesh>
      <mesh position={[side * (PAGE_W + 0.002), 0, 0.02 + (STACK * LAYER) / 2]} castShadow>
        <boxGeometry args={[0.01, PAGE_H - 0.1, STACK * LAYER * 0.92]} />
        <meshPhysicalMaterial color="#c4a15c" metalness={0.92} roughness={0.34} />
      </mesh>
    </group>
  )
}

function GoldFrame({ side }: { side: 1 | -1 }) {
  const z = 0.022
  const inset = 0.055
  return (
    <group>
      <mesh position={[side * COVER_W * 0.5, COVER_H / 2 - inset, z]} castShadow>
        <boxGeometry args={[COVER_W - inset * 2.2, 0.014, 0.005]} />
        <meshPhysicalMaterial color="#e4c78a" metalness={1} roughness={0.28} />
      </mesh>
      <mesh position={[side * COVER_W * 0.5, -(COVER_H / 2 - inset), z]} castShadow>
        <boxGeometry args={[COVER_W - inset * 2.2, 0.014, 0.005]} />
        <meshPhysicalMaterial color="#e4c78a" metalness={1} roughness={0.28} />
      </mesh>
      <mesh position={[side * (COVER_W - inset), 0, z]} castShadow>
        <boxGeometry args={[0.014, COVER_H - inset * 2.4, 0.005]} />
        <meshPhysicalMaterial color="#e4c78a" metalness={1} roughness={0.28} />
      </mesh>
      <mesh position={[side * (inset + 0.02), 0, z]} castShadow>
        <boxGeometry args={[0.014, COVER_H - inset * 2.4, 0.005]} />
        <meshPhysicalMaterial color="#e4c78a" metalness={1} roughness={0.28} />
      </mesh>
    </group>
  )
}

function TurningPage({
  page,
  frontMap,
  backMap,
  z,
  delay,
  startedAt,
}: {
  page: PageGeometry
  frontMap: BookTextures['pageFront']
  backMap: BookTextures['pageBack']
  z: number
  delay: number
  startedAt: number
}) {
  const materials = useMemo(() => {
    const front = new MeshPhysicalMaterial({
      map: frontMap,
      roughness: 0.9,
      metalness: 0,
      sheen: 0.35,
      sheenRoughness: 0.55,
      sheenColor: '#fff6e8',
    })
    const back = new MeshPhysicalMaterial({
      map: backMap,
      roughness: 0.92,
      metalness: 0,
      sheen: 0.2,
      sheenRoughness: 0.7,
      sheenColor: '#f3e2c4',
    })
    const edge = new MeshStandardMaterial({
      color: '#f3e4c8',
      roughness: 0.88,
      side: DoubleSide,
    })
    front.polygonOffset = true
    front.polygonOffsetFactor = -1
    front.polygonOffsetUnits = -1
    return [front, back, edge]
  }, [frontMap, backMap])

  useEffect(() => () => {
    materials.forEach((material) => material.dispose())
  }, [materials])

  useFrame(() => {
    const elapsed = (performance.now() - startedAt) / 1000
    deformPage(page, PAGE_W, PAGE_H, ease((elapsed - delay) / FLIP_WINDOW), 0.012, OPEN)
  })

  return (
    <mesh
      geometry={page.geometry}
      material={materials}
      position={[0, 0, z]}
      dispose={null}
      castShadow
      receiveShadow
    />
  )
}

export function AntiqueBook({
  textures,
  startedAt,
  detailed,
}: {
  textures: BookTextures
  startedAt: number
  detailed: boolean
}) {
  const pages = useMemo(() => {
    const segments: [number, number] = detailed ? [34, 8] : [18, 5]
    const first = createPageGeometry(segments[0], segments[1])
    const second = createPageGeometry(segments[0], segments[1])
    deformPage(first, PAGE_W, PAGE_H, 0, 0.012, OPEN)
    deformPage(second, PAGE_W, PAGE_H, 0, 0.012, OPEN)
    return [first, second]
  }, [detailed])

  useEffect(() => () => {
    pages.forEach((page) => page.geometry.dispose())
  }, [pages])

  const coverMaterials = useMemo(() => {
    const plain = new MeshPhysicalMaterial({
      map: textures.leather,
      color: '#ffffff',
      roughness: 0.68,
      metalness: 0.06,
    })
    const tooled = new MeshPhysicalMaterial({
      map: textures.coverColor,
      roughnessMap: textures.coverRoughness,
      metalnessMap: textures.coverMetalness,
      normalMap: textures.coverNormal,
      normalScale: new Vector2(0.85, 0.85),
      roughness: 0.85,
      metalness: 1,
      envMapIntensity: 0.85,
    })
    return [plain, plain, plain, plain, tooled, plain]
  }, [textures])

  useEffect(() => () => {
    coverMaterials[0].dispose()
    coverMaterials[4].dispose()
  }, [coverMaterials])

  const topZ = 0.02 + STACK * LAYER
  const bookRef = useRef<Group>(null)
  const framed = useRef(false)

  useFrame(() => {
    const group = bookRef.current
    if (!group || framed.current) return
    const box = new Box3().setFromObject(group)
    if (box.isEmpty()) return
    const center = box.getCenter(new Vector3())
    group.position.x -= center.x
    group.position.y -= center.y
    group.position.z -= center.z
    framed.current = true
  })

  return (
    <group ref={bookRef} rotation={[-0.5, 0.08, 0]} position={[0, 0, 0]} scale={0.92}>
      {([-1, 1] as const).map((side) => (
        <group key={side} rotation={[0, side === 1 ? -OPEN : OPEN, 0]}>
          <mesh
            position={[side * COVER_W * 0.5, 0, -0.004]}
            material={coverMaterials}
            dispose={null}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[COVER_W, COVER_H, 0.046]} />
          </mesh>
          <PageStack side={side} map={side === 1 ? textures.pageSecond : textures.pageBack} />
          <GoldFrame side={side} />
        </group>
      ))}

      <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
        <cylinderGeometry args={[0.052, 0.056, COVER_H * 0.99, 24]} />
        <meshPhysicalMaterial map={textures.leather} roughness={0.58} metalness={0.08} />
      </mesh>
      {[-0.46, 0, 0.46].map((bandY) => (
        <mesh key={bandY} position={[0, bandY, -0.03]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
          <meshPhysicalMaterial color="#d4b06a" metalness={1} roughness={0.28} />
        </mesh>
      ))}

      <mesh position={[0, 0, topZ * 0.45]}>
        <boxGeometry args={[0.028, PAGE_H * 0.98, 0.05]} />
        <meshStandardMaterial color="#24110e" roughness={1} />
      </mesh>

      <TurningPage
        page={pages[0]}
        frontMap={textures.pageFront}
        backMap={textures.pageBack}
        z={topZ + 0.012}
        delay={0.05}
        startedAt={startedAt}
      />
      <TurningPage
        page={pages[1]}
        frontMap={textures.pageSecond}
        backMap={textures.pageBlank}
        z={topZ + 0.002}
        delay={0.18}
        startedAt={startedAt}
      />
    </group>
  )
}
