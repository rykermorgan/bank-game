# 🧾 Product Requirements Document (PRD)

## 🧱 Title
**Bank Dice Game Companion App**

---

## 🧩 TL;DR

This is a **live scoring companion app** for the in-person dice game *Bank* (also known as “Bank It”). One person acts as the scorekeeper, using the app to manage players, track rounds, enter dice rolls, and record banking actions.

The app does not simulate gameplay or replace physical dice. Its core value is **speed, clarity, and personality**, including optional audio feedback and a deliberately snarky tone inspired by CARROT Weather.

The MVP includes the full game loop, snark levels, voice + captioned prompts, game history, and a polished end-of-game experience. Future versions may support passive companion viewers.

---

## 🎲 Gameplay Reference — How the Game of Bank Works

This app is a **companion scorekeeper** for the dice game *Bank*. The app tracks game state and scoring, but does not enforce physical gameplay.

### Core Rules
- Played with **two six-sided dice**
- Each game consists of a fixed number of **rounds** (e.g., 10 / 15 / 20)

### Round Flow
1. At the start of a round, the **Bank total** is set to 0.
2. Players take turns rolling dice.
3. Each roll’s **sum** is added to the Bank total.
4. At any time during a round, a player may call **“Bank!”**:
   - That player adds the current Bank total to their score.
   - That player is marked as **banked** and does not participate further in the round.
5. The round ends when:
   - A **7 is rolled**, OR
   - **All players have banked**

### Special Dice Events
- **Rolling a 7**:
  - Ends the round immediately.
  - All players who have **not banked** receive **0 points**.
- **Rolling doubles**:
  - Add roll sum to the Bank total.
  - Then **double the entire Bank total**.
- **Optional Supported Variant**:
  - A 7 rolled within the **first three rolls of a round** counts as **+70 points** instead of ending the round.
  - This behavior is controlled by a single settings toggle.

### Game End
- The game ends after the final round.
- Player with the highest total score wins.
- Ties are allowed and clearly displayed.

This section is the **authoritative source of truth** for gameplay logic.

---

## 👤 Roles & Authority

- Each game has exactly one **Scorekeeper**.
- Only the scorekeeper can:
  - Enter dice rolls
  - Bank players
  - Undo actions
  - Advance rounds
- Other players are **passive observers** in MVP.
- The scorekeeper role **cannot be transferred mid-game**.
- Companion viewers (future) are read-only unless explicitly expanded later.

---

## 🎯 Goals

### Business Goals
- Be the definitive in-person *Bank* companion app
- Differentiate through personality, snark, and audio feedback
- Drive replayability and sharing through delightful UX

### User Goals
- Score games quickly without slowing play
- Let everyone follow along via audio or screen
- Opt into humor and roasting without confusion
- Save games and replay easily

### Non-Goals
- Online multiplayer
- Custom house rule editors
- Real-time multi-device inputs

---

## 🧠 Core Features (MVP)

### Game Setup
- Enter 2+ player names
- Choose number of rounds (10 / 15 / 20)
- Save and reload player lists
- Optional player colors or avatars

### Gameplay Loop
- Manual dice entry (two values)
- Automatic Bank total updates
- One-tap banking per player
- Automatic round ending on:
  - 7 rolled
  - All players banked

### Scoreboard
- Live total scores
- Banked / unbanked status per round
- Undo last action
- Optional per-round history view

---

## 🔄 Error Recovery

- Undo reverses the **most recent action only**.
- Undo supports:
  - Dice entry
  - Banking
  - Round transitions
- Undo can cross round boundaries.
- No multi-step undo history in MVP.
- Manual score editing is **not supported**.

This prioritizes speed and clarity over full auditability.

---

## 🎙 Voiceover & Snark

### Audio Prompts
- Optional global toggle
- Triggered only on key moments:
  - Round start
  - Player banking
  - 7 rolled
  - Final round
  - Game over
- **No audio** for standard roll inputs

### Caption Consistency
- Every audio prompt must also appear as **on-screen text**.
- Audio and captions are sourced from the same prompt definition.

### Snark Levels
- Off
- Low (gentle sarcasm)
- Medium (playful mockery)
- Full (CARROT-style savage)

Snark level affects **tone**, not logic or timing.

---

## ⏱ Pacing & Performance Requirements

- Audio prompts must **never block gameplay**.
- UI remains interactive while audio plays.
- Audio length ≤ **3 seconds**.
- If a new event occurs:
  - Current audio may be interrupted.
  - Only the most recent prompt is guaranteed to play.

The game must remain fast-paced at all times.

---

## 🗯️ Snark Content Guidelines

- Tone is sarcastic, not hateful.
- No profanity, slurs, or explicit content.
- No references to:
  - Race, gender, appearance, or identity.
- Humor targets **gameplay decisions**, not people.
- Content must remain clean and app-store safe.

---

## 📜 Game History Log

- Automatically saves last **10 games** locally.
- Each entry includes:
  - Players
  - Final scores
  - Winner(s)
  - Key stats (biggest bank, most banks, streaks)
  - Date/time
- Accessible via a History section.

---

## 🏁 End-of-Game Experience

- Winner banner with confetti animation
- Final leaderboard with medals
- Fun stats summary
- Actions:
  - Play Again (same settings)
  - Share Results (image/text)
  - View Full Scoreboard

---

## 📱 Device Assumptions

- Primary device: **mobile phone**
- Portrait orientation preferred
- UI readable from **3–6 feet**
- Tablet support is a bonus, not required for MVP

---

## 🧪 Acceptance Criteria & Example Scenarios

- Banking adds Bank total and locks player for round
- Rolling a 7 ends the round immediately
- Doubles add then double Bank
- Round resets correctly
- Final round triggers end-of-game screen
- Audio + captions remain in sync
- Snark level correctly selects prompt variants

---

## 📈 Success Metrics

- % of games completed
- % of sessions using snark
- Average games per session
- History usage
- Shares per game
- Review sentiment referencing fun or clarity

---

## 🛠 Technical Considerations

- Offline-first
- Local persistence of game state and history
- Shared prompt model for audio + captions
- No authentication in MVP
- Companion viewer staged for v1.1

---

## ⏱ Roadmap

### v1.0 (MVP)
- Full game loop
- Snark + voice system
- History
- End-game experience
- Settings + accessibility

### v1.1
- Read-only companion viewer (join via code)

### Future
- Player inputs from companion devices
- Cloud sync
- Lifetime stats and achievements

---

## 📋 Output: Team To-Dos

### Engineering
- Game state model
- Dice + banking logic
- Undo system
- Audio engine
- Prompt selection
- Local persistence
- Share/export

### Design
- Core gameplay UI
- End-of-game screen
- Snark caption styling
- Settings & accessibility

### Content
- Snark prompt library (per event × snark level)
- Caption text
- Audio recording or TTS config

### QA
- Scenario testing
- Audio pacing
- Accessibility
- Save/recovery

---
