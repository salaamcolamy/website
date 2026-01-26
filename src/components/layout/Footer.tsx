import { Link } from '@/i18n/routing'
import { ThreadsIcon, TikTokIcon, XIcon, YouTubeIcon } from '@/components/icons/SocialIcons'
import { Instagram } from 'lucide-react'
import Image from 'next/image'

const brandsLinks = [
  { label: 'New arrivals', href: '/shop?sort=newest' },
  { label: 'Best sellers', href: '/shop?sort=popular' },
  { label: 'Original', href: '/shop?category=original' },
  { label: 'Zero Sugar', href: '/shop?category=zero-sugar' },
  { label: 'Keffiyeh Edition', href: '/shop?category=keffiyeh' },
]

const aboutLinks = [
  { label: 'Our story', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'Where Your Sip Goes', href: '/programs' },
  { label: 'Join Us', href: '/join-us' },
]

const connectLinks = [
  { label: 'Career', href: '/join-us#career' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
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
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* PepsiCo-style multi-column footer */}
      <div className="container mx-auto px-4 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <Link href="/" className="mb-4">
              <Image
                src="/Header-Logo-White-New.svg"
                alt="Salaam Cola"
                width={140}
                height={38}
                className="h-9 w-auto opacity-90"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(6000%) hue-rotate(355deg) brightness(90%) contrast(115%)',
                }}
              />
            </Link>
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-salaam-red-500 hover:border-salaam-red-200 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Brands</h4>
            <ul className="space-y-2.5">
              {brandsLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-salaam-red-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">About</h4>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-salaam-red-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2.5">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-salaam-red-500 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <p>&copy; Salaam Cola {new Date().getFullYear()}. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              <Link href="/terms" className="hover:text-salaam-red-500 transition-colors">Terms of Use</Link>
              <Link href="/privacy" className="hover:text-salaam-red-500 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
