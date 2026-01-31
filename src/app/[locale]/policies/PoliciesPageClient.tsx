'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Link } from '@/i18n/routing'
import { fadeInUp, staggerContainer } from '@/lib/animations'

const lastUpdated = '31 January 2026'

const toc = [
  { id: 'payment-policy', label: 'Payment Policy' },
  { id: 'returns-refunds', label: 'Returns & Refund SOP' },
  { id: 'shipping-delivery', label: 'Shipping & Delivery' },
  { id: 'privacy-policy', label: 'Privacy Policy' },
  { id: 'terms-conditions', label: 'Terms & Conditions' },
  { id: 'contact', label: 'Contact' },
]

function TocLink({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:text-salaam-red-500 hover:ring-salaam-red-500/30 transition-colors"
    >
      {label}
    </a>
  )
}

export function PoliciesPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-24 left-10 w-72 h-72 bg-salaam-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-salaam-red-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
            >
              Policies
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600">
              Payment, returns/refunds SOP, shipping & delivery, privacy policy, and terms for using and ordering
              from Salaam Cola Malaysia.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-sm text-gray-500">
              Last updated: <span className="font-medium text-gray-700">{lastUpdated}</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* TOC */}
            <motion.div variants={fadeInUp}>
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quick links</h2>
                  <div className="flex flex-wrap gap-3">
                    {toc.map((item) => (
                      <TocLink key={item.id} id={item.id} label={item.label} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Looking for something else? You can also{' '}
                    <Link href="/contact" className="text-salaam-red-500 hover:underline font-medium">
                      contact us
                    </Link>{' '}
                    for help.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Payment Policy */}
            <motion.div variants={fadeInUp} id="payment-policy">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Policy</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This Payment Policy explains how payments are processed on Salaam Cola Malaysia (the “Site”),
                    what payment methods we accept, and how we handle issues such as failed or disputed payments.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Payment processor (Billplz)</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Payments on this Site are processed through <span className="font-medium text-gray-700">Billplz</span>.
                      When you proceed to pay, you may be redirected to Billplz’s payment flow to complete your
                      transaction securely.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Billplz is provided by <span className="font-medium text-gray-700">Billplz Sdn Bhd</span>{' '}
                      (Registration No.: <span className="font-medium text-gray-700">201201039375</span>{' '}
                      (1023853-P)).
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      We do <span className="font-medium text-gray-700">not</span> store your online banking credentials or
                      full card details on our servers. Payment details are handled by the payment provider and/or
                      its banking partners.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Accepted payment methods</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>
                        Online banking (e.g., FPX) and any other payment methods made available by Billplz at
                        checkout (availability may vary by bank, device, and browser).
                      </li>
                      <li>We do not accept cash on delivery unless explicitly stated at checkout.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Currency & pricing</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>All prices displayed on the Site are shown at checkout before you confirm payment.</li>
                      <li>
                        Your bank/card issuer may apply foreign exchange rates, conversion fees, or other charges.
                        These fees are not controlled by Salaam Cola Malaysia.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Payment confirmation</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Once Billplz confirms a successful payment, you should receive an order confirmation
                      (on-screen and/or via email). Please keep any Billplz reference (e.g., Bill ID/receipt) for
                      faster support.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      If you do not receive confirmation but your bank shows a successful payment, contact us with
                      your order details and the Billplz reference so we can trace the transaction.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Failed or reversed payments</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>
                        If a payment fails or is reversed, the order may not be created or may be cancelled.
                      </li>
                      <li>
                        If you see a “pending” or “authorization” hold, it may drop off automatically depending on
                        your bank (often within a few business days).
                      </li>
                      <li>
                        If you accidentally pay twice for the same order, contact us with both Billplz references so
                        we can verify and assist.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Fraud prevention</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To protect customers and reduce fraud, we may perform checks on orders. We may request
                      additional verification or cancel/refund an order if we reasonably suspect unauthorized or
                      fraudulent activity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Refunds</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Approved refunds are returned to the original payment method whenever possible. Timing
                      depends on your bank/payment provider (commonly 5–14 business days after we confirm the
                      refund).
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      If a dispute/chargeback is raised, we may request additional information to validate the
                      transaction and delivery outcome. Please contact us first so we can resolve the issue quickly.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      If you are unable to resolve a payment-related issue with us, you may also contact Billplz at{' '}
                      <a href="mailto:team@billplz.com" className="text-salaam-red-500 hover:underline font-medium">
                        team@billplz.com
                      </a>{' '}
                      and include your Billplz reference and order details.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Returns & Refund SOP */}
            <motion.div variants={fadeInUp} id="returns-refunds">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Returns & Refund SOP</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This SOP outlines how to request a return, replacement, or refund. We aim to resolve issues
                    quickly and fairly.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Eligibility</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>
                        For consumable goods (beverages), returns are generally accepted only for items that are
                        damaged, defective, incorrect, or missing on arrival.
                      </li>
                      <li>
                        For non-consumable items (e.g., merchandise), items must be unused, in original packaging,
                        and in resalable condition (unless they arrived damaged/defective).
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Timeframe to report an issue</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>
                        Please report damaged, defective, incorrect, or missing items within{' '}
                        <span className="font-medium text-gray-700">48 hours</span> of delivery (or the first
                        reasonable opportunity).
                      </li>
                      <li>
                        For merchandise returns (where applicable), request within{' '}
                        <span className="font-medium text-gray-700">7 days</span> of delivery unless stated
                        otherwise at checkout.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">How to request a return/refund</h3>
                    <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                      <li>
                        Contact us via the{' '}
                        <Link href="/contact" className="text-salaam-red-500 hover:underline font-medium">
                          Contact page
                        </Link>{' '}
                        with your order number.
                      </li>
                      <li>
                        Provide photos/videos of the issue (outer box, inner packaging, and affected items) and a
                        short description.
                      </li>
                      <li>
                        We will review and respond with the next step: replacement shipment, partial refund, full
                        refund, or additional information.
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Damaged or defective items</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If your order arrives damaged or defective, we may offer a replacement (where stock is
                      available) or a refund. We may request evidence and/or return of affected items depending on
                      the situation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Incorrect or missing items</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If an item is missing or you receive the wrong item, we’ll arrange a replacement shipment,
                      store credit, or refund depending on availability and your preference.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Non-returnable items</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>Opened consumable goods (unless defective/damaged on arrival).</li>
                      <li>Items damaged due to misuse, improper storage, or normal wear and tear.</li>
                      <li>Gift cards and digital items (if offered).</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Refund method & timing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If approved, refunds are processed back to the original payment method whenever possible.
                      Your bank/payment provider may take several business days to post the refund (commonly 5–14
                      business days).
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      Refunds relate only to the purchase made from Salaam Cola Malaysia. Billplz is the payment
                      processor and does not decide product fulfilment outcomes. For delivery/quality issues, please
                      contact us first so we can resolve it.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Shipping & Delivery */}
            <motion.div variants={fadeInUp} id="shipping-delivery">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping & Delivery</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This section explains how we process and ship orders. Shipping options, fees, and delivery
                    times shown at checkout are estimates and may vary due to factors outside our control.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Order processing</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>Orders are typically processed within 1–3 business days after successful payment.</li>
                      <li>
                        During promotions, public holidays, or high-demand periods, processing may take longer.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Delivery estimates</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>Delivery times are shown at checkout (where available) and may vary by location.</li>
                      <li>Delays can occur due to weather, customs, carrier disruptions, or remote areas.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Address accuracy</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Please ensure your delivery address and contact number are correct. If an order is returned
                      to us due to an incorrect address or failed delivery attempts, we may need to charge a
                      re-delivery fee or refund excluding shipping costs (where permitted by law).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Tracking</h3>
                    <p className="text-gray-600 leading-relaxed">
                      If tracking is available for your shipment, we’ll provide tracking details once the order is
                      dispatched.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Privacy Policy */}
            <motion.div variants={fadeInUp} id="privacy-policy">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Privacy Policy</h2>
                  <p className="text-gray-600 leading-relaxed">
                    This Privacy Policy describes how we collect, use, disclose, and protect personal information
                    when you use the Site or place an order.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">What we collect</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>
                        Contact details (such as name, email, phone number) and delivery information (such as
                        address).
                      </li>
                      <li>
                        Order and transaction details (such as products purchased, order totals, and payment status).
                      </li>
                      <li>
                        Technical data (such as device information, browser type, pages viewed, and approximate
                        location) collected via cookies or similar technologies.
                      </li>
                      <li>Customer support communications you send to us.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">How we use your information</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>To process orders, deliver products, and provide customer support.</li>
                      <li>To prevent fraud, secure transactions, and protect the Site.</li>
                      <li>To improve our products, services, and website experience.</li>
                      <li>
                        To send updates or marketing communications where you have opted in (you can unsubscribe at
                        any time).
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Sharing & disclosure</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We may share information with service providers strictly for operating the Site and fulfilling
                      orders (e.g., payment processors such as Billplz, logistics partners, hosting providers). We may
                      also disclose information if required by law or to protect our rights, users, and platform
                      integrity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Cookies</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We use cookies and similar technologies to enable core site functionality, remember
                      preferences, and analyze usage. You can manage cookies through your browser settings, but some
                      features may not work properly if cookies are disabled.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Data security & retention</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We take reasonable steps to protect personal information. No method of transmission or storage
                      is completely secure, so we cannot guarantee absolute security. We retain information only as
                      long as needed for the purposes described above, unless a longer retention period is required
                      by law.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Your rights</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Depending on your location and applicable law, you may have rights to request access,
                      correction, deletion, or restriction of your personal information. To make a request, contact
                      us via the Contact page.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div variants={fadeInUp} id="terms-conditions">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Terms & Conditions</h2>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing or using this Site, you agree to these Terms & Conditions. If you do not agree,
                    please do not use the Site.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Use of the Site</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>You agree to use the Site lawfully and not misuse or interfere with its operation.</li>
                      <li>You must not attempt to gain unauthorized access to accounts, systems, or data.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      <li>All orders are subject to acceptance and availability.</li>
                      <li>
                        We may cancel an order if we cannot verify payment, suspect fraud, detect pricing/stock
                        errors, or for other legitimate reasons.
                      </li>
                      <li>We reserve the right to limit quantities per order or per customer.</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Pricing & availability</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Prices, promotions, and product availability may change without notice. While we aim for
                      accuracy, errors may occur. If we discover an error affecting your order, we may contact you
                      to confirm, or we may cancel and refund the order.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Intellectual property</h3>
                    <p className="text-gray-600 leading-relaxed">
                      All content on the Site (including trademarks, logos, graphics, and text) is owned by or
                      licensed to Salaam Cola Malaysia and is protected by applicable laws. You may not reproduce,
                      distribute, or exploit content without prior written permission.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Disclaimers</h3>
                    <p className="text-gray-600 leading-relaxed">
                      The Site and its content are provided “as is” and “as available”. To the maximum extent
                      permitted by law, we disclaim warranties of any kind. Nothing in these terms limits consumer
                      rights that cannot be excluded under applicable law.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Limitation of liability</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To the maximum extent permitted by law, Salaam Cola Malaysia will not be liable for indirect,
                      incidental, special, or consequential losses arising from your use of the Site or products.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">Changes</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We may update these policies from time to time. Changes take effect when posted on this page.
                      Your continued use of the Site after changes are posted constitutes acceptance.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Contact */}
            <motion.div variants={fadeInUp} id="contact">
              <GlassCard className="bg-white" hover={false} padding="lg">
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Contact</h2>
                  <p className="text-gray-600 leading-relaxed">
                    If you have questions about payments, returns/refunds, shipping, or privacy, contact us and
                    we’ll help.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Email</p>
                      <a
                        href="mailto:hello@salaamcolamy.com"
                        className="text-sm text-salaam-red-500 hover:underline font-medium"
                      >
                        hello@salaamcolamy.com
                      </a>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Business hours</p>
                      <p className="text-sm text-gray-600">9.00am - 5.00pm</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Company</p>
                      <p className="text-sm text-gray-600">DUNYA DAMAI SDN BHD (1645635-W)</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">
                        Block B-03-01, No 21, Galeria Hartamas, Jalan 26A/70A Desa Sri Hartamas, 50480 Kuala Lumpur
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-full bg-salaam-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-salaam-red-600 transition-colors"
                    >
                      Contact support
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 hover:ring-salaam-red-500/30 hover:text-salaam-red-500 transition-colors"
                    >
                      Continue shopping
                    </Link>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

