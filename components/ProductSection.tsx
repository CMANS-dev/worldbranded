import ProductCard from './ProductCard'
import SearchBar from './SearchBar'

export interface SanityProduct {
  _id: string
  slug: string
  price: number
  name: string
  categories?: string[] | null
  description?: string | null
  brand?: string | null
  images?: { url: string; alt?: string }[] | null
}

interface ProductSectionProps {
  title: string
  products: SanityProduct[]
  showSearch?: boolean
}

export default function ProductSection({ title, products, showSearch = false }: ProductSectionProps) {
  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 mb-4">
        <div className="col-span-1 md:col-span-3 px-4 md:px-6 flex items-start">
          <h2 className="text-3xl md:text-4xl">{title}</h2>
        </div>
        {showSearch && <div className="px-4 md:px-0"><SearchBar /></div>}
      </div>

      <div className="px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-[10px]">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            slug={p.slug}
            price={p.price}
            name={p.name}
            images={p.images}
          />
        ))}
      </div>
    </section>
  )
}
