import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  slug: string
  price: number
  name: string
  description?: string | null
  images?: { url: string; alt?: string }[] | null
  // fallback สำหรับกรณีส่ง image string เดียว
  image?: string | null
}

export default function ProductCard({ slug, price, name, description, images, image }: ProductCardProps) {
  const img1 = images?.[0]?.url ?? image ?? null
  const img2 = images?.[1]?.url ?? null

  return (
    <Link href={`/products/${slug}`} className="group block">
      {/* Image */}
      <div className="relative w-full aspect-[2/3] bg-[#D8D8D8] overflow-hidden">
        {img1 && (
          <Image
            src={img1}
            alt={name}
            fill
            className={`object-cover transition-opacity duration-500 ${img2 ? 'group-hover:opacity-0' : 'group-hover:scale-105'} transition-all`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {img2 && (
          <Image
            src={img2}
            alt={name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-8">
        <p className="text-md">฿{price.toLocaleString()}</p>
        <p className="text-md">{name}</p>
      </div>
    </Link>
  )
}
