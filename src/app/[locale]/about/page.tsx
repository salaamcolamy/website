'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { Link } from '@/i18n/routing'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import {
  Heart,
  Users,
  Globe,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'
import Image from 'next/image'

const values = [
  {
    icon: Heart,
    title: 'Purpose-Driven',
    description: 'Every bottle sold contributes to meaningful change in communities across Malaysia.',
  },
  {
    icon: Globe,
    title: '100% Halal',
    description: 'Certified halal production ensuring quality and compliance with Islamic standards.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in empowering local communities and creating positive social impact.',
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'Premium ingredients and rigorous quality control for the perfect taste.',
  },
]

const milestones = [
  { year: '2020', title: 'Founded', description: 'Salaam Cola was born with a vision for ethical refreshment' },
  { year: '2021', title: 'First Production', description: 'Launched our first batch of Mister Cola' },
  { year: '2022', title: 'Retail Expansion', description: 'Available in AEON, myNEWS, and 7-Eleven nationwide' },
  { year: '2023', title: 'Community Impact', description: 'Reached 50+ communities through our giving program' },
  { year: '2024', title: 'Growing Strong', description: 'Expanding product line and deepening our impact' },
]

export default function AboutPage() {
  const t = useTranslations('mission')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-salaam-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-salaam-red-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-salaam-red-500/10 rounded-full text-salaam-red-500 font-medium text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Our Story
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              Refreshing with{' '}
              <span className="text-salaam-red-500">Purpose</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              We're not just making cola. We're building a movement for ethical
              refreshment that empowers communities and delivers exceptional taste.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInLeft} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t('title')}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t('description')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Founded in Malaysia, Salaam Cola represents a new wave of conscious
                consumerism. We believe that what you drink should not only taste
                great but also contribute to something greater than yourself.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-salaam-red-500" />
                  <span>Halal Certified</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-salaam-red-500" />
                  <span>Malaysian Made</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-salaam-red-500" />
                  <span>Community Focused</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/images/change/WhatsApp Image 2025-12-11 at 23.51.22.jpeg"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 p-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center"
                    >
                      <Target className="w-16 h-16 text-white" />
                    </motion.div>
                    <p className="text-2xl font-bold">Our Mission</p>
                    <p className="text-white/80 max-w-xs mx-auto">
                      To create positive change, one refreshing sip at a time
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Values
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div key={value.title} variants={fadeInUp}>
                  <GlassCard className="h-full bg-white text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-salaam-red-500/10 rounded-2xl flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-salaam-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Journey
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From a bold idea to a growing movement
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-salaam-red-500/20" />

                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-6 pb-8 last:pb-0"
                  >
                    {/* Timeline dot */}
                    <div className="w-16 h-16 rounded-full bg-salaam-red-500 text-white flex items-center justify-center font-bold text-sm z-10 flex-shrink-0">
                      {milestone.year}
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-salaam-red-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Taste the Freedom?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Join thousands of Malaysians who have made the switch to purposeful refreshment.
            </p>
            <Link href="/shop">
              <GlassButton
                variant="secondary"
                size="lg"
                className="bg-white text-salaam-red-500 hover:bg-white/90"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Shop Now
              </GlassButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
