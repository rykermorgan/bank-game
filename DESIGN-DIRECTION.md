# Design Direction for Bank Game

## Design Philosophy

**Primary Goal:** Fast, clear, fun. In that order.

The app should feel:
- **Energetic** - Quick animations, bright colors, immediate feedback
- **Clear** - No ambiguity about what's happening or what to do next
- **Playful** - Lighthearted personality, but not childish
- **Readable from distance** - 3-6 feet away during active gameplay

## Design Inspiration

### Primary Reference: CARROT Weather
- Bold, high-contrast UI
- Personality through text, not clutter
- Clear hierarchy
- Smooth, fast animations
- Dark mode friendly
- Doesn't take itself too seriously

### Secondary References:
- **Duolingo** - Game-ified UI, clear progress indicators, celebratory moments
- **Monzo** - Clean financial displays, instant feedback, good use of color
- **Apple's Game Center** - Leaderboard treatment, player avatars, achievement styling

## Color Palette

### Option A: Bold & Energetic (Recommended)
```
Primary: #FF6B6B (Vibrant Red/Coral)
Secondary: #4ECDC4 (Teal/Turquoise)
Accent: #FFE66D (Bright Yellow)
Success: #95E1D3 (Mint Green)
Warning: #F38181 (Soft Red)
Background (Light): #F7F7F7
Background (Dark): #1A1A2E
Text (Light): #2D3436
Text (Dark): #FFFFFF
```

### Option B: Modern & Sophisticated
```
Primary: #667EEA (Purple-Blue)
Secondary: #F093FB (Pink)
Accent: #4BC0C8 (Cyan)
Success: #52B788 (Green)
Warning: #FFB703 (Orange)
Background (Light): #FAFAFA
Background (Dark): #0F0E17
Text (Light): #2E2F3E
Text (Dark): #FFFFFE
```

**Recommendation:** Start with Option A. It's more playful and energetic, matching the game's personality.

## Typography

### Font Stack
```css
/* Primary (Headings, Buttons, Bank Total) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 700; /* Bold */

/* Secondary (Body, Player Names) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-weight: 400; /* Regular */

/* Monospace (Scores) */
font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
font-weight: 500; /* Medium */
```

### Size Scale (Mobile-First)
```css
/* Bank Total */
--size-bank: clamp(48px, 15vw, 72px);

/* Scores */
--size-score: clamp(24px, 6vw, 32px);

/* Headings */
--size-h1: clamp(28px, 7vw, 36px);
--size-h2: clamp(20px, 5vw, 24px);

/* Body */
--size-body: clamp(16px, 4vw, 18px);
--size-small: clamp(14px, 3.5vw, 16px);
```

## Component Guidelines

### Buttons
- **Minimum tap target:** 44x44px (iOS/Android standard)
- **Bank buttons:** Large, prominent, one per player
- **Shape:** Rounded corners (border-radius: 12px)
- **States:** Default, Hover, Active, Disabled, Locked (for banked players)
- **Feedback:** Quick scale animation on tap (95% → 100%)

```css
/* Example Bank Button */
.bank-button {
  min-height: 56px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  transition: transform 0.1s ease;
}

.bank-button:active {
  transform: scale(0.95);
}
```

### Cards & Containers
- **Elevation:** Use subtle shadows, not heavy borders
- **Spacing:** Generous padding (16px minimum)
- **Borders:** Rounded corners (8-16px)
- **Background:** Slightly translucent for layering

```css
.player-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Animations

**Use animations for:**
- Banking action (success celebration)
- 7 rolled (dramatic warning)
- Doubles (bank total doubling)
- Round completion
- Game over

**Animation Principles:**
- **Fast:** 150-300ms for most interactions
- **Purposeful:** Every animation communicates meaning
- **Smooth:** Use ease-out for most transitions
- **Skippable:** Never block interactions

```css
/* Example: Bank Total Update */
@keyframes bankUpdate {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); color: var(--accent); }
  100% { transform: scale(1); }
}

.bank-total--updated {
  animation: bankUpdate 0.3s ease-out;
}
```

### Snark/Personality Display

**Caption Styling:**
```css
.snark-caption {
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 8px;
  margin-top: 8px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Layout Structure

### Main Game Screen
```
┌─────────────────────────┐
│  Round 3 of 10    [⚙️]  │
├─────────────────────────┤
│                         │
│    BANK: 84            │  ← Large, prominent
│                         │
├─────────────────────────┤
│  Dice Entry             │
│  [_3_] + [_4_] = 7     │
│                         │
│  [Doubles?] [7 Rolled?]│
├─────────────────────────┤
│  Alice      42  [BANK] │  ← Player rows
│  Bob        28  [BANK] │
│  Carol      15  LOCKED │  ← Banked players
├─────────────────────────┤
│  "Not bad, Bob..." 💭   │  ← Snark captions
└─────────────────────────┘
```

### Spacing & Rhythm
- **Consistent gaps:** 16px between most elements
- **Larger gaps:** 24px between major sections
- **Edge padding:** 20px minimum on all sides

## Accessibility Requirements

### Color Contrast
- **Text on light:** Minimum 4.5:1 ratio
- **Text on dark:** Minimum 4.5:1 ratio
- **Large text:** Minimum 3:1 ratio
- **Focus indicators:** High contrast, 3px solid

### Touch Targets
- **Minimum size:** 44x44px
- **Spacing:** 8px between adjacent targets
- **Visual feedback:** Immediate on touch

### Font Sizes
- **Respect system text scaling**
- **Test at 200% zoom**
- **Minimum body text:** 16px

### Screen Reader Support
```html
<!-- Example: Bank button -->
<button 
  aria-label="Bank current total of 84 points for Alice"
  aria-pressed="false"
>
  BANK
</button>

<!-- Example: Dice entry -->
<label for="dice1">First die</label>
<input 
  id="dice1" 
  type="number" 
  min="1" 
  max="6"
  aria-describedby="dice-hint"
/>
<div id="dice-hint" class="sr-only">
  Enter a number from 1 to 6
</div>
```

## Dark Mode

**Full dark mode support required.**

Toggle in settings. Respect system preference by default.

**Color Adjustments for Dark:**
- Reduce saturation by ~10%
- Increase contrast for text
- Soften shadows
- Use elevation through color, not just shadow

## End-of-Game Celebration

**Winner Screen:**
- Confetti animation (Canvas API or CSS particles)
- Trophy/medal icon
- Winner's name in large text
- Final scores displayed as a leaderboard
- Fun stats prominently featured
- Share button with pre-formatted text

```
Example Share Text:
"🎲 Just won Bank with 420 points! 
Biggest bank: 84
Total banks: 12
#BankGame"
```

## Technical Implementation Notes

### Framework: React
- Use functional components
- Tailwind CSS for styling (or CSS Modules)
- Framer Motion for animations (optional, but recommended)
- Use CSS custom properties for theming

### Performance
- Code-split by route
- Lazy load end-game animations
- Optimize images (use SVG where possible)
- Minimize re-renders

## Design System Reference

**Use the `frontend-design` skill** built into Claude for:
- Creating distinctive, non-generic designs
- Implementing animations
- Building polished UI components
- Ensuring accessibility

The skill will help avoid "AI aesthetic" and create something unique.

## What to AVOID

❌ **Don't:**
- Use generic blue/gray corporate colors
- Make everything flat (use elevation)
- Copy Material Design exactly (be distinctive)
- Use tiny text (remember: 3-6 feet away)
- Over-animate (respect reduced motion)
- Make it look like a spreadsheet

✅ **Do:**
- Be bold with color
- Use personality in micro-interactions
- Make tap targets large
- Test on actual phones
- Respect accessibility
- Have fun with it!

## Open Questions for User

Before implementing, let's decide:

1. **Color Palette:** Option A (Bold) or Option B (Sophisticated)?
2. **Dark Mode:** Default to dark or light?
3. **Animations:** Full/Medium/Minimal animations?
4. **Snark Personality:** Which level should be the default?
5. **Player Avatars:** Simple color dots or emoji/icons?

Let's discuss these before Claude Code starts building!
