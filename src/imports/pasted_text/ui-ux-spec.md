```markdown
# UI/UX Design Specification: Gamified Learning & Farm Platform

---

## 1. Design System & Visual Language

* **Aesthetic Direction:** **"Chiptune Academic"** — A crisp, modern dark/light slate shell wrapping rich 16-bit pixel-art canvas elements. The outer UI remains minimalist and legible to reduce cognitive overload during study sessions, while the farm, badges, and rewards use vibrant pixel graphics.
* **Color Palette:**
  * **Slate & Canvas (Backgrounds):** Deep Obsidian (`#0F172A`), Slate Surface (`#1E293B`), Light Card Hover (`#334155`).
  * **Accent & Leveling (Energy):** Amber Gold (`#F59E0B`) for coins/points; Emerald Green (`#10B981`) for streaks and crop-ready states.
  * **Interactive Highlights:** Sky Blue (`#0EA5E9`) for active video modules; Indigo (`#6366F1`) for live chat notifications.
  * **Danger / Anti-Cheat:** Coral Red (`#EF4444`) for missed streaks or failing test cases.
* **Typography:**
  * **Headings & Badges:** `Press Start 2P` or `Silkscreen` (used selectively for level numbers, coin totals, and milestone badges).
  * **Body & Interface:** `Geist Sans` or `Inter` (14px–16px, 1.5 line-height) for reading tutorials, documentation, and chat logs.
  * **Code Editor:** `JetBrains Mono` or `Fira Code` with ligatures enabled.
* **Grid & Design Tokens:** Strict 4px/8px baseline grid. Borders use solid `1px` or `2px` crisp outlines with no fractional or blurry shadows.

---

## 2. Core Layout & Global Header

```text
+-----------------------------------------------------------------------------------+
| [Logo: PixelSprout] | Classroom | My Farm | Friends | Chat (3) |  🪙 1,420 | 🔥 14 | 👤 |
+---------------------+------------------------------------------+------------------+
|                                                                                   |
|                                MAIN CONTENT AREA                                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+

```

### Persistent Global Header Elements

* **Left Section:** Brand Logo (animated pixel seed/sprout icon) with dynamic breadcrumb navigation.
* **Center Section:** Primary tab navigation with pixelated hover indicators: `Learn`, `Farm`, `Marketplace`, `Social`.
* **Right Section:**
* **Wallet Pill:** Animated bouncing pixel coin counter showing live study points balance.
* **Streak Flame:** Fire icon with flame particle effects indicating the active daily streak count.
* **Level Progress Bar:** Compact progress indicator to next level (e.g., `Lvl 8 [=====>  ] 65%`).
* **Notification Bell:** Dropdown menu for incoming friend requests, crop harvest alerts, and chat tags.
* **User Profile Avatar:** Mini pixel avatar displaying user-customized accessories unlocked via the shop.



---

## 3. Page-by-Page UI/UX Breakdown

### A. The Classroom & Interactive Tutorial View (`/classroom/[id]`)

A dynamic 3-pane split-screen environment tailored for focused learning and immediate application.

```text
+--------------------------------------------------+--------------------------------+
| LEFT PANE: Video Player & Syllabus               | RIGHT PANE: Quiz / Code Sandbox|
|                                                  |                                |
|  [ Embedded YouTube Player ]                     |  [ Task Description & Tests ]  |
|  * Anti-cheat progress bar (90% threshold line)  |  - Step 1: Initialize array    |
|                                                  |  - Step 2: Loop condition      |
|  ----------------------------------------------  |  ----------------------------  |
|  [ Lesson Transcript / Cheat Sheet ]             |  [ Monaco Code Editor ]        |
|  [ Next Lesson > ]                               |                                |
|                                                  |  [ Run Tests ]  [ Submit 🪙 ] |
+--------------------------------------------------+--------------------------------+

```

* **Video Pane (Left):**
* **YouTube Player Wrapper:** Embedded player with related videos stripped, synced with a custom progress bar.
* **Verification Indicator:** Lock icon that transforms into an unlocked green chest once $\ge 90\%$ verified watch time is reached.
* **Speed Controls & Hotkeys:** `Space` (Play/Pause), `J`/`L` (10-second seek), `[`/`]` (Playback speed).


* **Interactive Pane (Right - Tabbed):**
* **Tab 1 — Code Sandbox (Monaco Editor):** Multi-language syntax highlighting, autocomplete, line numbers, and a bottom terminal drawer for `stdout` and stack traces. Actions include "Run Code" and "Submit Assignment".
* **Tab 2 — Multiple Choice / Quiz:** Radio/checkbox cards with instant visual feedback (green pulse for correct, gentle red shake for incorrect).


* **Reward Modal (Milestone Trigger):**
* Displays celebratory confetti, plays a retro chime, and reveals an animated reward card: `+50 Points Earned!`, `+1 Day Streak Extended!`, and `Farm Multiplier 1.2x Activated!`.



---

### B. The Farm Simulation View (`/farm`)

An interactive, hardware-accelerated 2D canvas displaying the user's customizable plot.

```text
+-----------------------------------------------------------------------------------+
| Weather: ☀️ Sunny (+10% Growth) | Farm Level: 4 | Multiplier: 1.25x (14-Day Streak) |
+-----------------------------------------------------------------------------------+
|                                                                    [ Zoom +/- ]   |
|     [Grid Tile]  [Grid Tile]  [Carrot Plot 🌱]   [Barn 🏠]          [ Re-center ]  |
|     [Grid Tile]  [Water Well] [Wheat Ready ✨]   [Grid Tile]                      |
|     [Grid Tile]  [Grid Tile]  [Grid Tile]        [Fence]                          |
|                                                                                   |
+-----------------------------------------------------------------------------------+
| BOTTOM TOOLBAR: [👆 Select] [🌱 Seeds] [💧 Water] [🔨 Build] [🛒 Shop] [🧺 Harvest]|
+-----------------------------------------------------------------------------------+

```

* **Canvas Controls (Pixi.js Engine):**
* Pan via mouse drag or WASD keys; integer-locked zoom levels ($1\times, 2\times, 3\times$) to avoid subpixel blur.
* Tile hover states with status popovers (e.g., `Soil: Dry`, `Crop: Golden Corn (Ready to Harvest!)`).


* **Interactive Tool Belt (Bottom Dock):**
* **Select/Inspect:** Click any tile to inspect crop stats, growth timers, and upgrade tiers.
* **Seeds & Plants:** Drawer listing available crop types purchased with points.
* **Water/Care:** Accelerates active crop growth timers.
* **Build/Decorate:** Drag-and-drop tool for fences, barns, decorations, and paths.
* **Quick Harvest:** One-click bulk harvest releasing coin animations.


* **Social Visit Mode:**
* Toggle to view a friend's active farm and leave a daily "Water Gift" for reciprocal bonuses.



---

### C. In-Game Marketplace (`/farm/shop`)

The themed game store where accumulated study points are spent.

```text
+-----------------------------------------------------------------------------------+
| Filter: [All] [Seeds & Crops] [Buildings & Upgrades] [Decorations] [Avatar Hats]  |
+-----------------------------------------------------------------------------------+
|  +--------------------+  +--------------------+  +--------------------+           |
|  | [Pixel Pumpkin]    |  | [Automated Sprinkler| | [Wizard Hat]       |           |
|  | Cost: 120 🪙       |  | Cost: 800 🪙       |  | Cost: 350 🪙       |           |
|  | Yield: +250 XP/hr  |  | Auto-waters 4 tiles|  | Cosmetic for Avatar|           |
|  | Req: Level 3       |  | Req: 7-Day Streak  |  | Req: None          |           |
|  | [ Buy & Place ]    |  | [ Buy Upgrade ]    |  | [ Equip Item ]     |           |
|  +--------------------+  +--------------------+  +--------------------+           |
+-----------------------------------------------------------------------------------+

```

* **Tiered Milestone Unlocks:** Higher-tier items require prerequisite educational milestones (e.g., *"Complete Python Module 2 to Unlock Greenhouse"*).
* **Instant Placement Action:** "Buy & Place" immediately routes to the farm viewport with the item attached to the cursor for grid snapping.

---

### D. Real-Time Chat & Social Graph (`/chat` & `/friends`)

```text
+--------------------------+--------------------------------------------------------+
| CHANNELS & FRIENDS (Online: 8) | # study-group-algorithms (5 Members)              |
+--------------------------+--------------------------------------------------------+
| 🔍 Search friends...     | [Bot]: 🎉 Alex just reached a 30-day streak!           |
|                          |                                                        |
| Groups:                  | [Sarah_Dev] 10:14 AM                                  |
| > # algorithms-study     | Hey, did anyone solve test case #4 on lesson 3?       |
| > # frontend-ninjas      |                                                        |
|                          | [Marcus_K] 10:15 AM                                   |
| Direct Messages:         | Check your loop edge cases. You might be off-by-one.   |
| 🟢 Alex (Lvl 12 | Farm 🏰) |                                                        |
| 🟢 Sarah (Lvl 9 | Farm 🌾) | ------------------------------------------------------ |
| ⚪ David (Last seen 2h)   | [ Type a message or share code snippet... ]  [ Send ]  |
+--------------------------+--------------------------------------------------------+

```

* **Presence Badges:** User status indicators displaying active context (e.g., *“🟢 Watching: React Hooks”* or *“🚜 Farming”*).
* **Rich Messaging:**
* Inline code syntax blocks with copy buttons.
* System achievement broadcasts (level-ups, streak milestones, rare purchases).


* **Friend Management (`/friends`):**
* One-click "Add Friend", "Visit Farm", and "Invite to Group".
* Leaderboard tab sorting friends by weekly watch time, quiz accuracy, and farm net worth.



---

## 4. Key UX Workflows & States

| User Action | System Trigger & Response | Visual / Audio Feedback |
| --- | --- | --- |
| **Video Completion** | Client sends verified watch heartbeat ($\ge 90\%$) $\rightarrow$ unlocks quiz/code editor. | Chest lock icon opens green; soft completion chime. |
| **Quiz / Code Pass** | Database transaction locks balance $\rightarrow$ credits points $\rightarrow$ increments streak. | Confetti animation; coin count scrolls upward with retro audio. |
| **Streak Maintained** | Background job records daily activity within 24-hour cycle. | Streak flame icon expands; multiplier banner activates (`1.25x`). |
| **Missed Streak** | Cron resets streak after grace period unless protected by Streak Freeze. | Warning modal offering a "Streak Repair Quest" (e.g., solve 3 bonus problems). |
| **Item Drag & Drop** | Pixi.js collision detection checks grid coordinate availability. | Valid tile highlights green; occupied tile highlights red with coordinate snap. |
| **Friend Visits Farm** | SignalR broadcasts visitor presence to active session. | Visitor avatar appears at the farm entrance with a floating emote bubble. |

---

## 5. Micro-Interactions & Polish

* **Haptic & Particle Feedback:**
* Clicking "Harvest" generates floating crop and coin particles that animate toward the header wallet.
* Code execution errors trigger a horizontal shake animation on the editor window.


* **Sound Effects (Toggleable in Settings):**
* 8-bit click sound on primary UI interactions.
* Soil tilling and planting audio on farm placement.
* Retro victory fanfare upon completing course tracks.


* **Accessibility & Navigation:**
* Global command palette (`Cmd + K` / `Ctrl + K`) for quick navigation between modules, chats, and farm views.
* Keyboard navigation and ARIA attributes across all quiz components and code editor panels.



```

```