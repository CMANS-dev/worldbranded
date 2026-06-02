import { defineQuery } from 'next-sanity'

// ── Product projection ─────────────────────────────────────────────────────
const productProjection = `
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  price,
  categories,
  description,
  inStock,
  tags,
  "brand": brand->name,
  "images": images[]{
    "url": asset->url,
    alt
  }
`

// ── New Arrivals (tag: new-arrival) ───────────────────────────────────────
export const NEW_ARRIVALS_QUERY = defineQuery(`
  *[_type == "product" && "new-arrival" in tags && inStock == true]
  | order(_createdAt desc)[0...8] {
    ${productProjection}
  }
`)

// ── On Sale (tag: on-sale) ────────────────────────────────────────────────
export const ON_SALE_QUERY = defineQuery(`
  *[_type == "product" && "on-sale" in tags && inStock == true]
  | order(_createdAt desc)[0...8] {
    ${productProjection}
  }
`)

// ── All Products (with optional category filter) ──────────────────────────
export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product" && inStock == true
    && ($category == "" || $category in categories)]
  | order(_createdAt desc) {
    ${productProjection}
  }
`)

// ── Single Product by slug ────────────────────────────────────────────────
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    ${productProjection}
  }
`)

// ── Shipping Methods ──────────────────────────────────────────────────────
export const SHIPPING_QUERY = defineQuery(`
  *[_type == "shipping" && isActive == true] | order(order asc) {
    _id,
    name,
    description,
    price,
    estimatedDays,
  }
`)

// ── Promo Banners ─────────────────────────────────────────────────────────
export const PROMO_BANNERS_QUERY = defineQuery(`
  *[_type == "promoBanner"] | order(order asc) {
    _id,
    title,
    layout,
    link,
    "image": image.asset->url
  }
`)
