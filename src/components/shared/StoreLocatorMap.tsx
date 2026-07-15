'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import {
  storeLocations,
  highlightedStates,
  hiddenStates,
  stateLabels,
  LIST_REGION_ORDER,
  groupLocationsByRegion,
  getStoreLocationStats,
  type StoreLocation,
} from '@/lib/storeLocations'
import { LocationStatsCounters } from '@/components/shared/LocationStatsCounters'

interface StoreLocatorMapProps {
  maxWidth?: string
  showStoreList?: boolean
  /** When true, match homepage (Supporters) design: glassmorphic map, dark-friendly list, etc. */
  variant?: 'default' | 'homepage'
}

export function StoreLocatorMap({ maxWidth = 'max-w-6xl', showStoreList = true, variant = 'default' }: StoreLocatorMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<StoreLocation | null>(null)
  const [svgContent, setSvgContent] = useState<string>('')
  const [zoomScale, setZoomScale] = useState(1)
  const isHomepage = variant === 'homepage'

  useEffect(() => {
    fetch('/images/malaysia-map.svg')
      .then(res => res.text())
      .then(svg => {
        let modifiedSvg = svg

        if (isHomepage) {
          // Homepage-style: glassmorphic states (semi-transparent white fill, faded white borders)
          modifiedSvg = modifiedSvg.replace(/fill="#[^"]*"/g, 'fill="rgba(255,255,255,0.15)"')
          modifiedSvg = modifiedSvg.replace(/fill='#[^']*'/g, "fill='rgba(255,255,255,0.15)'")
          modifiedSvg = modifiedSvg.replace(/stroke="#[^"]*"/g, 'stroke="rgba(255,255,255,0.3)"')
          modifiedSvg = modifiedSvg.replace(/stroke='#[^']*'/g, "stroke='rgba(255,255,255,0.3)'")
          modifiedSvg = modifiedSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="1"')
        } else {
          modifiedSvg = modifiedSvg.replace('fill="#6f9c76"', 'fill="#ffffff"')
          modifiedSvg = modifiedSvg.replace('stroke="#ffffff"', 'stroke="#94a3b8"')
          modifiedSvg = modifiedSvg.replace('stroke-width=".5"', 'stroke-width="1"')
          highlightedStates.forEach(stateId => {
            const regex = new RegExp(`id="${stateId}"`, 'g')
            modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" fill="#fecaca" stroke="#ef4444" stroke-width="1.5"`)
          })
        }

        hiddenStates.forEach(stateId => {
          const regex = new RegExp(`id="${stateId}"`, 'g')
          modifiedSvg = modifiedSvg.replace(regex, `id="${stateId}" style="display:none"`)
        })
        modifiedSvg = modifiedSvg.replace('<g id="label_points">', '<g id="label_points" style="display:none">')
        modifiedSvg = modifiedSvg.replace(/width="1000"/, '')
        modifiedSvg = modifiedSvg.replace(/height="332"/, '')
        modifiedSvg = modifiedSvg.replace(/viewbox="0 0 1000 332"/i, 'viewBox="50 40 200 280"')

        setSvgContent(modifiedSvg)
      })
  }, [isHomepage])

  const handleMouseEnter = (location: StoreLocation) => {
    setHoveredLocation(location)
  }

  const { locationCount, stateCount } = getStoreLocationStats()

  return (
    <div className={`${maxWidth} mx-auto`}>
      <LocationStatsCounters
        locationCount={locationCount}
        stateCount={stateCount}
        className="mb-10 flex flex-wrap justify-center gap-4"
        theme="dark"
      />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative">
          <div className={isHomepage ? 'relative overflow-hidden' : 'relative bg-salaam-red-100 rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden'}>
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
                    <div className="w-full relative">
                      {svgContent ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: svgContent }}
                          className={`w-full [&>svg]:w-full [&>svg]:h-auto ${isHomepage ? '[&>svg_path]:fill-[rgba(255,255,255,0.15)] [&>svg_path]:stroke-[rgba(255,255,255,0.3)] [&>svg_path]:stroke-width-[1] [&>svg_g_path]:fill-[rgba(255,255,255,0.15)] [&>svg_g_path]:stroke-[rgba(255,255,255,0.3)] [&>svg_g_path]:stroke-width-[1]' : ''}`}
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
                                fill={isHomepage ? '#ffffff' : '#475569'}
                                stroke={isHomepage ? 'none' : '#fff'}
                                strokeWidth={isHomepage ? 0 : 0.4}
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
            <p className={`text-xs ${isHomepage ? 'text-white/70' : 'text-gray-400'}`}>
              Use buttons to zoom • Drag to pan
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-salaam-red-500 rounded-full border-2 border-white shadow"></div>
                <span className={`text-xs ${isHomepage ? 'text-white/90' : 'text-gray-600'}`}>Store</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 border border-red-400 rounded"></div>
                <span className={`text-xs ${isHomepage ? 'text-white/90' : 'text-gray-600'}`}>Region</span>
              </div>
            </div>
          </div>
        </div>

        {showStoreList && (
          <div className="space-y-6">
            <h3 className={`text-lg font-bold mb-4 ${isHomepage ? 'text-white' : 'text-gray-900'}`}>Our Locations</h3>
            
            {/* Group locations by state; each location = individual glass card */}
            <div className="space-y-6">
              {(() => {
                const grouped = groupLocationsByRegion(storeLocations)

                return LIST_REGION_ORDER.map((stateName) => {
                  const locations = grouped[stateName] || []
                  if (locations.length === 0) return null

                  return (
                    <div key={stateName} className="space-y-3">
                      <h4 className={`font-bold text-sm ${isHomepage ? 'text-white' : 'text-gray-900'}`}>{stateName}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {locations.map((location) => (
                          <motion.div
                            key={location.id}
                            className={isHomepage
                              ? 'bg-white/20 backdrop-blur-md rounded-xl p-3 shadow-lg border-2 border-white/50 hover:shadow-xl hover:border-white/70 transition-all duration-300 cursor-pointer'
                              : 'bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-salaam-red-200 transition-all duration-300 cursor-pointer'}
                            onMouseEnter={() => handleMouseEnter(location)}
                            onMouseLeave={() => setHoveredLocation(null)}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isHomepage ? 'text-salaam-red-400' : 'text-salaam-red-500'}`} />
                              <span className={`font-medium text-sm leading-tight ${isHomepage ? 'text-white' : 'text-gray-900'}`}>{location.name}</span>
                            </div>
                            <p className={`text-xs pl-5 mt-0.5 leading-tight ${isHomepage ? 'text-white/80' : 'text-gray-500'}`}>
                              {location.address}
                              {location.comingSoon && (
                                <span className={`ml-1 ${isHomepage ? 'text-white/60' : 'text-gray-500'}`}>(AKAN DATANG)</span>
                              )}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>

            {/* PENGEDAR RASMI Section */}
            <motion.div
              className={isHomepage
                ? 'bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border-2 border-white/50 hover:shadow-xl hover:border-white/70 transition-all duration-300 mt-6'
                : 'bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-salaam-red-200 transition-all duration-300 mt-6'}
            >
              <h4 className={`font-bold text-sm mb-3 ${isHomepage ? 'text-white' : 'text-gray-900'}`}>PENGEDAR RASMI:</h4>
              <ul className={`space-y-1.5 text-xs ${isHomepage ? 'text-white/90' : 'text-gray-700'}`}>
                <li>
                  <span className={`font-medium ${isHomepage ? 'text-white' : 'text-gray-900'}`}>Perwira Niaga Malaysia (PERNAMA):</span>
                  <p className={`mt-0.5 ${isHomepage ? 'text-white/80' : 'text-gray-500'}`}>19 Lokasi</p>
                  <span>+603 - 3341 0572</span>
                </li>
                <li>
                  <span className={`font-medium ${isHomepage ? 'text-white' : 'text-gray-900'}`}>Hilal Resources:</span>{' '}
                  <span>012-220 2712</span>
                </li>
                <li>
                  <span className={`font-medium ${isHomepage ? 'text-white' : 'text-gray-900'}`}>Negeri Sembilan:</span>{' '}
                  <span>017 - 647 2960</span>
                </li>
                <li>
                  <span className={`font-medium ${isHomepage ? 'text-white' : 'text-gray-900'}`}>Langkawi:</span>{' '}
                  <span>04-952 3641 / 03-26164488 / 013-350 8171 / 018-9479288</span>
                </li>
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
