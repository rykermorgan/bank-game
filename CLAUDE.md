# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bank Dice Game Companion App** - A mobile-first companion for the in-person dice game "Bank" / "Bank It".

One person is the Scorekeeper and uses the app to:
- Set up players + rounds
- Enter dice rolls manually
- Bank players (one tap)
- Track scores, rounds, and end-of-game winner
- Optionally play short audio prompts + show matching captions
- Save last 10 games locally (history)

**This app does NOT simulate rolling dice; users enter dice values manually.**

Key differentiator: Speed, clarity, and optional snarky personality (inspired by CARROT Weather).

## Game Logic (Authoritative)

The app tracks scoring for a two-dice game with these mechanics:

### Core Rules
- 2+ players, fixed number of rounds (10/15/20)
- Each round starts with Bank total = 0
- Players take turns rolling two dice; sum is added to Bank total
- Any player can call "Bank!" to claim current Bank total and exit the round
- Round ends when: (1) a 7 is rolled, OR (2) all players have banked

### Dice Events
- **Rolling a 7**: Ends round immediately. Unbanked players get 0 points.
- **Rolling doubles**: Add sum to Bank, then DOUBLE the entire Bank total.
- **Optional variant**: 7 in first 3 rolls = +70 points (doesn't end round). Controlled by settings toggle.

### Banking
- When a player banks: current Bank total → their score, player locked out for rest of round
- Banked players cannot roll or bank again until next round

### Game End
- After final round, highest score wins. Ties allowed.

## Architecture Principles

### Roles & Authority
- **Scorekeeper**: One per game. Only role that can enter rolls, bank players, undo actions, advance rounds. Role cannot be transferred mid-game.
- **Observers**: Passive viewers in MVP. Read-only companion viewers planned for v1.1.

### Error Recovery
- Undo supports: most recent dice entry, banking action, or round transition
- Undo can cross round boundaries but only reverses ONE action
- No manual score editing allowed

### Audio & Snark System
- Audio prompts triggered only on: round start, player banking, 7 rolled, final round, game over
- NO audio on standard dice rolls
- Every audio prompt must have matching on-screen caption text
- Audio/caption sourced from same prompt definition
- 4 snark levels: Off, Low (gentle), Medium (playful), Full (savage)
- Snark affects tone, not game logic or timing

### Audio Performance Requirements
- Audio NEVER blocks gameplay - UI stays interactive
- Audio length ≤ 3 seconds
- New events may interrupt current audio
- Only most recent prompt guaranteed to play

### Snark Content Rules
- Sarcastic, not hateful. No profanity/slurs/explicit content.
- NO references to race, gender, appearance, or identity
- Humor targets gameplay decisions, not people
- Must be app-store safe

### Data Persistence
- Auto-save last 10 games locally
- Each saved game includes: players, final scores, winner(s), key stats, date/time
- Offline-first design
- Local persistence of game state and history
- No authentication in MVP

## UI/UX Requirements

### UX Principles (Prioritize)
- **Minimum taps**: Banking is one-tap per player from main screen (no modal pickers as default)
- **High readability**: Readable from 3-6 feet; large tap targets
- **Fast-paced**: No laggy animations; minimal blocking dialogs
- **Single-step undo**: Can cross round boundaries

### Device Targeting
- Primary: mobile phone (portrait)
- UI readable from 3-6 feet away
- Tablet support is bonus, not required

### Required Screens
1. **Home / New Game**
2. **Player Setup** - Rounds selection + Save/Load player list
3. **Main Game Screen** - Round info, bank total, player rows with bank button
4. **End-of-Game** - Winner highlight, leaderboard, stats, share, play again
5. **Settings** - Voiceover toggle, snark level, rules toggles, accessibility toggles
6. **History** - Last 10 games list + Game detail view

### End-of-Game Experience
- Winner banner with confetti animation
- Final leaderboard with medals
- Fun stats summary (biggest bank, most banks, streaks)
- Actions: Play Again, Share Results, View Full Scoreboard

## Implementation Details

### State Machine (High Level)
```
Game → Rounds → RoundActive → RoundEnd → NextRound → GameEnd
```

Round ends when:
- 7 rolled, OR
- All players banked

On 7 rolled:
- Unbanked players score 0 for the round
- Banked players keep their already-banked points

On doubles:
- Add sum to Bank, then DOUBLE the entire Bank total

Optional variant:
- If enabled and within first 3 rolls of a round, a 7 adds +70 instead of ending the round

### Data Model (Recommended)

Keep these serializable (JSON) for local persistence:

**Game:**
- `id`, `createdAt`, `settings`
- `players[]`, `roundsTotal`, `roundIndex`
- `bankTotal`, `rollCountInRound`
- `lastEvent`, `historyLog[]`

**Player:**
- `id`, `name`, `color/avatar`
- `totalScore`, `bankedThisRound` (bool)
- `banksCount`, `biggestBank`, `streakCount`

**Event Log (append-only):**
- `type`: ROLL | BANK | ROUND_END | ROUND_START | GAME_END | UNDO
- `payload`: dice, playerId, bankTotalBefore/After, roundIndex, etc.

Undo should revert the last event only by replaying or using stored before/after snapshots.

### Audio + Caption System (Implementation)

Use a single prompt definition object per event:
- `id`
- `captionText`
- `audioAsset` (or TTS text)
- `snarkLevel` variant mapping

**When an event triggers:**
1. Determine current snark level
2. Select prompt variant
3. Render caption immediately
4. Play audio asynchronously if enabled
5. If a new prompt triggers, interrupt current audio and replace with latest prompt

**Do NOT queue long audio.** Keep audio ≤ 3 seconds.

### Content System Best Practices

- Store prompt definitions in a single file/module that is easy for non-engineers to edit later
- Provide 3-5 variations per event per snark level (where applicable)
- Add a simple deterministic selector (e.g., rotate through variants or pseudo-random seeded per game)

### Performance Requirements

- UI must remain interactive at all times
- Updates to bank/score should feel instantaneous (<100ms perceived)
- Audio/caption sync should occur immediately; do not delay captions waiting for audio
- No laggy animations

### Accessibility Requirements

- Respect system text scaling
- High contrast mode option
- VoiceOver / screen reader labels for key controls
- Captions always visible for events that have audio

### Testing Requirements

Write tests for:
- Bank logic (once per round)
- Round end conditions (7 or all banked)
- Doubles logic (add then double)
- Optional first-3-roll 7=+70 variant
- Undo across actions including round transitions
- Tie handling at end of game
- Persistence reload restores state correctly

**Include at least 5 scenario tests that mirror PRD acceptance criteria.**

## Development Constraints

### Product Constraints (DO NOT Change)
- **Single Scorekeeper only** - No multi-device inputs in MVP
- **No custom house rules editors** - Only the optional "first 3 rolls: 7=+70" toggle
- **No audio for every roll** - Audio only for key moments: round start, player banking, 7 rolled, final round, game over
- **Audio must NEVER block UI interaction**
- **Every audio prompt must have identical on-screen caption text** (same source of truth)
- **Snark is opt-in** with 4 levels: Off, Low, Medium, Full
- **Snark must remain clean**: no profanity, slurs, identity/appearance attacks; roast gameplay decisions only
- **Offline-first** - No login/accounts; local persistence only

### Out of Scope (Do NOT Implement)
- Multi-device input (players banking themselves)
- Accounts, cloud sync, leaderboards
- Fully custom scoring/rules editor
- Audio narration for every roll
- Manual score editing
- Multi-step undo history

### Deliverables / Milestones

**Implementation order:**
1. Implement core game loop first (no audio/snark)
2. Add persistence + undo next
3. Add end-of-game + history
4. Add settings + audio + snark level system last
5. Polish accessibility and performance at end

### Future Roadmap Context
- v1.0 (MVP): Full game loop, snark+voice, history, end-game experience
- v1.1: Read-only companion viewer (join via code)
- Future: Player inputs from companion devices, cloud sync, achievements
