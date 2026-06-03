import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const coupon = defineType({
  name: 'coupon',
  title: 'Coupon',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'code',
      title: 'Coupon Code',
      type: 'string',
      description: 'ตัวพิมพ์ใหญ่ ไม่มีเว้นวรรค เช่น SAVE10, FREESHIP',
      validation: (rule) => rule.required().uppercase(),
    }),
    defineField({
      name: 'type',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: '% ส่วนลด (Percent)', value: 'percent' },
          { title: 'ฟรีค่าส่ง (Free Shipping)', value: 'free_shipping' },
        ],
        layout: 'radio',
      },
      initialValue: 'percent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Discount Value (%)',
      type: 'number',
      description: 'ใส่เฉพาะประเภท "% ส่วนลด" เช่น 10 = ลด 10%',
      hidden: ({ document }) => document?.type === 'free_shipping',
      validation: (rule) =>
        rule.custom((val, ctx) => {
          if (ctx.document?.type === 'percent' && !val) return 'กรุณาใส่ค่า % ส่วนลด'
          if (val && (val <= 0 || val > 100)) return 'ต้องอยู่ระหว่าง 1–100'
          return true
        }),
    }),
    defineField({
      name: 'minOrderAmount',
      title: 'ยอดขั้นต่ำ (฿)',
      type: 'number',
      description: 'ถ้าไม่กำหนดจะไม่มีขั้นต่ำ',
      initialValue: 0,
    }),
    defineField({
      name: 'usageLimit',
      title: 'จำนวนครั้งที่ใช้ได้ทั้งหมด',
      type: 'number',
      description: 'ถ้าไม่กำหนดจะไม่จำกัด',
    }),
    defineField({
      name: 'usedCount',
      title: 'จำนวนครั้งที่ใช้ไปแล้ว',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'expiresAt',
      title: 'วันหมดอายุ',
      type: 'datetime',
      description: 'ถ้าไม่กำหนดจะไม่มีวันหมดอายุ',
    }),
    defineField({
      name: 'isActive',
      title: 'เปิดใช้งาน',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'code',
      type: 'type',
      value: 'value',
      active: 'isActive',
    },
    prepare({ title, type, value, active }) {
      const label = type === 'free_shipping' ? 'ฟรีค่าส่ง' : `${value}% ส่วนลด`
      return {
        title,
        subtitle: `${label} ${active ? '✅' : '❌ ปิดใช้งาน'}`,
      }
    },
  },
})
