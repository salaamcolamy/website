'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

// Store locations with coordinates based on the SVG viewBox (50 40 200 280)
const storeLocations = [
  {
    id: 1,
    name: 'BETAWI TTDI',
    address: 'TTDI, Kuala Lumpur',
    contact: '+603-7728-3456',
    state: 'MY14', // KL
    x: 118,
    y: 188,
  },
  {
    id: 2,
    name: 'The Great Chase',
    address: 'Solaris Dutamas, Kuala Lumpur',
    contact: '+603-6201-7890',
    state: 'MY14', // KL
    x: 125,
    y: 195,
  },
  {
    id: 3,
    name: 'Fennel & Co',
    address: 'Kuala Lumpur',
    contact: '+603-2142-5678',
    state: 'MY14', // KL
    x: 130,
    y: 192,
  },
  {
    id: 4,
    name: 'Tepuk Tepung',
    address: 'Hartamas Shopping Centre, Kuala Lumpur',
    contact: '+603-2110-2345',
    state: 'MY14', // KL
    x: 122,
    y: 190,
  },
  {
    id: 5,
    name: 'KLIA Food Station',
    address: 'KLIA Terminal, Sepang',
    contact: '+603-8787-1234',
    state: 'MY10', // Selangor
    x: 135,
    y: 220,
  },
  {
    id: 6,
    name: 'Karya Kopi Roastery',
    address: 'Shah Alam, Selangor',
    contact: '+603-9000-6789',
    state: 'MY10', // Selangor
    x: 140,
    y: 205,
  },
  {
    id: 7,
    name: 'Lot 15',
    address: 'Negeri Sembilan',
    contact: '+606-601-0123',
    state: 'MY05', // Negeri Sembilan
    x: 135,
    y: 235,
  },
  {
    id: 8,
    name: 'Tujuh Tiga Cafe',
    address: 'Negeri Sembilan',
    contact: '+606-601-0124',
    state: 'MY05', // Negeri Sembilan
    x: 138,
    y: 238,
  },
]

// States to highlight (where we have stores)
const highlightedStates = ['MY10', 'MY14', 'MY05']

export function Supporters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredLocation, setHoveredLocation] = useState<typeof storeLocations[0] | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [zoomScale, setZoomScale] = useState(1)

  // States to hide (East Malaysia - Sabah & Sarawak)
  const hiddenStates = ['MY12', 'MY13']

  useEffect(() => {
    // Fetch and modify the SVG
    fetch('/images/malaysia-map.svg')
      .then(res => res.text())
      .then(svg => {
        // Modify SVG to highlight states
        let modifiedSvg = svg

        // Terrain-style fill: warm paper/tan for default states
        modifiedSvg = modifiedSvg.replace('fill="#6f9c76"', 'fill="#d4c4a8"')
        modifiedSvg = modifiedSvg.replace('stroke="#ffffff"', 'stroke="#b8a88a"')
        modifiedSvg = modifiedSvg.replace('stroke-width=".5"', 'stroke-width="1"')

        // Hide East Malaysia states (Sabah & Sarawak)
        hiddenStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" style="display:none"`)
        })

        // Adjust viewBox to focus on Peninsular Malaysia only (crop out East Malaysia)
        modifiedSvg = modifiedSvg.replace(/width="1000"/, '')
        modifiedSvg = modifiedSvg.replace(/height="332"/, '')
        modifiedSvg = modifiedSvg.replace(/viewbox="0 0 1000 332"/i, 'viewBox="50 40 200 280"')

        // Highlight states where we have stores – subtle green terrain
        highlightedStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" fill="#9cb88a" stroke="#7a9a6a" stroke-width="1.5"`)
        })

        setSvgContent(modifiedSvg)
      })
  }, [])

  const handleMouseEnter = (location: typeof storeLocations[0]) => {
    setHoveredLocation(location)
  }

  return (
    <section id="supporters" ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-salaam-red-500 mb-2">
            Get Your Salaam Cola At
          </h2>
          <p className="text-gray-600">Find us across Malaysia</p>
        </motion.div>

        {/* Map and Store List Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Interactive Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* SVG Map Container – map-style frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-200/60 bg-[#ebe5d8] p-4 md:p-6 ring-1 ring-amber-900/5">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              panning={{ velocityDisabled: true }}
              onTransformed={(_, state) => setZoomScale(state.scale)}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  {/* Zoom Controls */}
                  <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
                    <button
                      onClick={() => zoomIn()}
                      className="p-2 bg-white/95 rounded-lg shadow-md border border-amber-200/80 hover:bg-amber-50/80 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5 text-amber-900/70" />
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="p-2 bg-white/95 rounded-lg shadow-md border border-amber-200/80 hover:bg-amber-50/80 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5 text-amber-900/70" />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      className="p-2 bg-white/95 rounded-lg shadow-md border border-amber-200/80 hover:bg-amber-50/80 transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5 text-amber-900/70" />
                    </button>
                  </div>

                  {/* Malaysia Map SVG */}
                  <TransformComponent
                    wrapperStyle={{ width: '100%', minHeight: '250px' }}
                    contentStyle={{ width: '100%' }}
                  >
                    <div className="w-full relative">
                      {svgContent ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: svgContent }}
                          className="w-full [&>svg]:w-full [&>svg]:h-auto"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-amber-50/30 rounded-xl">
                          <div className="animate-pulse text-amber-800/50">Loading map…</div>
                        </div>
                      )}

                      {/* Location Markers Overlay */}
                      {svgContent && (
                        <svg
                          viewBox="50 40 200 280"
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 10 }}
                        >
                          {storeLocations.map((location) => {
                            const r = 3.5 / zoomScale
                            const strokeW = 1.2 / zoomScale
                            const cx = location.x
                            const cy = location.y

                            return (
                              <g key={location.id} className="pointer-events-auto" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>
                                {/* Map-pin shape */}
                                <path
                                  d={`M${cx} ${cy - r} C${cx + r * 1.2} ${cy - r} ${cx + r} ${cy - r * 0.3} ${cx + r} ${cy + r * 0.5} C${cx + r} ${cy + r * 1.2} ${cx} ${cy + r * 1.6} ${cx} ${cy + r * 1.6} C${cx} ${cy + r * 1.6} ${cx - r} ${cy + r * 1.2} ${cx - r} ${cy + r * 0.5} C${cx - r} ${cy - r * 0.3} ${cx - r * 1.2} ${cy - r} ${cx} ${cy - r} Z`}
                                  fill="#c21316"
                                  stroke="#fff"
                                  strokeWidth={strokeW}
                                  className="cursor-pointer hover:fill-red-700 transition-colors"
                                  onMouseEnter={() => handleMouseEnter(location)}
                                  onMouseLeave={() => setHoveredLocation(null)}
                                />
                                <circle cx={cx} cy={cy - r * 0.1} r={r * 0.35} fill="#fff" className="pointer-events-none" />
                              </g>
                            )
                          })}
                        </svg>
                      )}
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>

            {/* Tooltip */}
            {hoveredLocation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-20 bg-white rounded-xl shadow-xl border border-amber-200/80 p-4 min-w-[220px] ring-1 ring-amber-900/5"
                style={{
                  left: '50%',
                  bottom: '20px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-amber-200/80 transform rotate-45" />
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-salaam-red-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-salaam-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{hoveredLocation.name}</h4>
                    <p className="text-sm text-gray-600">{hoveredLocation.address}</p>
                    <p className="text-sm text-salaam-red-500 font-medium mt-1">{hoveredLocation.contact}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

            {/* Legend & Instructions */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-xs text-amber-800/60">Scroll to zoom • Drag to pan</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#c21316" stroke="#fff" strokeWidth="1.5">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  </svg>
                  <span className="text-xs text-amber-900/80">Store</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#9cb88a] border border-[#7a9a6a]"></div>
                  <span className="text-xs text-amber-900/80">Coverage</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Store List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Locations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 auto-rows-min">
              {storeLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-salaam-red-200 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => handleMouseEnter(location)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-salaam-red-500 flex-shrink-0" />
                    <span className="font-medium text-gray-900 text-sm leading-tight">{location.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 pl-5 mt-0.5 leading-tight">{location.address}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
