import { Link } from '@/i18n/routing'
import { Instagram } from 'lucide-react'
import { ThreadsIcon, TikTokIcon, XIcon, YouTubeIcon } from '@/components/icons/SocialIcons'

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
  { icon: Instagram, href: 'https://instagram.com/salaamcolamy' },
  { icon: ThreadsIcon, href: 'https://threads.net/@salaamcolamy' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@salaamcolamy' },
  { icon: XIcon, href: 'https://x.com/salaamcolamy' },
  { icon: YouTubeIcon, href: 'https://youtube.com/@salaamcolamy' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
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
