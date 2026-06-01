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
      type: 'url',
      description: 'Optional — link when clicking the banner',
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
