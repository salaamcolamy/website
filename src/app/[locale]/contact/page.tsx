'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@salaamcola.com',
    href: 'mailto:hello@salaamcola.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+60 12-345 6789',
    href: 'tel:+60123456789',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: 'Kuala Lumpur, Malaysia',
    href: '#',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon - Fri: 9AM - 6PM',
    href: '#',
  },
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/salaamcola', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/salaamcola', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/salaamcola', label: 'Twitter' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })

    setTimeout(() => setStatus('idle'), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-salaam-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-salaam-red-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-salaam-red-500/10 rounded-full text-salaam-red-500 font-medium text-sm mb-4">
                <MessageSquare className="w-4 h-4" />
                Get in Touch
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              We'd Love to{' '}
              <span className="text-salaam-red-500">Hear from You</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Have questions, feedback, or just want to say hello?
              We're here and ready to help.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div variants={fadeInLeft}>
              <GlassCard className="bg-white shadow-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <GlassInput
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                      <GlassInput
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>

                    <GlassInput
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-gray-50 border-gray-200"
                    />

                    <div>
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500/50 transition-all duration-300 resize-none"
                      />
                    </div>

                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={status === 'loading'}
                      rightIcon={<Send className="w-5 h-5" />}
                    >
                      Send Message
                    </GlassButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={fadeInRight} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {contactInfo.map((item) => (
                    <motion.a
                      key={item.title}
                      href={item.href}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-salaam-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-salaam-red-500 transition-colors">
                        <item.icon className="w-6 h-6 text-salaam-red-500 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <p className="font-medium text-gray-900">{item.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-salaam-red-500 hover:text-white transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <GlassCard className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500 space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-salaam-red-500/50" />
                  <p className="font-medium">Kuala Lumpur, Malaysia</p>
                  <p className="text-sm">Map integration coming soon</p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to common questions
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                {
                  q: 'Is Salaam Cola halal certified?',
                  a: 'Yes, all our products are 100% halal certified and comply with Islamic dietary standards.',
                },
                {
                  q: 'Where can I buy Salaam Cola?',
                  a: 'You can find our products at major retailers including AEON, myNEWS, 7-Eleven, and through our online shop.',
                },
                {
                  q: 'Do you ship nationwide?',
                  a: 'Yes, we deliver throughout Malaysia. Shipping is calculated at checkout based on your location.',
                },
                {
                  q: 'How does your community impact program work?',
                  a: 'A portion of every purchase goes directly to supporting communities across Malaysia through our giving program.',
                },
              ].map((faq, index) => (
                <GlassCard key={index} className="bg-white">
                  <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
