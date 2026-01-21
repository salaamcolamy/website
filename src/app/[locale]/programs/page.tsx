'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  Heart,
  Globe,
  Users,
  HandHeart,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Image from 'next/image'

const malaysiaPrograms = [
  {
    icon: Users,
    title: 'Youth Hangouts',
    description: 'We hit up the spots where the next generation chills, bringing the vibe and free cold colas to the youth.',
  },
  {
    icon: Building,
    title: 'Mosques & Orphanages',
    description: 'From Iftar at the Masjid to weekend visits at orphanages, we\'re there to share a meal, a drink, and a smile.',
  },
  {
    icon: HandHeart,
    title: 'Grassroots Giving',
    description: 'We don\'t wait for a "campaign." If there\'s a community that needs a boost, we load up the van and go.',
  },
]

export default function ProgramsPage() {
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
                Purpose-Driven
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-quora font-black text-gray-900 uppercase"
            >
              Where Your{' '}
              <span className="text-salaam-red-500">Sip Goes</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Every bottle of Salaam Cola contributes to meaningful change.
              10% of our profits support global humanitarian causes.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Global Mission Section */}
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-salaam-red-500/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-salaam-red-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Global Mission
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                While others stay silent, we act. We aren't just "raising awareness"—we're sending real aid where it's needed most.
              </p>
              <p className="text-gray-600 leading-relaxed">
                10% of each can, a significant portion of our profits goes directly to Muslim countries to provide food, medicine, and clean water.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5 text-salaam-red-500" />
                  <span className="font-medium">10% of Profits</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-full">
                  <Globe className="w-5 h-5 text-salaam-red-500" />
                  <span className="font-medium">33 Countries</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInRight}>
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/images/change/WhatsApp Image 2025-12-11 at 23.51.25.jpeg"
                  alt="Global Mission"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-medium">
                    Making a difference, one sip at a time
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Malaysia Section */}
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
              <span className="inline-block px-4 py-1.5 text-sm font-medium text-salaam-red-500 bg-salaam-red-50 rounded-full">
                Local Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                MALAYSIA: SERVING THE HOME TEAM
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We believe refreshment should be shared. We're taking the "Salaam Spirit" across Malaysia, showing up where it matters most:
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {malaysiaPrograms.map((program, index) => (
                <motion.div key={program.title} variants={fadeInUp}>
                  <GlassCard className="h-full bg-white text-center space-y-4 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 mx-auto bg-salaam-red-500/10 rounded-2xl flex items-center justify-center">
                      <program.icon className="w-8 h-8 text-salaam-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{program.title}</h3>
                    <p className="text-gray-600 text-sm">{program.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Closing Statement */}
            <motion.div variants={fadeInUp} className="text-center pt-8">
              <p className="text-xl md:text-2xl font-semibold text-gray-900">
                This isn't just charity. It's a community.
              </p>
              <p className="text-lg text-salaam-red-500 font-medium mt-2">
                Now you know where your sip goes.
              </p>
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
              Learn More About Our Global Impact
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Discover how Salaam Cola is making a difference in communities around the world
              through our parent company's charity initiatives.
            </p>
            <a
              href="https://salaamcola.com/charity/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Want to Partner With Us?
            </h2>
            <p className="text-gray-600">
              Whether you're a retailer, business, or individual looking to make a difference,
              we'd love to hear from you.
            </p>
            <Link
              href="/join-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors"
            >
              Join Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
