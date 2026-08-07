/**
 * Post Category Definitions
 * Maps backend CategoryEnum values to key, label, and SVG icon path.
 */
export const POST_CATEGORIES = {
  general: {
    key: 'general',
    label: 'General',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z'
  },
  announcement: {
    key: 'announcement',
    label: 'Announcement',
    icon: 'M10.34 15.84c-.012 0-.025 0-.037 0a3.375 3.375 0 0 1-3.264-2.48l-.133-.497H4.5A2.25 2.25 0 0 1 2.25 10.6v-.2A2.25 2.25 0 0 1 4.5 8.15h2.406l.133-.497a3.375 3.375 0 0 1 3.264-2.48c.012 0 .025 0 .037 0h.034a.75.75 0 0 1 .75.75v9.17c0 .414-.336.747-.75.75h-.034ZM15.75 10.5a3.75 3.75 0 0 0-1.5-3M18.75 10.5a6.75 6.75 0 0 0-3-5.5'
  },
  awarding: {
    key: 'awarding',
    label: 'Awarding',
    icon: 'M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-6.75c-.621 0-1.125.504-1.125 1.125v3.375m9 0h-9M9 6h6m-6 3h6m-6 3h6M5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v2.25A2.25 2.25 0 0 1 18.75 9.75H5.25A2.25 2.25 0 0 1 3 7.5V5.25A2.25 2.25 0 0 1 5.25 3Z'
  },
  event: {
    key: 'event',
    label: 'Event',
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5'
  },
  reminder: {
    key: 'reminder',
    label: 'Reminder',
    icon: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
  }
}

export const CATEGORY_LIST = Object.values(POST_CATEGORIES)

export const getCategoryMeta = (categoryKey) => {
  if (!categoryKey || typeof categoryKey !== 'string') {
    return POST_CATEGORIES.general
  }
  const key = categoryKey.toLowerCase()
  return POST_CATEGORIES[key] || POST_CATEGORIES.general
}
