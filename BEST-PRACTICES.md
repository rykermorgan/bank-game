# Claude Code Best Practices & Rules

## Meta-Rule: Read This First

Before doing ANYTHING, Claude Code must:
1. Read CLAUDE.md (project-specific instructions)
2. Read this file (best practices and rules)
3. Read NON-ENGINEER-CONTEXT.md (user background)
4. Read TESTING-STRATEGY.md (TDD approach)
5. Read DESIGN-DIRECTION.md (design guidelines)
6. Read PLATFORM-STRATEGY.md (platform decisions)

**Only then** should you start planning or coding.

## Core Workflow: Plan → Test → Build → Verify

### 1. Always Use Plan Mode First (Shift+Tab twice)

For ANY non-trivial task:
- Research and analyze without editing
- Explain what you'll do and why
- List potential issues
- Ask for confirmation before proceeding

**Example:**
```
Task: Add the doubles logic

[Plan Mode engaged]

Research findings:
- Doubles should add sum, then double entire bank
- Need to detect when both dice match
- Should trigger visual feedback
- Covered in CLAUDE.md line 127

Implementation plan:
1. Add doubles detection to dice entry
2. Update bank calculation logic
3. Add test for doubles sequence
4. Add animation for doubling

Potential issues:
- Need to ensure order: sum first, THEN double
- Animation shouldn't block gameplay
- Undo needs to work with doubles

Ready to proceed with tests?
```

### 2. Test-Driven Development (Always)

**For EVERY feature:**

1. **Write tests first**
   - Cover happy path
   - Cover edge cases
   - Cover error conditions
   - Make them fail

2. **Implement minimal code**
   - Just enough to pass tests
   - No extra features
   - No premature optimization

3. **Refactor**
   - Clean up code
   - Keep tests green
   - Improve readability

4. **Verify**
   - Run full test suite
   - Check for regressions
   - Update documentation

**Never skip tests.** Ever.

### 3. Break Down Complex Tasks

**If a task seems big:**
1. Break into 3-5 milestones
2. Explain each milestone
3. Get approval for breakdown
4. Complete one at a time
5. Show progress after each

**Red flag:** Working for 30+ minutes without a checkpoint.

### 4. Commit Frequently

**After each working feature:**
- Write descriptive commit message
- Explain what changed and why
- Include what's tested
- Note any remaining work

**Good commit:**
```
Add doubles detection and bank doubling logic

- Detects when both dice values match
- Adds sum to bank first, then doubles total bank
- Includes animation for doubling effect (300ms)
- 8 tests covering doubles logic and edge cases

Tested:
- Basic doubles (3,3) → (bank+6)*2
- Doubles with existing bank
- Doubles edge case (1,1)
- Undo after doubles

Remaining: Audio cue for doubles
```

**Bad commit:**
```
updates
```

## File Organization & Structure

### Directory Structure

```
/bank-game
  /src
    /components      (React components)
    /hooks          (Custom React hooks)
    /utils          (Pure functions, helpers)
    /lib            (Game logic - framework agnostic)
    /assets         (Images, audio, icons)
    /styles         (Global styles, theme)
  /tests
    /unit           (Unit tests)
    /integration    (Integration tests)
    /e2e            (End-to-end tests)
  /public           (Static files)
  /docs             (Documentation)
```

### File Naming

- **Components:** PascalCase (`GameBoard.jsx`)
- **Utilities:** camelCase (`calculateBank.js`)
- **Tests:** Match source (`GameBoard.test.jsx`)
- **Constants:** UPPER_SNAKE_CASE (`GAME_CONSTANTS.js`)

### Keep Files Focused

**One responsibility per file:**
- ✅ `BankButton.jsx` - Just the bank button
- ❌ `GameComponents.jsx` - Too broad

**File size limits:**
- Components: <200 lines
- Utilities: <150 lines
- If bigger, split it up

## Code Quality Standards

### Linting & Formatting

**Always lint before committing:**
```bash
npm run lint
npm run format
```

**If linting fails:**
- Fix the issues
- Don't suppress warnings unless absolutely necessary
- Never commit with linting errors

### TypeScript / JavaScript

**Prefer:**
- Functional components over classes
- Named exports over default exports (easier to refactor)
- Explicit types (if using TypeScript)
- Destructuring for clarity
- Early returns to reduce nesting

**Example:**
```javascript
// ✅ Good
export function calculateDoubles(dice1, dice2, currentBank) {
  if (dice1 !== dice2) return currentBank;
  
  const sum = dice1 + dice2;
  return (currentBank + sum) * 2;
}

// ❌ Bad
export default function calc(d1, d2, b) {
  if (d1 == d2) {
    return (b + (d1 + d2)) * 2;
  } else {
    return b;
  }
}
```

### React Best Practices

**Component Structure:**
```javascript
// 1. Imports
import { useState } from 'react';
import { Button } from './Button';

// 2. Types/Constants
const MAX_PLAYERS = 6;

// 3. Component
export function GameBoard() {
  // 4. Hooks
  const [bank, setBank] = useState(0);
  
  // 5. Event handlers
  const handleDiceRoll = (dice1, dice2) => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**State Management:**
- Use `useState` for local state
- Use `useContext` for shared state
- Consider Zustand if state gets complex
- Keep state close to where it's used

## Performance Rules

### Never Block the UI

**Audio/Animations:**
- Always async
- Never wait for completion
- Interruptible
- Graceful degradation if slow

**Long Operations:**
- Show loading states
- Allow cancellation
- Break into chunks if possible

### Optimize Renders

**React:**
- Use `memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable functions
- Profile before optimizing

**CSS:**
- Use transforms for animations (GPU accelerated)
- Avoid layout thrashing
- Minimize reflows

## Error Handling

### User-Facing Errors

**Always:**
- Show clear error messages
- Explain what went wrong
- Suggest how to fix it
- Provide recovery path

**Example:**
```javascript
try {
  savegame(gameState);
} catch (error) {
  showToast({
    type: 'error',
    title: 'Couldn\'t save game',
    message: 'Your progress is safe, but wasn\'t saved to disk. Try again?',
    actions: [
      { label: 'Retry', onClick: () => saveGame(gameState) },
      { label: 'Continue', onClick: closeToast }
    ]
  });
}
```

### Developer-Facing Errors

**In development:**
- Log errors with context
- Include stack traces
- Add debugging info

**In production:**
- Catch and handle gracefully
- Log to console (still useful)
- Don't crash the app

## Accessibility (A11y)

### Required Standards

**Every interactive element needs:**
- Accessible name (`aria-label` or text content)
- Keyboard navigation support
- Focus indicators
- Touch target ≥44x44px

**Forms:**
- Labels for all inputs
- Error messages linked with `aria-describedby`
- Required fields marked
- Validation messages

**Images:**
- `alt` text for meaningful images
- `alt=""` for decorative images
- Avoid text in images

### Testing Accessibility

**Before committing:**
- Tab through the UI
- Test with screen reader (VoiceOver on iOS)
- Check color contrast
- Test at 200% zoom

## Cost Management

### Token Efficiency

**Be efficient with Claude Code usage:**

1. **Use Plan Mode** to avoid costly mistakes
2. **Write tests first** to prevent expensive debugging
3. **Batch related changes** into single sessions
4. **Ask clarifying questions early** before building wrong thing
5. **Use existing libraries** when appropriate

### When to Stop and Ask

**Stop if:**
- Same error occurs 3+ times
- Unsure about requirements
- Making assumptions about user needs
- Going in circles
- Task scope expanding

**Ask for:**
- Clarification on requirements
- Approval for big changes
- Trade-off decisions
- Priority when multiple options exist

## Git Workflow

### Branching (If Using Git)

**Simple approach:**
- `main` - stable code
- `develop` - work in progress
- Feature branches if needed

### Commit Messages

**Format:**
```
<type>: <summary>

<details>

<testing notes>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `test:` Test updates
- `refactor:` Code cleanup
- `docs:` Documentation
- `style:` UI/CSS changes
- `chore:` Tooling, config

## Communication with User

### Status Updates

**Provide updates:**
- After completing each milestone
- When stuck on a problem
- When making a significant decision
- Every ~15 minutes of work

**Format:**
```
✅ Completed: Dice entry system
⏳ In progress: Banking logic
📋 Up next: Round end detection

Just finished implementing the dice validation.
Now working on the bank button functionality.

Quick question: Should the bank button disable 
after one use, or just show "LOCKED"?
```

### Explaining Technical Decisions

**Always include:**
- What you're doing
- Why this approach
- Alternative considered
- Trade-offs
- Recommendation

**Example:**
```
For storing game state, I recommend using IndexedDB 
instead of LocalStorage.

Why IndexedDB:
- Can store more data (no 5MB limit)
- Better performance for large datasets
- Supports transactions (safer)
- Can query/filter data

Why not LocalStorage:
- Limited to 5MB
- Slower for large objects
- No transactions
- JSON stringify/parse overhead

Trade-off:
IndexedDB is more complex, but we'll use a library
(idb-keyval) that makes it simple.

Okay to proceed with IndexedDB?
```

## Debugging Process

### When Things Break

**Step-by-step debugging:**

1. **Reproduce** the issue
2. **Isolate** the cause
3. **Check** recent changes
4. **Read** error messages carefully
5. **Verify** assumptions with tests
6. **Fix** the smallest possible change
7. **Test** the fix works
8. **Verify** no new bugs introduced

### Logging Strategy

**Add strategic logs:**
```javascript
// Development
console.log('🎲 Dice rolled:', dice1, dice2);
console.log('💰 Bank total:', currentBank, '→', newBank);
console.log('🏦 Player banked:', player.name, player.score);
```

**Use emoji for scan-ability!**

## When to Refactor

### Good Times to Refactor

- ✅ Tests are green
- ✅ Feature is working
- ✅ You see duplication
- ✅ Code is confusing
- ✅ Adding new feature would be easier after refactor

### Bad Times to Refactor

- ❌ Tests are failing
- ❌ Uncertain about requirements
- ❌ "Just in case" optimization
- ❌ Friday afternoon before deploy
- ❌ While debugging

## Milestones & Checkpoints

### After Each Feature

**Checklist:**
- [ ] Tests written and passing
- [ ] Code committed with good message
- [ ] Documentation updated
- [ ] User notified of progress
- [ ] Demo-able if requested

### End of Session

**Before finishing:**
- [ ] All tests passing
- [ ] No uncommitted changes
- [ ] Status update to user
- [ ] Next steps documented
- [ ] Questions/blockers noted

## Emergency Procedures

### If You're Stuck

**After 3 failed attempts:**
1. Stop trying the same approach
2. Explain the problem clearly
3. List what you've tried
4. Ask for guidance
5. Suggest alternative approach

### If Tests Keep Failing

**Don't:**
- Keep tweaking randomly
- Disable the tests
- Assume tests are wrong
- Get into a loop

**Do:**
- Explain what's failing
- Show the test output
- Explain your theory
- Ask if requirements changed
- Suggest debugging strategy

### If User Seems Confused

**Immediately:**
1. Stop what you're doing
2. Summarize current state
3. Ask what's unclear
4. Offer to slow down
5. Simplify explanation

## Success Metrics

**You're doing well when:**
- ✅ Tests passing consistently
- ✅ Features work first try
- ✅ User understands progress
- ✅ Commits are small and focused
- ✅ Making steady progress
- ✅ Code is readable
- ✅ No mysterious bugs

**Warning signs:**
- ❌ Tests failing repeatedly
- ❌ Working >30min without checkpoint
- ❌ User asking lots of clarifying questions
- ❌ Same bug keeps coming back
- ❌ Scope creeping
- ❌ Uncertain about requirements

## Final Reminders

1. **Read the docs first** (all the .md files)
2. **Plan before coding** (use Plan Mode)
3. **Tests before implementation** (always TDD)
4. **Communicate clearly** (user is not an engineer)
5. **Commit frequently** (working features)
6. **Ask questions** (when uncertain)
7. **Stay focused** (one feature at a time)
8. **Be patient** (quality over speed)
9. **Have fun** (this is a game, after all!)

## Questions?

If ANY of this is unclear, ask before starting!

Better to clarify now than debug later.
