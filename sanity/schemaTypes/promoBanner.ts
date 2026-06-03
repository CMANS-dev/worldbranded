import { defineType, defineField } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const promoBanner = defineType({
  name: 'promoBanner',
  title: 'Promo Banner',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Banner Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Full Width', value: 'full' },
          { title: 'Half Width (2-column)', value: 'half' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link URL',
      type: 'string',
      description: 'Full banner link (สำหรับ layout: Full Width)',
    }),
    defineField({
      name: 'imageRight',
      title: 'Right Image (Half Width only)',
      type: 'image',
      options: { hotspot: true },
      description: 'รูปฝั่งขวา — ใช้เฉพาะ layout Half Width (2-column)',
    }),
    defineField({
      name: 'linkLeft',
      title: 'Left Link (Half Width only)',
      type: 'string',
      description: 'Link รูปซ้าย เช่น /shop?category=gift-for-him',
    }),
    defineField({
      name: 'linkRight',
      title: 'Right Link (Half Width only)',
      type: 'string',
      description: 'Link รูปขวา เช่น /shop?category=gift-for-her',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number = shown first',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'layout', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === 'full' ? 'Full Width' : 'Half Width',
        media,
      }
    },
  },
})
