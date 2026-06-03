import Link from 'next/link'

export interface PromoBannerData {
  _id: string
  layout: 'full' | 'half'
  image?: string | null
  imageRight?: string | null
  link?: string | null
  linkLeft?: string | null
  linkRight?: string | null
}

interface PromoBannerProps {
  banner: PromoBannerData
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  if (banner.layout === 'half') {
    return (
      <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {/* Left */}
        <BannerPanel
          imageUrl={banner.image}
          link={banner.linkLeft ?? '/shop?category=gift-for-him'}
        />
        {/* Right */}
        <BannerPanel
          imageUrl={banner.imageRight}
          link={banner.linkRight ?? '/shop?category=gift-for-her'}
        />
      </div>
    )
  }

  // Full width
  const inner = (
    <div
      className="w-full h-[75vw] md:h-[calc(100vh-10rem)] bg-[#D8D8D8] bg-cover bg-center"
      style={banner.image ? { backgroundImage: `url(${banner.image})` } : undefined}
    />
  )

  return (
    <div className="px-4 md:px-6">
      {banner.link ? <Link href={banner.link}>{inner}</Link> : inner}
    </div>
  )
}

function BannerPanel({ imageUrl, link }: { imageUrl?: string | null; link: string }) {
  return (
    <Link href={link} className="block relative overflow-hidden group">
      <div
        className="bg-[#D8D8D8] h-[60vw] md:h-[calc(100vh-10rem)] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
    </Link>
  )
}
