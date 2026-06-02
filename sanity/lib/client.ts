import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// client สำหรับ fetch ข้อมูลทั่วไป — bypass Next.js Data Cache ทุกครั้ง
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  fetchOptions: { cache: 'no-store' },
})

// client สำหรับ on-demand revalidation (ใช้คู่กับ revalidateTag)
// เก็บ cache ไว้แต่ผูกกับ tag 'products' เพื่อให้ webhook invalidate ได้
export const cachedClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  fetchOptions: { next: { tags: ['products'] } } as RequestInit,
})
