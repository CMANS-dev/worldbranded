import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // false เมื่อต้องการข้อมูลล่าสุด เช่น ตอน build
})
