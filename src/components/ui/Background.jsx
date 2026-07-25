/**
 * Ambient page background: base gradient, subtle grid, and two lightweight
 * animated color blobs. Purely decorative — hidden from assistive tech.
 *
 * Perf notes: blobs animate translate only (compositor-friendly) and use a
 * moderate blur. A static third accent adds depth without a third animation.
 */
export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[#0b1120]" />

      {/* Grid overlay, faded toward the bottom */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />

      {/* Animated blobs (translate-only) */}
      <div className="absolute -left-32 top-[-6rem] h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-[90px] animate-blob" />
      <div
        className="absolute right-[-8rem] top-[25%] h-[24rem] w-[24rem] rounded-full bg-secondary/15 blur-[90px] animate-blob"
        style={{ animationDelay: '-8s' }}
      />

      {/* Static accent for depth (no animation) */}
      <div className="absolute bottom-[-8rem] left-[35%] h-[22rem] w-[22rem] rounded-full bg-violet-500/10 blur-[100px]" />

      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  )
}
