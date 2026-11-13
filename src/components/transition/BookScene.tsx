import { useEffect, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  PMREMGenerator,
  SRGBColorSpace,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { AntiqueBook } from './AntiqueBook.tsx'
import {
  peekBookTextures,
  preloadBookAssets,
  type BookTextures,
} from './bookTextures.ts'

function Studio({ mapSize }: { mapSize: number }) {
  const { gl, scene } = useThree()

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1.12
    gl.outputColorSpace = SRGBColorSpace
    gl.shadowMap.enabled = true

    const pmrem = new PMREMGenerator(gl)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    scene.environmentIntensity = 0.62
    pmrem.dispose()

    return () => {
      environment.dispose()
      scene.environment = null
    }
  }, [gl, scene])

  return (
    <>
      <ambientLight intensity={0.42} color="#ffe7c8" />
      <directionalLight
        position={[1.8, 3.6, 2.2]}
        intensity={2.7}
        color="#fff3dc"
        castShadow
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-bias={-0.00035}
        shadow-normalBias={0.025}
        shadow-camera-near={0.4}
        shadow-camera-far={12}
        shadow-camera-left={-2.2}
        shadow-camera-right={2.2}
        shadow-camera-top={2.2}
        shadow-camera-bottom={-2.2}
      />
      <directionalLight position={[-2.4, 1.6, 1.4]} intensity={0.62} color="#f0c59a" />
      <pointLight position={[0.1, 0.35, 1.35]} intensity={0.45} color="#ffe2bc" distance={5} />
    </>
  )
}

function ContactShadow() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(42, 18, 12, 0.42)')
    gradient.addColorStop(0.45, 'rgba(42, 18, 12, 0.16)')
    gradient.addColorStop(1, 'rgba(42, 18, 12, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)
    const map = new CanvasTexture(canvas)
    map.colorSpace = SRGBColorSpace
    return map
  }, [])

  useEffect(() => () => texture?.dispose(), [texture])
  if (!texture) return null

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
      <planeGeometry args={[2.15, 1.15]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

export default function BookScene({ startedAt }: { startedAt: number }) {
  const [textures, setTextures] = useState<BookTextures | null>(peekBookTextures)
  const detailed = typeof window === 'undefined'
    ? true
    : !window.matchMedia('(max-width: 520px)').matches

  useEffect(() => {
    if (textures) return undefined
    let live = true
    void preloadBookAssets().then(() => {
      if (live) setTextures(peekBookTextures())
    })
    return () => {
      live = false
    }
  }, [textures])

  return (
    <Canvas
      className="route-transition__canvas"
      dpr={detailed ? [1, 1.5] : [1, 1.15]}
      gl={{ antialias: detailed, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.42, 3.15], fov: 30, near: 0.05, far: 40 }}
      shadows
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.02, 0)
      }}
    >
      <Studio mapSize={detailed ? 1024 : 512} />
      <ContactShadow />
      {textures && (
        <AntiqueBook textures={textures} startedAt={startedAt} detailed={detailed} />
      )}
    </Canvas>
  )
}
