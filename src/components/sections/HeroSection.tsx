'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassButton } from '@/components/ui/GlassButton'
import { Link } from '@/i18n/routing'
import { ArrowRight, Leaf, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

// Slider images
const sliderImages = [
  {
    id: 1,
    src: '/ttt.jpg',
    alt: 'Salaam Cola lifestyle 1',
  },
  {
    id: 2,
    src: '/images/change/WhatsApp Image 2025-12-11 at 23.51.27.jpeg',
    alt: 'Salaam Cola products with KL skyline',
  },
  {
    id: 3,
    src: '/images/change/WhatsApp Image 2025-12-11 at 23.51.26.jpeg',
    alt: 'Salaam Cola drone delivery event',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-salaam-red-500">
      {/* Animated wavy background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated wave layer 1 - slowest, darkest */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[60%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.15)"
            d="M0,160L60,170.7C120,181,240,203,360,208C480,213,600,203,720,176C840,149,960,107,1080,101.3C1200,96,1320,128,1440,154.7C1560,181,1680,203,1800,197.3C1920,192,2040,160,2160,154.7C2280,149,2400,171,2520,176C2640,181,2760,171,2820,165.3L2880,160L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Animated wave layer 2 - medium speed */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[50%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [-1440, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(0,0,0,0.1)"
            d="M0,192L60,186.7C120,181,240,171,360,181.3C480,192,600,224,720,218.7C840,213,960,171,1080,154.7C1200,139,1320,149,1440,165.3C1560,181,1680,203,1800,202.7C1920,203,2040,181,2160,165.3C2280,149,2400,139,2520,149.3C2640,160,2760,192,2820,208L2880,224L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Animated wave layer 3 - fastest, lightest */}
        <motion.svg
          className="absolute bottom-0 left-0 w-[200%] h-[40%]"
          viewBox="0 0 2880 320"
          preserveAspectRatio="none"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        >
          <path
            fill="rgba(255,255,255,0.05)"
            d="M0,224L60,218.7C120,213,240,203,360,192C480,181,600,171,720,181.3C840,192,960,224,1080,229.3C1200,235,1320,213,1440,197.3C1560,181,1680,171,1800,176C1920,181,2040,203,2160,208C2280,213,2400,203,2520,186.7C2640,171,2760,149,2820,138.7L2880,128L2880,320L0,320Z"
          />
        </motion.svg>

        {/* Soft gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="space-y-2">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-quora font-black leading-none text-white uppercase tracking-wide"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Taste
                <br />
                <span className="block">The</span>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                >
                  Freedom
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-sm md:text-base text-white/90 max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                10% of all Profits go to Charitable Causes
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/shop">
                <GlassButton
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="bg-white text-salaam-red-500 hover:bg-white/90 border-0"
                >
                  Shop now
                </GlassButton>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">Organic Ingredients</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium">FDA Tested</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2 lg:-ml-44 xl:-ml-60"
          >
            {/* Slider Container - Landscape orientation */}
            <div className="relative aspect-[16/10] md:aspect-[16/9] lg:aspect-[16/9] lg:w-[96%] xl:w-[104%] rounded-3xl overflow-hidden shadow-2xl">
              {/* Images */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={sliderImages[currentSlide].src}
                    alt={sliderImages[currentSlide].alt}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay for better text visibility if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hidden lg:block"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hidden lg:block"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom wave transition to white */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-20 md:h-32"
        >
          <path
            fill="white"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  )
}
