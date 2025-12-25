# Bank Game - Design Audit & Recommendations

## Current State Analysis

### Typography Scale (Current)
```
bank:  48-72px (clamp) - VERY LARGE
score: 24-32px (clamp)
h1:    28-36px (clamp)
h2:    20-24px (clamp)
body:  16-18px (clamp)
small: 14-16px (clamp)
```

**Issues:**
- Bank total (48-72px) dominates the screen
- Score size (24-32px) also quite large
- Large line heights eating vertical space

### Spacing (Current)
```
py-8:  32px vertical padding (BankDisplay)
py-6:  24px vertical padding (containers)
py-4:  16px vertical padding (cards)
py-3:  12px button padding
p-4:   16px all-around padding (very common)
space-y-4: 16px gaps between elements
```

**Issues:**
- Everything uses p-4 (16px) - lacks hierarchy
- Vertical padding is generous (good for taps, but eats space)
- No tight spacing option for grouped elements

### Border Radius (Current)
```
rounded-xl: 16px (most cards)
rounded-lg: 12px (buttons, some elements)
```

**Issues:**
- 16px corners everywhere feels toy-like
- Lacks variation for hierarchy

### Colors (Current)
✅ Bold & Energetic palette is good
- Primary: #FF6B6B (red/coral)
- Secondary: #4ECDC4 (teal)
- Accent: #FFE66D (yellow)

**Good:**
- Distinct, accessible colors
- Works well for at-a-distance viewing

---

## CARROT Weather Inspiration

### What Makes CARROT Work:
1. **Bold but Refined** - Strong colors + clean whitespace
2. **Information Density** - Shows lots of data without clutter
3. **Visual Hierarchy** - Clear primary/secondary/tertiary levels
4. **Tight Spacing** - Elements breathe but don't float
5. **Purposeful Rounding** - Not everything is super-rounded

### Key Principles to Adopt:
- **Compact Vertical Rhythm** - Reduce vertical spacing between related items
- **Smaller Base Padding** - Use p-3 (12px) as base instead of p-4 (16px)
- **Tighter Font Sizes** - Reduce max font sizes by ~20%
- **Hierarchical Rounding** - Important cards get more rounding, minor elements less
- **Grouped Elements** - Related items should feel connected (less gap)

---

## Proposed Design System

### New Typography Scale
```
bank:  40-56px (was 48-72px) - Still prominent but not overwhelming
score: 20-28px (was 24-32px) - Readable but tighter
h1:    24-30px (was 28-36px) - Clean header size
h2:    18-22px (was 20-24px) - Section headers
body:  16-18px (keep same)   - Base text
small: 14-16px (keep same)   - Meta info
```

**Changes:**
- Reduce max sizes by 20-25%
- Bank total still largest element but not dominating
- Tighter line heights (1.0 for bank, 1.1 for score)

### New Spacing Scale
```
Padding Scale:
py-8  → py-6   (32px → 24px) - Hero sections only
py-6  → py-4   (24px → 16px) - Major containers
py-4  → py-3   (16px → 12px) - Standard cards (NEW BASE)
py-3  → py-2.5 (12px → 10px) - Compact elements
py-2  → py-2   (8px  → 8px)  - Tight grouping

Gap Scale:
space-y-4 → space-y-3 (16px → 12px) - Default gap
space-y-3 → space-y-2 (12px → 8px)  - Related items
space-y-2 → space-y-1 (8px  → 4px)  - Grouped items
```

**Philosophy:**
- p-3 (12px) becomes new baseline for cards
- p-4 (16px) only for important containers
- Tighter gaps create visual grouping

### New Border Radius
```
Hero Card (Bank):    rounded-xl (16px) - Keep prominent
Important Cards:     rounded-lg (12px) - Most cards
Standard Elements:   rounded-md (8px)  - Buttons, inputs
Tight Elements:      rounded (6px)     - Minor UI
```

**Changes:**
- Not everything gets xl rounding
- Creates visual hierarchy through radius

### Color Usage (Keep Current)
✅ No changes to color palette - it's working well

---

## Specific Component Changes

### 1. BankDisplay (BIGGEST REDUCTION)
**Current:**
```jsx
<div className="py-8 ..."> // 32px padding
  <div className="text-bank ..."> // 48-72px text
```

**Proposed:**
```jsx
<div className="py-6 ..."> // 24px padding (was 32px)
  <div className="text-bank ..."> // 40-56px text (reduced)
```

**Why:** Bank is huge right now, reducing padding + font makes it prominent but not overwhelming

---

### 2. PlayerRow (MODERATE REDUCTION)
**Current:**
```jsx
<div className="p-4 rounded-xl ..."> // 16px padding, 16px radius
  <div className="font-bold text-lg"> // 18px font
  <button className="px-6 py-3 ..."> // Large button
```

**Proposed:**
```jsx
<div className="p-3 rounded-lg ..."> // 12px padding, 12px radius
  <div className="font-bold text-base"> // 16px font
  <button className="px-5 py-2.5 ..."> // Slightly smaller button
```

**Why:** Tighter spacing makes rows feel less floaty, still tap-friendly

---

### 3. GameScreen Layout (TIGHTEN GAPS)
**Current:**
```jsx
<div className="space-y-4"> // 16px gaps everywhere
```

**Proposed:**
```jsx
<div className="space-y-3"> // 12px default gap
  // Related items can use space-y-2 (8px)
```

**Why:** Reduces overall screen height, groups related info better

---

### 4. DiceEntry (REDUCE BUTTON SIZE)
**Current:**
```jsx
<button className="py-3 px-3 ..."> // 12px padding all around
```

**Proposed:**
```jsx
<button className="py-2.5 px-2.5 ..."> // 10px padding
```

**Why:** Grid of 11 buttons is taking lots of space, slight reduction helps

---

### 5. Round Info & Turn Indicator (COMPACT)
**Current:**
```jsx
<div className="p-4 ...">
  <div className="text-2xl ..."> // Large text
```

**Proposed:**
```jsx
<div className="p-3 ...">
  <div className="text-xl ..."> // Slightly smaller
```

**Why:** Info cards don't need to be as large as action areas

---

## Expected Impact

### Before → After Screen Real Estate:
- Bank Display: 120px tall → 96px tall (**20% reduction**)
- Player Rows: 80px each → 68px each (**15% reduction**)
- Overall vertical space: **~25% more content fits on screen**

### Visual Improvements:
- ✅ Less scrolling on mobile
- ✅ Better visual grouping
- ✅ Still highly readable from 3-6 feet
- ✅ More "professional" feel
- ✅ Better information density (CARROT-like)

---

## Implementation Plan

### Phase 1: Typography
1. Update Tailwind config font sizes
2. Test readability on phone from 3-6 feet
3. Adjust if needed

### Phase 2: Spacing
1. Reduce base padding from p-4 to p-3
2. Tighten vertical gaps (space-y-4 → space-y-3)
3. Test tap targets still work

### Phase 3: Polish
1. Adjust border radius for hierarchy
2. Fine-tune any remaining spacing
3. Add subtle animations (bank updates, etc.)

---

## Questions for User

1. **Bank Display Size:** Is current 48-72px too big? Should it be THE focal point or more balanced?
2. **Information Density:** Do you want to see more on screen at once, or is current scroll depth fine?
3. **Rounding:** Do you like the rounded corners everywhere, or prefer sharper/varied?
4. **Button Sizes:** Are current buttons comfortable to tap or could they be smaller?

---

## Next Steps

**Waiting for:**
- User screenshots showing "too big" areas
- Specific feedback on what feels wrong
- Confirmation on proposed changes

**Ready to:**
- Implement typography changes
- Apply new spacing scale
- Create before/after comparison
- Iterate based on feedback
