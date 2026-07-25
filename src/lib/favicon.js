import profileImage from '../assets/profileImage'

/**
 * Set the browser-tab favicon to the profile photo (if one is present),
 * so every page/entry shows the same icon instead of the default.
 */
export function applyFavicon() {
  if (!profileImage) return
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/jpeg'
  link.href = profileImage
}
