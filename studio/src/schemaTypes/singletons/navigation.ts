import { defineArrayMember, defineField, defineType } from 'sanity'
import { MenuIcon } from '@sanity/icons'

const navItemFields = [
  defineField({ name: 'label', title: 'Label', type: 'string', validation: r => r.required() }),
  defineField({
    name: 'link',
    title: 'Link',
    type: 'cmsLink',
    validation: (rule) => rule.required(),
  }),
]

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            ...navItemFields,
            defineField({
              name: 'children',
              title: 'Dropdown items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: navItemFields,
                  preview: {
                    select: {
                      title: 'label',
                      linkKind: 'link.linkKind',
                      externalUrl: 'link.externalUrl',
                      internalPageSlug: 'link.internalPage.slug.current',
                      pageSectionSlug: 'link.pageSectionPage.slug.current',
                      anchorId: 'link.anchorId',
                    },
                    prepare({title, linkKind, externalUrl, internalPageSlug, pageSectionSlug, anchorId}) {
                      if (linkKind === 'internalPage') {
                        return {title, subtitle: internalPageSlug ? `/${internalPageSlug}` : '/'}
                      }

                      if (linkKind === 'pageSection') {
                        const route = pageSectionSlug ? `/${pageSectionSlug}` : '/'
                        return {title, subtitle: `${route}#${anchorId ?? 'anchor'}`}
                      }

                      return {title, subtitle: externalUrl ?? 'Incomplete link'}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'label',
              linkKind: 'link.linkKind',
              externalUrl: 'link.externalUrl',
              internalPageSlug: 'link.internalPage.slug.current',
              pageSectionSlug: 'link.pageSectionPage.slug.current',
              anchorId: 'link.anchorId',
            },
            prepare({title, linkKind, externalUrl, internalPageSlug, pageSectionSlug, anchorId}) {
              if (linkKind === 'internalPage') {
                return {title, subtitle: internalPageSlug ? `/${internalPageSlug}` : '/'}
              }

              if (linkKind === 'pageSection') {
                const route = pageSectionSlug ? `/${pageSectionSlug}` : '/'
                return {title, subtitle: `${route}#${anchorId ?? 'anchor'}`}
              }

              return {title, subtitle: externalUrl ?? 'Incomplete link'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: navItemFields,
          preview: {
            select: {
              title: 'label',
              linkKind: 'link.linkKind',
              externalUrl: 'link.externalUrl',
              internalPageSlug: 'link.internalPage.slug.current',
              pageSectionSlug: 'link.pageSectionPage.slug.current',
              anchorId: 'link.anchorId',
            },
            prepare({title, linkKind, externalUrl, internalPageSlug, pageSectionSlug, anchorId}) {
              if (linkKind === 'internalPage') {
                return {title, subtitle: internalPageSlug ? `/${internalPageSlug}` : '/'}
              }

              if (linkKind === 'pageSection') {
                const route = pageSectionSlug ? `/${pageSectionSlug}` : '/'
                return {title, subtitle: `${route}#${anchorId ?? 'anchor'}`}
              }

              return {title, subtitle: externalUrl ?? 'Incomplete link'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() { return { title: 'Navigation' } },
  },
})
