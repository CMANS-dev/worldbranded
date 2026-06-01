import FooterWordmark from './FooterWordmark'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 overflow-hidden">

      {/* ── Top: 3 columns ── */}
      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 pb-12 md:pb-16">

        {/* Client Services */}
        <div>
          <h3 className="font-serif text-2xl mb-5">Client Services</h3>
          <ul className="space-y-2 font-inter font-regular text-base text-gray-900">
            <li><a href="#" className="hover:opacity-50 transition-opacity">Order tracking</a></li>
            <li><a href="#" className="hover:opacity-50 transition-opacity">FAQ</a></li>
          </ul>
        </div>

        {/* Sitemap */}
        <div>
          <h3 className="font-serif text-2xl mb-5">Sitemap</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-inter font-regular text-base text-gray-900">
            <a href="/" className="hover:opacity-50 transition-opacity">Home</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Gift for him</a>
            <a href="/shop" className="hover:opacity-50 transition-opacity">Shop</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Gift for her</a>
            <a href="/account" className="hover:opacity-50 transition-opacity">Profile</a>
            <a href="#" className="hover:opacity-50 transition-opacity">New arrivals</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Shopping bag</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Hot deals</a>
          </div>
        </div>

        {/* Inquiry */}
        <div>
          <h3 className="font-serif text-2xl mb-5">Inquiry</h3>
          <div className="font-inter font-regular text-base text-gray-900 space-y-4">
            <p className="leading-relaxed">
              Monday to Saturday (excluding public holidays)<br />
              10:00–20:00
            </p>
            <p className="leading-relaxed text-gray-500">
              We currently do not have any advisors available to assist you via chat.
            </p>
            <a href="mailto:hello@worldbranded.com" className="underline underline-offset-2 hover:opacity-50 transition-opacity">
              Inquiries via email
            </a>
          </div>
        </div>

      </div>

      {/* ── Bottom: full-width wordmark ── */}
      <FooterWordmark />

    </footer>
  )
}
