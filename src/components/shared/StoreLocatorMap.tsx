'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
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
  {
    id: 9,
    name: 'Selera Nate Glenmarie',
    address: 'Glenmarie, Shah Alam, Selangor',
    contact: '+603-5555-0125',
    state: 'MY10', // Selangor
    x: 137,
    y: 208,
  },
]

// States to highlight (where we have stores)
const highlightedStates = ['MY10', 'MY14', 'MY05']

// States to hide (East Malaysia)
const hiddenStates = ['MY12', 'MY13']

// State labels (Peninsular Malaysia only; exclude Sabah, Sarawak, Labuan)
const stateLabels = [
  { id: 'MY09', name: 'Perlis', x: 73.4, y: 55.2 },
  { id: 'MY02', name: 'Kedah', x: 93.7, y: 80.9 },
  { id: 'MY07', name: 'Pulau Pinang', x: 83.1, y: 106.1 },
  { id: 'MY08', name: 'Perak', x: 108.6, y: 128.6 },
  { id: 'MY03', name: 'Kelantan', x: 156.5, y: 118.5 },
  { id: 'MY11', name: 'Terengganu', x: 196.7, y: 122 },
  { id: 'MY06', name: 'Pahang', x: 174.6, y: 183.5 },
  { id: 'MY10', name: 'Selangor', x: 131.5, y: 198.2 },
  { id: 'MY14', name: 'Kuala Lumpur', x: 140.3, y: 210.9 },
  { id: 'MY16', name: 'Putrajaya', x: 140.6, y: 220.8 },
  { id: 'MY05', name: 'Negeri Sembilan', x: 164.6, y: 226.1 },
  { id: 'MY04', name: 'Melaka', x: 170.3, y: 249.2 },
  { id: 'MY01', name: 'Johor', x: 219.2, y: 262.2 },
]

interface StoreLocatorMapProps {
  maxWidth?: string
  showStoreList?: boolean
}

export function StoreLocatorMap({ maxWidth = 'max-w-6xl', showStoreList = true }: StoreLocatorMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<typeof storeLocations[0] | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [zoomScale, setZoomScale] = useState(1)

  useEffect(() => {
    fetch('/images/malaysia-map.svg')
      .then(res => res.text())
      .then(svg => {
        let modifiedSvg = svg

        // Change default fill color to white
        modifiedSvg = modifiedSvg.replace('fill="#6f9c76"', 'fill="#ffffff"')

        // State borders: visible lines separating states (replace root stroke)
        modifiedSvg = modifiedSvg.replace('stroke="#ffffff"', 'stroke="#94a3b8"')
        modifiedSvg = modifiedSvg.replace('stroke-width=".5"', 'stroke-width="1"')

        // Hide East Malaysia states
        hiddenStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" style="display:none"`)
        })

        // Hide label_points group (we use our own overlay labels)
        modifiedSvg = modifiedSvg.replace('<g id="label_points">', '<g id="label_points" style="display:none">')

        // Adjust viewBox to focus on Peninsular Malaysia
        modifiedSvg = modifiedSvg.replace(/width="1000"/, '')
        modifiedSvg = modifiedSvg.replace(/height="332"/, '')
        modifiedSvg = modifiedSvg.replace(/viewbox="0 0 1000 332"/i, 'viewBox="50 40 200 280"')

        // Highlight states where we have stores (red border overrides default)
        highlightedStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" fill="#fecaca" stroke="#ef4444" stroke-width="1.5"`)
        })

        setSvgContent(modifiedSvg)
      })
  }, [])

  const handleMouseEnter = (location: typeof storeLocations[0]) => {
    setHoveredLocation(location)
  }

  return (
    <div className={`${maxWidth} mx-auto`}>
      {/* Map and Store List Side by Side */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Interactive Map */}
        <div className="relative">
          {/* SVG Map Container */}
          <div className="relative bg-salaam-red-100 rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden">
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
                      className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => zoomOut()}
                      className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      className="p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5 text-gray-700" />
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
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-pulse text-gray-400">Loading map...</div>
                        </div>
                      )}

                      {/* State labels + Location markers overlay */}
                      {svgContent && (
                        <svg
                          viewBox="50 40 200 280"
                          className="absolute top-0 left-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 10 }}
                        >
                          {/* State labels */}
                          <g className="pointer-events-none" aria-hidden="true">
                            {stateLabels.map((s) => (
                              <text
                                key={s.id}
                                x={s.x}
                                y={s.y}
                                fontSize={4.5}
                                fontWeight={600}
                                fill="#475569"
                                stroke="#fff"
                                strokeWidth={0.4}
                                paintOrder="stroke"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {s.name}
                              </text>
                            ))}
                          </g>
                          {/* Location markers */}
                          {storeLocations.map((location) => {
                            const baseRadius = 4
                            const markerRadius = baseRadius / zoomScale
                            const innerRadius = 1.5 / zoomScale
                            const strokeW = 1 / zoomScale

                            return (
                              <g key={location.id} className="pointer-events-auto">
                                <circle
                                  cx={location.x}
                                  cy={location.y}
                                  r={markerRadius}
                                  fill="#ef4444"
                                  stroke="#fff"
                                  strokeWidth={strokeW}
                                  className="cursor-pointer hover:fill-red-600 transition-colors"
                                  style={{
                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                                  }}
                                  onMouseEnter={() => handleMouseEnter(location)}
                                  onMouseLeave={() => setHoveredLocation(null)}
                                />
                                <circle
                                  cx={location.x}
                                  cy={location.y}
                                  r={innerRadius}
                                  fill="#fff"
                                  className="pointer-events-none"
                                />
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
                className="absolute z-20 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[220px]"
                style={{
                  left: '50%',
                  bottom: '20px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-salaam-red-100 rounded-full flex items-center justify-center flex-shrink-0">
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
            <p className="text-xs text-gray-400">Scroll to zoom • Drag to pan</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-salaam-red-500 rounded-full border-2 border-white shadow"></div>
                <span className="text-xs text-gray-600">Store</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                <span className="text-xs text-gray-600">Region</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Store List */}
        {showStoreList && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Our Locations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 auto-rows-min">
              {storeLocations.map((location) => (
                <motion.div
                  key={location.id}
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
          </div>
        )}
      </div>
    </div>
  )
}
