# Testing Strategy

## Overview

This project uses a comprehensive testing approach to catch both compile-time and **runtime errors**.

## Why Smoke Tests?

`npm run build` only catches compile errors. It **does not catch**:
- Missing imports (e.g., `clsx is not defined`)
- Console errors
- React warnings
- Runtime ReferenceErrors
- Component crashes

Our smoke tests render actual components in a simulated browser environment and detect these issues.

## Running Tests

### Quick Smoke Test (Recommended before commits)
```bash
npm run test:smoke
```

**This catches:**
- ✅ Missing imports (ReferenceErrors)
- ✅ Console errors
- ✅ React warnings
- ✅ Component rendering failures

**Output when successful:**
```
✓ tests/integration/smoke.test.jsx (7 tests)
  ✓ renders App without console errors
  ✓ renders SetupScreen without ReferenceErrors
  ✓ all components have required imports
  ✓ checks for critical React warnings
  ✓ renders setup screen with all required elements
  ✓ handles state transitions without errors
  ✓ renders GameScreen after starting game without errors

Test Files  1 passed (1)
     Tests  7 passed (7)
```

### All Tests
```bash
npm test
```

### Watch Mode (during development)
```bash
npm test -- --watch
```

### Test Coverage
```bash
npm run test:coverage
```

## Test Files

### Unit Tests
`/tests/unit/lib/` - Pure game logic tests (92 tests)
- `scoring.test.js` - Dice rolling, doubles, seven rule
- `banking.test.js` - Player banking logic
- `roundEnd.test.js` - Round completion logic
- `gameEngine.test.js` - State machine tests

### Integration/Smoke Tests
`/tests/integration/smoke.test.jsx` - **Browser simulation tests (7 tests)**
- Component rendering without console errors
- Missing import detection (ReferenceErrors)
- React warning detection
- **GameScreen rendering after state transitions**
- Full user flow: SetupScreen → Start Game → GameScreen

**Why this matters:** These tests simulate actual browser behavior and catch errors that `npm run build` misses, such as:
- Missing icon imports (e.g., `User is not defined`)
- Runtime JavaScript errors
- Component crashes during rendering

## Pre-Commit Checklist

Before committing or deploying:
1. ✅ `npm run test:smoke` - Catch runtime errors
2. ✅ `npm run build` - Verify production build
3. ✅ `npm run lint` - Check code style

## CI/CD Integration

Recommended GitHub Actions workflow:

```yaml
- name: Run Tests
  run: |
    npm run test:smoke
    npm run build
    npm run lint
```

## Debugging Failed Tests

### Console Errors Detected
If smoke tests fail with console errors:
1. Check the error message in test output
2. Look for "ReferenceError" or "is not defined"
3. Verify all imports in the failing component

### Missing Imports
The smoke test specifically catches:
```javascript
// ❌ This would fail smoke tests
export function MyComponent() {
  return <div className={clsx('test')} /> // clsx not imported!
}

// ✅ This passes
import clsx from 'clsx'
export function MyComponent() {
  return <div className={clsx('test')} />
}
```

## What's Next?

Future testing improvements:
- [ ] E2E tests with Playwright for full user flows
- [ ] Visual regression testing
- [ ] Performance testing
- [ ] Accessibility testing
