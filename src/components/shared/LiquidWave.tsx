'use client'

const COLA = '#c21316'

export function LiquidWave({ className = '' }: { className?: string }) {
  return (
    <div
      className={`w-full overflow-hidden pointer-events-none ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-24 lg:h-28 block"
      >
        <path
          fill={COLA}
          d="M0,64 C180,100 360,28 540,64 C720,100 900,28 1080,64 C1260,100 1380,50 1440,64 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  )
}
