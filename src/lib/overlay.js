/**
 * Overlay a translation on top of the English guide.
 *
 * Arrays are merged by position, objects key by key, and anything the
 * translation omits keeps its English value. That fallback is the point:
 * a half-finished translation degrades to English instead of blank space,
 * and code fields (cmd, content, path) simply never appear in the patch.
 */
export function overlay(base, patch) {
  if (patch === undefined || patch === null) return base
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return patch
    return base.map((item, i) => overlay(item, patch[i]))
  }
  if (base && typeof base === 'object' && !Array.isArray(patch)) {
    if (typeof patch !== 'object') return patch
    const out = { ...base }
    for (const key of Object.keys(patch)) out[key] = overlay(base[key], patch[key])
    return out
  }
  return patch
}

export default overlay
