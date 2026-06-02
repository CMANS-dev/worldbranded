import { defineType, defineField } from 'sanity'

export const shipping = defineType({
  name: 'shipping',
  title: 'Shipping Methods',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'ชื่อช่องทาง',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'รายละเอียด',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'ค่าส่ง (฿)',
      type: 'number',
      validation: r => r.required().min(0),
    }),
    defineField({
      name: 'estimatedDays',
      title: 'ระยะเวลาจัดส่ง',
      type: 'string',
      description: 'เช่น 2-3 วันทำการ',
    }),
    defineField({
      name: 'isActive',
      title: 'เปิดใช้งาน',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'ลำดับ',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'price' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `฿${subtitle}` }
    },
  },
})
