# Platform Strategy: Web-First PWA Approach

## Recommendation: Start with Progressive Web App (PWA)

**TL;DR:** Build a web app first, make it installable as a PWA, then convert to native iOS if needed.

## Why Web-First for Your Use Case

### Perfect Fit for Bank Game

Your app is ideal for the web-first approach because:

✅ **No complex native features needed**
- No camera, GPS, or phone hardware
- No background processing
- No complex gestures
- Just display, input, audio

✅ **Offline-capable**
- Game state stored locally
- No server required
- Works without internet (PWA feature)

✅ **Quick iteration**
- Make changes instantly
- No App Store approval delays
- Test on real devices immediately
- Fix bugs in minutes, not days

✅ **Family & friends audience**
- Easy to share (just a URL)
- Works on any device
- No "download from App Store" friction
- Grandma can play on her Android tablet

✅ **No monetization = no App Store benefits**
- You're not selling it
- No in-app purchases
- No need for App Store discovery
- Skip the $99/year Apple Developer fee

## What is a PWA?

A Progressive Web App is a website that:
- **Installs** like an app (home screen icon)
- **Works offline** (saves data locally)
- **Feels native** (full screen, fast, smooth)
- **Runs anywhere** (phones, tablets, desktop)

**It's basically an app, but delivered through the web.**

### PWA Capabilities for Your Game

✅ Things PWAs can do (that you need):
- Display UI (obviously)
- Store data locally (game history)
- Play audio (snark prompts)
- Install to home screen
- Work offline
- Send notifications (optional for round reminders)
- Full screen mode

❌ Things PWAs struggle with (that you DON'T need):
- Advanced camera features
- Bluetooth
- NFC payments
- Background location tracking
- Deep OS integration

**Your app needs ZERO of the things in the ❌ list.**

## Development Path: 3 Stages

### Stage 1: Web App (Week 1-2)
**Build it as a responsive website**

Tech Stack:
- React (UI framework)
- Vite (build tool - super fast)
- Tailwind CSS (styling)
- LocalStorage or IndexedDB (data)

Benefits:
- Fastest development
- Easy debugging (browser dev tools)
- Test on any device with a browser
- No deployment complexity (use Netlify/Vercel free tier)

Deliverable:
- Working game at `bankgame.yourdomain.com`
- Fully functional on phone browsers

### Stage 2: PWA Enhancement (Week 3)
**Add installability**

Add:
- Service Worker (offline support)
- Web Manifest (install metadata)
- App icons
- Splash screen

Benefits:
- Users can "install" to home screen
- Works offline
- Feels like a native app
- Still just a web app under the hood

Tools:
- Vite PWA Plugin (auto-generates service worker)
- PWA Asset Generator (creates all icon sizes)

Deliverable:
- Installable app
- Works offline
- Launches full screen

### Stage 3: Native iOS (Optional - Later)
**Only if family REALLY wants it**

Use:
- Capacitor (wraps web app as iOS app)
- Or React Native rebuild (if you want native performance)

When to do this:
- Family is using it regularly
- Web version is stable and tested
- You want App Store presence
- You're willing to pay $99/year for Apple Developer

**IMPORTANT:** Don't start here. 90% chance you won't need this.

## Cost & Time Comparison

### PWA Route (Recommended)
**Development:**
- Week 1-2: Core functionality
- Week 3: PWA enhancements
- Week 4+: Polish, testing

**Ongoing:**
- $0-12/year (domain + hosting)
- Free updates, instant deployment
- No approval process

**Claude Code Token Estimate:**
- ~200-300k tokens for MVP
- ~$20-30 at current rates

### Native iOS Route (Not Recommended Initially)
**Development:**
- Week 1-3: Core functionality (single platform)
- Week 4-5: iOS-specific polish
- Week 6: App Store submission process

**Ongoing:**
- $99/year (Apple Developer Program)
- Slower updates (review process)
- Higher maintenance

**Claude Code Token Estimate:**
- ~350-500k tokens for MVP
- ~$35-50 at current rates
- Plus time cost of App Store approvals

## Platform Limitations: iOS vs Android PWAs

### iOS PWA Limitations
Apple is less friendly to PWAs, but for your use case it doesn't matter:

❌ **iOS Limitations You DON'T Care About:**
- No push notifications → You don't need this
- No background sync → You don't need this
- No persistent storage quota → 10 games = tiny data
- Limited battery APIs → Not needed

✅ **What DOES Work on iOS:**
- Install to home screen ✅
- Full screen mode ✅
- Local storage ✅
- Audio playback ✅
- Offline functionality ✅

### Android PWA Support
Much better! Full PWA support including:
- Install prompts (automatic)
- Push notifications
- Better integration

## User Installation Flow

### iOS (Safari)
1. Visit the website
2. Tap Share button
3. Tap "Add to Home Screen"
4. App icon appears
5. Launch like any app

**Note:** No visual indicator it's a PWA. You'll need to tell users to add it.

### Android (Chrome)
1. Visit the website
2. See "Install app" prompt (automatic)
3. Tap Install
4. App icon appears
5. Launch like any app

**Much more seamless!**

## Sharing with Family

### PWA Approach:
```
You: "Hey, go to bankgame.com on your phone"
Them: [visits URL]
You: "Now tap Share > Add to Home Screen"
Them: [app is installed]
Total: 30 seconds
```

### Native App Approach:
```
You: "Download the Bank Game app from the App Store"
Them: [searches App Store]
Them: [finds wrong app, gets confused]
You: [sends exact link]
Them: [downloads, waits, installs]
Total: 2-3 minutes + confusion
```

## When to Consider Native iOS Later

Convert to native iOS if:
- ✅ Family is actively using it
- ✅ Web version is stable (no major bugs)
- ✅ You want better performance (unlikely to matter)
- ✅ You want App Store presence
- ✅ You're willing to pay $99/year

Don't convert if:
- ❌ Just launched
- ❌ Still fixing bugs frequently
- ❌ Only 2-3 people using it
- ❌ Web version works fine

## Technical Migration Path

**If you decide to go native later:**

### Option 1: Wrap with Capacitor (Easier)
- Takes your existing PWA code
- Wraps it in a native shell
- Publishes to App Store
- ~1-2 weeks additional work
- Shares 95% of code with web version

### Option 2: Rebuild with React Native (Better Performance)
- Rebuild UI with React Native components
- Can reuse game logic
- Better performance
- More work (~4-6 weeks)
- Separate codebase to maintain

**Recommendation:** If you ever go native, use Capacitor.

## Recommended Tech Stack

### Minimal Viable Stack
```
Framework: React + Vite
Styling: Tailwind CSS
State: React Context or Zustand
Storage: LocalStorage (simple) or IndexedDB (robust)
Audio: HTML5 Audio API
Testing: Vitest
Deployment: Netlify or Vercel (free tier)
```

### Why This Stack?
- **Fast development:** Vite is incredibly fast
- **Familiar:** React is well-known, tons of resources
- **Flexible:** Easy to convert to React Native later
- **Free:** Entire stack can run on free tiers
- **Well-supported:** All popular tools with good docs

## Deployment Strategy

### Stage 1: Local Testing
```
npm run dev → Test on phone via local network
```

### Stage 2: Staging
```
Deploy to Netlify → Share with family for testing
bankgame-staging.netlify.app
```

### Stage 3: Production
```
Custom domain → "bankgame.com" or similar
SSL automatic (required for PWA)
```

### Cost:
- **Netlify Free Tier:** Perfect for this app
- **Domain:** ~$12/year
- **Total:** ~$1/month

## The Path Forward

### Week 1: Foundation
- Set up React + Vite project
- Basic game loop (no audio, no snark yet)
- Core mechanics working
- Test on your phone

### Week 2: Features
- Add all game rules
- Undo system
- End-of-game screen
- Local storage

### Week 3: Polish
- PWA setup (service worker, manifest)
- Responsive design
- Dark mode
- Share with family for testing

### Week 4: Personality
- Audio system
- Snark captions
- Animations
- Final polish

### Week 5+: Iteration
- Bug fixes based on family feedback
- Small improvements
- Maybe add companion viewer mode

## Migration Checklist (If Converting to iOS Native)

Only attempt this after web version is stable:

- [ ] Web app is bug-free and tested
- [ ] Family is actively using it
- [ ] Willing to pay $99/year
- [ ] Apple Developer account created
- [ ] Icons/assets prepared
- [ ] Privacy policy written (required)
- [ ] App Store listing prepared
- [ ] Test on actual iOS devices
- [ ] Submit for review
- [ ] Handle rejections (common first time)

**Estimated time:** 2-3 weeks after web version is complete

## Decision Time

### Quick Survey for You:

1. **Audience:** Just family? Or wider public?
   - Family → PWA perfect
   - Public → Maybe native later

2. **Update frequency:** How often will you fix bugs?
   - Often (first few weeks) → PWA better
   - Rarely → Native okay

3. **Budget:** Willing to pay $99/year?
   - No → PWA only
   - Yes → Native is an option

4. **Devices:** What does your family use?
   - Mix of iOS/Android → PWA covers both
   - iOS only → Still start with PWA

5. **Timeline:** Want it ready soon?
   - Yes → PWA (faster)
   - Flexible → Either works

**Recommendation for 99% of cases: Start with PWA.**

You can always convert to native later if needed. But you probably won't need to.

## Questions Before Building

Let's confirm the approach:

1. **Platform:** PWA first, native iOS only if needed later?
2. **Hosting:** Use free Netlify/Vercel, or prefer something else?
3. **Domain:** Do you have a domain, or should we use free subdomain?
4. **Testing Devices:** What phones do you and family have?

Once we answer these, we're ready to start building!
