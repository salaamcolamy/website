'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlassButton } from '@/components/ui/GlassButton'
import { GlassInput } from '@/components/ui/GlassInput'
// import { FileUpload } from '@/components/forms/FileUpload' // Hidden for now
import {
  Store,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
  Users,
  Send,
  CheckCircle,
  Heart,
  Globe,
  TrendingUp,
} from 'lucide-react'

const distributorTypes = [
  {
    icon: Store,
    title: 'Retail Partner',
    description: 'Stock Salaam Cola in your store, supermarket, or convenience outlet. Join our growing network of retail partners.',
    benefits: ['Competitive wholesale pricing', 'Marketing support', 'Regular stock availability'],
  },
  {
    icon: Building2,
    title: 'Business Partner',
    description: 'Serve Salaam Cola in your restaurant, cafe, or food service business. Perfect for F&B establishments.',
    benefits: ['Restaurant pricing', 'Menu integration support', 'Brand partnership opportunities'],
  },
  {
    icon: Briefcase,
    title: 'Corporate Partner',
    description: 'Bulk orders for events, offices, or corporate gifting. Make a statement with purpose-driven refreshments.',
    benefits: ['Volume discounts', 'Custom branding options', 'Corporate CSR alignment'],
  },
]

const whyPartner = [
  {
    icon: Heart,
    title: 'Purpose-Driven Brand',
    description: '10% of profits support global humanitarian causes',
  },
  {
    icon: Globe,
    title: 'Global Recognition',
    description: 'Available in 33 countries with growing demand',
  },
  {
    icon: TrendingUp,
    title: 'Growing Market',
    description: 'Ethical consumerism is on the rise in Malaysia',
  },
]

export default function JoinUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  })
  // const [cvFile, setCvFile] = useState<File | null>(null) // Hidden for now
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus('success')
    setFormData({ name: '', email: '', phone: '', position: '', message: '' })
    // setCvFile(null) // Hidden for now

    setTimeout(() => setStatus('idle'), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const scrollToContact = () => {
    document.getElementById('career')?.scrollIntoView({ behavior: 'smooth' })
  }

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
                Partner With Us
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-quora font-black text-gray-900 uppercase"
            >
              Join the{' '}
              <span className="text-salaam-red-500">Movement</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Whether you want to distribute Salaam Cola or build your career with us,
              we're excited to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Distribute Section */}
      <section className="py-20 relative">
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
                Distribution
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Distribute Salaam Cola
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bring purposeful refreshment to your customers. Partner with us to stock
                Malaysia's favorite ethical cola brand.
              </p>
            </motion.div>

            {/* Partner Types */}
            <motion.div
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6"
            >
              {distributorTypes.map((type) => (
                <motion.div key={type.title} variants={fadeInUp}>
                  <GlassCard className="h-full bg-white hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-salaam-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                      <type.icon className="w-8 h-8 text-salaam-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-salaam-red-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Why Partner */}
            <motion.div variants={fadeInUp} className="bg-gray-50 rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Partner With Salaam Cola?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {whyPartner.map((item) => (
                  <div key={item.title} className="text-center">
                    <div className="w-14 h-14 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <item.icon className="w-7 h-7 text-salaam-red-500" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeInUp} className="text-center">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Talk to Us
              </GlassButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left: Info */}
            <motion.div variants={fadeInLeft} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-salaam-red-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-salaam-red-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Build Your Career With Us
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Join a team that's making a difference. At Salaam Cola, we're not just
                selling beverages – we're building a movement for ethical consumption.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're always looking for passionate individuals who share our values
                and want to contribute to something meaningful. Whether you're in sales,
                marketing, operations, or logistics, we'd love to hear from you.
              </p>

              <div className="bg-white rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-gray-900">What We Look For</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-salaam-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Passion for ethical business practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-salaam-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Strong work ethic and team collaboration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-salaam-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Creative problem-solving mindset</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-salaam-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Desire to make a positive impact</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div variants={fadeInRight}>
              <GlassCard className="bg-white shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Your CV
                </h3>

                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Application Sent!</h4>
                    <p className="text-gray-600">
                      Thank you for your interest. We'll review your application and get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <GlassInput
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                      <GlassInput
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <GlassInput
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-gray-50 border-gray-200"
                      />
                      <div>
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500/50 transition-all duration-300"
                        >
                          <option value="">Position of Interest</option>
                          <option value="sales">Sales</option>
                          <option value="marketing">Marketing</option>
                          <option value="operations">Operations</option>
                          <option value="logistics">Logistics</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder="Tell us about yourself and why you want to join Salaam Cola"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500/50 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* CV Upload - Hidden for now
                    <FileUpload
                      onFileSelect={setCvFile}
                      label="Upload your CV/Resume"
                      maxSizeMB={5}
                    />
                    */}

                    <GlassButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      isLoading={status === 'loading'}
                      rightIcon={<Send className="w-5 h-5" />}
                    >
                      Submit Application
                    </GlassButton>
                  </form>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
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
              Have Questions?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Our team is ready to assist with any inquiries about distribution,
              partnerships, or career opportunities.
            </p>
            <a
              href="mailto:hello@salaamcolamy.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-salaam-red-500 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
