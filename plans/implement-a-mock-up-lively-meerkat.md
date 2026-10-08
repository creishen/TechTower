# Context

Replace the Farm view with an RPG battle system. Completing code sandbox challenges and quizzes defeats enemies; streak count passively boosts the player character. The Farm tab is renamed "Battle" (or "Quest"). All other views (Classroom, Shop, Chat) and the Header are unchanged.

---

## Approach

Replace `FarmView` (and its supporting data/types) in `src/App.tsx` with `BattleView`. Update the `Tab` type and the Header tab label from `"farm"/"Farm"` to `"battle"/"Quest"`. The `FarmTile` interface, `FARM_TILES` array, `FarmTool` type, and `tileBg` helper are all removed. Everything else stays.

Add CSS animations for the battle scene to `src/index.css`.

---

## Design System (unchanged from prior implementation)

Fonts, color tokens, and utility classes already wired in `src/index.css`. New animations needed:
- `@keyframes hp-drain` — shrink animation for HP bars
- `@keyframes enemy-hit` — red flash + knockback shake on the enemy sprite
- `@keyframes player-attack` — brief lunge forward for the player sprite
- `@keyframes victory-pop` — scale bounce for victory state
- `@keyframes float-damage` — floating damage number rising and fading

---

## Files to Modify

### `src/App.tsx`

#### 1. Types & data — replace Farm with Battle

Remove: `FarmTool`, `FarmTile` interface, `FARM_TILES` array, `tileBg` helper.

Add:
```ts
type BattleAction = "code" | "quiz" | "item";
type BattlePhase = "idle" | "player-turn" | "enemy-turn" | "victory" | "defeat";

interface Enemy {
  id: number;
  name: string;
  emoji: string;
  hp: number;
  maxHp: number;
  attack: number;
  weakness: "code" | "quiz";  // double damage on matching action
  xpReward: number;
  coinReward: number;
  description: string;
}

interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  level: number;
  xp: number;
  xpToNext: number;
}
```

Enemy roster (4 enemies, progressively harder):
| # | Name | Emoji | HP | ATK | Weakness | XP | Coins |
|---|---|---|---|---|---|---|---|
| 1 | Null Pointer Slime | 🟢 | 60 | 8 | code | 30 | 50 |
| 2 | Infinite Loop Specter | 👻 | 100 | 14 | quiz | 60 | 90 |
| 3 | Stack Overflow Golem | 🪨 | 150 | 18 | code | 100 | 140 |
| 4 | Memory Leak Dragon | 🐉 | 220 | 26 | quiz | 180 | 250 |

Streak boosts (derived from header streak count = 14):
```ts
const STREAK_BOOSTS = [
  { days: 3,  label: "+10% ATK",            atk: 0.10, def: 0,    crit: 0 },
  { days: 7,  label: "+20% ATK  +10% DEF",  atk: 0.20, def: 0.10, crit: 0 },
  { days: 14, label: "+30% ATK  +20% DEF  HP Regen", atk: 0.30, def: 0.20, crit: 0 },
  { days: 30, label: "+50% CRIT chance",    atk: 0.30, def: 0.20, crit: 0.50 },
];
// Active boosts = all tiers with days <= current streak (14 → tiers 1–3 active)
```

#### 2. Header — rename tab

Change `{ id: "farm", label: "Farm" }` → `{ id: "battle", label: "Quest" }`.
Change `Tab` type: remove `"farm"`, add `"battle"`.

#### 3. BattleView component — layout

Three columns inside a dark dungeon-gradient canvas:

```
┌──────────────────────────────────────────────────────────────┐
│  PLAYER PANEL (left 220px)  │  ARENA (flex-1)  │  ENEMY PANEL (right 220px)  │
└──────────────────────────────────────────────────────────────┘
                         ACTION BAR (bottom)
```

**Left — Player Panel**
- Pixel avatar (🧙) with name "CodeMage Lv.8"
- HP bar (green → red as HP drops) with numeric label
- MP bar (blue)
- Active streak buff badges — each tier unlocked shows a glowing pill:
  - 🔥 ×3 days → amber pill "+10% ATK"
  - 🔥 ×7 days → orange pill "+20% ATK +10% DEF"
  - 🔥 ×14 days → coral pill "+30% ATK +20% DEF HP Regen" (ACTIVE)
  - 🔥 ×30 days → purple legendary pill (locked, greyed)
- Status effects (if any): Poisoned, Burning, Shielded

**Center — Arena**
- Dungeon background: dark stone gradient with faint grid lines
- Enemy sprite (large emoji, ~80px) centered, with a name plate below
- Enemy HP bar (wide, red, above sprite)
- Floating damage numbers appear on hit (CSS animation, positioned absolutely, state-driven)
- Battle log — last 4 lines of combat history scrolling at the bottom of the arena
- Phase-specific overlays:
  - `victory` → golden banner "ENEMY DEFEATED!" with XP/coin reward breakdown
  - `defeat` → red vignette "YOU WERE DEFEATED" with retry button

**Right — Enemy Panel**
- Enemy name + emoji
- Weakness badge: "Weak to: 💻 Code" or "Weak to: 📝 Quiz"
- Attack stat, description text
- "Next enemies" mini list (upcoming roster, first 2 greyed)

**Bottom — Action Bar**
- Three action buttons:
  - `💻 Code Attack` — opens the code sandbox panel (slides up from bottom), submitting deal damage proportional to tests passed (1 test = 20 dmg, 2 = 40, 3 = 60; weakness multiplier ×1.5)
  - `📝 Quiz Strike` — opens quiz panel; correct answer = 35 dmg (×1.5 if weakness); wrong = miss + enemy counter-attacks
  - `🧪 Use Item` — consume a stored potion to restore 40 HP (disabled if 0 potions)
- Potion count badge on the item button

**Code sandbox panel** (slides up, replaces action bar area, ~300px tall):
- Same Monaco-style editor as ClassroomView (textarea + line numbers)
- "Run & Attack" button — increments damage based on mock test results
- "Cancel" to dismiss without attacking

**Quiz panel** (slides up):
- Single question with 4 options (same style as ClassroomView quiz)
- Auto-resolves on answer click — no separate confirm

#### 4. Battle state machine (useState)

```ts
const [phase, setPhase] = useState<BattlePhase>("idle");
const [enemyIndex, setEnemyIndex] = useState(0);
const [enemyHp, setEnemyHp] = useState(ENEMIES[0].hp);
const [player, setPlayer] = useState<PlayerStats>({ hp: 120, maxHp: 120, mp: 60, maxMp: 60, attack: 28, defense: 14, level: 8, xp: 340, xpToNext: 500 });
const [battleLog, setBattleLog] = useState<string[]>(["A wild Null Pointer Slime appears!"]);
const [activePanel, setActivePanel] = useState<"none" | "code" | "quiz">("none");
const [floatingDmg, setFloatingDmg] = useState<{ val: number; key: number } | null>(null);
const [potions, setPotions] = useState(3);
const [code, setCode] = useState(STARTER_CODE);
```

Attack resolution helper:
```ts
function resolveAttack(baseDmg: number, isWeakness: boolean, streakAtk: number): number {
  const boosted = Math.round(baseDmg * (1 + streakAtk));
  return isWeakness ? Math.round(boosted * 1.5) : boosted;
}
```

Enemy counter-attack triggers after a 800ms delay following any player action (simulated with `setTimeout`).

#### 5. Root App — wire up

Replace `{activeTab === "farm" && <FarmView />}` with `{activeTab === "battle" && <BattleView />}`.

---

## CSS additions (`src/index.css`)

```css
@keyframes enemy-hit {
  0%   { transform: translateX(0) scale(1);   filter: brightness(1); }
  20%  { transform: translateX(12px) scale(0.95); filter: brightness(3) saturate(0); }
  60%  { transform: translateX(-6px);         filter: brightness(2); }
  100% { transform: translateX(0) scale(1);   filter: brightness(1); }
}
.enemy-hit { animation: enemy-hit 0.4s ease; }

@keyframes float-dmg {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-48px); }
}
.float-dmg { animation: float-dmg 1s ease-out forwards; }

@keyframes player-lunge {
  0%, 100% { transform: translateX(0); }
  40%       { transform: translateX(16px); }
}
.player-lunge { animation: player-lunge 0.3s ease; }

@keyframes victory-pop {
  0%   { transform: scale(0.7); opacity: 0; }
  70%  { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}
.victory-pop { animation: victory-pop 0.5s cubic-bezier(.34,1.56,.64,1) forwards; }
```

---

## Verification

1. Quest tab renders `BattleView` without errors
2. "Code Attack" opens the code panel; "Run & Attack" deals damage, updates enemy HP bar, triggers `enemy-hit` animation and floating damage number
3. "Quiz Strike" shows a quiz; correct answer damages enemy; wrong answer triggers enemy counter-attack
4. Streak buff badges display correctly for a 14-day streak (3 active tiers, 1 locked)
5. Defeating an enemy (HP → 0) shows the victory overlay with XP/coin breakdown and advances to next enemy
6. "Use Item" restores player HP and decrements potion count
7. All other tabs (Learn, Shop, Chat) still work
