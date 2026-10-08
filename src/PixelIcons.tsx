// ─── Pixel-Art Sprite System ─────────────────────────────────────────────────
// All sprites rendered as SVG grids with imageRendering: pixelated.
// Each named export is a self-contained component with a `scale` prop
// (pixels-per-grid-cell, default 2).

const _: null = null // transparent cell

type Px = string | null
type SpriteMap = Px[][]

export function Sprite({
  map,
  scale = 2,
  className,
  style,
}: {
  map: SpriteMap
  scale?: number
  className?: string
  style?: React.CSSProperties
}) {
  const h = map.length
  const w = map[0]?.length ?? 0
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        imageRendering: "pixelated",
        display: "block",
        flexShrink: 0,
        ...style,
      }}
      shapeRendering="crispEdges"
      className={className}
    >
      {map.flatMap((row, y) =>
        row.map((c, x) =>
          c ? (
            <rect key={`${x}:${y}`} x={x} y={y} width={1} height={1} fill={c} />
          ) : null,
        ),
      )}
    </svg>
  )
}

// ─── Palette ─────────────────────────────────────────────────────────────────

// Stone / UI
const St = "#3D4B63" // stone
const Sl = "#64748B" // stone light
const Ss = "#262E40" // stone shadow
const Sm = "#94A3B8" // stone mid

// Gold
const Gb = "#FCD34D" // gold bright
const Gd = "#F59E0B" // gold
const Gk = "#D97706" // gold dark

// Red
const Rd = "#EF4444" // red
const Rk = "#DC2626" // red dark

// Purple / arcane
const Pp = "#A855F7" // purple
const Pd = "#7C3AED" // purple dark
const Pl = "#818CF8" // arcane light

// Blue
const Bl = "#0EA5E9" // sky blue
const Bk = "#0369A1" // sky dark
const Bn = "#1E40AF" // navy

// Green
const Gr = "#10B981" // emerald
const Gn = "#22c55e" // green
const Gl = "#4ade80" // light green
const Gd2 = "#16a34a" // dark green

// Orange
const Or = "#F97316" // orange

// White / highlight
const Wh = "#F8FAFC" // white
const Wl = "#CBD5E1" // light grey
const Hi = "#FEF3C7" // gold highlight

// Dark
const Dk = "#090A0F" // abyss
const Ds = "#131722" // dungeon

// Brown
const Br = "#92400E" // brown
const Bw = "#78350F" // dark brown

// Skin
const Sk = "#FBBF24" // amber skin
const Sh = "#D97706" // skin dark

// ─── Tower (12 × 16) ─────────────────────────────────────────────────────────

const TOWER_MAP: SpriteMap = [
  [St, _, _, St, St, St, St, St, St, _, _, St],
  [St, _, _, St, Sl, Sl, Sl, Sl, St, _, _, St],
  [St, St, St, St, St, St, St, St, St, St, St, St],
  [St, Sl, Sl, St, Sl, Sl, Sl, Sl, St, Sl, Sl, St],
  [St, Dk, Dk, St, Sl, Sl, Sl, Sl, St, Dk, Dk, St],
  [St, Dk, Dk, St, Sl, Sl, Sl, Sl, St, Dk, Dk, St],
  [St, Sl, Sl, St, St, St, St, St, St, Sl, Sl, St],
  [St, St, St, St, St, St, St, St, St, St, St, St],
  [_, _, _, St, Sl, Sl, Sl, Sl, St, _, _, _],
  [_, _, _, St, Sl, Dk, Dk, Sl, St, _, _, _],
  [_, _, _, St, Sl, Dk, Dk, Sl, St, _, _, _],
  [_, _, _, St, Sl, Sl, Sl, Sl, St, _, _, _],
  [_, _, _, St, Dk, Dk, Dk, Dk, St, _, _, _],
  [_, _, _, St, Dk, Dk, Dk, Dk, St, _, _, _],
  [_, _, _, St, St, St, St, St, St, _, _, _],
  [_, _, _, _, St, St, St, St, _, _, _, _],
]
export const TowerIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={TOWER_MAP} scale={scale} />
)

// ─── Mage / Player (10 × 16) ─────────────────────────────────────────────────

const MAGE_MAP: SpriteMap = [
  [_, _, _, Pd, Pd, Pp, Pp, _, _, _],
  [_, _, Pd, Pp, Pp, Pp, Pp, Pd, _, _],
  [_, Pd, Pp, Pp, Pp, Pp, Pp, Pp, Pd, _],
  [_, _, _, Sk, Sk, Sk, Sk, _, _, _],
  [_, _, Sk, Sk, Sk, Sk, Sk, Sk, _, _],
  [_, _, Sk, Gk, Sk, Sk, Gk, Sk, _, _],
  [_, _, Sk, Sk, Wh, Sk, Sk, Sk, _, _],
  [_, Bl, Bl, Bl, Bl, Bl, Bl, Bl, Bl, _],
  [_, Bl, Bl, Bl, Bl, Bl, Bl, Bl, Bl, _],
  [Bl, Bl, Bl, Bl, Bl, Bl, Bl, Bl, Gd, _],
  [Bl, Bl, Bl, Bl, Bl, Bl, Bl, Bl, Gd, Gb],
  [_, Bl, Bl, Bl, Bl, Bl, Bl, Bl, Gb, _],
  [_, _, Bl, Bl, Bl, Bl, Bl, _, _, _],
  [_, _, Bl, Bl, Bl, Bl, Bl, _, _, _],
  [_, Bn, Bn, _, _, Bn, Bn, _, _, _],
  [_, Bn, Bn, _, _, Bn, Bn, _, _, _],
]
export const MageIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={MAGE_MAP} scale={scale} />
)

// ─── Coin (8 × 8) ────────────────────────────────────────────────────────────

const COIN_MAP: SpriteMap = [
  [_, _, Gb, Gb, Gb, Gb, _, _],
  [_, Gb, Gd, Gd, Gd, Gd, Gb, _],
  [Gb, Gd, Hi, Gd, Gd, Gd, Gd, Gb],
  [Gb, Gd, Gd, Gd, Gd, Gd, Gd, Gb],
  [Gb, Gd, Gd, Gd, Gd, Gd, Gd, Gb],
  [Gb, Gd, Gd, Gd, Gd, Gd, Hi, Gb],
  [_, Gb, Gd, Gd, Gd, Gd, Gb, _],
  [_, _, Gb, Gb, Gb, Gb, _, _],
]
export const CoinIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={COIN_MAP} scale={scale} />
)

// ─── Flame (8 × 10) ──────────────────────────────────────────────────────────

const FLAME_MAP: SpriteMap = [
  [_, _, _, _, Rd, _, _, _],
  [_, _, _, Rd, Rd, Rd, _, _],
  [_, _, Rd, Or, Rd, Rd, Rd, _],
  [_, Rd, Or, Or, Or, Rd, Rd, _],
  [_, Rd, Or, Gb, Or, Or, Rd, _],
  [Rd, Or, Gb, Hi, Gb, Or, Or, Rd],
  [Rd, Or, Gb, Gb, Gb, Or, Rd, _],
  [_, Rd, Or, Or, Or, Rd, _, _],
  [_, _, Rd, Or, Rd, _, _, _],
  [_, _, _, Rd, _, _, _, _],
]
export const FlameIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={FLAME_MAP} scale={scale} />
)

// ─── Bell (8 × 8) ────────────────────────────────────────────────────────────

const BELL_MAP: SpriteMap = [
  [_, _, _, Gk, Gk, _, _, _],
  [_, _, Gd, Gd, Gd, Gd, _, _],
  [_, Gd, Gd, Gd, Gd, Gd, Gd, _],
  [Gd, Gd, Gb, Gd, Gd, Gd, Gd, Gd],
  [Gd, Gd, Gd, Gd, Gd, Gd, Gd, Gd],
  [Gd, Gd, Gd, Gd, Gd, Gd, Gd, Gd],
  [_, Gd, Gk, Gd, Gd, Gk, Gd, _],
  [_, _, _, Gk, Gk, _, _, _],
]
export const BellIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={BELL_MAP} scale={scale} />
)

// ─── Slime / Enemy 1 (12 × 10) ───────────────────────────────────────────────

const SLIME_MAP: SpriteMap = [
  [_, _, _, Gl, Gl, Gl, Gl, Gl, _, _, _, _],
  [_, _, Gl, Gn, Gn, Gn, Gn, Gn, Gl, _, _, _],
  [_, Gl, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gl, _, _],
  [Gl, Gn, Gn, Wh, Gn, Gn, Gn, Gn, Gn, Gn, Gl, _],
  [Gn, Gn, Gn, Gn, Dk, Dk, Gn, Dk, Dk, Gn, Gn, Gn],
  [Gn, Gn, Gn, Gn, Dk, Gn, Gn, Gn, Dk, Gn, Gn, Gn],
  [Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn],
  [Gd2, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gd2],
  [_, Gd2, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gn, Gd2, _],
  [_, _, Gd2, Gd2, Gd2, Gd2, Gd2, Gd2, Gd2, Gd2, _, _],
]
export const SlimeSprite = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SLIME_MAP} scale={scale} />
)

// ─── Ghost / Specter (10 × 10) ───────────────────────────────────────────────

const GHOST_MAP: SpriteMap = [
  [_, _, _, Wh, Wh, Wh, Wh, _, _, _],
  [_, _, Wh, Pp, Pp, Pp, Pp, Wh, _, _],
  [_, Wh, Pp, Pp, Pp, Pp, Pp, Pp, Wh, _],
  [Wh, Pp, Pp, Wh, Pp, Pp, Wh, Pp, Pp, Wh],
  [Wh, Pp, Pp, Dk, Dk, Dk, Dk, Pp, Pp, Wh],
  [Wh, Pp, Pp, Dk, Pp, Pp, Dk, Pp, Pp, Wh],
  [Wh, Pp, Pp, Pp, Pp, Pp, Pp, Pp, Pp, Wh],
  [Wh, Pp, Pp, Pp, Pp, Pp, Pp, Pp, Pp, Wh],
  [Wh, Pd, Pp, Pd, Pp, Pd, Pp, Pd, Pp, Wh],
  [Pd, _, Pd, _, Pd, _, Pd, _, Pd, _],
]
export const GhostSprite = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={GHOST_MAP} scale={scale} />
)

// ─── Golem / Stone (12 × 14) ─────────────────────────────────────────────────

const GY1 = "#6b7280" // golem stone mid
const GY2 = "#9ca3af" // golem stone light
const GY3 = "#374151" // golem shadow
const OG = "#f97316" // eye glow

const GOLEM_MAP: SpriteMap = [
  [_, _, _, GY3, GY3, GY3, GY3, GY3, GY3, _, _, _],
  [_, _, GY3, GY1, GY1, GY1, GY1, GY1, GY1, GY3, _, _],
  [_, GY3, GY1, GY1, GY1, GY2, GY2, GY1, GY1, GY1, GY3, _],
  [GY3, GY1, GY1, Dk, Dk, GY1, GY1, Dk, Dk, GY1, GY1, GY3],
  [GY3, GY1, GY1, OG, OG, GY1, GY1, OG, OG, GY1, GY1, GY3],
  [GY3, GY1, GY1, Dk, Dk, GY1, GY1, Dk, Dk, GY1, GY1, GY3],
  [GY3, GY1, GY1, GY1, GY3, GY1, GY1, GY3, GY1, GY1, GY1, GY3],
  [_, GY3, GY3, GY3, GY3, GY3, GY3, GY3, GY3, GY3, GY3, _],
  [GY3, GY1, GY1, GY1, GY3, GY1, GY1, GY3, GY1, GY1, GY1, GY3],
  [GY3, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY3],
  [GY3, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY1, GY3],
  [_, GY3, GY1, GY1, GY3, GY1, GY1, GY3, GY1, GY1, GY3, _],
  [_, _, GY3, GY3, _, GY3, GY3, _, GY3, GY3, _, _],
  [_, _, GY3, GY3, _, GY3, GY3, _, GY3, GY3, _, _],
]
export const GolemSprite = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={GOLEM_MAP} scale={scale} />
)

// ─── Dragon (16 × 12) ────────────────────────────────────────────────────────

const DRAGON_MAP: SpriteMap = [
  [_, _, _, _, _, _, _, Rk, Rk, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, Rk, Rd, Rd, Rk, _, _, _, _, _, _],
  [_, Rd, _, _, _, Rk, Rd, Rd, Rd, Rd, Rk, _, _, Rk, Rd, _],
  [_, Rd, Rd, _, Rk, Rd, Rd, Rd, Rd, Rd, Rd, Rk, Rk, Rd, Rd, _],
  [Rk, Rd, Rd, Rk, Rd, Rd, Rk, Rk, Rk, Rk, Rd, Rd, Rd, Rd, Rd, Rk],
  [Rk, Rd, Rd, Rd, Rd, Rd, Rd, Gb, Gb, Rd, Rd, Rd, Rd, Rd, Rd, Rk],
  [_, Rk, Rd, Rd, Rd, Gb, Gb, Gb, Gb, Gb, Rd, Rd, Rd, Rd, Rk, _],
  [_, _, Rk, Rd, Rd, Gb, Rd, Rd, Rd, Gb, Rd, Rd, Rd, Rk, _, _],
  [_, _, _, Rk, Rd, Rd, Dk, Dk, Rd, Rd, Rd, Rk, _, _, _, _],
  [_, _, _, Rk, Rd, Or, Or, Or, Or, Rd, Rk, _, _, _, _, _],
  [_, _, _, _, Rk, Or, Gb, Gb, Or, Rk, _, _, _, _, _, _],
  [_, _, _, _, _, Gb, Gb, Gb, _, _, _, _, _, _, _, _],
]
export const DragonSprite = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={DRAGON_MAP} scale={scale} />
)

// ─── Enemy sprite lookup ──────────────────────────────────────────────────────
// Map enemy id → component function

export const ENEMY_SPRITE: Record<number, (scale: number) => React.ReactNode> =
  {
    1: (s) => <SlimeSprite scale={s} />,
    2: (s) => <GhostSprite scale={s} />,
    3: (s) => <GolemSprite scale={s} />,
    4: (s) => <DragonSprite scale={s} />,
  }

// ─── Skull (8 × 8) ───────────────────────────────────────────────────────────

const SKULL_MAP: SpriteMap = [
  [_, _, Wh, Wh, Wh, Wh, _, _],
  [_, Wh, Wh, Wh, Wh, Wh, Wh, _],
  [Wh, Wh, Dk, Wh, Wh, Dk, Wh, Wh],
  [Wh, Wh, Dk, Dk, Dk, Dk, Wh, Wh],
  [Wh, Wh, Wh, Wh, Wh, Wh, Wh, Wh],
  [_, Wh, Wl, Wh, Wl, Wh, Wh, _],
  [_, Wh, Wh, Wl, Wh, Wl, Wh, _],
  [_, _, Wl, Wl, Wl, Wl, _, _],
]
export const SkullIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SKULL_MAP} scale={scale} />
)

// ─── Trophy (8 × 9) ──────────────────────────────────────────────────────────

const TROPHY_MAP: SpriteMap = [
  [_, Gb, Gb, Gb, Gb, Gb, Gb, _],
  [Gb, Gd, Gd, Gd, Gd, Gd, Gd, Gb],
  [Gb, Gd, Hi, Gd, Gd, Hi, Gd, Gb],
  [_, Gb, Gd, Gd, Gd, Gd, Gb, _],
  [_, _, Gb, Gk, Gk, Gb, _, _],
  [_, _, _, Gd, Gd, _, _, _],
  [_, _, _, Gd, Gd, _, _, _],
  [_, Gb, Gb, Gb, Gb, Gb, Gb, _],
  [Gb, Gb, Gb, Gb, Gb, Gb, Gb, Gb],
]
export const TrophyIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={TROPHY_MAP} scale={scale} />
)

// ─── Star (8 × 8) ────────────────────────────────────────────────────────────

const STAR_MAP: SpriteMap = [
  [_, _, _, Gb, Gb, _, _, _],
  [_, _, _, Gb, Gb, _, _, _],
  [Gb, Gb, Gb, Gb, Gb, Gb, Gb, Gb],
  [_, Gb, Hi, Gb, Gb, Hi, Gb, _],
  [_, _, Gb, Gb, Gb, Gb, _, _],
  [_, Gb, Gb, _, _, Gb, Gb, _],
  [Gb, Gb, _, _, _, _, Gb, Gb],
  [Gb, _, _, _, _, _, _, Gb],
]
export const StarIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={STAR_MAP} scale={scale} />
)

// ─── Lock (6 × 8) ────────────────────────────────────────────────────────────

const LOCK_MAP: SpriteMap = [
  [_, _, Gd, Gd, _, _],
  [_, Gd, _, _, Gd, _],
  [_, Gd, _, _, Gd, _],
  [Gb, Gb, Gb, Gb, Gb, Gb],
  [Gb, Gb, Dk, Dk, Gb, Gb],
  [Gb, Gb, Dk, Gb, Gb, Gb],
  [Gb, Gd, Gd, Gd, Gd, Gb],
  [_, Gd, Gd, Gd, Gd, _],
]
export const LockIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={LOCK_MAP} scale={scale} />
)

// ─── Play button (8 × 8) ─────────────────────────────────────────────────────

const PLAY_MAP: SpriteMap = [
  [_, Bk, Bl, Bl, Bl, Bl, Bk, _],
  [Bk, Bl, Bl, Bl, Bl, Bl, Bl, Bk],
  [Bl, Bl, Wh, Bl, Bl, Bl, Bl, Bl],
  [Bl, Bl, Wh, Wh, Bl, Bl, Bl, Bl],
  [Bl, Bl, Wh, Wh, Wh, Bl, Bl, Bl],
  [Bl, Bl, Wh, Wh, Bl, Bl, Bl, Bl],
  [Bl, Bl, Wh, Bl, Bl, Bl, Bl, Bl],
  [Bk, Bl, Bl, Bl, Bl, Bl, Bl, Bk],
]
export const PlayIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={PLAY_MAP} scale={scale} />
)

// ─── Pause (8 × 8) ───────────────────────────────────────────────────────────

const PAUSE_MAP: SpriteMap = [
  [_, Bk, Bl, Bl, Bl, Bl, Bk, _],
  [Bk, Bl, Bl, Bl, Bl, Bl, Bl, Bk],
  [Bl, Bl, Wh, Wh, Bl, Wh, Wh, Bl],
  [Bl, Bl, Wh, Wh, Bl, Wh, Wh, Bl],
  [Bl, Bl, Wh, Wh, Bl, Wh, Wh, Bl],
  [Bl, Bl, Wh, Wh, Bl, Wh, Wh, Bl],
  [Bl, Bl, Wh, Wh, Bl, Wh, Wh, Bl],
  [Bk, Bl, Bl, Bl, Bl, Bl, Bl, Bk],
]
export const PauseIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={PAUSE_MAP} scale={scale} />
)

// ─── Sword / ATK (6 × 12) ────────────────────────────────────────────────────

const SWORD_MAP: SpriteMap = [
  [_, _, Sm, Sm, _, _],
  [_, _, Sm, Wh, _, _],
  [_, _, Sm, Wh, _, _],
  [_, Sm, Sm, Wh, _, _],
  [_, _, Sm, Wh, _, _],
  [_, Sm, Sm, Wh, Sm, _],
  [Gd, Gd, Gd, Gd, Gd, Gd],
  [_, _, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, Br, Br, Br, Br, _],
]
export const SwordIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SWORD_MAP} scale={scale} />
)

// ─── Shield / DEF (8 × 8) ────────────────────────────────────────────────────

const SHIELD_MAP: SpriteMap = [
  [_, Gd, Gd, Gd, Gd, Gd, Gd, _],
  [Gd, Bl, Bl, Bl, Bl, Bl, Bl, Gd],
  [Gd, Bl, Gb, Bl, Bl, Gb, Bl, Gd],
  [Gd, Bl, Bl, Gb, Gb, Bl, Bl, Gd],
  [Gd, Bl, Bl, Gb, Gb, Bl, Bl, Gd],
  [Gd, Bl, Gb, Bl, Bl, Gb, Bl, Gd],
  [_, Gd, Bl, Bl, Bl, Bl, Gd, _],
  [_, _, Gd, Gd, Gd, Gd, _, _],
]
export const ShieldIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SHIELD_MAP} scale={scale} />
)

// ─── Potion (6 × 10) ─────────────────────────────────────────────────────────

const POTION_MAP: SpriteMap = [
  [_, _, Ss, Ss, _, _],
  [_, Ss, Dk, Dk, Ss, _],
  [_, Ss, Dk, Dk, Ss, _],
  [Ss, Ss, Ss, Ss, Ss, Ss],
  [Ss, Pp, Wh, Pp, Pp, Ss],
  [Ss, Pp, Pp, Pp, Pp, Ss],
  [Ss, Pp, Pd, Pp, Pp, Ss],
  [Ss, Pd, Pp, Pp, Pd, Ss],
  [Ss, Pd, Pd, Pd, Pd, Ss],
  [_, Ss, Ss, Ss, Ss, _],
]
export const PotionIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={POTION_MAP} scale={scale} />
)

// ─── Scroll / Quest (8 × 10) ─────────────────────────────────────────────────

const PA = "#d4a574" // parchment
const PL2 = "#fef3c7" // parchment light
const TX = "#1e293b" // text dark
const PB = "#92400e" // parchment dark brown

const SCROLL_MAP: SpriteMap = [
  [PB, PB, PB, PB, PB, PB, PB, PB],
  [PB, PL2, PL2, PL2, PL2, PL2, PL2, PB],
  [PB, PL2, TX, TX, TX, TX, PL2, PB],
  [PB, PL2, PL2, PL2, PL2, PL2, PL2, PB],
  [PB, PL2, TX, TX, TX, PL2, PL2, PB],
  [PB, PL2, PL2, PL2, PL2, PL2, PL2, PB],
  [PB, PL2, TX, TX, TX, TX, PL2, PB],
  [PB, PL2, TX, PL2, PL2, PL2, PL2, PB],
  [PB, PL2, PL2, PL2, PL2, PL2, PL2, PB],
  [PB, PB, PB, PB, PB, PB, PB, PB],
]
export const ScrollIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SCROLL_MAP} scale={scale} />
)

// ─── Chest / Reward (10 × 8) ─────────────────────────────────────────────────

const CHEST_MAP: SpriteMap = [
  [_, Gd, Gd, Gd, Gd, Gd, Gd, Gd, Gd, _],
  [Gd, Br, Br, Br, Br, Br, Br, Br, Br, Gd],
  [Gd, Br, Gb, Gb, Gb, Gb, Gb, Gb, Br, Gd],
  [Gd, Gd, Gd, Gd, Gb, Gb, Gd, Gd, Gd, Gd],
  [Gd, Br, Br, Br, Gb, Gb, Br, Br, Br, Gd],
  [Gd, Br, Br, Br, Br, Br, Br, Br, Br, Gd],
  [Gd, Bw, Bw, Bw, Bw, Bw, Bw, Bw, Bw, Gd],
  [_, Gd, Gd, Gd, Gd, Gd, Gd, Gd, Gd, _],
]
export const ChestIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={CHEST_MAP} scale={scale} />
)

// ─── Book (8 × 8) ────────────────────────────────────────────────────────────

const BOOK_MAP: SpriteMap = [
  [_, Gd, Gd, Gd, Gd, Gd, Gd, _],
  [Gd, Bn, Bn, Bn, Bn, Bn, Bn, Gd],
  [Gd, Bn, Wh, Wh, Wh, Wh, Bn, Gd],
  [Gd, Bn, Wh, TX, TX, TX, Bn, Gd],
  [Gd, Bn, Wh, TX, Wh, Wh, Bn, Gd],
  [Gd, Bn, Wh, TX, TX, TX, Bn, Gd],
  [Gd, Bn, Wh, Wh, Wh, Wh, Bn, Gd],
  [_, Gd, Gd, Gd, Gd, Gd, Gd, _],
]
export const BookIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={BOOK_MAP} scale={scale} />
)

// ─── Dagger (6 × 10) ─────────────────────────────────────────────────────────

const DAGGER_MAP: SpriteMap = [
  [_, _, Wh, Wh, _, _],
  [_, _, Sm, Sm, _, _],
  [_, _, Sm, Sm, _, _],
  [_, Sm, Sm, Sm, _, _],
  [Sm, Sm, Sm, Sm, Sm, _],
  [_, Br, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, _, Br, Br, _, _],
  [_, Br, Br, Br, Br, _],
]
export const DaggerIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={DAGGER_MAP} scale={scale} />
)

// ─── Crystal / Spells (8 × 8) ────────────────────────────────────────────────

const CRYSTAL_MAP: SpriteMap = [
  [_, _, _, Pl, Pl, _, _, _],
  [_, _, Pl, Pp, Pp, Pl, _, _],
  [_, Pl, Wh, Pp, Pp, Pp, Pl, _],
  [Pl, Wh, Pp, Pp, Pp, Pp, Pp, Pl],
  [Pl, Pp, Pp, Pp, Pp, Pp, Pd, Pl],
  [_, Pl, Pp, Pp, Pp, Pd, Pl, _],
  [_, _, Pl, Pp, Pd, Pl, _, _],
  [_, _, _, Pl, Pl, _, _, _],
]
export const CrystalIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={CRYSTAL_MAP} scale={scale} />
)

// ─── Store / All items (8 × 8) ───────────────────────────────────────────────

const STORE_MAP: SpriteMap = [
  [_, Ss, Ss, Ss, Ss, Ss, Ss, _],
  [Gd, Gb, Gb, Gb, Gb, Gb, Gb, Gd],
  [Gd, Gb, Wh, Gb, Gb, Wh, Gb, Gd],
  [Ss, Ss, Ss, Ss, Ss, Ss, Ss, Ss],
  [Ss, Dk, Ss, Ss, Ss, Ss, Dk, Ss],
  [Ss, Dk, Ss, Ss, Ss, Ss, Dk, Ss],
  [Ss, Dk, Ss, Ss, Ss, Ss, Dk, Ss],
  [Ss, Ss, Ss, Ss, Ss, Ss, Ss, Ss],
]
export const StoreIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={STORE_MAP} scale={scale} />
)

// ─── Lightning / Crit (6 × 10) ───────────────────────────────────────────────

const LIGHTNING_MAP: SpriteMap = [
  [_, _, Gb, Gb, _, _],
  [_, _, Gb, Gb, _, _],
  [_, Gb, Gb, Gb, _, _],
  [Gb, Gb, Gb, Gb, _, _],
  [Gb, Gb, Gb, Gb, Gb, _],
  [_, Gb, Gb, Gb, Gb, Gb],
  [_, _, Gb, Gb, Gb, _],
  [_, _, _, Gb, Gb, _],
  [_, _, _, Gb, Gb, _],
  [_, _, _, Gb, _, _],
]
export const LightningIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={LIGHTNING_MAP} scale={scale} />
)

// ─── Eye / Password toggle (8 × 6) ───────────────────────────────────────────

const EYE_OPEN_MAP: SpriteMap = [
  [_, _, Sl, Sl, Sl, Sl, _, _],
  [_, Sl, Wh, Wh, Wh, Wh, Sl, _],
  [Sl, Wh, Wh, Bl, Bl, Wh, Wh, Sl],
  [Sl, Wh, Wh, Dk, Bl, Wh, Wh, Sl],
  [_, Sl, Wh, Wh, Wh, Wh, Sl, _],
  [_, _, Sl, Sl, Sl, Sl, _, _],
]
export const EyeOpenIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={EYE_OPEN_MAP} scale={scale} />
)

const EYE_SHUT_MAP: SpriteMap = [
  [_, _, _, _, _, _, _, _],
  [_, _, Sl, Sl, Sl, Sl, _, _],
  [Sl, Sl, Wh, Wh, Wh, Wh, Sl, Sl],
  [_, _, Sl, Sl, Sl, Sl, _, _],
  [_, Sl, _, _, _, _, Sl, _],
  [_, _, _, _, _, _, _, _],
]
export const EyeShutIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={EYE_SHUT_MAP} scale={scale} />
)

// ─── Warning (8 × 8) ─────────────────────────────────────────────────────────

const WARN_MAP: SpriteMap = [
  [_, _, _, Rd, Rd, _, _, _],
  [_, _, Rd, Gb, Gb, Rd, _, _],
  [_, _, Rd, Gb, Gb, Rd, _, _],
  [_, Rd, Gb, Gb, Gb, Gb, Rd, _],
  [_, Rd, Gb, Gb, Gb, Gb, Rd, _],
  [Rd, Gb, Gb, Rd, Rd, Gb, Gb, Rd],
  [Rd, Gb, Gb, Gb, Gb, Gb, Gb, Rd],
  [_, Rd, Rd, Rd, Rd, Rd, Rd, _],
]
export const WarnIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={WARN_MAP} scale={scale} />
)

// ─── Pin (6 × 8) ─────────────────────────────────────────────────────────────

const PIN_MAP: SpriteMap = [
  [_, Rd, Rd, Rd, Rd, _],
  [Rd, Rk, Rk, Rk, Rk, Rd],
  [Rd, Rk, Wh, Rk, Rk, Rd],
  [Rd, Rk, Rk, Rk, Rk, Rd],
  [_, Rd, Rd, Rd, Rd, _],
  [_, _, Rd, Rd, _, _],
  [_, _, Rd, Rd, _, _],
  [_, _, Rd, _, _, _],
]
export const PinIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={PIN_MAP} scale={scale} />
)

// ─── Group / Members (10 × 8) ────────────────────────────────────────────────

const GROUP_MAP: SpriteMap = [
  [_, _, Sl, Sl, _, _, _, Sl, Sl, _],
  [_, Sl, Wh, Wh, Sl, _, Sl, Wh, Wh, Sl],
  [_, Sl, Wh, Wh, Sl, _, Sl, Wh, Wh, Sl],
  [_, _, Sl, Sl, _, _, _, Sl, Sl, _],
  [_, Ss, St, St, Ss, Ss, Ss, St, St, Ss],
  [Ss, St, St, St, St, St, St, St, St, Ss],
  [Ss, St, St, St, St, St, St, St, St, Ss],
  [_, Ss, Ss, Ss, Ss, Ss, Ss, Ss, Ss, _],
]
export const GroupIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={GROUP_MAP} scale={scale} />
)

// ─── Volume icons (6 × 6) ────────────────────────────────────────────────────

const VOL_HI_MAP: SpriteMap = [
  [_, Sm, Sm, _, Wl, _],
  [_, Sm, Sm, _, Wl, Wl],
  [Sm, Sm, Sm, Sm, _, Wl],
  [Sm, Sm, Sm, Sm, _, Wl],
  [_, Sm, Sm, _, Wl, Wl],
  [_, Sm, Sm, _, Wl, _],
]

const VOL_LO_MAP: SpriteMap = [
  [_, Sm, Sm, _, _, _],
  [_, Sm, Sm, _, Wl, _],
  [Sm, Sm, Sm, Sm, Wl, _],
  [Sm, Sm, Sm, Sm, Wl, _],
  [_, Sm, Sm, _, Wl, _],
  [_, Sm, Sm, _, _, _],
]

const VOL_MUTE_MAP: SpriteMap = [
  [_, Sm, Sm, _, _, _],
  [_, Sm, Sm, _, Rd, _],
  [Sm, Sm, Sm, Sm, Rd, Rd],
  [Sm, Sm, Sm, Sm, Rd, Rd],
  [_, Sm, Sm, _, Rd, _],
  [_, Sm, Sm, _, _, _],
]

export const VolHiIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={VOL_HI_MAP} scale={scale} />
)
export const VolLoIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={VOL_LO_MAP} scale={scale} />
)
export const VolMuteIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={VOL_MUTE_MAP} scale={scale} />
)

// ─── Seek back / forward (8 × 6) ─────────────────────────────────────────────

const SEEK_BACK_MAP: SpriteMap = [
  [_, Wl, _, Wl, Wl, Wl, Wl, _],
  [Wl, Wl, _, Wl, Wl, Wl, Wl, Wl],
  [Wl, Wl, Wl, Wl, Wl, Wl, Wl, Wl],
  [Wl, Wl, Wl, Wl, Wl, Wl, Wl, Wl],
  [Wl, Wl, _, Wl, Wl, Wl, Wl, Wl],
  [_, Wl, _, Wl, Wl, Wl, Wl, _],
]

const SEEK_FWD_MAP: SpriteMap = [
  [_, Wl, Wl, Wl, Wl, _, Wl, _],
  [Wl, Wl, Wl, Wl, Wl, _, Wl, Wl],
  [Wl, Wl, Wl, Wl, Wl, Wl, Wl, Wl],
  [Wl, Wl, Wl, Wl, Wl, Wl, Wl, Wl],
  [Wl, Wl, Wl, Wl, Wl, _, Wl, Wl],
  [_, Wl, Wl, Wl, Wl, _, Wl, _],
]

export const SeekBackIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SEEK_BACK_MAP} scale={scale} />
)
export const SeekFwdIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SEEK_FWD_MAP} scale={scale} />
)

// ─── Search (8 × 8) ──────────────────────────────────────────────────────────

const SEARCH_MAP: SpriteMap = [
  [_, _, Sl, Sl, Sl, Sl, _, _],
  [_, Sl, Ss, Ss, Ss, Ss, Sl, _],
  [Sl, Ss, _, Wh, _, Ss, Ss, Sl],
  [Sl, Ss, _, _, _, Ss, Ss, Sl],
  [Sl, Ss, Ss, Ss, Ss, Ss, Sl, _],
  [_, Sl, Sl, Sl, Sl, Sl, _, Sl],
  [_, _, _, _, _, _, Sl, Sl],
  [_, _, _, _, _, _, Sl, _],
]
export const SearchIcon = ({ scale = 2 }: { scale?: number }) => (
  <Sprite map={SEARCH_MAP} scale={scale} />
)

// ─── Decoration sprite lookup ────────────────────────────────────────────────
// Used by AuthView background scatter

export const DECO_SPRITE: Record<string, (scale: number) => React.ReactNode> = {
  tower: (s) => <TowerIcon scale={s} />,
  dragon: (s) => <DragonSprite scale={s} />,
  sword: (s) => <SwordIcon scale={s} />,
  mage: (s) => <MageIcon scale={s} />,
  coin: (s) => <CoinIcon scale={s} />,
  star: (s) => <StarIcon scale={s} />,
  shield: (s) => <ShieldIcon scale={s} />,
  crystal: (s) => <CrystalIcon scale={s} />,
}
