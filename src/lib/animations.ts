import { Variants } from 'framer-motion'

// Fade-in variants for sections
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -60
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export const fadeIn: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

// Stagger children animations
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

// Scale animations for cards
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  }
}

// Glass reveal effect
export const glassReveal: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(20px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }
}

// Float animation for products
export const floatAnimation: Variants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Slide in from sides (useful for drawers)
export const slideInRight: Variants = {
  hidden: {
    x: '100%',
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

export const slideInLeft: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}

// Overlay animation
export const overlayAnimation: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
}

// Button hover variants
export const buttonHover = {
  scale: 1.05,
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10
  }
}

export const buttonTap = {
  scale: 0.98
}

// Card hover variants
export const cardHover = {
  scale: 1.02,
  y: -5,
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  transition: {
    duration: 0.3
  }
}

// Text character animation
export const letterAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

// Parallax scroll configurations
export const parallaxConfig = {
  slow: { inputRange: [0, 1], outputRange: ['0%', '-10%'] },
  medium: { inputRange: [0, 1], outputRange: ['0%', '-20%'] },
  fast: { inputRange: [0, 1], outputRange: ['0%', '-30%'] },
}

// Page transition variants
export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
}
