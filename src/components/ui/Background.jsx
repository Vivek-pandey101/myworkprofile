/**
 * Ambient page background: base gradient, subtle grid, and animated
 * color blobs. Purely decorative — hidden from assistive tech.
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
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />

      {/* Animated blobs */}
      <div className="absolute -left-32 top-[-6rem] h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px] animate-blob" />
      <div
        className="absolute right-[-8rem] top-[20%] h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-[120px] animate-blob"
        style={{ animationDelay: '-6s' }}
      />
      <div
        className="absolute bottom-[-8rem] left-[30%] h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-[130px] animate-blob"
        style={{ animationDelay: '-12s' }}
      />

      {/* Top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  )
}
