# Testing Strategy for Bank Game

## Overview
This document defines the Test-Driven Development (TDD) approach for building the Bank Game. Claude Code will follow these principles to ensure robust, maintainable code.

## Core TDD Workflow

**MANDATORY: Claude must follow this sequence for ALL new features:**

### 1. Red Phase (Write Failing Tests)
- Write tests BEFORE implementation
- Tests should fail for the right reasons
- No implementation code during this phase
- Be explicit: "We are doing TDD - write tests only, no implementation yet"

### 2. Green Phase (Minimal Implementation)
- Write minimal code to make tests pass
- Avoid over-engineering
- Focus solely on passing the current tests

### 3. Refactor Phase (Improve Code Quality)
- Clean up code while keeping tests green
- Apply design patterns where appropriate
- Ensure code remains readable and maintainable

### 4. Verify Phase (Run All Tests)
- Run full test suite
- Confirm no regressions
- Check test coverage

## Test Requirements

### Must Have Tests For:
1. **Banking Logic**
   - One bank per player per round
   - Bank total correctly added to player score
   - Player locked out after banking
   - Cannot bank twice in same round

2. **Round End Conditions**
   - Round ends on 7 rolled
   - Round ends when all players banked
   - Unbanked players get 0 on 7

3. **Doubles Logic**
   - Sum added to bank first
   - Then entire bank total doubled
   - Verify calculation order

4. **Optional 7 Rule (First 3 Rolls)**
   - When enabled: 7 in first 3 rolls = +70 points
   - 7 does NOT end round during first 3 rolls
   - After roll 3: 7 ends round normally
   - When disabled: 7 always ends round

5. **Undo System**
   - Can undo last dice entry
   - Can undo last bank action
   - Can undo round transition
   - Undo works across round boundaries
   - State correctly restored after undo

6. **Game End**
   - Winner correctly identified
   - Ties handled properly
   - Stats calculated correctly

7. **Persistence**
   - Game state saves correctly
   - Game state loads correctly
   - Last 10 games maintained
   - History includes all required fields

### Test Coverage Goals
- **Minimum**: 80% code coverage
- **Target**: 90%+ for game logic
- **Critical paths**: 100% (banking, scoring, round transitions)

## Testing Framework

**Recommended Stack:**
- **Frontend**: Vitest + React Testing Library
- **E2E**: Playwright
- **Linting**: ESLint with strict rules

## Test Organization

```
tests/
  unit/
    game-logic/
      banking.test.js
      scoring.test.js
      doubles.test.js
      seven-rule.test.js
      round-end.test.js
    undo/
      undo-actions.test.js
    persistence/
      save-load.test.js
  integration/
    game-flow.test.js
    audio-system.test.js
  e2e/
    complete-game.spec.js
    error-recovery.spec.js
```

## Claude Code TDD Instructions

**When starting ANY new feature, Claude must:**

1. Ask: "Shall I write the tests first?" (Answer is always YES)
2. Write comprehensive test cases covering:
   - Happy path
   - Edge cases
   - Error conditions
3. Run tests and confirm they FAIL
4. Only then implement minimal code to pass tests
5. Run tests again to confirm they PASS
6. Refactor if needed while keeping tests green

**Claude should NOT:**
- Write implementation before tests
- Skip tests "to get started quickly"
- Create mock implementations when writing tests
- Move forward with failing tests

## Scenario Tests (PRD Acceptance Criteria)

### Scenario 1: Basic Banking Flow
```javascript
test('player can bank and lock in current total', () => {
  // Setup: Round with Bank total = 50
  // Action: Player banks
  // Assert: Player score = 50, player locked out
});
```

### Scenario 2: Seven Ends Round
```javascript
test('rolling a 7 ends round immediately', () => {
  // Setup: Active round, 2 players unbanked
  // Action: Roll 7
  // Assert: Round ended, unbanked players score 0
});
```

### Scenario 3: Doubles Logic
```javascript
test('doubles add then double the bank', () => {
  // Setup: Bank = 20
  // Action: Roll double 4s (sum = 8)
  // Assert: Bank = (20 + 8) * 2 = 56
});
```

### Scenario 4: First-3-Roll 7 Variant
```javascript
test('7 in first 3 rolls adds 70 when enabled', () => {
  // Setup: Variant enabled, roll count = 2
  // Action: Roll 7
  // Assert: Bank += 70, round continues
});

test('7 in first 3 rolls ends round when disabled', () => {
  // Setup: Variant disabled, roll count = 2
  // Action: Roll 7
  // Assert: Round ended
});
```

### Scenario 5: Undo Across Rounds
```javascript
test('undo can reverse round transition', () => {
  // Setup: Just completed round 1
  // Action: Undo
  // Assert: Back in round 1, state restored
});
```

## Testing as a Non-Engineer

**You don't need to write tests manually!** Claude Code will:
1. Understand the feature from your description
2. Write comprehensive tests automatically
3. Run them and show you results
4. Fix any that fail

**Your job is to:**
- Verify the test scenarios make sense
- Confirm the behavior matches what you want
- Approve before implementation starts

## Continuous Testing

**During development, Claude should:**
- Run tests after each code change
- Report test results clearly
- Fix failing tests before moving forward
- Never commit code with failing tests

## Cost Management

Tests consume tokens, but they SAVE money by:
- Preventing bugs that require expensive fixes later
- Giving Claude clear targets (faster development)
- Reducing iteration cycles
- Ensuring code quality from the start

**Estimated token usage:**
- Writing tests: ~2-3k tokens per feature
- Running tests: ~500-1k tokens per run
- Bug fixes avoided: Saves 10-20k tokens

## When Tests Can Be Skipped

**NEVER.** Even for "quick experiments," write tests.

If you truly need to prototype without tests:
1. Create it in a separate `/experiments` folder
2. Mark clearly as "throwaway code"
3. Do NOT merge into main codebase
4. Rewrite with tests when promoting to production

## Success Metrics

You'll know TDD is working when:
- ✅ Features work on first try
- ✅ Undo works reliably
- ✅ Refactoring doesn't break things
- ✅ You're confident in the code quality
- ✅ Claude stays focused and on-task

## Red Flags

If Claude:
- Skips writing tests
- Writes implementation before tests
- Has vague test descriptions
- Can't explain what a test validates

→ **STOP and reinforce TDD workflow**

## Emergency Override

If you're truly stuck and need to bypass TDD:
1. Document WHY in code comments
2. Create a TODO to add tests later
3. Mark code as "UNTESTED - USE WITH CAUTION"
4. Add tests before next session

This should be RARE.
