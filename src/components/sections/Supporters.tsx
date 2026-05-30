'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Image from 'next/image'
import {
  storeLocations,
  hiddenStates,
  stateLabels,
  LIST_REGION_ORDER,
  groupLocationsByRegion,
  type StoreLocation,
} from '@/lib/storeLocations'

export function Supporters() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredLocation, setHoveredLocation] = useState<StoreLocation | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [zoomScale, setZoomScale] = useState(1)

  // States to hide (East Malaysia - Sabah & Sarawak)

  useEffect(() => {
    // Fetch and modify the SVG
    fetch('/images/malaysia-map.svg')
      .then(res => res.text())
      .then(svg => {
        // Modify SVG to highlight states
        let modifiedSvg = svg

        // Glassmorphic states: semi-transparent white fill, faded borders
        // Replace all fill colors with transparent white
        modifiedSvg = modifiedSvg.replace(/fill="#[^"]*"/g, 'fill="rgba(255,255,255,0.15)"')
        modifiedSvg = modifiedSvg.replace(/fill='#[^']*'/g, "fill='rgba(255,255,255,0.15)'")
        // Replace all stroke colors with faded white (remove grey)
        modifiedSvg = modifiedSvg.replace(/stroke="#[^"]*"/g, 'stroke="rgba(255,255,255,0.3)"')
        modifiedSvg = modifiedSvg.replace(/stroke='#[^']*'/g, "stroke='rgba(255,255,255,0.3)'")
        modifiedSvg = modifiedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1"')

        // Hide East Malaysia states (Sabah & Sarawak)
        hiddenStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" style="display:none"`)
        })

        // Hide label_points group (we use our own overlay labels)
        modifiedSvg = modifiedSvg.replace('<g id="label_points">', '<g id="label_points" style="display:none">')

        // Adjust viewBox to focus on Peninsular Malaysia only (crop out East Malaysia)
        modifiedSvg = modifiedSvg.replace(/width="1000"/, '')
        modifiedSvg = modifiedSvg.replace(/height="332"/, '')
        modifiedSvg = modifiedSvg.replace(/viewbox="0 0 1000 332"/i, 'viewBox="50 40 200 280"')

        // All states get glassmorphic style (already applied above via global replace)

        setSvgContent(modifiedSvg)
      })
  }, [])

  const handleMouseEnter = (location: StoreLocation) => {
    setHoveredLocation(location)
  }

  return (
    <section id="supporters" ref={ref} className="py-16 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/ttt.jpg"
          alt="Salaam Cola background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-2 uppercase">
            GET YOUR SALAAM COLA
          </h2>
          <p className="text-white/90">Find us across Malaysia</p>
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
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerOnInit={true}
              wheel={{ disabled: true }}
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
                    {svgContent ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        className="w-full [&>svg]:w-full [&>svg]:h-auto [&>svg_path]:fill-[rgba(255,255,255,0.15)] [&>svg_path]:stroke-[rgba(255,255,255,0.3)] [&>svg_path]:stroke-width-[1] [&>svg_g_path]:fill-[rgba(255,255,255,0.15)] [&>svg_g_path]:stroke-[rgba(255,255,255,0.3)] [&>svg_g_path]:stroke-width-[1]"
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
                                fill="#ffffff"
                                stroke="none"
                                strokeWidth={0}
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
                            // Scale markers inversely with zoom (smaller base size)
                            const baseRadius = 4
                            const markerRadius = baseRadius / zoomScale
                            const innerRadius = 1.5 / zoomScale
                            const strokeW = 1 / zoomScale

                            return (
                              <g key={location.id} className="pointer-events-auto">
                                {/* Main marker */}
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
                                {/* Inner dot */}
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
                {/* Arrow pointing down */}
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

            {/* Legend & Instructions */}
            <div className="flex flex-col items-center gap-2 mt-4">
              <p className="text-xs text-white/70">Use buttons to zoom • Drag to pan</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-salaam-red-500 rounded-full border-2 border-white shadow"></div>
                  <span className="text-xs text-white/90">Store</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                  <span className="text-xs text-white/90">Region</span>
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
            <h3 className="text-lg font-bold text-white mb-4">Our Locations</h3>
            <div className="space-y-6">
              {/* Group locations by state; each location = individual glass card */}
              {(() => {
                const grouped = groupLocationsByRegion(storeLocations)

                return LIST_REGION_ORDER.map((stateName, stateIndex) => {
                  const locations = grouped[stateName] || []
                  if (locations.length === 0) return null

                  return (
                    <motion.div
                      key={stateName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.4 + stateIndex * 0.1 }}
                      className="space-y-3"
                    >
                      <h4 className="font-bold text-sm text-white">{stateName}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {locations.map((location, locIndex) => (
                          <motion.div
                            key={location.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.2, delay: 0.5 + stateIndex * 0.1 + locIndex * 0.05 }}
                            className="bg-white/20 backdrop-blur-md rounded-xl p-3 shadow-lg border-2 border-white/50 hover:shadow-xl hover:border-white/70 transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => handleMouseEnter(location)}
                            onMouseLeave={() => setHoveredLocation(null)}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-salaam-red-400" />
                              <span className="font-medium text-sm leading-tight text-white">{location.name}</span>
                            </div>
                            <p className="text-xs text-white/80 pl-5 mt-0.5 leading-tight">
                              {location.address}
                              {location.comingSoon && (
                                <span className="ml-1 text-white/60">(AKAN DATANG)</span>
                              )}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                })
              })()}
            </div>

            {/* PENGEDAR RASMI Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border-2 border-white/50 hover:shadow-xl hover:border-white/70 transition-all duration-300 mt-6"
            >
              <h4 className="font-bold text-sm mb-3 text-white">PENGEDAR RASMI:</h4>
              <ul className="space-y-1.5 text-xs text-white/90">
                <li>
                  <span className="font-medium text-white">Hilal Resources:</span>{' '}
                  <span>012-220 2712</span>
                </li>
                <li>
                  <span className="font-medium text-white">Negeri Sembilan:</span>{' '}
                  <span>017 - 647 2960</span>
                </li>
                <li>
                  <span className="font-medium text-white">Langkawi:</span>{' '}
                  <span>04-952 3641 / 03-26164488 / 013-350 8171 / 018-9479288</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
