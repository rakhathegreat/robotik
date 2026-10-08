---
name: Precision Engineering Mono
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c6c9'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e1e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
  surface-base: '#09090b'
  surface-raised: '#18181b'
  surface-overlay: '#27272a'
  border-subtle: '#27272a'
  border-strong: '#3f3f46'
  text-primary: '#ffffff'
  text-secondary: '#a1a1aa'
  text-muted: '#71717a'
  status-success: '#10b981'
  status-warning: '#f59e0b'
  status-neutral-subtle: '#e4e4e7'
  arena-canvas-light: '#fafafa'
typography:
  display-arena-math:
    fontFamily: Plus Jakarta Sans
    fontSize: 180px
    fontWeight: '800'
    lineHeight: 180px
    letterSpacing: -0.04em
  display-arena-timer:
    fontFamily: Plus Jakarta Sans
    fontSize: 120px
    fontWeight: '700'
    lineHeight: 120px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-mono-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system merges the ultra-clean, technical restraint of developer-first platforms like Vercel and Linear with the mission-critical legibility required for high-stakes robotics competitions. Built for the Counting Mission Engine platform, it bridges two distinct environments: high-density referee and match-control consoles on one side, and ultra-readable, arena-distance displays for young elementary participants and spectator projection systems on the other.

The design philosophy adheres to technical minimalism: pure obsidian surfaces, razor-sharp single-pixel grid divisions, disciplined typography, and strict functional feedback. Emotionally, the interface conveys absolute authority, precision, and surgical calm. For young competitors, failure-induced anxiety is neutralized through constructive pedagogical feedback—eliminating harsh red rejection flags while maintaining unwavering high contrast and instantaneous state verification.

## Colors

The foundation is built on deep obsidian values (`#000000`, `#09090b`) contrasted against crisp white typography and muted zinc borders (`#27272a`, `#3f3f46`). Rather than relying on heavy fills or saturated accents, the interface expresses structure via tone, depth boundaries, and 1px borders.

### Semantic Rules & Competition State Logic
- **Primary & Surface Tiers**: `#09090b` anchors base system screens and high-density operator hubs. `#18181b` serves elevated match cards and dynamic metrics tables. 
- **Feedback & Pedagogy Isolation**: 
  - `status-success` (`#10b981`) indicates confirmed correct mathematical missions across referee tablets and student arena monitors.
  - `status-warning` (`#f59e0b`) is reserved strictly for match control time-critical scenarios (countdown remaining `< 30s`).
  - **Negative State Rule**: In accordance with elementary pedagogical parameters, failure alerts (`status-error` / harsh reds) are completely barred from student-facing terminals. Incorrect attempts utilize neutral feedback tokens (`text-secondary` with calm instructional prompts) rather than punitive red alert states.

## Typography

Plus Jakarta Sans provides high geometric precision combined with wide aperture openings, preserving optical legibility across extreme physical distances and ultra-dense data grids.

### Arena-Scale vs. Operator-Scale
- **Arena Distance Roles**: For student monitors placed across competition arenas (readable at 3+ meters), `display-arena-math` and `display-arena-timer` deploy massive scales with negative letter tracking to lock numerical equations into solid visual anchors.
- **Operator Densities**: Match control sheets and live judging tables standardize on `body-md` and `label-mono-stat` with tight vertical rhythms, ensuring multi-team monitoring dashboards fit within uniform viewport heights without manual scrolling.

## Layout & Spacing

The layout model is anchored on a rigid 4px/8px incremental grid.

### Layout Philosophy
1. **Public/Audience Leaderboard (1080p Fixed)**: Designed as a zero-scroll, high-density display handling up to 35 teams concurrently. Uses fixed column definitions with minimal gutters (`0.5rem` to `1rem`) and crisp horizontal row dividers.
2. **Referee Touch Console (Handheld/Tablet)**: Structured with fluid CSS grid modules. Minimum target heights for buttons and interactive controls strictly observe an unyielding touch boundary (`≥ 48px`).
3. **Student Terminal (Isolated Workspace)**: Single-problem view, perfectly centered within the container, floating inside a high-contrast viewport free of extraneous toolbars or real-time competitor standings.

## Elevation & Depth

In keeping with a linear, monochrome aesthetic, depth is established using **structural borders and planar tonal separation** rather than diffuse multi-layered shadows.

- **Surface Levels**:
  - `Base`: `#09090b` (Canvas background)
  - `Panel / Container`: `#18181b` framed by a 1px solid border (`#27272a`)
  - `Hover / Active Overlays`: `#27272a` with high-contrast edge highlights (`#3f3f46`)
- **Shadow System**: Subtle, ambient, and restrained. Cards use an understated shadow (`0 1px 2px rgba(0, 0, 0, 0.4)`), fading into pure black backgrounds.
- **Divider Treatment**: No blurry separators; only razor-sharp, single-pixel hairline borders (`border-zinc-800` / `#27272a`).

## Shapes

The interface embraces crisp, engineered corners with a `roundedness` rating of 1 (Soft). 

- **Base Components**: Inputs, metric panels, and operational buttons adhere to `0.25rem` (4px) corner radii.
- **Grouped Panels & Modals**: Surface cards scale up to `0.5rem` (8px).
- **Status Dots & Indicators**: Exact circular geometry (`50%` radius) is applied for match progress dots (`●` / `○`) and WebSocket connection monitors.

## Components

### Buttons
- **Primary / Action Trigger**: `#ffffff` background with pure `#000000` text, `font-weight: 600`, 4px radius. Zero drop shadows. Sharp inverted focus rings.
- **Judge Match Actions**:
  - `BENAR` (Correct): Dark zinc background with a high-contrast emerald edge border (`#10b981`).
  - `LEWATI` (Pass): Subtle `#27272a` surface with crisp neutral text.
  - Minimum tap height is enforced at `48px` to prevent misclicks during timed rounds.

### Chips & Status Badges
- Compact rectangular geometry (4px radius). Minimalist presentation: `#18181b` fill with a 1px `#27272a` outline.
- Badges house a 6px circular indicator token (`●`) for state clarity (e.g., active round, paused, timer warning).

### Input Fields & Scoring Adjustments
- Dark zinc surfaces (`#09090b` canvas with `#18181b` input backgrounds).
- Border default: 1px `#27272a`. Focused: 1px `#ffffff` with no glow or blur. Plus Jakarta Sans tabular numerals enabled.

### Cards & Metric Modules
- Containerized with 1px hairline zinc borders. 
- Headers display metadata using `label-mono-stat` in muted uppercase lettering, clearly separating high-level category information from critical match values.

### Progression Trackers (Question Step Indicator)
- Represented as precise sequential dot matrices (`●●○○○`).
- Completed missions render in high-contrast solid white or emerald. Pending missions display as muted 1px hollow zinc rings (`#3f3f46`), providing immediate state awareness without distracting animations.
