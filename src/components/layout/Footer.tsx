'use client'

import { useState } from 'react'
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const shopLinks = [
  { label: 'New arrivals', href: '/shop?sort=newest' },
  { label: 'Best sellers', href: '/shop?sort=popular' },
  { label: 'Original', href: '/shop?category=original' },
  { label: 'Zero Sugar', href: '/shop?category=zero-sugar' },
  { label: 'Keffiyeh Edition', href: '/shop?category=keffiyeh' },
]

const helpLinks = [
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const aboutLinks = [
  { label: 'Our story', href: '/about' },
  { label: 'Contact us', href: '/contact' },
]

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/salaamcola' },
  { icon: Facebook, href: 'https://facebook.com/salaamcola' },
  { icon: Twitter, href: 'https://twitter.com/salaamcola' },
]

export function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Newsletter Section */}
          <div className="lg:col-span-2 space-y-4 text-center md:text-left">
            <span className="inline-block px-4 py-1.5 text-sm font-medium text-salaam-red-500 bg-salaam-red-50 backdrop-blur-sm border border-salaam-red-100 rounded-full">
              Newsletter
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Get 10% off your first purchase
            </h3>
            <p className="text-gray-500 text-sm">
              Be the first to know about new arrivals, special offers, in-store events and news
            </p>
            <form className="flex gap-2 max-w-md mx-auto md:mx-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-salaam-red-500/50 focus:border-salaam-red-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-salaam-red-500 text-white rounded-full font-semibold hover:bg-salaam-red-600 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Shop Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-salaam-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="font-semibold text-gray-900">Help</h4>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-salaam-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="font-semibold text-gray-900">About</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-salaam-red-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-salaam-red-500 hover:bg-gray-200 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              &copy; Salaam Cola {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
