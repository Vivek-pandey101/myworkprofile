/**
 * Lightweight metadata about which skills have a reference guide.
 *
 * Kept separate from the (large) skillGuides.js content so the main portfolio
 * page can check "does this skill have a guide?" and build links WITHOUT
 * importing the full guide data — that heavy data only loads on reference.html.
 */
export const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-')

export const guideNames = [
  'AWS EC2',
  'AWS SES',
  'Nginx',
  'PM2',
  'Linux',
  'Git',
  'GitHub',
]

export const hasGuide = (name) => guideNames.includes(name)
