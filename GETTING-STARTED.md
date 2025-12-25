# Getting Started with Claude Code

## 🎉 You're Ready to Build!

All the prep work is done. This guide will walk you through starting your first Claude Code session.

## 📁 What's in Your Project Now

```
/bank-game/
  ├── bank-game-prd.md              ← Full product requirements
  ├── CLAUDE.md                      ← Project-specific instructions
  ├── TESTING-STRATEGY.md            ← TDD workflow (NEW)
  ├── NON-ENGINEER-CONTEXT.md        ← Tells Claude you're not an engineer (NEW)
  ├── DESIGN-DIRECTION.md            ← Design guidelines & inspiration (NEW)
  ├── PLATFORM-STRATEGY.md           ← Why PWA, not native (NEW)
  ├── BEST-PRACTICES.md              ← Rules for Claude Code to follow (NEW)
  └── README.md                      ← This file
```

## 🚀 First Session: Foundation Setup

### Step 1: Open Terminal and Navigate to Project

```bash
cd ~/bank-game
```

### Step 2: Start Claude Code

```bash
claude
```

### Step 3: Your First Prompt

Copy and paste this:

```
Hi! I'm ready to build the Bank Game. Before we start:

1. Please read all the .md files in this directory to understand:
   - The project (bank-game-prd.md and CLAUDE.md)
   - That I'm not an engineer (NON-ENGINEER-CONTEXT.md)
   - Our testing approach (TESTING-STRATEGY.md)
   - Design direction (DESIGN-DIRECTION.md)
   - Platform strategy (PLATFORM-STRATEGY.md)
   - Best practices (BEST-PRACTICES.md)

2. After reading, please use Plan Mode to propose:
   - Tech stack setup (React + Vite + Tailwind)
   - Project structure
   - Initial dependencies
   - First milestone goals

Remember: We're doing TDD, so tests first for everything!

Ready when you are.
```

### Step 4: Review Claude's Plan

Claude will switch to **Plan Mode** and propose an approach.

**You should expect:**
- Clear explanation of what it will do
- Tech stack recommendations
- Project structure proposal
- First steps breakdown

**Before approving, ask yourself:**
- Does this make sense?
- Any questions about the approach?
- Comfortable with the tools mentioned?

### Step 5: Approve and Start Building

Once the plan looks good:
```
Looks great! Let's proceed with Milestone 1.
Remember to write tests first!
```

## 📋 Recommended Development Order

Claude Code should follow this sequence (from CLAUDE.md):

### Milestone 1: Project Setup (Day 1)
- Initialize React + Vite project
- Set up testing framework (Vitest)
- Configure Tailwind CSS
- Create basic project structure
- Add linting/formatting

### Milestone 2: Core Game Logic (Days 2-4)
- Dice entry system (with tests!)
- Bank total calculation
- Banking functionality
- Round end detection
- Game state management

### Milestone 3: UI Foundation (Days 5-6)
- Main game screen layout
- Player rows
- Dice input components
- Bank button
- Round information display

### Milestone 4: Game Flow (Days 7-9)
- Round transitions
- Game end detection
- Winner determination
- Score tracking
- Undo system

### Milestone 5: Persistence (Day 10)
- Local storage integration
- Game history (last 10 games)
- Save/load state
- Statistics tracking

### Milestone 6: Design & Polish (Days 11-13)
- Implement design system
- Dark mode
- Animations
- Responsive layout
- Accessibility

### Milestone 7: Audio & Snark (Days 14-15)
- Audio system integration
- Snark prompt library
- Caption display
- Settings for audio/snark levels

### Milestone 8: PWA Enhancement (Day 16)
- Service worker
- Web manifest
- Offline support
- Install prompts

### Milestone 9: Testing & Bug Fixes (Days 17-18)
- End-to-end testing
- Cross-browser testing
- Mobile device testing
- Bug fixes

### Milestone 10: Deployment (Day 19)
- Deploy to Netlify/Vercel
- Custom domain setup
- Share with family for feedback

## ⚙️ Important Settings & Features

### Plan Mode (Use Liberally!)
**Activate:** Press `Shift + Tab` twice

**Use when:**
- Starting a new feature
- Making architectural decisions
- Debugging complex issues
- Uncertain about approach

### Skills Available

Claude Code has access to these skills:
- **frontend-design**: For creating distinctive UI
- **docx, pdf, pptx, xlsx**: (Not needed for this project)

The **frontend-design** skill will help avoid generic AI aesthetics.

### Slash Commands

You can create custom commands in `.claude/commands/`

**Useful ones to create later:**
- `/test` - Run full test suite
- `/lint` - Check code quality
- `/build` - Build production version

## 🎯 Before Each Session Checklist

1. **[ ] Know what you want to build**
   - Pick ONE feature
   - Have clear acceptance criteria
   - Know what "done" looks like

2. **[ ] Start Claude Code in project directory**
   ```bash
   cd ~/bank-game
   claude
   ```

3. **[ ] Remind Claude of context**
   ```
   Continuing work on Bank Game.
   Today's goal: [specific feature]
   Remember: TDD approach, tests first!
   ```

4. **[ ] Use Plan Mode for new features**
   - Shift + Tab twice
   - Get plan
   - Approve before coding

## 🐛 When Things Go Wrong

### Tests Failing?
```
The tests are failing. Let's debug:

1. Show me the test output
2. Explain what's failing in simple terms
3. What do you think is wrong?
4. How should we fix it?

Don't just keep trying random fixes!
```

### Code Not Working?
```
This feature isn't working as expected.

What I see: [describe the problem]
What I expected: [describe expected behavior]

Please use Plan Mode to:
1. Diagnose the issue
2. Propose a fix
3. Explain why it will work
```

### Lost or Confused?
```
I'm feeling lost. Can you:

1. Summarize where we are in the project
2. List what's been completed
3. List what's remaining
4. Recommend next steps

Take your time explaining - I'm not an engineer!
```

## 💰 Managing Costs

Claude Code uses tokens. Here's how to be efficient:

**Good Practices:**
- ✅ Use Plan Mode (prevents costly mistakes)
- ✅ Break tasks into milestones
- ✅ Write tests first (saves debugging tokens)
- ✅ Ask questions early (before building wrong thing)
- ✅ Review plans before approving

**Expensive Mistakes:**
- ❌ Building without planning
- ❌ Fixing bugs without tests
- ❌ Going in circles
- ❌ Rebuilding the same thing multiple times
- ❌ Not reading the docs

**Estimated Token Budget:**
- Full MVP: ~200-300k tokens
- Cost: ~$20-30
- Timeline: 2-3 weeks of sessions

## 📱 Testing on Your Phone

### During Development

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Find your computer's IP:**
   ```bash
   ipconfig getifaddr en0  # Mac
   # Usually something like 192.168.1.x
   ```

3. **On your phone, visit:**
   ```
   http://192.168.1.x:5173
   ```

4. **Make sure:**
   - Phone on same WiFi
   - Firewall allows connections

### After Deployment

Just visit the URL on any device!

## 🎨 Design Decisions to Make

Before Claude Code starts building the UI, you should decide:

1. **Color Palette:**
   - Option A: Bold & Energetic (Recommended)
   - Option B: Modern & Sophisticated

2. **Dark Mode Default:**
   - Light mode first, dark mode second?
   - Dark mode first, light mode second?
   - Follow system preference?

3. **Animation Level:**
   - Full (celebrations, transitions, effects)
   - Medium (key moments only)
   - Minimal (just feedback)

4. **Snark Default:**
   - Off (user opts in)
   - Low (gentle, family-friendly)
   - Medium (default CARROT level)

5. **Player Avatars:**
   - Color circles
   - Emoji
   - Initials
   - Custom icons

**Tip:** You can decide these later, but thinking about them now helps Claude Code make consistent choices.

## 🤝 Working with Claude Code

### Communication Tips

**Be specific:**
❌ "Make it look better"
✅ "Make the Bank total larger and more prominent"

**Ask questions:**
❌ Assume Claude knows what you want
✅ "Before you implement, can you explain the approach?"

**Provide feedback:**
❌ "This is wrong"
✅ "This isn't quite what I meant. The bank button should..."

**Celebrate wins:**
✅ "That works great! Let's move to the next feature."

### Trust the Process

**TDD feels slower at first:**
- Writing tests seems like extra work
- You want to "just code it"
- **But it pays off:** Fewer bugs, faster overall

**Plan Mode seems excessive:**
- You want to jump in
- Planning feels like overthinking
- **But it saves tokens:** Prevents costly mistakes

**Small commits feel tedious:**
- Want to build everything at once
- Feels inefficient
- **But it's safer:** Easy to undo, clear progress

## 🎓 Learning Resources

**While Building:**
- Ask Claude Code to explain concepts
- Request links to documentation
- Ask "why" questions

**React Resources:**
- [react.dev](https://react.dev) - Official docs
- Search: "React [concept] tutorial"

**Vite Resources:**
- [vitejs.dev](https://vitejs.dev) - Official docs

**Tailwind CSS:**
- [tailwindcss.com](https://tailwindcss.com) - Official docs

## 🏁 Success Checklist

**Week 1:** ✅ Core game loop working
**Week 2:** ✅ All features implemented
**Week 3:** ✅ UI polished and responsive
**Week 4:** ✅ Deployed and family testing

## 🆘 Getting Help

**In Claude Code Session:**
```
I'm stuck and need help. Here's the situation:
[explain problem]

Can you help me figure this out?
```

**For This Guide:**
If anything is unclear, just ask! The whole point is to make this accessible to non-engineers.

## 🎯 You're Ready!

Everything is set up. The documentation is comprehensive. Claude Code has all the context it needs.

**Next step:** Open terminal and type `claude`

**First message:** Use the prompt from Step 3 above.

**Remember:**
- Take it one milestone at a time
- Tests first, always
- Ask questions when confused
- Use Plan Mode for big changes
- Commit frequently
- Celebrate progress!

Good luck! 🎲🎉

---

**Pro Tip:** Save this file as `README.md` so it's the first thing you see when you open the project.
