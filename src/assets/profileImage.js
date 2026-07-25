/**
 * Auto-detects a profile photo dropped into this folder.
 *
 * Drop a file named `profile.jpg` (or .jpeg/.png/.webp) into `src/assets/`
 * and it will automatically be used for the hero image AND the browser
 * favicon. No other changes needed. If no file is present, the UI falls
 * back to the "VP" monogram.
 *
 * `import.meta.glob` resolves at build time and returns an empty object
 * when nothing matches, so the build never breaks either way.
 */
const matches = import.meta.glob('./profile.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const profileImage = Object.values(matches)[0] || null

export default profileImage
