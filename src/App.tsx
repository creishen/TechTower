import { useState } from "react"
import {
  TowerIcon,
  MageIcon,
  CoinIcon,
  FlameIcon,
  BellIcon,
  SkullIcon,
  TrophyIcon,
  StarIcon,
  LockIcon,
  PlayIcon,
  PauseIcon,
  SwordIcon,
  ShieldIcon,
  PotionIcon,
  ScrollIcon,
  ChestIcon,
  BookIcon,
  DaggerIcon,
  CrystalIcon,
  StoreIcon,
  LightningIcon,
  EyeOpenIcon,
  EyeShutIcon,
  WarnIcon,
  SearchIcon,
  PinIcon,
  GroupIcon,
  VolHiIcon,
  VolLoIcon,
  VolMuteIcon,
  SeekBackIcon,
  SeekFwdIcon,
  ENEMY_SPRITE,
  DECO_SPRITE,
} from "./PixelIcons"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "learn" | "battle" | "shop" | "chat"
type ShopFilter = "all" | "weapons" | "armor" | "potions" | "accessories" | "spells"
type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary"
type BattlePhase = "idle" | "player-turn" | "enemy-turn" | "victory" | "defeat"

interface Enemy {
  id: number
  name: string
  emoji: string
  hp: number
  attack: number
  weakness: "code" | "quiz"
  xpReward: number
  coinReward: number
  description: string
  color: string
}

interface PlayerStats {
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  attack: number
  defense: number
  level: number
  xp: number
  xpToNext: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ENEMIES: Enemy[] = [
  {
    id: 1,
    name: "Null Pointer Slime",
    emoji: "🟢",
    hp: 60,
    attack: 8,
    weakness: "code",
    xpReward: 30,
    coinReward: 50,
    color: "#22c55e",
    description:
      "A slimy creature born from uninitialized variables. Vulnerable to clean code.",
  },
  {
    id: 2,
    name: "Infinite Loop Specter",
    emoji: "👻",
    hp: 100,
    attack: 14,
    weakness: "quiz",
    xpReward: 60,
    coinReward: 90,
    color: "#a855f7",
    description:
      "Trapped forever in its own loop. Knowledge-based attacks break the cycle.",
  },
  {
    id: 3,
    name: "Stack Overflow Golem",
    emoji: "🪨",
    hp: 150,
    attack: 18,
    weakness: "code",
    xpReward: 100,
    coinReward: 140,
    color: "#f97316",
    description:
      "Built from recursive calls that never return. Well-written code is its weakness.",
  },
  {
    id: 4,
    name: "Memory Leak Dragon",
    emoji: "🐉",
    hp: 220,
    attack: 26,
    weakness: "quiz",
    xpReward: 180,
    coinReward: 250,
    color: "#ef4444",
    description:
      "An ancient beast that consumes all available memory. Only deep knowledge can slay it.",
  },
]

const STREAK_BOOSTS = [
  {
    days: 3,
    label: "+10% ATK",
    atk: 0.1,
    def: 0.0,
    crit: 0,
    color: "#F59E0B",
    iconKey: "lightning",
  },
  {
    days: 7,
    label: "+20% ATK · +10% DEF",
    atk: 0.2,
    def: 0.1,
    crit: 0,
    color: "#F97316",
    iconKey: "flame",
  },
  {
    days: 14,
    label: "+30% ATK · +20% DEF · HP Regen",
    atk: 0.3,
    def: 0.2,
    crit: 0,
    color: "#EF4444",
    iconKey: "star",
  },
  {
    days: 30,
    label: "+50% CRIT Chance",
    atk: 0.3,
    def: 0.2,
    crit: 0.5,
    color: "#8B5CF6",
    iconKey: "crystal",
  },
]

const STREAK_ICON: Record<string, React.ReactNode> = {
  lightning: <LightningIcon scale={2} />,
  flame: <FlameIcon scale={2} />,
  star: <StarIcon scale={2} />,
  crystal: <CrystalIcon scale={2} />,
}

const CURRENT_STREAK = 14

const BATTLE_QUIZ = {
  question: "Which data structure gives O(1) average lookup time?",
  options: ["Sorted Array", "Linked List", "Hash Map", "Binary Tree"],
  correct: 2,
}

const STARTER_CODE = `function findDuplicate(nums) {
  // Use a Set to track seen values
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return n;
    seen.add(n);
  }
  return -1;
}`

const SHOP_ITEMS: {
  id: number
  name: string
  emoji: string
  cost: number
  stats: string
  flavor: string
  req: string
  category: ShopFilter
  rarity: ItemRarity
  cta: string
}[] = [
    // ── Weapons ──────────────────────────────────────────────────────────────
    {
      id: 1,
      name: "Apprentice Staff",
      emoji: "🪄",
      cost: 80,
      stats: "+6 ATK",
      flavor: "A crooked branch humming with latent mana.",
      req: "None",
      category: "weapons",
      rarity: "common",
      cta: "Equip",
    },
    {
      id: 2,
      name: "Iron Shortsword",
      emoji: "🗡️",
      cost: 150,
      stats: "+10 ATK · +2 DEF",
      flavor: "Reliable and balanced. A soldier's first companion.",
      req: "Level 3",
      category: "weapons",
      rarity: "common",
      cta: "Equip",
    },
    {
      id: 3,
      name: "Recursion Blade",
      emoji: "⚔️",
      cost: 420,
      stats: "+18 ATK · Crit +8%",
      flavor: "Strikes twice if the first hit lands cleanly.",
      req: "Level 6",
      category: "weapons",
      rarity: "uncommon",
      cta: "Equip",
    },
    {
      id: 4,
      name: "Hexadecimal Wand",
      emoji: "✨",
      cost: 780,
      stats: "+26 ATK · MP +20",
      flavor: "Channels raw binary energy into focused beams.",
      req: "7-Day Streak",
      category: "weapons",
      rarity: "rare",
      cta: "Equip",
    },
    {
      id: 5,
      name: "Void Compiler Axe",
      emoji: "🪓",
      cost: 1600,
      stats: "+38 ATK · Ignore 20% DEF",
      flavor: "Compiled from shattered runtime errors.",
      req: "Level 12",
      category: "weapons",
      rarity: "epic",
      cta: "Equip",
    },
    {
      id: 6,
      name: "Segfault Scythe",
      emoji: "☠️",
      cost: 3200,
      stats: "+55 ATK · Lifesteal 15%",
      flavor: "Forged in the deepest stack overflow.",
      req: "30-Day Streak",
      category: "weapons",
      rarity: "legendary",
      cta: "Equip",
    },

    // ── Armor ─────────────────────────────────────────────────────────────────
    {
      id: 7,
      name: "Cloth Robe",
      emoji: "👘",
      cost: 60,
      stats: "+4 DEF",
      flavor: "Thin but comfortable. Good enough for early quests.",
      req: "None",
      category: "armor",
      rarity: "common",
      cta: "Equip",
    },
    {
      id: 8,
      name: "Leather Tunic",
      emoji: "🥼",
      cost: 180,
      stats: "+9 DEF · +5 HP",
      flavor: "Tanned hide reinforced at the shoulders.",
      req: "Level 3",
      category: "armor",
      rarity: "common",
      cta: "Equip",
    },
    {
      id: 9,
      name: "Chainmail Vest",
      emoji: "🛡️",
      cost: 450,
      stats: "+16 DEF · +15 HP",
      flavor: "Interlocked rings that absorb surprisingly heavy blows.",
      req: "Level 6",
      category: "armor",
      rarity: "uncommon",
      cta: "Equip",
    },
    {
      id: 10,
      name: "Arcane Plate",
      emoji: "🔮",
      cost: 900,
      stats: "+24 DEF · +25 HP · +10 MP",
      flavor: "Enchanted steel that dampens incoming spells.",
      req: "Level 9",
      category: "armor",
      rarity: "rare",
      cta: "Equip",
    },
    {
      id: 11,
      name: "Obsidian Fortress",
      emoji: "🖤",
      cost: 2200,
      stats: "+38 DEF · Reflect 10% DMG",
      flavor: "Carved from a single volcanic monolith.",
      req: "Level 14",
      category: "armor",
      rarity: "epic",
      cta: "Equip",
    },
    {
      id: 12,
      name: "Null Shield Aegis",
      emoji: "🌀",
      cost: 4500,
      stats: "+55 DEF · Nullify 1 hit/battle",
      flavor: "Absorbs one attack completely per fight.",
      req: "30-Day Streak",
      category: "armor",
      rarity: "legendary",
      cta: "Equip",
    },

    // ── Potions ───────────────────────────────────────────────────────────────
    {
      id: 13,
      name: "Health Potion",
      emoji: "🧪",
      cost: 40,
      stats: "Restore 40 HP",
      flavor: "A fizzy red brew. Tastes vaguely of strawberries.",
      req: "None",
      category: "potions",
      rarity: "common",
      cta: "Stock Up",
    },
    {
      id: 14,
      name: "Mana Elixir",
      emoji: "💙",
      cost: 55,
      stats: "Restore 30 MP",
      flavor: "Cool and crystalline. Sharpens focus instantly.",
      req: "None",
      category: "potions",
      rarity: "common",
      cta: "Stock Up",
    },
    {
      id: 15,
      name: "Mega Potion",
      emoji: "❤️",
      cost: 120,
      stats: "Restore 100 HP",
      flavor: "A concentrated dose for desperate moments.",
      req: "Level 4",
      category: "potions",
      rarity: "uncommon",
      cta: "Stock Up",
    },
    {
      id: 16,
      name: "Streak Tonic",
      emoji: "🔥",
      cost: 300,
      stats: "+15% ATK for 3 turns",
      flavor: "Distilled from 7 days of unbroken effort.",
      req: "7-Day Streak",
      category: "potions",
      rarity: "rare",
      cta: "Stock Up",
    },
    {
      id: 17,
      name: "Philosopher's Brew",
      emoji: "⚗️",
      cost: 800,
      stats: "Full HP+MP restore",
      flavor: "Rumoured to contain a solved P=NP proof.",
      req: "Level 10",
      category: "potions",
      rarity: "epic",
      cta: "Stock Up",
    },

    // ── Accessories ───────────────────────────────────────────────────────────
    {
      id: 18,
      name: "Focus Ring",
      emoji: "💍",
      cost: 200,
      stats: "+5% Quiz accuracy",
      flavor: "Calms the mind. Wrong answers sting a little less.",
      req: "None",
      category: "accessories",
      rarity: "common",
      cta: "Equip",
    },
    {
      id: 19,
      name: "Coder's Amulet",
      emoji: "📿",
      cost: 380,
      stats: "+8 ATK on Code attacks",
      flavor: "Hums softly when near a compiler.",
      req: "Level 5",
      category: "accessories",
      rarity: "uncommon",
      cta: "Equip",
    },
    {
      id: 20,
      name: "Streak Medallion",
      emoji: "🏅",
      cost: 650,
      stats: "Streak bonus ×1.1",
      flavor: "Multiplies your momentum. Don't break the chain.",
      req: "14-Day Streak",
      category: "accessories",
      rarity: "rare",
      cta: "Equip",
    },
    {
      id: 21,
      name: "Algorithmic Sigil",
      emoji: "🔣",
      cost: 1400,
      stats: "+20% XP from battles",
      flavor: "Every victory echoes back double.",
      req: "Level 11",
      category: "accessories",
      rarity: "epic",
      cta: "Equip",
    },
    {
      id: 22,
      name: "Turing Pendant",
      emoji: "🖥️",
      cost: 3500,
      stats: "All stats +12%",
      flavor: "A tribute to the father of computer science.",
      req: "30-Day Streak",
      category: "accessories",
      rarity: "legendary",
      cta: "Equip",
    },

    // ── Spells ────────────────────────────────────────────────────────────────
    {
      id: 23,
      name: "Syntax Strike",
      emoji: "⚡",
      cost: 100,
      stats: "Deal 30 DMG · 8 MP",
      flavor: "A crackling bolt that punishes malformed expressions.",
      req: "None",
      category: "spells",
      rarity: "common",
      cta: "Learn",
    },
    {
      id: 24,
      name: "Exception Curse",
      emoji: "💢",
      cost: 260,
      stats: "Deal 50 DMG · Stun 1 turn · 15 MP",
      flavor: "Throws an uncaught exception at the enemy.",
      req: "Level 4",
      category: "spells",
      rarity: "uncommon",
      cta: "Learn",
    },
    {
      id: 25,
      name: "Garbage Collect",
      emoji: "🗑️",
      cost: 500,
      stats: "Purge debuffs · Heal 20 HP · 18 MP",
      flavor: "Frees memory. Frees the soul.",
      req: "Level 7",
      category: "spells",
      rarity: "rare",
      cta: "Learn",
    },
    {
      id: 26,
      name: "Infinite Recursion",
      emoji: "♾️",
      cost: 1200,
      stats: "Deal DMG 3× · 40 MP",
      flavor: "Calls itself until the enemy gives up.",
      req: "Level 10",
      category: "spells",
      rarity: "epic",
      cta: "Learn",
    },
    {
      id: 27,
      name: "Big O Annihilation",
      emoji: "🌌",
      cost: 2800,
      stats: "Deal 999 DMG · 80 MP · once per battle",
      flavor: "Reduces any problem to O(1).",
      req: "30-Day Streak",
      category: "spells",
      rarity: "legendary",
      cta: "Learn",
    },
  ]

type ChatMessage = {
  id: number
  author: string
  time: string
  text: string
  system: boolean
  code?: string
}

const CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  "# algorithms-study": [
    {
      id: 1,
      author: "🤖 TowerBot",
      time: "10:12 AM",
      text: "⚔️ Sarah_Dev just defeated the Stack Overflow Golem using a recursive DFS — 280 XP earned!",
      system: true,
    },
    {
      id: 2,
      author: "Sarah_Dev",
      time: "10:14 AM",
      text: "Hey, did anyone solve test case #4 on the Arrays lesson? I keep getting an off-by-one error.",
      system: false,
    },
    {
      id: 3,
      author: "Marcus_K",
      time: "10:15 AM",
      text: "Check your loop edge cases. Your upper bound might be exclusive when you expect inclusive.",
      system: false,
    },
    {
      id: 4,
      author: "Sarah_Dev",
      time: "10:16 AM",
      text: "Here's my broken loop:",
      system: false,
      code: `for (let i = 0; i <= arr.length; i++) {\n  sum += arr[i]; // IndexError on last iter!\n}`,
    },
    {
      id: 5,
      author: "Marcus_K",
      time: "10:17 AM",
      text: "Change <= to <. Array indices run 0 to length-1. Classic off-by-one 🎯",
      system: false,
    },
    {
      id: 6,
      author: "Alex",
      time: "10:22 AM",
      text: "Also — for Two Sum, using a hash map brings it from O(n²) down to O(n). Game changer once you see it.",
      system: false,
    },
    {
      id: 7,
      author: "🤖 TowerBot",
      time: "10:30 AM",
      text: "🎉 Alex just hit a 30-day streak! +2.0x Battle Multiplier is now active.",
      system: true,
    },
  ],
  "# frontend-ninjas": [
    {
      id: 1,
      author: "🤖 TowerBot",
      time: "9:00 AM",
      text: "📢 New quest unlocked: Defeat the CSS Specificity Wraith by completing the Flexbox challenge!",
      system: true,
    },
    {
      id: 2,
      author: "Priya_UI",
      time: "9:05 AM",
      text: "Anyone know why my flex children aren't wrapping? I've got flex-wrap: wrap set and nothing happens.",
      system: false,
    },
    {
      id: 3,
      author: "Marcus_K",
      time: "9:07 AM",
      text: "Does the parent have a fixed height? That often fights wrap. Try min-height instead.",
      system: false,
    },
    {
      id: 4,
      author: "Priya_UI",
      time: "9:08 AM",
      text: "Here's the offending CSS:",
      system: false,
      code: `.container {\n  display: flex;\n  flex-wrap: wrap;\n  height: 200px; /* <-- culprit? */\n}`,
    },
    {
      id: 5,
      author: "David_C",
      time: "9:10 AM",
      text: "Yep, fixed height stops the container from expanding. Switch to min-height: 200px and it'll wrap correctly.",
      system: false,
    },
    {
      id: 6,
      author: "Priya_UI",
      time: "9:11 AM",
      text: "That fixed it!! Thanks both 🙌",
      system: false,
    },
    {
      id: 7,
      author: "🤖 TowerBot",
      time: "9:20 AM",
      text: "⚔️ Priya_UI defeated the CSS Specificity Wraith — 140 coins earned!",
      system: true,
    },
  ],
  "# python-bootcamp": [
    {
      id: 1,
      author: "🤖 TowerBot",
      time: "8:45 AM",
      text: "📚 This week's boss: the Memory Leak Dragon. Requires mastery of Python list comprehensions to defeat.",
      system: true,
    },
    {
      id: 2,
      author: "JamieCode",
      time: "8:50 AM",
      text: "List comprehensions are wild. I just replaced 6 lines with one — is that actually readable though?",
      system: false,
    },
    {
      id: 3,
      author: "Sarah_Dev",
      time: "8:52 AM",
      text: "Context matters. One-liner is fine for simple transforms; anything with branches should stay a loop.",
      system: false,
    },
    {
      id: 4,
      author: "JamieCode",
      time: "8:53 AM",
      text: "Here's what I collapsed:",
      system: false,
      code: `# Before\nresult = []\nfor x in nums:\n    if x % 2 == 0:\n        result.append(x * 2)\n\n# After\nresult = [x * 2 for x in nums if x % 2 == 0]`,
    },
    {
      id: 5,
      author: "Alex",
      time: "8:55 AM",
      text: "That's completely fine to read. The condition at the end is the Python idiom — embrace it 👍",
      system: false,
    },
    {
      id: 6,
      author: "JamieCode",
      time: "8:57 AM",
      text: "What about nested comprehensions? Like [[f(x) for x in row] for row in matrix]?",
      system: false,
    },
    {
      id: 7,
      author: "Marcus_K",
      time: "8:59 AM",
      text: "Two levels deep is still okay. Three levels = write the loops. Future-you will thank present-you.",
      system: false,
    },
    {
      id: 8,
      author: "🤖 TowerBot",
      time: "9:10 AM",
      text: "⚔️ JamieCode just defeated the Null Pointer Slime — 50 coins earned!",
      system: true,
    },
  ],
}

const MESSAGES = CHANNEL_MESSAGES["# algorithms-study"]

const CHANNELS = [
  "# algorithms-study",
  "# frontend-ninjas",
  "# python-bootcamp",
]
const DMS = [
  { name: "Alex", level: 12, online: true, context: "Quest: Floor 3" },
  {
    name: "Sarah_Dev",
    level: 9,
    online: true,
    context: "Watching: React Hooks",
  },
  { name: "David_C", level: 6, online: false, context: "Last seen 2h ago" },
]

const DM_MESSAGES: Record<string, ChatMessage[]> = {
  Alex: [
    {
      id: 1,
      author: "Alex",
      time: "Yesterday",
      text: "Yo — did you see they added the Memory Leak Dragon to floor 4? That thing hits hard.",
      system: false,
    },
    {
      id: 2,
      author: "You",
      time: "Yesterday",
      text: "Yeah I got wiped twice. Quiz Strike barely tickles it. Code Attack only.",
      system: false,
    },
    {
      id: 3,
      author: "Alex",
      time: "Yesterday",
      text: "Stack up the Philosopher's Brew from the shop before you fight it. Full restore = free second attempt.",
      system: false,
    },
    {
      id: 4,
      author: "🤖 TowerBot",
      time: "Today",
      text: "🎉 Alex just reached a 30-day streak!",
      system: true,
    },
    {
      id: 5,
      author: "Alex",
      time: "10:35 AM",
      text: "LFG 🔥 30 days. The +50% crit is actually ridiculous now.",
      system: false,
    },
  ],
  Sarah_Dev: [
    {
      id: 1,
      author: "Sarah_Dev",
      time: "9:30 AM",
      text: "Quick question — in the Sliding Window lesson, do we always anchor the left pointer at 0 initially?",
      system: false,
    },
    {
      id: 2,
      author: "You",
      time: "9:31 AM",
      text: "Yes, left starts at 0 and only moves right as you shrink the window.",
      system: false,
    },
    {
      id: 3,
      author: "Sarah_Dev",
      time: "9:32 AM",
      text: "And the window size is just right - left + 1?",
      system: false,
    },
    {
      id: 4,
      author: "You",
      time: "9:33 AM",
      text: "Exactly. Here's a simple template:",
      system: false,
      code: `let left = 0, maxLen = 0;\nfor (let right = 0; right < s.length; right++) {\n  // expand window\n  while (/* invalid */) left++;\n  maxLen = Math.max(maxLen, right - left + 1);\n}`,
    },
    {
      id: 5,
      author: "Sarah_Dev",
      time: "9:35 AM",
      text: "This is super clear, thank you! Saving this snippet 📌",
      system: false,
    },
  ],
  David_C: [
    {
      id: 1,
      author: "David_C",
      time: "2 days ago",
      text: "Haven't logged in much lately. How's the new quest system?",
      system: false,
    },
    {
      id: 2,
      author: "You",
      time: "2 days ago",
      text: "It's great — each enemy has a weakness so you have to pick code vs quiz strategically.",
      system: false,
    },
    {
      id: 3,
      author: "David_C",
      time: "2 days ago",
      text: "Nice. I'll be back this weekend — need to rebuild my streak 😅",
      system: false,
    },
  ],
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const NOTIFICATIONS: {
  id: number
  iconNode: React.ReactNode
  text: string
  time: string
  color: string
}[] = [
    {
      id: 1,
      iconNode: <SwordIcon scale={2} />,
      text: "Infinite Loop Specter is waiting in the dungeon.",
      time: "2m ago",
      color: "#EF4444",
    },
    {
      id: 2,
      iconNode: <CoinIcon scale={2} />,
      text: "You earned 90 coins defeating Null Pointer Slime.",
      time: "18m ago",
      color: "#F59E0B",
    },
    {
      id: 3,
      iconNode: <GroupIcon scale={2} />,
      text: "Marcus_K sent you a friend request.",
      time: "1h ago",
      color: "#6366F1",
    },
  ]

function Header({
  activeTab,
  setActiveTab,
  userName,
  onLogout,
}: {
  activeTab: Tab
  setActiveTab: (t: Tab) => void
  userName: string
  onLogout: () => void
}) {
  const [bellOpen, setBellOpen] = useState(false)
  const [dismissed, setDismissed] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs: { id: Tab; label: string }[] = [
    { id: "learn", label: "Learn" },
    { id: "battle", label: "Quest" },
    { id: "shop", label: "Shop" },
    { id: "chat", label: "Chat" },
  ]

  const visible = NOTIFICATIONS.filter((n) => !dismissed.includes(n.id))

  /* get icon associated with active tab */
  const getTabIcon = (id: Tab) => {
    switch (id) {
      case "learn":
        return <BookIcon scale={1} />
      case "battle":
        return <SwordIcon scale={1} />
      case "shop":
        return <StoreIcon scale={1} />
      case "chat":
        return <GroupIcon scale={1} />
    }
  }

  return (
    <header
      style={{ backgroundColor: "#131722", borderBottom: "2px solid #262E40" }}
      className="flex items-center justify-between px-3 sm:px-4 h-14 shrink-0 gap-2 sm:gap-4 relative"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <TowerIcon scale={2} />
        <span
          className="font-cinzel font-bold hidden sm:inline"
          style={{
            color: "#10B981",
            fontSize: "clamp(11px,1.2vw,14px)",
            letterSpacing: "0.08em",
          }}
        >
          TechPro Tower
        </span>
      </div>

      {/* Center nav - desktop standard view */}
      <nav className="hidden sm:flex items-center gap-0 sm:gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            style={{
              fontFamily: "var(--font-sans)",
              color: activeTab === t.id ? "#0EA5E9" : "#94A3B8",
              background: "none",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              borderBottom:
                activeTab === t.id
                  ? "2px solid #0EA5E9"
                  : "2px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            <span className="flex items-center gap-1.5">
              {getTabIcon(t.id)}
              {t.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Right HUD */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Wallet */}
        <div
          className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded"
          style={{ backgroundColor: "#090A0F", border: "1px solid #262E40" }}
        >
          <span className="coin-bounce" style={{ lineHeight: 0 }}>
            <CoinIcon scale={2} />
          </span>
          <span
            className="font-pixel text-xs"
            style={{ color: "#F59E0B", fontSize: "clamp(8px,1vw,11px)" }}
          >
            1,420
          </span>
        </div>

        {/* Streak */}
        <div className="hidden sm:flex items-center gap-1">
          <span className="flame-pulse" style={{ lineHeight: 0 }}>
            <FlameIcon scale={2} />
          </span>
          <span
            className="font-pixel text-xs"
            style={{ color: "#10B981", fontSize: "clamp(8px,1vw,11px)" }}
          >
            14
          </span>
        </div>

        {/* Level bar — hidden below md */}
        <div className="hidden md:flex items-center gap-2">
          <span
            className="font-pixel"
            style={{ color: "#6366F1", fontSize: "8px" }}
          >
            LVL 8
          </span>
          <div
            className="h-2 rounded-sm overflow-hidden"
            style={{
              width: "clamp(48px,5vw,80px)",
              backgroundColor: "#262E40",
              border: "1px solid #3D4B63",
            }}
          >
            <div
              className="h-full"
              style={{ width: "65%", backgroundColor: "#6366F1" }}
            />
          </div>
          <span style={{ color: "#64748B", fontSize: "11px" }}>65%</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setBellOpen((v) => !v)}
            className="relative cursor-pointer"
            style={{
              background: "none",
              border: "none",
              color: bellOpen ? "#a78bfa" : "#94A3B8",
              fontSize: "18px",
              lineHeight: 0,
            }}
          >
            <BellIcon scale={2} />
            {visible.length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-pixel"
                style={{
                  backgroundColor: "#6366F1",
                  fontSize: "7px",
                  color: "white",
                }}
              >
                {visible.length}
              </span>
            )}
          </button>

          {bellOpen && (
            <div
              className="notif-dropdown absolute right-0 top-8 z-50 flex flex-col"
              style={{
                width: "280px",
                backgroundColor: "#131722",
                border: "2px solid #262E40",
                borderRadius: "4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderBottom: "1px solid #262E40" }}
              >
                <span
                  className="font-pixel"
                  style={{ fontSize: "8px", color: "#94A3B8" }}
                >
                  NOTIFICATIONS
                </span>
                <button
                  onClick={() => {
                    setDismissed(NOTIFICATIONS.map((n) => n.id))
                    setBellOpen(false)
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3D4B63",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  Clear all
                </button>
              </div>
              {visible.length === 0 ? (
                <div
                  className="px-4 py-4 text-center"
                  style={{ color: "#3D4B63", fontSize: "13px" }}
                >
                  All caught up! 🎉
                </div>
              ) : (
                visible.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3"
                    style={{ borderBottom: "1px solid #111827" }}
                  >
                    <span style={{ lineHeight: 0, marginTop: "1px" }}>
                      {n.iconNode}
                    </span>
                    <div className="flex-1">
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#C8D4E6",
                          lineHeight: "1.4",
                        }}
                      >
                        {n.text}
                      </p>
                      <span style={{ fontSize: "10px", color: "#3D4B63" }}>
                        {n.time}
                      </span>
                    </div>
                    <button
                      onClick={() => setDismissed((d) => [...d, n.id])}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#262E40",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar + logout */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => {
              if (window.confirm(`Sign out of TechPro Tower?`)) onLogout()
            }}
            className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer"
            style={{ backgroundColor: "#131722", border: "1px solid #262E40" }}
            title="Sign out"
          >
            <div className="relative">
              <div
                className="w-7 h-8 rounded flex items-center justify-center animate-none"
                style={{
                  backgroundColor: "#262E40",
                  border: "1px solid #3D4B63",
                }}
              >
                <MageIcon scale={1} />
              </div>
              <span
                className="absolute -bottom-1.5 -left-1.5 font-pixel px-0.5 rounded border text-white"
                style={{
                  backgroundColor: "#6366F1",
                  borderColor: "#3D4B63",
                  fontSize: "5px",
                  lineHeight: "1.2",
                }}
              >
                8
              </span>
            </div>
            <span
              className="hidden sm:inline"
              style={{
                fontSize: "12px",
                color: "#94A3B8",
                maxWidth: "80px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </span>
          </button>
        </div>

        {/* Hamburger menu button for mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden w-7 h-8 rounded flex items-center justify-center border border-[#262E40] bg-[#131722] text-[#94A3B8] hover:text-white cursor-pointer"
          title="Menu"
        >
          <span className="font-sans text-lg leading-none">☰</span>
        </button>
      </div>

      {/* Burger menu right sidebar drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-[#090a0f] bg-opacity-70 backdrop-blur-xs z-50 sm:hidden"
          />
          {/* Drawer Panel */}
          <div
            className="fixed top-0 right-0 bottom-0 w-[260px] bg-[#090A0F] border-l-4 border-double border-[#262E40] z-50 flex flex-col justify-between p-4 sm:hidden animate-none shadow-2xl"
          >
            {/* Top / Nav items */}
            <div className="flex flex-col gap-4">
              {/* Header row */}
              <div className="flex items-center justify-between border-b border-[#262E40] pb-2">
                <span className="font-cinzel font-bold text-xs text-[#10B981] letter-spacing-[0.08em]">
                  NAVIGATION
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-[#64748B] hover:text-white cursor-pointer font-pixel text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Nav list */}
              <nav className="flex flex-col gap-2">
                {tabs.map((t) => {
                  const isActive = activeTab === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTab(t.id)
                        setMenuOpen(false)
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded text-left text-xs font-pixel cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isActive ? "#0E2235" : "#131722",
                        border: `1px solid ${isActive ? "#0EA5E9" : "#262E40"}`,
                        color: isActive ? "#0EA5E9" : "#94A3B8",
                      }}
                    >
                      {getTabIcon(t.id)}
                      <span>{t.label.toUpperCase()}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Bottom character HUD panel */}
            <div className="flex flex-col gap-3 border-t border-[#262E40] pt-4">
              {/* Avatar Icon + Name */}
              <div className="flex items-center gap-3 bg-[#131722] p-2 rounded border border-[#262E40]">
                <div className="relative shrink-0">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center animate-none"
                    style={{
                      backgroundColor: "#262E40",
                      border: "1px solid #3D4B63",
                    }}
                  >
                    <MageIcon scale={1.2} />
                  </div>
                  <span
                    className="absolute -bottom-1 -left-1 font-pixel px-0.5 rounded border text-white text-[5px]"
                    style={{
                      backgroundColor: "#6366F1",
                      borderColor: "#3D4B63",
                      lineHeight: "1.2",
                    }}
                  >
                    8
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-cinzel font-bold text-xs text-white truncate">
                    {userName}
                  </div>
                  {/* smaller letter (student ID) */}
                  <div className="font-mono text-[8px] text-[#475569] uppercase leading-none mt-0.5">
                    std-9082-tp
                  </div>
                </div>
              </div>

              {/* Stats row: Points, Streak, Level */}
              <div className="flex flex-col gap-1.5 bg-[#0b0c10] p-2 rounded border border-[#131722] text-[10px] font-pixel">
                {/* Points */}
                <div className="flex justify-between items-center text-[#F59E0B]">
                  <span className="flex items-center gap-1.5">
                    <CoinIcon scale={1} />
                    POINTS
                  </span>
                  <span>1,420</span>
                </div>
                {/* Streak */}
                <div className="flex justify-between items-center text-[#10B981]">
                  <span className="flex items-center gap-1.5">
                    <FlameIcon scale={1} />
                    STREAK
                  </span>
                  <span>14 DAYS</span>
                </div>
                {/* Level */}
                <div className="flex justify-between items-center text-[#6366F1]">
                  <span className="flex items-center gap-1.5">
                    <StarIcon scale={1} />
                    LEVEL
                  </span>
                  <span>LVL 8 (65%)</span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  if (window.confirm("Sign out of TechPro Tower?")) {
                    onLogout()
                    setMenuOpen(false)
                  }
                }}
                className="w-full py-2 font-pixel text-center rounded border border-[#EF4444] bg-[#ef444415] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer text-[10px]"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

// ─── Classroom View ───────────────────────────────────────────────────────────

function ClassroomView({ setActiveTab }: { setActiveTab: (t: Tab) => void }) {
  const [trialMode, setTrialMode] = useState<"none" | "code" | "quiz">("none")
  const [trialCode, setTrialCode] = useState(`function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`)
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [trialRan, setTrialRan] = useState(false)
  const [trialResult, setTrialResult] = useState<"pass" | "fail" | null>(null)
  const [trialQuizAnswer, setTrialQuizAnswer] = useState<number | null>(null)
  const [speed, setSpeed] = useState("1x")
  const [activeLesson, setActiveLesson] = useState(3)

  // ── Video player state ──────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0) // 0–100
  const [videoDuration] = useState(715) // seconds per lesson mock
  const [showControls, setShowControls] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [unlocked, setUnlocked] = useState(false)
  const videoTimerRef = {
    current: null as ReturnType<typeof setInterval> | null,
  }

  const SPEED_MAP: Record<string, number> = {
    "0.75x": 0.75,
    "1x": 1,
    "1.25x": 1.25,
    "1.5x": 1.5,
  }

  function formatTime(pct: number, dur: number) {
    const s = Math.floor((pct / 100) * dur)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
  }

  function togglePlay() {
    if (isPlaying) {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current)
      videoTimerRef.current = null
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      const rate = SPEED_MAP[speed] ?? 1
      videoTimerRef.current = setInterval(() => {
        setVideoProgress((p) => {
          const next = Math.min(100, p + (100 / videoDuration) * rate)
          if (next >= 90) setUnlocked(true)
          if (next >= 100) {
            clearInterval(videoTimerRef.current!)
            videoTimerRef.current = null
            setIsPlaying(false)
          }
          return next
        })
      }, 1000)
    }
  }

  function seekBy(seconds: number) {
    setVideoProgress((p) => {
      const next = Math.max(
        0,
        Math.min(100, p + (seconds / videoDuration) * 100),
      )
      if (next >= 90) setUnlocked(true)
      return next
    })
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    )
    setVideoProgress(pct)
    if (pct >= 90) setUnlocked(true)
  }

  const LESSON_THUMBNAILS = [
    {
      bg: "linear-gradient(135deg, #0a1628 0%, #1a2a5e 50%, #0d0a20 100%)",
      icon: <ChestIcon scale={4} />,
      subtitle: "Memory layout · index access · O(1) reads",
    },
    {
      bg: "linear-gradient(135deg, #0a2015 0%, #1a4a30 50%, #0a1a10 100%)",
      icon: <SwordIcon scale={4} />,
      subtitle: "Left & right convergence · palindrome check",
    },
    {
      bg: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #0a0e1a 100%)",
      icon: <CrystalIcon scale={4} />,
      subtitle: "Hash table internals · Two Sum O(n)",
    },
    {
      bg: "linear-gradient(135deg, #1a1a0a 0%, #3a3a10 50%, #1a1200 100%)",
      icon: <ScrollIcon scale={4} />,
      subtitle: "Expand & shrink · max-length substrings",
    },
    {
      bg: "linear-gradient(135deg, #1a0a0a 0%, #3a1010 50%, #200808 100%)",
      icon: <SearchIcon scale={4} />,
      subtitle: "lo/hi pointers · sorted search in O(log n)",
    },
  ]
  const thumb = LESSON_THUMBNAILS[activeLesson - 1]

  const LESSONS = [
    {
      id: 1,
      title: "Introduction to Arrays",
      topic: "Arrays",
      description:
        "Arrays are contiguous blocks of memory indexed from 0. Accessing any element is O(1) by index, but inserting or removing in the middle is O(n).",
      starterCode: `function reverseArray(arr) {
  // Reverse the array in-place
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++; right--;
  }
  return arr;
}`,
      quiz: {
        question:
          "What is the time complexity of accessing an element in an array by index?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correct: 2,
      },
    },
    {
      id: 2,
      title: "Two Pointer Technique",
      topic: "Arrays / Pointers",
      description:
        "Two pointers reduce many O(n²) brute-force solutions to O(n) by maintaining a left and right index that converge toward the center.",
      starterCode: `function isPalindrome(s) {
  // Use two pointers to check palindrome
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}`,
      quiz: {
        question: "Two-pointer technique is most effective when the input is:",
        options: [
          "A tree",
          "A sorted array or string",
          "A hash map",
          "A random graph",
        ],
        correct: 1,
      },
    },
    {
      id: 3,
      title: "Hash Maps & Two Sum",
      topic: "Hash Tables",
      description:
        "A hash map stores key-value pairs with O(1) average insert and lookup. The classic Two Sum problem drops from O(n²) to O(n) by trading space for time.",
      starterCode: `function twoSum(nums, target) {
  // Use a Map to track complement positions
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
      quiz: {
        question: "Which data structure gives O(1) average lookup time?",
        options: ["Sorted Array", "Linked List", "Hash Map", "Binary Tree"],
        correct: 2,
      },
    },
    {
      id: 4,
      title: "Sliding Window",
      topic: "Arrays / Strings",
      description:
        "A sliding window maintains a contiguous sub-array between a left and right pointer. The window expands right and shrinks left based on a validity condition.",
      starterCode: `function maxSumSubarray(nums, k) {
  // Find max sum of any subarray of size k
  let windowSum = 0, maxSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
      quiz: {
        question:
          "In a variable-size sliding window, what triggers moving the LEFT pointer?",
        options: [
          "Window becomes empty",
          "Window becomes invalid/exceeds constraint",
          "Right pointer hits the end",
          "Sum reaches the target",
        ],
        correct: 1,
      },
    },
    {
      id: 5,
      title: "Binary Search Basics",
      topic: "Search Algorithms",
      description:
        "Binary search divides a sorted range in half each step, achieving O(log n) time. The key is correctly maintaining the lo/hi boundary so every element stays reachable.",
      starterCode: `function binarySearch(nums, target) {
  // Return index of target or -1 if not found
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
      quiz: {
        question: "Binary search requires the input array to be:",
        options: [
          "Unsorted",
          "Sorted",
          "A power-of-2 length",
          "Stored in a hash map",
        ],
        correct: 1,
      },
    },
  ]

  const syllabus = LESSONS.map((l) => ({ id: l.id, title: l.title }))
  const currentLesson = LESSONS[activeLesson - 1]

  function runTrialCode() {
    setTerminalOpen(true)
    setTrialRan(true)
    // Mock: pass if code contains "seen" (a reasonable heuristic for this problem)
    // Heuristic: code must contain the function name from the lesson's starter to be considered a real attempt
    const hintWord =
      currentLesson.starterCode.match(/function (\w+)/)?.[1] ?? "return"
    setTrialResult(
      trialCode.includes(hintWord) && trialCode.length > 80 ? "pass" : "fail",
    )
  }

  function resetTrial() {
    setTrialMode("none")
    setTrialRan(false)
    setTrialResult(null)
    setTrialQuizAnswer(null)
    setTerminalOpen(false)
  }

  function switchLesson(num: number) {
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current)
      videoTimerRef.current = null
    }
    setIsPlaying(false)
    setVideoProgress(0)
    setUnlocked(false)
    setActiveLesson(num)
    resetTrial()
    setTrialCode(LESSONS[num - 1].starterCode)
  }

  return (
    <div className="two-pane flex flex-1 overflow-hidden" style={{ gap: 0 }}>
      {/* Left pane */}
      <div
        className="flex flex-col overflow-y-auto scrollbar-hide"
        style={{
          width: "clamp(280px, 50%, 560px)",
          borderRight: "2px solid #262E40",
          flexShrink: 0,
        }}
      >
        {/* ── Video Player ───────────────────────────────── */}
        <div
          className="relative mx-4 mt-4 rounded overflow-hidden group"
          style={{
            aspectRatio: "16/9",
            border: "2px solid #262E40",
            background: thumb.bg,
            cursor: "pointer",
          }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => {
            if (isPlaying) setShowControls(false)
          }}
          onClick={togglePlay}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault()
              togglePlay()
            }
            if (e.key === "j" || e.key === "J") seekBy(-10)
            if (e.key === "l" || e.key === "L") seekBy(10)
            if (e.key === "m" || e.key === "M") setIsMuted((v) => !v)
          }}
          tabIndex={0}
          role="region"
          aria-label="Lesson video player"
        >
          {/* Thumbnail artwork */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
            style={{
              opacity: isPlaying ? 0.15 : 1,
              transition: "opacity 0.3s",
            }}
          >
            <div style={{ lineHeight: 0 }}>{thumb.icon}</div>
            <div className="text-center px-6">
              <div
                className="font-cinzel font-bold"
                style={{
                  fontSize: "14px",
                  color: "#F8FAFC",
                  marginBottom: "4px",
                }}
              >
                {currentLesson.title}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                {thumb.subtitle}
              </div>
            </div>
          </div>

          {/* Playing indicator (animated bars) */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-end gap-1" style={{ height: "36px" }}>
                {[0.6, 1, 0.4, 0.85, 0.5, 0.9, 0.3].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: "4px",
                      height: `${h * 100}%`,
                      backgroundColor: "#818CF8",
                      borderRadius: "2px",
                      opacity: 0.7,
                      animation: `sound-bar-${i % 3} ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Big play/pause button overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: showControls || !isPlaying ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isPlaying
                  ? "rgba(0,0,0,0.5)"
                  : "rgba(99,102,241,0.9)",
                border: `2px solid ${isPlaying ? "rgba(255,255,255,0.2)" : "#818CF8"
                  }`,
                backdropFilter: "blur(4px)",
                boxShadow: isPlaying ? "none" : "0 0 24px rgba(99,102,241,0.5)",
              }}
            >
              <span
                style={{ lineHeight: 0, marginLeft: isPlaying ? "0" : "3px" }}
              >
                {isPlaying ? <PauseIcon scale={3} /> : <PlayIcon scale={3} />}
              </span>
            </div>
          </div>

          {/* Unlock badge */}
          <div
            className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded"
            style={{
              backgroundColor: "rgba(9,10,15,0.85)",
              border: `1px solid ${unlocked ? "#10B981" : "#262E40"}`,
              fontSize: "11px",
              color: unlocked ? "#10B981" : "#F59E0B",
              backdropFilter: "blur(4px)",
            }}
          >
            {unlocked ? (
              "✓ Unlocked"
            ) : (
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <LockIcon scale={1} /> Watch 90% to unlock
              </span>
            )}
          </div>

          {/* Lesson badge top-left */}
          <div
            className="absolute top-2 left-2 px-2.5 py-1 rounded font-pixel"
            style={{
              backgroundColor: "rgba(9,10,15,0.85)",
              border: "1px solid #262E40",
              fontSize: "7px",
              color: "#818CF8",
              backdropFilter: "blur(4px)",
            }}
          >
            LESSON {activeLesson} · {currentLesson.topic}
          </div>

          {/* Bottom controls */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              opacity: showControls ? 1 : 0,
              transition: "opacity 0.2s",
              background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrub bar */}
            <div
              className="mx-3 mb-1 cursor-pointer"
              style={{
                position: "relative",
                height: "16px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleScrub}
            >
              {/* Track */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "2px",
                }}
              >
                {/* Watched fill */}
                <div
                  style={{
                    width: `${videoProgress}%`,
                    height: "100%",
                    backgroundColor: "#818CF8",
                    borderRadius: "2px",
                    transition: "width 0.3s",
                  }}
                />
                {/* 90% marker */}
                <div
                  style={{
                    position: "absolute",
                    left: "90%",
                    top: "-3px",
                    bottom: "-3px",
                    width: "2px",
                    backgroundColor: "#F59E0B",
                    borderRadius: "1px",
                  }}
                />
                {/* Playhead */}
                <div
                  style={{
                    position: "absolute",
                    left: `${videoProgress}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#818CF8",
                    borderRadius: "50%",
                    border: "2px solid #F8FAFC",
                    boxShadow: "0 0 6px rgba(129,140,248,0.6)",
                  }}
                />
              </div>
            </div>

            {/* Controls row */}
            <div
              className="flex items-center gap-3 px-3 pb-2.5"
              style={{ fontSize: "12px" }}
            >
              {/* Play/pause */}
              <button
                onClick={togglePlay}
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#F8FAFC",
                  fontSize: "16px",
                  lineHeight: 0,
                  padding: "2px",
                }}
              >
                {isPlaying ? <PauseIcon scale={2} /> : <PlayIcon scale={2} />}
              </button>

              {/* Seek buttons */}
              <button
                onClick={() => seekBy(-10)}
                className="cursor-pointer flex items-center gap-1"
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: "11px",
                }}
              >
                <SeekBackIcon scale={2} />
                10s
              </button>
              <button
                onClick={() => seekBy(10)}
                className="cursor-pointer flex items-center gap-1"
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: "11px",
                }}
              >
                10s
                <SeekFwdIcon scale={2} />
              </button>

              {/* Time */}
              <span
                className="font-mono-custom"
                style={{ color: "#94A3B8", fontSize: "11px" }}
              >
                {formatTime(videoProgress, videoDuration)} /{" "}
                {formatTime(100, videoDuration)}
              </span>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Volume */}
              <button
                onClick={() => setIsMuted((v) => !v)}
                className="cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  lineHeight: 0,
                }}
              >
                {isMuted || volume === 0 ? (
                  <VolMuteIcon scale={2} />
                ) : volume < 50 ? (
                  <VolLoIcon scale={2} />
                ) : (
                  <VolHiIcon scale={2} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(+e.target.value)
                  if (+e.target.value > 0) setIsMuted(false)
                }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "60px",
                  accentColor: "#818CF8",
                  cursor: "pointer",
                }}
              />

              {/* Speed */}
              <div className="flex items-center gap-1">
                {["0.75x", "1x", "1.25x", "1.5x"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="cursor-pointer"
                    style={{
                      background:
                        speed === s ? "#6366F1" : "rgba(255,255,255,0.08)",
                      border: "none",
                      color: speed === s ? "#fff" : "#94A3B8",
                      borderRadius: "3px",
                      fontSize: "10px",
                      padding: "2px 5px",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard shortcut hint bar */}
        <div
          className="mx-4 mt-1.5 flex items-center gap-3 px-3 py-1.5 rounded"
          style={{
            backgroundColor: "#131722",
            border: "1px solid #262E40",
            fontSize: "11px",
            color: "#64748B",
          }}
        >
          <span style={{ color: "#3D4B63" }}>Shortcuts:</span>
          {[
            ["Space", "Play/Pause"],
            ["J", "−10s"],
            ["L", "+10s"],
            ["M", "Mute"],
          ].map(([k, label]) => (
            <span key={k} className="flex items-center gap-1">
              <kbd
                style={{
                  background: "#262E40",
                  border: "1px solid #3D4B63",
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "#94A3B8",
                }}
              >
                {k}
              </kbd>
              <span>{label}</span>
            </span>
          ))}
          {videoProgress >= 90 && (
            <span
              className="ml-auto animate-pulse"
              style={{ color: "#10B981", fontSize: "11px" }}
            >
              ✓ Quest challenges unlocked
            </span>
          )}
        </div>

        {/* Syllabus */}
        <div className="mx-4 mt-4 mb-4">
          <div
            className="font-pixel text-xs mb-3"
            style={{ color: "#94A3B8", fontSize: "9px" }}
          >
            MODULE 4 — ARRAYS & HASH MAPS
          </div>
          <div className="flex flex-col gap-1">
            {syllabus.map((s, idx) => {
              const lessonNum = idx + 1
              const isDone = lessonNum < activeLesson
              const isActive = lessonNum === activeLesson
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer"
                  onClick={() => switchLesson(lessonNum)}
                  style={{
                    backgroundColor: isActive ? "#0E2235" : "#131722",
                    border: `1px solid ${isActive ? "#0EA5E9" : "#262E40"}`,
                    color: isDone
                      ? "#10B981"
                      : isActive
                        ? "#F8FAFC"
                        : "#64748B",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {isDone ? "✓" : isActive ? "»" : "o"}
                  </span>
                  <span style={{ fontSize: "13px" }}>{s.title}</span>
                  {isActive && (
                    <span
                      className="ml-auto font-pixel"
                      style={{ fontSize: "8px", color: "#0EA5E9" }}
                    >
                      NOW
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          <button
            onClick={() =>
              switchLesson(Math.min(activeLesson + 1, LESSONS.length))
            }
            className="mt-3 w-full py-2 rounded font-medium text-sm cursor-pointer"
            style={{
              backgroundColor: "#0EA5E9",
              color: "#090A0F",
              border: "none",
            }}
          >
            {activeLesson < syllabus.length
              ? "Next Lesson →"
              : "✓ Module Complete"}
          </button>
        </div>
      </div>

      {/* Right pane */}
      <div className="classroom-challenge-pane flex flex-col flex-1 overflow-hidden">
        {/* Pane header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{
            backgroundColor: "#131722",
            borderBottom: "2px solid #262E40",
          }}
        >
          <span
            className="font-pixel"
            style={{ fontSize: "9px", color: "#94A3B8" }}
          >
            LESSON CHALLENGE
          </span>
          {trialMode !== "none" && (
            <button
              onClick={resetTrial}
              style={{
                background: "none",
                border: "none",
                color: "#64748B",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              ← Back
            </button>
          )}
        </div>

        {trialMode === "none" ? (
          /* ── Default: challenge options ─────────────────── */
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide p-5 gap-5">
            {/* Lesson context */}
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "#090A0F",
                border: "1px solid #262E40",
              }}
            >
              <div
                className="font-pixel mb-2"
                style={{ fontSize: "8px", color: "#F59E0B" }}
              >
                CURRENT LESSON · {currentLesson.topic}
              </div>
              <div className="font-medium mb-1" style={{ color: "#F8FAFC" }}>
                {currentLesson.title}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  lineHeight: "1.5",
                }}
              >
                {currentLesson.description}
              </p>
            </div>

            {/* Go to Quest — primary CTA */}
            <div
              className="flex flex-col gap-3 p-4 rounded"
              style={{
                background: unlocked
                  ? "linear-gradient(135deg, #0c1e10 0%, #0f2a1e 100%)"
                  : "linear-gradient(135deg, #0c1e36 0%, #1a0a2e 100%)",
                border: `2px solid ${unlocked ? "#10B981" : "#6366F1"}`,
                boxShadow: unlocked ? "0 0 16px rgba(16,185,129,0.2)" : "none",
                transition: "all 0.4s ease",
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ lineHeight: 0 }}>
                  {unlocked ? (
                    <TrophyIcon scale={2} />
                  ) : (
                    <SwordIcon scale={2} />
                  )}
                </span>
                <div>
                  <div
                    className="font-pixel"
                    style={{
                      fontSize: "9px",
                      color: unlocked ? "#10B981" : "#a78bfa",
                    }}
                  >
                    {unlocked ? "QUEST UNLOCKED" : "BATTLE MODE"}
                  </div>
                  <div
                    className="font-cinzel font-semibold"
                    style={{ color: "#F8FAFC", fontSize: "13px" }}
                  >
                    {unlocked
                      ? "Ready to Enter the Dungeon"
                      : "Watch lesson to unlock quest"}
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#94A3B8",
                  lineHeight: "1.5",
                }}
              >
                {unlocked ? (
                  <>
                    Lesson{" "}
                    <strong style={{ color: "#F8FAFC" }}>
                      {currentLesson.title}
                    </strong>{" "}
                    watched. Face an enemy and use what you learned to deal
                    damage — correct answers earn{" "}
                    <span style={{ color: "#F59E0B" }}>XP & coins</span>.
                  </>
                ) : (
                  <>
                    Watch at least <span style={{ color: "#F59E0B" }}>90%</span>{" "}
                    of the lesson video to unlock the quest. You can still
                    practice in Trial Mode below.
                  </>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => unlocked && setActiveTab("battle")}
                  className="flex items-center gap-2 px-4 py-2 rounded font-cinzel font-semibold text-sm cursor-pointer"
                  style={{
                    backgroundColor: unlocked ? "#10B981" : "#3D4B63",
                    color: unlocked ? "#060810" : "#64748B",
                    border: "none",
                    cursor: unlocked ? "pointer" : "not-allowed",
                    transition: "background-color 0.3s",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <SwordIcon scale={2} />
                    {unlocked ? "Enter the Quest" : "Locked — Watch Video"}
                  </span>
                </button>
                {unlocked && (
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded text-xs"
                    style={{
                      backgroundColor: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      color: "#10B981",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <CoinIcon scale={1} />
                      Points awarded
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Trial options */}
            <div
              className="flex flex-col gap-3 p-4 rounded"
              style={{
                backgroundColor: "#131722",
                border: "1px solid #262E40",
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ lineHeight: 0 }}>
                  <PotionIcon scale={2} />
                </span>
                <div>
                  <div
                    className="font-pixel"
                    style={{ fontSize: "9px", color: "#64748B" }}
                  >
                    TRIAL MODE
                  </div>
                  <div className="font-medium" style={{ color: "#C8D4E6" }}>
                    Practice Without Stakes
                  </div>
                </div>
                <div
                  className="ml-auto px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: "#262E40",
                    color: "#94A3B8",
                    border: "1px solid #3D4B63",
                  }}
                >
                  No Points
                </div>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748B",
                  lineHeight: "1.5",
                }}
              >
                Try the challenge without an enemy present. Results are not
                submitted — useful for getting familiar before entering the
                Quest.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrialMode("code")}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer"
                  style={{
                    backgroundColor: "#262E40",
                    color: "#C8D4E6",
                    border: "1px solid #3D4B63",
                  }}
                >
                  💻 Try Code
                </button>
                <button
                  onClick={() => setTrialMode("quiz")}
                  className="flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer"
                  style={{
                    backgroundColor: "#262E40",
                    color: "#C8D4E6",
                    border: "1px solid #3D4B63",
                  }}
                >
                  📝 Try Quiz
                </button>
              </div>
            </div>
          </div>
        ) : trialMode === "code" ? (
          /* ── Trial: code sandbox ─────────────────────────── */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Trial banner */}
            <div
              className="flex items-center gap-2 px-4 py-2 shrink-0"
              style={{
                backgroundColor: "#0D0C05",
                borderBottom: "1px solid #3D4B63",
              }}
            >
              <span style={{ lineHeight: 0 }}>
                <PotionIcon scale={2} />
              </span>
              <span
                className="font-pixel"
                style={{ fontSize: "8px", color: "#F59E0B" }}
              >
                TRIAL MODE — No points awarded
              </span>
              <span
                style={{
                  color: "#262E40",
                  marginLeft: "auto",
                  fontSize: "12px",
                }}
              >
                Go to{" "}
                <button
                  onClick={() => setActiveTab("battle")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6366F1",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Quest <SwordIcon scale={1} />
                </button>{" "}
                to earn rewards
              </span>
            </div>

            {/* Editor */}
            <div
              className="flex flex-1 overflow-hidden"
              style={{ minHeight: 0 }}
            >
              <div
                className="flex flex-col pt-3 px-3 shrink-0 select-none font-mono-custom"
                style={{
                  backgroundColor: "#090A0F",
                  color: "#262E40",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  borderRight: "1px solid #131722",
                  minWidth: "40px",
                  textAlign: "right",
                }}
              >
                {trialCode.split("\n").map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <textarea
                value={trialCode}
                onChange={(e) => {
                  setTrialCode(e.target.value)
                  setTrialRan(false)
                  setTrialResult(null)
                }}
                className="flex-1 p-3 font-mono-custom scrollbar-hide resize-none outline-none"
                style={{
                  backgroundColor: "#090A0F",
                  color: "#F8FAFC",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  border: "none",
                  caretColor: "#F59E0B",
                }}
                spellCheck={false}
              />
            </div>

            {/* Terminal */}
            <div
              style={{
                borderTop: "2px solid #262E40",
                backgroundColor: "#060810",
              }}
            >
              <button
                onClick={() => setTerminalOpen((v) => !v)}
                className="w-full flex items-center gap-2 px-4 py-2 cursor-pointer"
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                <span>{terminalOpen ? "▼" : "▶"}</span>
                <span className="font-mono-custom">Terminal Output</span>
              </button>
              {terminalOpen && trialRan && (
                <div
                  className="px-4 pb-3 font-mono-custom"
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    height: "80px",
                    overflowY: "auto",
                  }}
                >
                  <span style={{ color: "#64748B" }}>$ </span>
                  <span style={{ color: "#C8D4E6" }}>node solution.js</span>
                  <br />
                  {trialResult === "pass" ? (
                    <>
                      <span style={{ color: "#10B981" }}>
                        ✓ Test 1 passed: twoSum([2,7,11,15], 9) → [0,1]
                      </span>
                      <br />
                      <span style={{ color: "#10B981" }}>
                        ✓ Test 2 passed: twoSum([3,2,4], 6) → [1,2]
                      </span>
                      <br />
                      <span style={{ color: "#10B981" }}>
                        ✓ Test 3 passed: twoSum([3,3], 6) → [0,1]
                      </span>
                      <br />
                      <span style={{ color: "#F59E0B" }}>
                        3/3 passed — Trial complete. No points in trial mode.
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#EF4444" }}>
                        ✗ Test 1 failed: expected [0,1], got undefined
                      </span>
                      <br />
                      <span style={{ color: "#64748B" }}>
                        0/3 passed — review your approach.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="flex items-center gap-3 p-3 shrink-0"
              style={{
                borderTop: "1px solid #262E40",
                backgroundColor: "#131722",
              }}
            >
              <button
                onClick={runTrialCode}
                className="px-4 py-2 rounded text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: "#262E40",
                  color: "#F8FAFC",
                  border: "1px solid #3D4B63",
                }}
              >
                ▶ Run (Trial)
              </button>
              {trialResult === "pass" && (
                <button
                  onClick={() => setActiveTab("battle")}
                  className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Ready — Enter Quest ⚔️
                </button>
              )}
              <span
                style={{
                  fontSize: "12px",
                  color: "#3D4B63",
                  marginLeft: "auto",
                }}
              >
                🧪 Results not saved
              </span>
            </div>
          </div>
        ) : (
          /* ── Trial: quiz ─────────────────────────────────── */
          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide p-5 gap-4">
            {/* Trial banner */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded"
              style={{
                backgroundColor: "#0D0C05",
                border: "1px solid #3D4B63",
              }}
            >
              <span style={{ lineHeight: 0 }}>
                <PotionIcon scale={2} />
              </span>
              <span
                className="font-pixel"
                style={{ fontSize: "8px", color: "#F59E0B" }}
              >
                TRIAL MODE — No points awarded
              </span>
              <button
                onClick={() => setActiveTab("battle")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366F1",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginLeft: "auto",
                }}
              >
                Go to Quest ⚔️
              </button>
            </div>

            <div>
              <div
                className="font-pixel mb-3"
                style={{ fontSize: "8px", color: "#64748B" }}
              >
                PRACTICE QUESTION · {currentLesson.topic}
              </div>
              <p
                className="mb-4"
                style={{
                  color: "#F8FAFC",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {currentLesson.quiz.question}
              </p>
              <div className="flex flex-col gap-2">
                {currentLesson.quiz.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setTrialQuizAnswer(i)}
                    className="flex items-center gap-3 px-4 py-3 rounded text-left cursor-pointer"
                    style={{
                      backgroundColor:
                        trialQuizAnswer === i
                          ? i === currentLesson.quiz.correct
                            ? "rgba(16,185,129,0.12)"
                            : "rgba(239,68,68,0.12)"
                          : trialQuizAnswer !== null &&
                            i === currentLesson.quiz.correct
                            ? "rgba(16,185,129,0.08)"
                            : "#131722",
                      border: `2px solid ${trialQuizAnswer === i
                        ? i === currentLesson.quiz.correct
                          ? "#10B981"
                          : "#EF4444"
                        : trialQuizAnswer !== null &&
                          i === currentLesson.quiz.correct
                          ? "#10B981"
                          : "#262E40"
                        }`,
                      color: "#F8FAFC",
                      fontSize: "14px",
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded flex items-center justify-center shrink-0 font-pixel"
                      style={{
                        backgroundColor: "#262E40",
                        fontSize: "8px",
                        color: "#94A3B8",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {trialQuizAnswer !== null &&
                      i === currentLesson.quiz.correct && (
                        <span className="ml-auto" style={{ color: "#10B981" }}>
                          ✓
                        </span>
                      )}
                    {trialQuizAnswer === i &&
                      i !== currentLesson.quiz.correct && (
                        <span className="ml-auto" style={{ color: "#EF4444" }}>
                          ✗
                        </span>
                      )}
                  </button>
                ))}
              </div>

              {trialQuizAnswer !== null && (
                <div
                  className="mt-4 p-3 rounded"
                  style={{
                    backgroundColor:
                      trialQuizAnswer === currentLesson.quiz.correct
                        ? "rgba(16,185,129,0.08)"
                        : "rgba(239,68,68,0.08)",
                    border: `1px solid ${trialQuizAnswer === currentLesson.quiz.correct
                      ? "#10B981"
                      : "#EF4444"
                      }`,
                    fontSize: "13px",
                    color:
                      trialQuizAnswer === currentLesson.quiz.correct
                        ? "#10B981"
                        : "#f87171",
                  }}
                >
                  {trialQuizAnswer === currentLesson.quiz.correct
                    ? `✓ Correct! "${currentLesson.quiz.options[currentLesson.quiz.correct]}" is right. Head to the Quest to apply this in battle.`
                    : `✗ Not quite. The correct answer is ${String.fromCharCode(65 + currentLesson.quiz.correct)} — "${currentLesson.quiz.options[currentLesson.quiz.correct]}".`}
                </div>
              )}

              {trialQuizAnswer === currentLesson.quiz.correct && (
                <button
                  onClick={() => setActiveTab("battle")}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded font-medium text-sm cursor-pointer"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Ready — Enter Quest ⚔️
                </button>
              )}

              <p
                className="mt-3"
                style={{
                  fontSize: "12px",
                  color: "#3D4B63",
                  textAlign: "center",
                }}
              >
                🧪 Trial answers are not saved or rewarded
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Battle View ──────────────────────────────────────────────────────────────

function BattleView() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<BattlePhase>("idle")
  const [enemyIndex, setEnemyIndex] = useState(0)
  const [enemyHp, setEnemyHp] = useState(ENEMIES[0].hp)
  const [player, setPlayer] = useState<PlayerStats>({
    hp: 120,
    maxHp: 120,
    mp: 60,
    maxMp: 60,
    attack: 28,
    defense: 14,
    level: 8,
    xp: 340,
    xpToNext: 500,
  })
  const [battleLog, setBattleLog] = useState<string[]>([
    "⚔️ A wild Null Pointer Slime appears!",
  ])
  const [activePanel, setActivePanel] = useState<"none" | "code" | "quiz">(
    "none",
  )
  const [floatingDmg, setFloatingDmg] = useState<{
    val: number
    crit: boolean
    key: number
  } | null>(null)
  const [enemyAnim, setEnemyAnim] = useState(false)
  const [playerAnim, setPlayerAnim] = useState(false)
  const [potions, setPotions] = useState(3)
  const [code, setCode] = useState(STARTER_CODE)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [pendingVictory, setPendingVictory] = useState<{
    xp: number
    coins: number
  } | null>(null)
  const [playerStatusExpanded, setPlayerStatusExpanded] = useState(false)
  const [monsterInfoOpen, setMonsterInfoOpen] = useState(false)

  const enemy = ENEMIES[enemyIndex]

  // Active streak boosts (all tiers unlocked at or below current streak)
  const activeBoosts = STREAK_BOOSTS.filter((b) => b.days <= CURRENT_STREAK)
  const totalAtkBoost = activeBoosts.reduce((acc, b) => acc + b.atk, 0)
  const totalDefBoost = activeBoosts.reduce((acc, b) => acc + b.def, 0)

  function addLog(msg: string) {
    setBattleLog((prev) => [...prev.slice(-5), msg])
  }

  function triggerFloating(val: number, crit: boolean) {
    setFloatingDmg({ val, crit, key: Date.now() })
    setTimeout(() => setFloatingDmg(null), 1100)
  }

  function triggerEnemyHit() {
    setEnemyAnim(true)
    setTimeout(() => setEnemyAnim(false), 450)
  }

  function triggerPlayerAnim() {
    setPlayerAnim(true)
    setTimeout(() => setPlayerAnim(false), 320)
  }

  function resolveAttack(base: number, isWeakness: boolean): number {
    const boosted = Math.round(base * (1 + totalAtkBoost))
    return isWeakness ? Math.round(boosted * 1.5) : boosted
  }

  function enemyCounterAttack(customMsg?: string) {
    setTimeout(() => {
      const dmg = Math.max(
        1,
        enemy.attack - Math.round(player.defense * totalDefBoost * 0.5),
      )
      setPlayer((p) => ({ ...p, hp: Math.max(0, p.hp - dmg) }))
      addLog(customMsg ?? `💢 ${enemy.name} attacks for ${dmg} damage!`)
      if (player.hp - dmg <= 0) setPhase("defeat")
      else setPhase("idle")
    }, 850)
  }

  function dealDamage(dmg: number) {
    triggerPlayerAnim()
    triggerEnemyHit()
    triggerFloating(dmg, dmg > 50)
    const newHp = Math.max(0, enemyHp - dmg)
    setEnemyHp(newHp)
    if (newHp <= 0) {
      setPhase("victory")
      setPendingVictory({ xp: enemy.xpReward, coins: enemy.coinReward })
      addLog(
        `✨ ${enemy.name} defeated! +${enemy.xpReward} XP  +${enemy.coinReward} 🪙`,
      )
    }
    return newHp
  }

  function handleCodeAttack() {
    setActivePanel("none")
    setPhase("enemy-turn")
    const testsPass = Math.floor(Math.random() * 2) + 2 // 2 or 3 tests pass (mock)
    const codeBase = testsPass * 20 // 40 or 60
    const base = codeBase
    const dmg = resolveAttack(base, enemy.weakness === "code")
    const isWeakness = enemy.weakness === "code"
    addLog(
      `💻 Code submitted! ${testsPass}/3 tests passed → ${dmg} DMG${isWeakness ? " (WEAKNESS ×1.5!)" : ""
      }`,
    )
    const remaining = dealDamage(dmg)
    if (remaining > 0) enemyCounterAttack()
  }

  function handleQuizAnswer(idx: number) {
    if (quizAnswer !== null) return
    setQuizAnswer(idx)
    const correct = idx === BATTLE_QUIZ.correct
    setTimeout(() => {
      setActivePanel("none")
      setQuizAnswer(null)
      setPhase("enemy-turn")
      if (correct) {
        // Quiz always deals 20% of the max code attack base (60 × 0.20 = 12)
        const base = Math.round(60 * 0.2)
        const dmg = resolveAttack(base, enemy.weakness === "quiz")
        const isWeakness = enemy.weakness === "quiz"
        addLog(
          `📝 Correct! Critical knowledge strike → ${dmg} DMG${isWeakness ? " (WEAKNESS ×1.5!)" : ""
          }`,
        )
        const remaining = dealDamage(dmg)
        if (remaining > 0) enemyCounterAttack()
      } else {
        addLog("❌ Wrong answer — you hesitate! Enemy seizes the moment.")
        enemyCounterAttack(
          `💢 ${enemy.name} exploits your confusion for ${Math.max(1, enemy.attack - 4)} damage!`,
        )
      }
    }, 900)
  }

  function usePotion() {
    if (potions <= 0 || player.hp >= player.maxHp) return
    setPotions((p) => p - 1)
    setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + 40) }))
    addLog("🧪 Used Health Potion — restored 40 HP!")
  }

  function nextEnemy() {
    const earned = pendingVictory?.xp ?? 0
    setPlayer((p) => {
      const newXp = p.xp + earned
      if (newXp >= p.xpToNext) {
        const overflow = newXp - p.xpToNext
        return {
          ...p,
          level: p.level + 1,
          xp: overflow,
          xpToNext: Math.round(p.xpToNext * 1.4),
          maxHp: p.maxHp + 15,
          hp: p.maxHp + 15, // full heal on level-up
          maxMp: p.maxMp + 8,
          mp: p.maxMp + 8,
          attack: p.attack + 4,
          defense: p.defense + 2,
        }
      }
      return { ...p, xp: newXp }
    })
    const next = enemyIndex + 1
    if (next >= ENEMIES.length) {
      setEnemyIndex(0)
      setEnemyHp(ENEMIES[0].hp)
      setBattleLog(["🏆 All enemies defeated! The dungeon resets... 🔄"])
    } else {
      setEnemyIndex(next)
      setEnemyHp(ENEMIES[next].hp)
      addLog(`⚔️ A wild ${ENEMIES[next].name} appears!`)
    }
    setPhase("idle")
    setPendingVictory(null)
  }

  const hpPct = (player.hp / player.maxHp) * 100
  const mpPct = (player.mp / player.maxMp) * 100
  const enemyHpPct = (enemyHp / enemy.hp) * 100
  const xpPct = (player.xp / player.xpToNext) * 100

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ backgroundColor: "#0A0E1A" }}
    >
      {/* Top dungeon status bar */}
      <div
        className="hidden sm:flex items-center justify-between px-5 py-2 shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #1a0a2e 0%, #0f1a2e 50%, #1a0a2e 100%)",
          borderBottom: "2px solid #2d1b4e",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-cinzel font-bold"
            style={{
              fontSize: "11px",
              color: "#818CF8",
              letterSpacing: "0.1em",
            }}
          >
            Dungeon of Algorithms
          </span>
          <span style={{ color: "#262E40" }}>·</span>
          <span style={{ fontSize: "12px", color: "#64748B" }}>
            Floor 1 · Room {enemyIndex + 1}/{ENEMIES.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {activeBoosts.map((b) => (
            <div
              key={b.days}
              className="flex items-center gap-1 px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${b.color}18`,
                border: `1px solid ${b.color}60`,
                fontSize: "11px",
                color: b.color,
              }}
            >
              <span style={{ lineHeight: 0 }}>{STREAK_ICON[b.iconKey]}</span>
              <span className="font-pixel" style={{ fontSize: "7px" }}>
                {b.days}d
              </span>
            </div>
          ))}
          <span style={{ fontSize: "12px", color: "#3D4B63" }}>Phase:</span>
          <span
            className="font-pixel"
            style={{
              fontSize: "8px",
              color:
                phase === "idle"
                  ? "#10B981"
                  : phase === "player-turn"
                    ? "#0EA5E9"
                    : phase === "enemy-turn"
                      ? "#EF4444"
                      : phase === "victory"
                        ? "#F59E0B"
                        : "#EF4444",
            }}
          >
            {phase.toUpperCase().replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Main battle layout */}
      <div className="battle-layout flex flex-1 overflow-hidden">
        {/* ── LEFT: Player panel ─────────────────────────── */}
        <div
          className="battle-side-panel jrpg-menu-border hidden lg:flex flex-col gap-3 p-4 shrink-0"
          style={{
            width: "clamp(160px, 20vw, 220px)",
            backgroundColor: "#090A0F",
          }}
        >
          {/* DESKTOP LAYOUT (>= 1024px) */}
          <div className="flex flex-col gap-3 w-full">
            {/* Title Header */}
            <div
              className="border-b border-[#262E40] pb-2 font-cinzel font-bold text-xs select-none"
              style={{ color: "#A855F7" }}
            >
              <span>HERO STATUS</span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Avatar */}
              <div
                className="flex flex-col items-center gap-2 p-3 rounded"
                style={{ backgroundColor: "#131722", border: "2px solid #262E40" }}
              >
                <div className="relative">
                  <div
                    className="w-12 h-14 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: "#262E40",
                      border: "1px solid #3D4B63",
                    }}
                  >
                    <div
                      className={playerAnim ? "player-lunge" : ""}
                      style={{ lineHeight: 0 }}
                    >
                      <MageIcon scale={4} />
                    </div>
                  </div>
                  <span
                    className="absolute -bottom-1 -left-1 font-pixel px-1 text-[8px] rounded border text-white"
                    style={{
                      backgroundColor: "#6366F1",
                      borderColor: "#3D4B63",
                      lineHeight: "1.2",
                    }}
                  >
                    LV.{player.level}
                  </span>
                </div>
                <div
                  className="font-cinzel font-bold text-center"
                  style={{ fontSize: "10px", color: "#F8FAFC" }}
                >
                  CodeMage
                </div>
              </div>

              {/* HP bar */}
              <div>
                <div
                  className="flex justify-between mb-1"
                  style={{ fontSize: "11px" }}
                >
                  <span style={{ color: "#94A3B8" }}>HP</span>
                  <span
                    style={{
                      color:
                        hpPct > 50 ? "#10B981" : hpPct > 25 ? "#F59E0B" : "#EF4444",
                    }}
                  >
                    {player.hp}/{player.maxHp}
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "#131722",
                    border: "1px solid #262E40",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${hpPct}%`,
                      height: "100%",
                      backgroundColor:
                        hpPct > 50 ? "#10B981" : hpPct > 25 ? "#F59E0B" : "#EF4444",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* MP bar */}
              <div>
                <div
                  className="flex justify-between mb-1"
                  style={{ fontSize: "11px" }}
                >
                  <span style={{ color: "#94A3B8" }}>MP</span>
                  <span style={{ color: "#0EA5E9" }}>
                    {player.mp}/{player.maxMp}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "#131722",
                    border: "1px solid #262E40",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${mpPct}%`,
                      height: "100%",
                      backgroundColor: "#0EA5E9",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
              </div>

              {/* XP bar */}
              <div>
                <div
                  className="flex justify-between mb-1"
                  style={{ fontSize: "10px" }}
                >
                  <span style={{ color: "#64748B" }}>
                    XP to Lv.{player.level + 1}
                  </span>
                  <span style={{ color: "#6366F1" }}>
                    {player.xp}/{player.xpToNext}
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    backgroundColor: "#131722",
                    border: "1px solid #2d1b4e",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${xpPct}%`,
                      height: "100%",
                      backgroundColor: "#6366F1",
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div
                className="flex flex-col gap-1 p-2 rounded"
                style={{
                  backgroundColor: "#090A0F",
                  border: "1px solid #131722",
                  fontSize: "11px",
                }}
              >
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <SwordIcon scale={1} />
                    ATK
                  </span>
                  <span style={{ color: "#F59E0B" }}>
                    {player.attack}{" "}
                    <span style={{ color: "#10B981", fontSize: "10px" }}>
                      +{Math.round(totalAtkBoost * 100)}%
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <ShieldIcon scale={1} />
                    DEF
                  </span>
                  <span style={{ color: "#0EA5E9" }}>
                    {player.defense}{" "}
                    <span style={{ color: "#10B981", fontSize: "10px" }}>
                      +{Math.round(totalDefBoost * 100)}%
                    </span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      color: "#64748B",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <PotionIcon scale={1} />
                    Potions
                  </span>
                  <span style={{ color: "#a78bfa" }}>{potions}</span>
                </div>
              </div>

              {/* Streak boosts */}
              <div>
                <div
                  className="font-pixel mb-2 flex items-center gap-1"
                  style={{ fontSize: "7px", color: "#3D4B63" }}
                >
                  <FlameIcon scale={1} /> STREAK BOOSTS ({CURRENT_STREAK} days)
                </div>
                <div className="flex flex-col gap-1">
                  {STREAK_BOOSTS.map((b) => {
                    const unlocked = b.days <= CURRENT_STREAK
                    return (
                      <div
                        key={b.days}
                        className="flex items-start gap-2 px-2 py-1.5 rounded"
                        style={{
                          backgroundColor: unlocked ? `${b.color}14` : "#090A0F",
                          border: `1px solid ${unlocked ? b.color + "50" : "#131722"
                            }`,
                          opacity: unlocked ? 1 : 0.45,
                        }}
                      >
                        <span style={{ lineHeight: 0, marginTop: "2px" }}>
                          {STREAK_ICON[b.iconKey]}
                        </span>
                        <div>
                          <div
                            className="font-pixel"
                            style={{
                              fontSize: "6px",
                              color: unlocked ? b.color : "#3D4B63",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                              }}
                            >
                              {b.days}-DAY{unlocked ? " ✓" : <LockIcon scale={1} />}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: unlocked ? "#C8D4E6" : "#3D4B63",
                              lineHeight: 1.3,
                            }}
                          >
                            {b.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CENTER: Arena ──────────────────────────────── */}
        <div
          className="battle-arena-container flex flex-col flex-1 overflow-hidden relative"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #1a1035 0%, #0a0e1a 70%)",
            backgroundImage:
              "radial-gradient(ellipse at 50% 40%, #1a1035 0%, #0a0e1a 70%), repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.02) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.02) 32px)",
          }}
        >
          {/* MOBILE/TABLET LAYOUT (< 1024px) */}
          <div className="lg:hidden p-3 bg-[#090A0F] border-b border-[#262E40] shrink-0 font-pixel text-[10px] w-full">
            <div className="flex gap-2 w-full">

              {/* col 1 — 40%: HP / MP / XP bars */}
              <div className="flex flex-col gap-1.5 justify-center" style={{ width: "40%" }}>
                <div>
                  <div className="flex justify-between text-[8px] mb-0.5">
                    <span className="text-[#94A3B8]">HP</span>
                    <span style={{ color: hpPct > 50 ? "#10B981" : "#EF4444" }}>{player.hp}/{player.maxHp}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#131722] border border-[#262E40] rounded-sm overflow-hidden">
                    <div className="h-full" style={{ width: `${hpPct}%`, backgroundColor: hpPct > 50 ? "#10B981" : "#EF4444" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] mb-0.5">
                    <span className="text-[#94A3B8]">MP</span>
                    <span className="text-[#0EA5E9]">{player.mp}/{player.maxMp}</span>
                  </div>
                  <div className="h-1 w-full bg-[#131722] border border-[#262E40] rounded-sm overflow-hidden">
                    <div className="h-full bg-[#0EA5E9]" style={{ width: `${mpPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] mb-0.5">
                    <span className="text-[#64748B]">XP</span>
                    <span className="text-[#6366F1]">{player.xp}/{player.xpToNext}</span>
                  </div>
                  <div className="h-1 w-full bg-[#131722] border border-[#2d1b4e] rounded-sm overflow-hidden">
                    <div className="h-full bg-[#6366F1]" style={{ width: `${xpPct}%` }} />
                  </div>
                </div>
              </div>

              {/* col 2 — 30%: ATK / DEF / POTIONS with icons */}
              <div className="flex flex-col justify-center gap-1.5 border-l border-[#262E40] pl-2" style={{ width: "30%" }}>
                <div className="text-[#A855F7] font-bold text-[7px] text-center tracking-widest">LVL {player.level}</div>
                <div className="flex items-center gap-1">
                  <span style={{ lineHeight: 0, color: "#64748B" }}><SwordIcon scale={1} /></span>
                  <span className="text-[#F59E0B] text-[8px]">{player.attack}</span>
                  {totalAtkBoost > 0 && <span className="text-[#62520b] text-[6px]">+{Math.round(totalAtkBoost * 100)}%</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ lineHeight: 0, color: "#64748B" }}><ShieldIcon scale={1} /></span>
                  <span className="text-[#0EA5E9] text-[8px]">{player.defense}</span>
                  {totalDefBoost > 0 && <span className="text-[#063a52] text-[6px]">+{Math.round(totalDefBoost * 100)}%</span>}
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ lineHeight: 0, color: "#64748B" }}><PotionIcon scale={1} /></span>
                  <span className="text-[#a78bfa] text-[8px]">x{potions}</span>
                </div>
              </div>

              {/* col 3 — 30%: Active boosts */}
              <div className="flex flex-col justify-center gap-1 border-l border-[#262E40] pl-2" style={{ width: "30%" }}>
                <div className="text-[#3D4B63] text-[7px] tracking-widest font-bold mb-0.5">BOOSTS</div>
                {activeBoosts.length > 0 ? (
                  activeBoosts.map((b) => (
                    <span
                      key={b.days}
                      className="px-1 py-0.5 rounded border text-[6px] font-mono leading-none truncate"
                      style={{ color: b.color, borderColor: b.color + "40", backgroundColor: b.color + "10" }}
                    >
                      {b.label}
                    </span>
                  ))
                ) : (
                  <span className="text-[#262E40] text-[7px]">NONE</span>
                )}
              </div>

            </div>
          </div>
          {/* Enemy HP bar (top of arena) */}
          <div
            className={`px-8 pt-4 pb-2 shrink-0 ${activePanel !== "none" ? "hidden md:block" : "block"
              }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-cinzel font-bold flex items-center gap-1.5"
                style={{
                  fontSize: "12px",
                  color: enemy.color,
                  letterSpacing: "0.05em",
                }}
              >
                <button
                  onClick={() => setMonsterInfoOpen(true)}
                  className="lg:hidden px-1 py-0.2 rounded font-pixel bg-[#131722] hover:bg-[#262E40] border border-[#262E40] text-[7px] text-[#0EA5E9] cursor-pointer inline-flex items-center justify-center leading-none"
                  title="Monster stats"
                >
                  i
                </button>
                {enemy.name}
              </span>
              <span
                className="font-pixel"
                style={{ fontSize: "9px", color: "#EF4444" }}
              >
                {Math.max(0, enemyHp)}/{enemy.hp} HP
              </span>
            </div>
            <div
              style={{
                height: "10px",
                backgroundColor: "#131722",
                border: "2px solid #262E40",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${enemyHpPct}%`,
                  height: "100%",
                  backgroundColor:
                    enemyHpPct > 50
                      ? "#EF4444"
                      : enemyHpPct > 25
                        ? "#F97316"
                        : "#F59E0B",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Enemy sprite */}
          <div
            className={`flex flex-col items-center justify-center flex-1 relative ${activePanel !== "none" ? "hidden md:flex" : "flex"
              }`}
          >
            <div className="relative flex flex-col items-center">
              {/* Shadow */}
              <div
                style={{
                  width: "100px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  margin: "0 auto",
                  marginBottom: "-6px",
                }}
              />
              <div
                className={enemyAnim ? "enemy-hit" : ""}
                style={{ lineHeight: 0, display: "block" }}
              >
                {ENEMY_SPRITE[enemy.id]?.(7)}
              </div>

              {/* Floating damage number */}
              {floatingDmg && (
                <div
                  key={floatingDmg.key}
                  className="float-dmg absolute font-pixel pointer-events-none"
                  style={{
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: floatingDmg.crit ? "18px" : "14px",
                    color: floatingDmg.crit ? "#F59E0B" : "#EF4444",
                    textShadow: "0 0 8px currentColor",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    {floatingDmg.crit ? <LightningIcon scale={2} /> : ""}−
                    {floatingDmg.val}
                  </span>
                </div>
              )}
            </div>

            {/* Enemy name plate */}
            <div
              className="mt-4 px-4 py-1.5 font-pixel"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                border: `2px solid ${enemy.color}60`,
                borderRadius: "2px",
                fontSize: "9px",
                color: enemy.color,
              }}
            >
              <span
                className="font-cinzel font-bold"
                style={{ fontSize: "11px", color: enemy.color }}
              >
                {enemy.name}
              </span>
            </div>

            {/* Victory overlay */}
            {
              phase === "victory" && pendingVictory && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
                >
                  <div
                    className="victory-pop flex flex-col items-center gap-4 p-7"
                    style={{
                      background:
                        "linear-gradient(160deg, #071a07 0%, #0d240d 60%, #071a07 100%)",
                      border: "2px solid #10B981",
                      borderRadius: "4px",
                      boxShadow:
                        "0 0 40px rgba(16,185,129,0.35), inset 0 1px 0 rgba(16,185,129,0.2)",
                      minWidth: "280px",
                    }}
                  >
                    <div
                      className="font-cinzel font-bold text-center flex items-center gap-3 justify-center"
                      style={{
                        fontSize: "18px",
                        color: "#10B981",
                        letterSpacing: "0.12em",
                      }}
                    >
                      <TrophyIcon scale={2} /> ENEMY DEFEATED
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, #10B981, transparent)",
                      }}
                    />
                    <div className="flex gap-8">
                      <div className="text-center">
                        <div
                          className="font-pixel"
                          style={{ fontSize: "8px", color: "#818CF8" }}
                        >
                          XP EARNED
                        </div>
                        <div
                          className="font-cinzel font-bold"
                          style={{ fontSize: "22px", color: "#F8FAFC" }}
                        >
                          +{pendingVictory.xp}
                        </div>
                      </div>
                      <div className="text-center">
                        <div
                          className="font-pixel"
                          style={{ fontSize: "8px", color: "#F59E0B" }}
                        >
                          GOLD COINS
                        </div>
                        <div
                          className="font-cinzel font-bold"
                          style={{ fontSize: "22px", color: "#FCD34D" }}
                        >
                          +{pendingVictory.coins}
                        </div>
                      </div>
                    </div>
                    {player.xp + pendingVictory.xp >= player.xpToNext && (
                      <div
                        className="flex items-center gap-3 px-5 py-3 rounded victory-pop"
                        style={{
                          background:
                            "linear-gradient(90deg, #1a0d33, #2d1b4e, #1a0d33)",
                          border: "2px solid #A855F7",
                          boxShadow: "0 0 20px rgba(168,85,247,0.4)",
                        }}
                      >
                        <StarIcon scale={3} />
                        <div>
                          <div
                            className="font-cinzel font-bold"
                            style={{ fontSize: "13px", color: "#A855F7" }}
                          >
                            LEVEL UP!
                          </div>
                          <div style={{ fontSize: "11px", color: "#C8D4E6" }}>
                            Lv.{player.level} →{" "}
                            <span style={{ color: "#818CF8" }}>
                              Lv.{player.level + 1}
                            </span>
                            &nbsp;· +15 HP · +4 ATK · +2 DEF
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={nextEnemy}
                      className="px-8 py-2.5 font-cinzel font-bold cursor-pointer"
                      style={{
                        backgroundColor: "#10B981",
                        color: "#060810",
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      NEXT ENEMY →
                    </button>
                  </div>
                </div>
              )
            }

            {/* Defeat overlay */}
            {
              phase === "defeat" && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
                >
                  <div
                    className="victory-pop flex flex-col items-center gap-3 p-6"
                    style={{
                      background: "linear-gradient(135deg, #3a0a0a, #2a0f0f)",
                      border: "3px solid #EF4444",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      className="font-cinzel font-bold text-center flex items-center gap-3 justify-center"
                      style={{
                        fontSize: "18px",
                        color: "#EF4444",
                        letterSpacing: "0.12em",
                      }}
                    >
                      <SkullIcon scale={3} /> DEFEATED
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, #EF4444, transparent)",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        textAlign: "center",
                        lineHeight: "1.5",
                      }}
                    >
                      Return to the Learn tab to strengthen your knowledge.
                    </p>
                    <button
                      onClick={() => {
                        setPlayer((p) => ({ ...p, hp: p.maxHp, mp: p.maxMp }))
                        setEnemyHp(enemy.hp)
                        setPhase("idle")
                        setBattleLog([
                          "🔄 You recover your strength and face the enemy again...",
                        ])
                      }}
                      className="px-8 py-2.5 font-cinzel font-bold cursor-pointer"
                      style={{
                        backgroundColor: "#EF4444",
                        color: "#F8FAFC",
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      TRY AGAIN
                    </button>
                  </div>
                </div>
              )
            }
          </div >

          {/* Battle log */}
          < div
            className={`mx-4 mb-3 p-3 shrink-0 ${activePanel !== "none" ? "hidden md:block" : "block"
              }`}
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "1px solid #1E2D40",
              borderRadius: "2px",
              maxHeight: "90px",
              overflowY: "auto",
            }}
          >
            {
              battleLog.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: i === battleLog.length - 1 ? "#F8FAFC" : "#3D4B63",
                    lineHeight: "1.5",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {line}
                </div>
              ))
            }
          </div >

          {/* mobile compact combat hud when panels are open */}
          {
            activePanel !== "none" && (
              <div className="md:hidden flex items-center justify-between px-3 py-2 mx-4 mb-2 bg-[#090A0F] border border-[#262E40] rounded shrink-0 gap-3 text-[9px] font-pixel">
                {/* Hero Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[7px] mb-0.5" style={{ color: "#818CF8" }}>
                    <span>HERO HP</span>
                    <span>{player.hp}/{player.maxHp}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#131722] rounded-sm overflow-hidden border border-[#262E40]">
                    <div
                      className="h-full"
                      style={{
                        width: `${hpPct}%`,
                        backgroundColor: hpPct > 50 ? "#10B981" : "#EF4444",
                      }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-[#3D4B63] text-[7px]">VS</div>
                {/* Enemy Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[7px] mb-0.5" style={{ color: enemy.color }}>
                    <span className="flex items-center gap-1">
                      {enemy.name.substring(0, 8).toUpperCase()}
                      <button
                        onClick={() => setMonsterInfoOpen(true)}
                        className="px-1 font-pixel text-[#0EA5E9] cursor-pointer text-[6px] hover:underline"
                      >
                        i
                      </button>
                    </span>
                    <span>{Math.max(0, enemyHp)}/{enemy.hp}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#131722] rounded-sm overflow-hidden border border-[#262E40]">
                    <div
                      className="h-full"
                      style={{
                        width: `${enemyHpPct}%`,
                        backgroundColor: "#EF4444",
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          }

          {/* Action bar / panels */}
          {
            activePanel === "none" ? (
              <div
                className="battle-actions flex items-center justify-center gap-3 px-4 py-3 shrink-0"
                style={{
                  backgroundColor: "#090A0F",
                  borderTop: "2px solid #1E2D40",
                }}
              >
                <button
                  onClick={() => {
                    if (
                      phase === "enemy-turn" ||
                      phase === "victory" ||
                      phase === "defeat"
                    )
                      return
                    setActivePanel("code")
                    setPhase("player-turn")
                  }}
                  disabled={
                    phase === "enemy-turn" ||
                    phase === "victory" ||
                    phase === "defeat"
                  }
                  className="battle-action-btn cursor-pointer"
                  style={{
                    backgroundColor: "#0c1e36",
                    border: "2px solid #0EA5E9",
                    borderRadius: "4px",
                    color: "#0EA5E9",
                    opacity:
                      phase === "enemy-turn" ||
                        phase === "victory" ||
                        phase === "defeat"
                        ? 0.4
                        : 1,
                  }}
                >
                  <SwordIcon scale={3} />
                  <span className="font-pixel" style={{ fontSize: "7px" }}>
                    CODE ATTACK
                  </span>
                  <span style={{ fontSize: "10px", color: "#3D4B63" }}>
                    40–60 DMG
                  </span>
                </button>

                <button
                  onClick={() => {
                    if (
                      phase === "enemy-turn" ||
                      phase === "victory" ||
                      phase === "defeat"
                    )
                      return
                    setActivePanel("quiz")
                    setPhase("player-turn")
                  }}
                  disabled={
                    phase === "enemy-turn" ||
                    phase === "victory" ||
                    phase === "defeat"
                  }
                  className="battle-action-btn cursor-pointer"
                  style={{
                    backgroundColor: "#1a0c36",
                    border: "2px solid #6366F1",
                    borderRadius: "4px",
                    color: "#6366F1",
                    opacity:
                      phase === "enemy-turn" ||
                        phase === "victory" ||
                        phase === "defeat"
                        ? 0.4
                        : 1,
                  }}
                >
                  <ScrollIcon scale={3} />
                  <span className="font-pixel" style={{ fontSize: "7px" }}>
                    QUIZ STRIKE
                  </span>
                  <span style={{ fontSize: "10px", color: "#3D4B63" }}>
                    12 DMG
                  </span>
                </button>

                <button
                  onClick={usePotion}
                  disabled={
                    potions === 0 ||
                    player.hp >= player.maxHp ||
                    phase === "enemy-turn"
                  }
                  className="battle-action-btn cursor-pointer relative"
                  style={{
                    backgroundColor: "#1a0c2e",
                    border: "2px solid #a78bfa",
                    borderRadius: "4px",
                    color: "#a78bfa",
                    opacity:
                      potions === 0 ||
                        player.hp >= player.maxHp ||
                        phase === "enemy-turn"
                        ? 0.4
                        : 1,
                  }}
                >
                  <PotionIcon scale={3} />
                  <span className="font-pixel" style={{ fontSize: "7px" }}>
                    USE ITEM
                  </span>
                  <span style={{ fontSize: "10px", color: "#3D4B63" }}>
                    +40 HP
                  </span>
                  <div
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-pixel"
                    style={{
                      backgroundColor: "#a78bfa",
                      color: "#090A0F",
                      fontSize: "8px",
                    }}
                  >
                    {potions}
                  </div>
                </button>
              </div>
            ) : activePanel === "code" ? (
              /* Code sandbox panel */
              <div className="battle-code-panel flex flex-col flex-1 md:flex-initial">
                <div
                  className="flex items-center justify-between px-4 py-2 shrink-0"
                  style={{
                    backgroundColor: "#0c1e36",
                    borderBottom: "1px solid #1E2D40",
                  }}
                >
                  <span
                    className="font-pixel"
                    style={{ fontSize: "8px", color: "#0EA5E9" }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <SwordIcon scale={1} />
                      CODE ATTACK — Submit to deal damage
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setActivePanel("none")
                      setPhase("idle")
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748B",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div
                    className="flex flex-col pt-2 px-2 shrink-0 select-none font-mono-custom"
                    style={{
                      backgroundColor: "#0A0E1A",
                      color: "#262E40",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      borderRight: "1px solid #131722",
                      minWidth: "36px",
                      textAlign: "right",
                    }}
                  >
                    {code.split("\n").map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 p-2 font-mono-custom scrollbar-hide resize-none outline-none"
                    style={{
                      backgroundColor: "#0A0E1A",
                      color: "#F8FAFC",
                      fontSize: "12px",
                      lineHeight: "1.6",
                      border: "none",
                      caretColor: "#0EA5E9",
                    }}
                    spellCheck={false}
                  />
                </div>
                <div
                  className="flex gap-2 px-4 py-2 shrink-0"
                  style={{
                    backgroundColor: "#0c1e36",
                    borderTop: "1px solid #1E2D40",
                  }}
                >
                  <button
                    onClick={handleCodeAttack}
                    className="px-4 py-1.5 font-pixel cursor-pointer"
                    style={{
                      backgroundColor: "#0EA5E9",
                      color: "#090A0F",
                      border: "none",
                      borderRadius: "2px",
                      fontSize: "8px",
                    }}
                  >
                    ▶ RUN &amp; ATTACK
                  </button>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#3D4B63",
                      alignSelf: "center",
                    }}
                  >
                    More passing tests = more damage
                  </span>
                </div>
              </div>
            ) : (
              /* Quiz panel */
              <div className="battle-quiz-panel flex flex-col shrink-0 p-4 gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className="font-pixel"
                    style={{ fontSize: "8px", color: "#6366F1" }}
                  >
                    📝 QUIZ STRIKE — Answer correctly to deal damage
                  </span>
                  <button
                    onClick={() => {
                      setActivePanel("none")
                      setPhase("idle")
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#64748B",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
                <p style={{ fontSize: "13px", color: "#F8FAFC" }}>
                  {BATTLE_QUIZ.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BATTLE_QUIZ.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      disabled={quizAnswer !== null}
                      className="flex items-center gap-2 px-3 py-2 text-left cursor-pointer"
                      style={{
                        backgroundColor:
                          quizAnswer === i
                            ? i === BATTLE_QUIZ.correct
                              ? "rgba(16,185,129,0.15)"
                              : "rgba(239,68,68,0.15)"
                            : quizAnswer !== null && i === BATTLE_QUIZ.correct
                              ? "rgba(16,185,129,0.1)"
                              : "#131722",
                        border: `2px solid ${quizAnswer === i
                          ? i === BATTLE_QUIZ.correct
                            ? "#10B981"
                            : "#EF4444"
                          : quizAnswer !== null && i === BATTLE_QUIZ.correct
                            ? "#10B981"
                            : "#262E40"
                          }`,
                        borderRadius: "3px",
                        color: "#F8FAFC",
                        fontSize: "13px",
                      }}
                    >
                      <span
                        className="font-pixel shrink-0 w-5 h-5 flex items-center justify-center"
                        style={{
                          fontSize: "7px",
                          backgroundColor: "#262E40",
                          borderRadius: "2px",
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          }
        </div>

        {/* ── RIGHT: Enemy panel ─────────────────────────── */}
        <div
        className="battle-side-panel jrpg-menu-border hidden lg:flex flex-col gap-3 p-4 shrink-0"
        style={{
          width: "clamp(150px, 18vw, 200px)",
          backgroundColor: "#090A0F",
        }}
      >
        {/* Title Header */}
        <div
          className="border-b border-[#262E40] pb-2 font-cinzel font-bold text-xs select-none"
          style={{ color: enemy.color }}
        >
          <span>MONSTER STATS</span>
        </div>

          {/* Enemy info */}
          <div
            className="flex flex-col items-center gap-2 p-3 rounded"
            style={{
              backgroundColor: "#131722",
              border: `2px solid ${enemy.color}60`,
              boxShadow: `0 0 16px ${enemy.color}20`,
            }}
          >
            <div
              className="w-12 h-14 rounded flex items-center justify-center"
              style={{
                backgroundColor: "#262E40",
                border: "1px solid #3D4B63",
              }}
            >
              <div style={{ lineHeight: 0 }}>{ENEMY_SPRITE[enemy.id]?.(3)}</div>
            </div>
            <div
              className="font-cinzel font-bold text-center"
              style={{
                fontSize: "10px",
                color: enemy.color,
                letterSpacing: "0.04em",
              }}
            >
              {enemy.name}
            </div>
          </div>

          <div
            className="flex items-center justify-center gap-2 px-2 py-1.5 rounded"
            style={{
              backgroundColor:
                enemy.weakness === "code"
                  ? "rgba(14,165,233,0.1)"
                  : "rgba(99,102,241,0.1)",
              border: `1px solid ${enemy.weakness === "code" ? "#0EA5E9" : "#6366F1"
                }50`,
            }}
          >
            <span style={{ lineHeight: 0 }}>
              {enemy.weakness === "code" ? (
                <SwordIcon scale={2} />
              ) : (
                <ScrollIcon scale={2} />
              )}
            </span>
            <div>
              <div
                className="font-pixel"
                style={{ fontSize: "6px", color: "#3D4B63" }}
              >
                WEAK TO
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: enemy.weakness === "code" ? "#0EA5E9" : "#6366F1",
                }}
              >
                {enemy.weakness === "code" ? "Code" : "Quiz"}
              </div>
            </div>
          </div>

          <div
            style={{ fontSize: "11px", color: "#64748B", lineHeight: "1.5" }}
          >
            {enemy.description}
          </div>

          <div
            className="flex flex-col gap-1 p-2 rounded"
            style={{
              backgroundColor: "#090A0F",
              border: "1px solid #131722",
              fontSize: "11px",
            }}
          >
            <div className="flex justify-between items-center">
              <span
                style={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <SwordIcon scale={1} />
                ATK
              </span>
              <span style={{ color: "#EF4444" }}>{enemy.attack}</span>
            </div>
            <div className="flex justify-between items-center">
              <span
                style={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <CoinIcon scale={1} />
                Reward
              </span>
              <span
                style={{
                  color: "#F59E0B",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                {enemy.coinReward}
                <CoinIcon scale={1} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                style={{
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                <StarIcon scale={1} />
                XP
              </span>
              <span style={{ color: "#6366F1" }}>+{enemy.xpReward}</span>
            </div>
          </div>

          {/* Upcoming enemies */}
          <div>
            <div
              className="font-pixel mb-2"
              style={{ fontSize: "7px", color: "#262E40" }}
            >
              NEXT UP
            </div>
            {ENEMIES.slice(enemyIndex + 1, enemyIndex + 3).map((e) => (
              <div
                key={e.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded mb-1"
                style={{
                  backgroundColor: "#090A0F",
                  border: "1px solid #131722",
                  opacity: 0.5,
                }}
              >
                <span style={{ lineHeight: 0 }}>{ENEMY_SPRITE[e.id]?.(2)}</span>
                <div>
                  <div style={{ fontSize: "10px", color: "#3D4B63" }}>
                    {e.name}
                  </div>
                  <div style={{ fontSize: "9px", color: "#262E40" }}>
                    {e.hp} HP
                  </div>
                </div>
              </div>
            ))}
            {enemyIndex + 1 >= ENEMIES.length && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#262E40",
                  textAlign: "center",
                  padding: "8px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  <TrophyIcon scale={2} />
                  Final boss
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monster stats detail modal */}
      {monsterInfoOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMonsterInfoOpen(false)}
            className="fixed inset-0 bg-[#090a0f] bg-opacity-80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          />
          {/* Modal Panel */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] bg-[#0A0E1A] border-4 border-double border-[#262E40] p-4 rounded z-50 flex flex-col gap-3 shadow-2xl font-pixel text-[10px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#262E40] pb-1.5">
              <span className="font-cinzel font-bold text-xs" style={{ color: enemy.color }}>
                {enemy.name.toUpperCase()}
              </span>
              <button
                onClick={() => setMonsterInfoOpen(false)}
                className="text-[#64748B] hover:text-white cursor-pointer font-pixel text-[10px]"
              >
                ✕
              </button>
            </div>

            {/* Sprite */}
            <div className="flex justify-center bg-[#131722] py-3 rounded border border-[#262E40]">
              <div style={{ lineHeight: 0 }}>{ENEMY_SPRITE[enemy.id]?.(4)}</div>
            </div>

            {/* Description */}
            <p className="text-[#94A3B8] font-sans leading-relaxed text-[10px] italic">
              "{enemy.description}"
            </p>

            {/* Details */}
            <div className="flex flex-col gap-1 bg-[#090A0F] p-2 rounded border border-[#131722] text-[9px]">
              <div className="flex justify-between items-center text-[#EF4444]">
                <span>ATK POWER</span>
                <span>{enemy.attack}</span>
              </div>
              <div className="flex justify-between items-center text-[#F59E0B]">
                <span>REWARD GOLD</span>
                <span>{enemy.coinReward} GP</span>
              </div>
              <div className="flex justify-between items-center text-[#6366F1]">
                <span>REWARD XP</span>
                <span>+{enemy.xpReward} XP</span>
              </div>
              <div className="flex justify-between items-center" style={{ color: enemy.weakness === "code" ? "#0EA5E9" : "#6366F1" }}>
                <span>WEAKNESS</span>
                <span>{enemy.weakness === "code" ? "CODE ATTACK (×1.5)" : "QUIZ STRIKE (×1.5)"}</span>
              </div>
            </div>

            {/* Upcoming list */}
            <div>
              <div className="text-[#3D4B63] text-[8px] mb-1.5 uppercase">Upcoming Enemies</div>
              <div className="flex flex-col gap-1">
                {ENEMIES.slice(enemyIndex + 1, enemyIndex + 3).map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between px-2 py-1 bg-[#131722] border border-[#262E40] rounded text-[8px] opacity-70"
                  >
                    <span className="text-[#94A3B8]">{e.name}</span>
                    <span className="text-[#EF4444]">{e.hp} HP</span>
                  </div>
                ))}
                {enemyIndex + 1 >= ENEMIES.length && (
                  <div className="text-[#3D4B63] text-center py-1">Final Boss Area</div>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setMonsterInfoOpen(false)}
              className="w-full py-1.5 text-center bg-[#262E40] border border-[#3D4B63] text-[#94A3B8] hover:text-white rounded cursor-pointer mt-1"
            >
              CLOSE STATUS
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Marketplace View ─────────────────────────────────────────────────────────

const RARITY_META: Record<ItemRarity, {
  label: string
  color: string
  glow: string
  bg: string
}> = {
  common: {
    label: "Common",
    color: "#94A3B8",
    glow: "rgba(148,163,184,0.12)",
    bg: "#131722",
  },
  uncommon: {
    label: "Uncommon",
    color: "#10B981",
    glow: "rgba(16,185,129,0.2)",
    bg: "#091a13",
  },
  rare: {
    label: "Rare",
    color: "#0EA5E9",
    glow: "rgba(14,165,233,0.25)",
    bg: "#081420",
  },
  epic: {
    label: "Epic",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.28)",
    bg: "#110a20",
  },
  legendary: {
    label: "Legendary",
    color: "#FCD34D",
    glow: "rgba(252,211,77,0.3)",
    bg: "#1c1200",
  },
}

function MarketplaceView() {
  const [filter, setFilter] = useState<ShopFilter>("all")
  const [owned, setOwned] = useState<number[]>([1, 7, 13]) // mock: a few already owned

  const filters: { id: ShopFilter; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All", icon: <StoreIcon scale={2} /> },
    { id: "weapons", label: "Weapons", icon: <SwordIcon scale={2} /> },
    { id: "armor", label: "Armor", icon: <ShieldIcon scale={2} /> },
    { id: "potions", label: "Potions", icon: <PotionIcon scale={2} /> },
    {
      id: "accessories",
      label: "Accessories",
      icon: <CrystalIcon scale={2} />,
    },
    { id: "spells", label: "Spells", icon: <CrystalIcon scale={2} /> },
  ]

  const SHOP_CATEGORY_SPRITE: Record<string, (s: number) => React.ReactNode> = {
    weapons: (s) => <SwordIcon scale={s} />,
    armor: (s) => <ShieldIcon scale={s} />,
    potions: (s) => <PotionIcon scale={s} />,
    accessories: (s) => <CrystalIcon scale={s} />,
    spells: (s) => <CrystalIcon scale={s} />,
  }

  const visible =
    filter === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === filter)

  function handleBuy(id: number) {
    setOwned((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
      style={{ backgroundColor: "#0A0E1A" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #1a0a2e 0%, #0f1a2e 50%, #1a0a2e 100%)",
          borderBottom: "2px solid #2d1b4e",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-cinzel font-bold flex items-center gap-2"
            style={{
              fontSize: "14px",
              color: "#A855F7",
              letterSpacing: "0.08em",
            }}
          >
            <StoreIcon scale={2} />
            Dungeon Armory
          </span>
          {/* hide secondary info on small viewports */}
          <span
            className="hidden sm:inline"
            style={{ fontSize: "12px", color: "#262E40" }}
          >
            ·
          </span>
          <span
            className="hidden sm:inline"
            style={{ fontSize: "12px", color: "#3D4B63" }}
          >
            {visible.length} items
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            <span className="coin-bounce" style={{ lineHeight: 0 }}>
              <CoinIcon scale={2} />
            </span>
            <span
              className="font-pixel"
              style={{ fontSize: "10px", color: "#F59E0B" }}
            >
              1,420
            </span>
          </div>
          {/* hide owned count tag on small viewports */}
          <div
            className="hidden sm:block"
            style={{ fontSize: "12px", color: "#3D4B63" }}
          >
            {owned.length} owned
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div
        className="flex items-center gap-2 px-5 py-2.5 shrink-0 overflow-x-auto scrollbar-hide"
        style={{
          backgroundColor: "#090A0F",
          borderBottom: "1px solid #131722",
        }}
      >
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded cursor-pointer shrink-0 transition-colors"
            style={{
              backgroundColor: filter === f.id ? "#6366F1" : "#131722",
              border: `1px solid ${filter === f.id ? "#818CF8" : "#262E40"}`,
              color: filter === f.id ? "#fff" : "#94A3B8",
              fontSize: "13px",
              fontWeight: filter === f.id ? 600 : 400,
            }}
          >
            <span style={{ lineHeight: 0 }}>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(clamp(160px, 22vw, 220px), 1fr))",
          }}
        >
          {visible.map((item) => {
            const meta = RARITY_META[item.rarity]
            const isOwned = owned.includes(item.id)
            return (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden"
                style={{
                  backgroundColor: meta.bg,
                  border: `4px double ${meta.color}`,
                  borderRadius: "4px",
                  boxShadow: isOwned ? `0 0 12px ${meta.glow}` : "none",
                  opacity: isOwned ? 1 : 0.92,
                  position: "relative",
                }}
              >
                {/* Rarity banner */}
                <div
                  className="flex items-center justify-between px-3 py-1"
                  style={{
                    backgroundColor: `${meta.color}18`,
                    borderBottom: `1px solid ${meta.color}30`,
                  }}
                >
                  <span
                    className="font-pixel"
                    style={{
                      fontSize: "7px",
                      color: meta.color,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {meta.label.toUpperCase()}
                  </span>
                  {isOwned && (
                    <span
                      className="font-pixel"
                      style={{ fontSize: "7px", color: "#10B981" }}
                    >
                      ✓ OWNED
                    </span>
                  )}
                </div>

                {/* Icon area */}
                <div
                  className="flex items-center justify-center relative"
                  style={{ height: "90px", backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                  {/* Rarity glow halo */}
                  <div
                    style={{
                      position: "absolute",
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      backgroundColor: meta.glow,
                      filter: "blur(12px)",
                    }}
                  />
                  <span style={{ lineHeight: 0, position: "relative" }}>
                    {SHOP_CATEGORY_SPRITE[item.category]?.(5)}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <div
                    className="font-cinzel font-semibold text-sm"
                    style={{ color: "#F8FAFC" }}
                  >
                    {item.name}
                  </div>

                  {/* Stats */}
                  <div
                    className="px-2 py-1 rounded font-mono-custom"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.35)",
                      fontSize: "11px",
                      color: meta.color,
                    }}
                  >
                    {item.stats}
                  </div>

                  {/* Flavor */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#3D4B63",
                      lineHeight: "1.4",
                      fontStyle: "italic",
                    }}
                  >
                    "{item.flavor}"
                  </div>

                  {/* Requirement */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded self-start"
                    style={{
                      backgroundColor:
                        item.req === "None"
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(167,139,250,0.08)",
                      border: `1px solid ${item.req === "None" ? "#10B98150" : "#a78bfa50"
                        }`,
                      color: item.req === "None" ? "#10B981" : "#a78bfa",
                      fontSize: "10px",
                    }}
                  >
                    {item.req === "None" ? (
                      "✓ No req"
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <LockIcon scale={1} />
                        {item.req}
                      </span>
                    )}
                  </div>

                  {/* Cost + CTA */}
                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <span
                      className="font-pixel"
                      style={{ fontSize: "10px", color: "#F59E0B" }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <CoinIcon scale={1} />
                        {item.cost}
                      </span>
                    </span>
                    <button
                      onClick={() => handleBuy(item.id)}
                      className="flex-1 py-1.5 rounded text-sm font-medium cursor-pointer"
                      style={{
                        backgroundColor: isOwned
                          ? "rgba(16,185,129,0.15)"
                          : meta.color,
                        color: isOwned
                          ? "#10B981"
                          : item.rarity === "common" ||
                            item.rarity === "uncommon"
                            ? "#090A0F"
                            : "#fff",
                        border: isOwned ? `1px solid #10B981` : "none",
                        fontSize: "12px",
                      }}
                    >
                      {isOwned ? "✓ " + item.cta + "d" : item.cta}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Chat View ────────────────────────────────────────────────────────────────

function ChatView() {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0])
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pinnedOpen, setPinnedOpen] = useState(false)
  const [membersOpen, setMembersOpen] = useState(false)
  const [channelsOpenMobile, setChannelsOpenMobile] = useState(false)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(
    CHANNEL_MESSAGES[CHANNELS[0]],
  )

  function switchChannel(ch: string) {
    setActiveChannel(ch)
    setLocalMessages(CHANNEL_MESSAGES[ch] ?? DM_MESSAGES[ch] ?? [])
    setSearchQuery("")
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSend = () => {
    const text = message.trim()
    if (!text) return
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    setLocalMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "You",
        time: timeStr,
        text,
        system: false,
      },
    ])
    setMessage("")
  }

  const PINNED = [
    {
      id: 1,
      author: "Sarah_Dev",
      text: "Check your loop edge cases. You might be off-by-one.",
    },
    { id: 2, author: "Bot", text: "🎉 Alex just reached a 30-day streak!" },
  ]

  const MEMBERS = [
    { name: "You", online: true, role: "Member" },
    { name: "Sarah_Dev", online: true, role: "Member" },
    { name: "Marcus_K", online: true, role: "Member" },
    { name: "Alex", online: true, role: "Member" },
    { name: "David", online: false, role: "Member" },
  ]

  const displayedMessages = searchQuery
    ? localMessages.filter((m) =>
      m.text?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : localMessages

  /* helper to render sidebar content to avoid duplication (dry) */
  const renderSidebarContent = () => (
    <>
      {/* Search */}
      <div className="p-3 shrink-0">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded"
          style={{ backgroundColor: "#090A0F", border: "1px solid #262E40" }}
        >
          <span style={{ color: "#3D4B63", lineHeight: 0 }}>
            <SearchIcon scale={2} />
          </span>
          <span style={{ color: "#3D4B63", fontSize: "13px" }}>
            Search friends...
          </span>
        </div>
      </div>

      {/* Channels */}
      <div className="px-3 mb-1 overflow-y-auto">
        <div
          className="font-pixel mb-2"
          style={{ fontSize: "8px", color: "#3D4B63", letterSpacing: "0.05em" }}
        >
          GROUPS
        </div>
        {CHANNELS.map((c) => (
          <button
            key={c}
            onClick={() => {
              switchChannel(c)
              setChannelsOpenMobile(false)
            }}
            className="w-full text-left px-3 py-2 rounded mb-0.5 cursor-pointer text-sm"
            style={{
              background: activeChannel === c ? "#262E40" : "none",
              border: "none",
              color: activeChannel === c ? "#F8FAFC" : "#64748B",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* DMs */}
      <div className="px-3 mt-2 overflow-y-auto">
        <div
          className="font-pixel mb-2"
          style={{ fontSize: "8px", color: "#3D4B63" }}
        >
          DIRECT MESSAGES
        </div>
        {DMS.map((dm) => (
          <button
            key={dm.name}
            onClick={() => {
              switchChannel(dm.name)
              setChannelsOpenMobile(false)
            }}
            className="w-full text-left px-2 py-2 rounded mb-0.5 cursor-pointer"
            style={{ background: "none", border: "none" }}
          >
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: dm.online ? "#10B981" : "#3D4B63",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <div className="flex flex-col min-w-0">
                <span style={{ color: "#F8FAFC", fontSize: "13px" }}>
                  {dm.name}
                </span>
                <span
                  style={{
                    color: "#3D4B63",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {dm.context}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Online count */}
      <div
        className="mt-auto p-3 border-t shrink-0"
        style={{ borderColor: "#262E40" }}
      >
        <div
          className="flex items-center gap-2"
          style={{ fontSize: "12px", color: "#64748B" }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              display: "inline-block",
            }}
          />
          8 online now
        </div>
      </div>
    </>
  )

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div
        className="chat-sidebar flex flex-col shrink-0 overflow-y-auto scrollbar-hide"
        style={{
          width: "clamp(180px, 20vw, 224px)",
          backgroundColor: "#131722",
          borderRight: "2px solid #262E40",
        }}
      >
        {renderSidebarContent()}
      </div>

      {/* Sidebar - Mobile Drawer backdrop */}
      {channelsOpenMobile && (
        <div
          className="drawer-backdrop"
          onClick={() => setChannelsOpenMobile(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer container */}
      <div
        className={`chat-sidebar-drawer sm:hidden flex flex-col shrink-0 overflow-y-auto scrollbar-hide ${channelsOpenMobile ? "open" : ""
          }`}
        style={{ borderRight: "2px solid #262E40" }}
      >
        {renderSidebarContent()}
      </div>

      {/* Message pane */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Channel header */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0 gap-2"
          style={{
            backgroundColor: "#131722",
            borderBottom: "2px solid #262E40",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* toggle channels drawer button (mobile only) */}
            <button
              onClick={() => setChannelsOpenMobile((v) => !v)}
              className="sm:hidden cursor-pointer flex items-center justify-center p-1.5 rounded"
              style={{
                backgroundColor: channelsOpenMobile ? "#262E40" : "transparent",
                border: "1px solid #262E40",
                color: "#94A3B8",
              }}
              title="Channels list"
            >
              <GroupIcon scale={2} />
            </button>
            <div className="min-w-0">
              <div
                className="font-medium truncate"
                style={{ color: "#F8FAFC" }}
              >
                {activeChannel}
              </div>
              <div
                className="truncate"
                style={{ fontSize: "12px", color: "#64748B" }}
              >
                5 Members · 2 Online
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ fontSize: "13px", color: "#64748B" }}
          >
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="cursor-pointer px-2 py-1 rounded"
              style={{
                background: searchOpen ? "#262E40" : "none",
                border: "none",
                color: searchOpen ? "#F8FAFC" : "#64748B",
                lineHeight: 0,
              }}
            >
              <SearchIcon scale={2} />
            </button>
            <button
              onClick={() => setPinnedOpen((v) => !v)}
              className="cursor-pointer px-2 py-1 rounded"
              style={{
                background: pinnedOpen ? "#262E40" : "none",
                border: "none",
                color: pinnedOpen ? "#F59E0B" : "#64748B",
                lineHeight: 0,
              }}
            >
              <PinIcon scale={2} />
            </button>
            <button
              onClick={() => setMembersOpen((v) => !v)}
              className="cursor-pointer px-2 py-1 flex items-center gap-1 rounded"
              style={{
                background: membersOpen ? "#262E40" : "none",
                border: "none",
                color: membersOpen ? "#0EA5E9" : "#64748B",
              }}
            >
              <GroupIcon scale={2} />
              <span className="hidden sm:inline">Members</span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div
            className="px-5 py-2 shrink-0"
            style={{
              backgroundColor: "#090A0F",
              borderBottom: "1px solid #262E40",
            }}
          >
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full px-3 py-2 rounded text-sm outline-none"
              style={{
                backgroundColor: "#131722",
                border: "1px solid #262E40",
                color: "#F8FAFC",
                caretColor: "#0EA5E9",
              }}
            />
            {searchQuery && (
              <div className="mt-1 text-xs" style={{ color: "#64748B" }}>
                {displayedMessages.length} result
                {displayedMessages.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        {/* Messages + optional sidebars */}
        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-4">
            {displayedMessages.map((msg) => (
              <div key={msg.id}>
                {msg.system ? (
                  <div
                    className="flex items-center gap-3 px-3 py-2 rounded"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#6366F1" }}>
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="font-medium text-sm"
                        style={{ color: "#0EA5E9" }}
                      >
                        {msg.author}
                      </span>
                      <span style={{ fontSize: "11px", color: "#3D4B63" }}>
                        {msg.time}
                      </span>
                    </div>
                    <p
                      style={{
                        color: "#C8D4E6",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {msg.text}
                    </p>
                    {msg.code && (
                      <div
                        className="mt-2 rounded overflow-hidden"
                        style={{ border: "1px solid #262E40" }}
                      >
                        <div
                          className="flex items-center justify-between px-3 py-1.5"
                          style={{
                            backgroundColor: "#090A0F",
                            borderBottom: "1px solid #262E40",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#3D4B63",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            javascript
                          </span>
                          <button
                            onClick={handleCopy}
                            className="cursor-pointer"
                            style={{
                              background: "none",
                              border: "none",
                              color: copied ? "#10B981" : "#3D4B63",
                              fontSize: "11px",
                            }}
                          >
                            {copied ? "✓ Copied" : "Copy"}
                          </button>
                        </div>
                        <pre
                          className="p-3 font-mono-custom overflow-x-auto scrollbar-hide"
                          style={{
                            backgroundColor: "#060810",
                            color: "#F8FAFC",
                            fontSize: "12px",
                            lineHeight: "1.6",
                            margin: 0,
                          }}
                        >
                          {msg.code}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pinned messages sidebar */}
          {pinnedOpen && (
            <div
              className="hidden sm:flex shrink-0 overflow-y-auto scrollbar-hide flex-col"
              style={{
                width: "clamp(200px,18vw,256px)",
                backgroundColor: "#111827",
                borderLeft: "1px solid #262E40",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid #262E40" }}
              >
                <span
                  className="font-medium text-sm flex items-center gap-1"
                  style={{ color: "#F59E0B" }}
                >
                  <PinIcon scale={2} />
                  Pinned Messages
                </span>
                <button
                  onClick={() => setPinnedOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748B",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-3 p-4">
                {PINNED.map((p) => (
                  <div
                    key={p.id}
                    className="rounded p-3"
                    style={{
                      backgroundColor: "#090A0F",
                      border: "1px solid #262E40",
                    }}
                  >
                    <div
                      className="text-xs font-medium mb-1"
                      style={{ color: "#0EA5E9" }}
                    >
                      {p.author}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "#C8D4E6", lineHeight: "1.4" }}
                    >
                      {p.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Members sidebar */}
          {membersOpen && (
            <div
              className="hidden sm:flex shrink-0 overflow-y-auto scrollbar-hide flex-col"
              style={{
                width: "clamp(180px,16vw,208px)",
                backgroundColor: "#111827",
                borderLeft: "1px solid #262E40",
              }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: "1px solid #262E40" }}
              >
                <span
                  className="font-medium text-sm flex items-center gap-1"
                  style={{ color: "#0EA5E9" }}
                >
                  <GroupIcon scale={2} />
                  Members ({MEMBERS.length})
                </span>
                <button
                  onClick={() => setMembersOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748B",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-1 p-3">
                {MEMBERS.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center gap-2 px-2 py-2 rounded"
                    style={{
                      backgroundColor:
                        m.name === "You" ? "#0E2235" : "transparent",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: m.online ? "#10B981" : "#3D4B63",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: m.name === "You" ? "#0EA5E9" : "#C8D4E6",
                      }}
                    >
                      {m.name}
                    </span>
                    {m.name === "You" && (
                      <span
                        className="ml-auto text-xs"
                        style={{ color: "#3D4B63" }}
                      >
                        you
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message input */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ backgroundColor: "#131722", borderTop: "2px solid #262E40" }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend()
            }}
            placeholder="Type a message or share code snippet..."
            className="flex-1 px-4 py-2.5 rounded outline-none text-sm"
            style={{
              backgroundColor: "#090A0F",
              border: "1px solid #262E40",
              color: "#F8FAFC",
              caretColor: "#0EA5E9",
            }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded font-medium text-sm cursor-pointer"
            style={{
              backgroundColor: message.trim() ? "#0EA5E9" : "#131722",
              color: message.trim() ? "#090A0F" : "#3D4B63",
              border: message.trim() ? "none" : "1px solid #262E40",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

// ─── Auth View ────────────────────────────────────────────────────────────────

const AUTH_DECORATIONS = [
  {
    sprite: "sword",
    x: "8%",
    y: "12%",
    scale: 4,
    opacity: 0.18,
    rotate: "-15deg",
  },
  {
    sprite: "dragon",
    x: "88%",
    y: "8%",
    scale: 2,
    opacity: 0.14,
    rotate: "10deg",
  },
  {
    sprite: "tower",
    x: "5%",
    y: "72%",
    scale: 3,
    opacity: 0.15,
    rotate: "-8deg",
  },
  {
    sprite: "mage",
    x: "91%",
    y: "78%",
    scale: 2,
    opacity: 0.16,
    rotate: "12deg",
  },
  {
    sprite: "coin",
    x: "18%",
    y: "88%",
    scale: 3,
    opacity: 0.2,
    rotate: "0deg",
  },
  {
    sprite: "star",
    x: "82%",
    y: "55%",
    scale: 3,
    opacity: 0.22,
    rotate: "20deg",
  },
  {
    sprite: "shield",
    x: "78%",
    y: "30%",
    scale: 3,
    opacity: 0.13,
    rotate: "-5deg",
  },
  {
    sprite: "crystal",
    x: "12%",
    y: "42%",
    scale: 3,
    opacity: 0.17,
    rotate: "8deg",
  },
]

function AuthView({ onAuth }: { onAuth: (name: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login")

  // Login state
  const [loginEmail, setLoginEmail] = useState("hero@techpro.gg")
  const [loginPassword, setLoginPassword] = useState("dungeon123")
  const [loginError, setLoginError] = useState("")

  // Signup state
  const [signupName, setSignupName] = useState("CodeMage_42")
  const [signupEmail, setSignupEmail] = useState("hero@techpro.gg")
  const [signupPassword, setSignupPassword] = useState("dungeon123")
  const [signupConfirm, setSignupConfirm] = useState("dungeon123")
  const [signupClass, setSignupClass] = useState("Beginner Mage")
  const [signupError, setSignupError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const CLASSES: { id: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: "Beginner Mage",
      icon: <MageIcon scale={2} />,
      desc: "Balanced starter — code & quiz",
    },
    {
      id: "Code Warrior",
      icon: <SwordIcon scale={2} />,
      desc: "Heavy damage via code attacks",
    },
    {
      id: "Quiz Scholar",
      icon: <BookIcon scale={2} />,
      desc: "Knowledge-based crit bonuses",
    },
    {
      id: "Debug Rogue",
      icon: <DaggerIcon scale={2} />,
      desc: "Fast strikes, high dodge",
    },
  ]

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginEmail.trim()) {
      setLoginError("Email is required.")
      return
    }
    if (!loginPassword) {
      setLoginError("Password is required.")
      return
    }
    setLoginError("")
    const name = loginEmail
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    onAuth(name)
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!signupName.trim()) {
      setSignupError("Display name is required.")
      return
    }
    if (!signupEmail.trim()) {
      setSignupError("Email is required.")
      return
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.")
      return
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match.")
      return
    }
    setSignupError("")
    onAuth(signupName.trim())
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "6px",
    backgroundColor: "#090A0F",
    border: "1px solid #262E40",
    color: "#F8FAFC",
    fontSize: "14px",
    outline: "none",
    fontFamily: "var(--font-sans)",
    caretColor: "#818CF8",
  }

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "#090A0F" }}
    >
      {/* Background rune grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(99,102,241,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(99,102,241,0.04) 40px)",
        }}
      />

      {/* Decorative sprites — hidden on very small screens */}
      {AUTH_DECORATIONS.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none hidden sm:block"
          style={{
            left: d.x,
            top: d.y,
            opacity: d.opacity,
            transform: `rotate(${d.rotate})`,
            userSelect: "none",
            lineHeight: 0,
          }}
        >
          {DECO_SPRITE[d.sprite]?.(d.scale)}
        </div>
      ))}

      {/* Radial glow behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          left: "50%",
          top: "50%",
        }}
      />

      {/* Scrollable centering wrapper */}
      <div className="auth-scroll-wrap flex items-start justify-center min-h-full">
        {/* Card */}
        <div
          className="relative flex flex-col w-full"
          style={{
            maxWidth: "clamp(300px, 90vw, 480px)",
            marginTop: "auto",
            marginBottom: "auto",
            backgroundColor: "#131722",
            border: "1px solid #262E40",
            borderRadius: "12px",
            boxShadow:
              "0 0 60px rgba(99,102,241,0.12), 0 24px 48px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            className="flex flex-col items-center gap-2 px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6"
            style={{
              borderBottom: "1px solid #262E40",
              background: "linear-gradient(180deg, #1a1030 0%, #131722 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <TowerIcon scale={3} />
              <span
                className="font-cinzel font-bold"
                style={{
                  fontSize: "22px",
                  color: "#F8FAFC",
                  letterSpacing: "0.06em",
                }}
              >
                TechPro Tower
              </span>
            </div>
            <p
              className="font-pixel text-center"
              style={{
                fontSize: "8px",
                color: "#818CF8",
                letterSpacing: "0.08em",
              }}
            >
              DUNGEON OF ALGORITHMS
            </p>

            {/* Mode tabs */}
            <div
              className="flex mt-3 rounded-lg overflow-hidden"
              style={{ border: "1px solid #262E40" }}
            >
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setLoginError("")
                    setSignupError("")
                  }}
                  className="cursor-pointer px-8 py-2 font-cinzel font-semibold"
                  style={{
                    background: mode === m ? "#6366F1" : "transparent",
                    border: "none",
                    color: mode === m ? "#fff" : "#64748B",
                    fontSize: "12px",
                    letterSpacing: "0.05em",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>
          </div>

          {/* Form body */}
          <div className="px-4 sm:px-8 py-5 sm:py-6">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="hero@techpro.gg"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
                    onBlur={(e) => (e.target.style.borderColor = "#262E40")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
                      onBlur={(e) => (e.target.style.borderColor = "#262E40")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute cursor-pointer"
                      style={{
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#64748B",
                        lineHeight: 0,
                      }}
                    >
                      {showPassword ? (
                        <EyeShutIcon scale={2} />
                      ) : (
                        <EyeOpenIcon scale={2} />
                      )}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#EF4444",
                      fontSize: "13px",
                    }}
                  >
                    <WarnIcon scale={2} /> {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 font-cinzel font-bold cursor-pointer rounded-lg mt-1"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                    fontSize: "14px",
                    letterSpacing: "0.06em",
                    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <SwordIcon scale={2} />
                    Enter the Tower
                  </span>
                </button>

                <div
                  className="text-center"
                  style={{ fontSize: "12px", color: "#64748B" }}
                >
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#818CF8",
                      cursor: "pointer",
                      fontSize: "12px",
                      textDecoration: "underline",
                    }}
                  >
                    Create one
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    HERO NAME
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CodeMage_42"
                    autoComplete="username"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
                    onBlur={(e) => (e.target.style.borderColor = "#262E40")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="hero@techpro.gg"
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
                    onBlur={(e) => (e.target.style.borderColor = "#262E40")}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: "44px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
                      onBlur={(e) => (e.target.style.borderColor = "#262E40")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute cursor-pointer"
                      style={{
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#64748B",
                        lineHeight: 0,
                      }}
                    >
                      {showPassword ? (
                        <EyeShutIcon scale={2} />
                      ) : (
                        <EyeOpenIcon scale={2} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor:
                        signupConfirm && signupConfirm !== signupPassword
                          ? "#EF4444"
                          : "#262E40",
                    }}
                    onFocus={(e) =>
                    (e.target.style.borderColor =
                      signupConfirm !== signupPassword
                        ? "#EF4444"
                        : "#6366F1")
                    }
                    onBlur={(e) =>
                    (e.target.style.borderColor =
                      signupConfirm && signupConfirm !== signupPassword
                        ? "#EF4444"
                        : "#262E40")
                    }
                  />
                </div>

                {/* Class selector */}
                <div className="flex flex-col gap-2">
                  <label
                    className="font-pixel"
                    style={{
                      fontSize: "8px",
                      color: "#94A3B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    CHOOSE YOUR CLASS
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {CLASSES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSignupClass(c.id)}
                        className="flex flex-col gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-lg cursor-pointer text-left"
                        style={{
                          backgroundColor:
                            signupClass === c.id
                              ? "rgba(99,102,241,0.15)"
                              : "#090A0F",
                          border: `1px solid ${signupClass === c.id ? "#6366F1" : "#262E40"
                            }`,
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ lineHeight: 0 }}>{c.icon}</span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#F8FAFC",
                            fontWeight: 600,
                          }}
                        >
                          {c.id}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748B",
                            lineHeight: "1.3",
                          }}
                        >
                          {c.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {signupError && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#EF4444",
                      fontSize: "13px",
                    }}
                  >
                    <WarnIcon scale={2} /> {signupError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 font-cinzel font-bold cursor-pointer rounded-lg mt-1"
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                    fontSize: "14px",
                    letterSpacing: "0.06em",
                    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <TowerIcon scale={2} />
                    Begin Your Quest
                  </span>
                </button>

                <div
                  className="text-center"
                  style={{ fontSize: "12px", color: "#64748B" }}
                >
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#818CF8",
                      cursor: "pointer",
                      fontSize: "12px",
                      textDecoration: "underline",
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer flavour text */}
          <div
            className="px-8 py-4 text-center font-pixel"
            style={{
              borderTop: "1px solid #262E40",
              fontSize: "7px",
              color: "#3D4B63",
              letterSpacing: "0.06em",
            }}
          >
            CONQUER DUNGEONS · EARN XP · LEVEL UP YOUR SKILLS
          </div>
        </div>
      </div>
      {/* end auth-scroll-wrap */}
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("learn")
  const [authed, setAuthed] = useState(false)
  const [userName, setUserName] = useState("CodeMage")

  if (!authed) {
    return (
      <AuthView
        onAuth={(name) => {
          setUserName(name)
          setAuthed(true)
        }}
      />
    )
  }

  return (
    <div
      className="flex flex-col size-full overflow-hidden"
      style={{ backgroundColor: "#090A0F", fontFamily: "var(--font-sans)" }}
    >
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userName}
        onLogout={() => setAuthed(false)}
      />
      <main className="flex flex-1 overflow-hidden">
        {activeTab === "learn" && <ClassroomView setActiveTab={setActiveTab} />}
        {activeTab === "battle" && <BattleView />}
        {activeTab === "shop" && <MarketplaceView />}
        {activeTab === "chat" && <ChatView />}
      </main>
    </div>
  )
}
