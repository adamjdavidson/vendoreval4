# Hybrid Development Workflow: SpecKit + Beads

This project uses a **hybrid approach** combining SpecKit for strategic planning and Beads for tactical execution.

## 🎯 Philosophy

**SpecKit** = What to build (strategic planning)
**Beads** = How to track it (tactical execution)

---

## 📋 Workflow Phases

### Phase 1: Planning (SpecKit)

When starting a **new feature** or **major enhancement**:

1. **Define requirements** with `/speckit.specify`
   ```
   /speckit.specify [description of what to build]
   ```

2. **Create technical plan** with `/speckit.plan`
   ```
   /speckit.plan [tech stack and architecture decisions]
   ```

3. **Generate task breakdown** with `/speckit.tasks`
   ```
   /speckit.tasks
   ```

**Output:** `specs/NNN-feature-name/` with spec.md, plan.md, tasks.md

**Purpose:** Create comprehensive documentation and master task list

---

### Phase 2: Execution (Beads)

When starting **actual implementation**:

1. **Find ready work:**
   ```bash
   bd ready --json
   ```

2. **Create focused tasks** from plan.md or tasks.md:
   ```bash
   bd create "Task description" -t TYPE -p PRIORITY -d "Details"
   ```

3. **Start work:**
   ```bash
   bd update TASK_ID --status in_progress
   ```

4. **Track discovered issues:**
   ```bash
   bd create "Bug or new task found" -t bug -p 1
   bd dep add ORIGINAL_TASK NEW_TASK --type discovered-from
   ```

5. **Complete tasks:**
   ```bash
   bd close TASK_ID --reason "What was done"
   ```

**Purpose:** Track day-to-day execution, find next actionable work, handle discoveries

---

## 🔄 Sync Points

### When to Import from SpecKit to Beads

**Option A: Import Entire Phase**
```bash
# If tasks.md has a specific phase you want to tackle
bd create -f specs/002-fullstack-platform/tasks.md
```

**Option B: Cherry-Pick Tasks**
- Read tasks.md
- Create Beads tasks for specific work you're starting
- Keep tasks.md as reference for "what's left"

**Recommendation:** Option B - create Beads tasks as you start work, not all at once

---

## 📊 Tracking Progress

### SpecKit (Reference)
- `specs/*/spec.md` - What the feature should do
- `specs/*/plan.md` - How it's architected
- `specs/*/tasks.md` - Master checklist of all tasks

### Beads (Active Work)
- `.beads/vendoreval3.db` - Current task status
- `bd ready` - What's next?
- `bd stats` - Overall progress
- `bd list --status in_progress` - What am I working on?

---

## 🎯 Decision Matrix: When to Use What?

| Scenario | Use SpecKit | Use Beads |
|----------|-------------|-----------|
| Starting a new feature | ✅ `/speckit.plan` | |
| Breaking down implementation | ✅ `/speckit.tasks` | |
| Finding next task to work on | | ✅ `bd ready` |
| Tracking task in progress | | ✅ `bd update` |
| Bug discovered during work | | ✅ `bd create` |
| Completing a task | | ✅ `bd close` |
| Understanding feature architecture | ✅ Read plan.md | |
| Checking overall progress | | ✅ `bd stats` |
| Deploying / finalizing feature | | ✅ Mark all tasks closed |

---

## 📝 Example: Today's CMS Work

### What We Did (Hybrid Approach)

**Planning (SpecKit):**
1. ✅ Already had plan.md with CMS architecture defined
2. ✅ tasks.md existed as reference (but didn't include CMS)

**Execution (Beads):**
1. ✅ Created 8 focused CMS tasks in Beads
2. ✅ Used `bd ready` to track what's next
3. ✅ Closed tasks as we completed them
4. ✅ Delivered working CMS in 2 hours

**Result:** Structured planning + flexible execution = success!

---

## 🚀 Current Status: Option 2 (Enhance CMS)

### Reference (SpecKit)
- `specs/002-fullstack-platform/plan.md` - CMS architecture (lines 421-681)
- `specs/002-fullstack-platform/tasks.md` - Full platform tasks (200 uncompleted)

### Active Work (Beads)
Created 4 new tasks for CMS enhancements:

1. **vendoreval3-550** (P0): Add ANTHROPIC_API_KEY for Edge Function
2. **vendoreval3-551** (P1): Build Docusaurus plugin to render pages from DB
3. **vendoreval3-552** (P1): Implement admin authentication
4. **vendoreval3-553** (P2): Create production deployment guide

**Next:** `bd ready` to start work!

---

## 🧹 Maintenance

### Periodic Cleanup (Weekly/Monthly)

```bash
# Close stale issues
bd list --status open --json | jq '.[] | select(.created_at < "old date") | .id'

# Review blocked work
bd blocked

# Check overall health
bd stats
```

### Regenerate SpecKit Tasks (When Needed)

Only regenerate tasks.md when:
- Major architecture changes
- New user stories added
- Need fresh perspective on work breakdown

**Warning:** Regenerating loses existing checkmarks in tasks.md

---

## 💡 Best Practices

1. **Start with SpecKit** for planning any substantial feature
2. **Execute with Beads** for day-to-day work
3. **Reference plan.md** when making technical decisions
4. **Track discovered work** in Beads (don't let it slip)
5. **Commit frequently** after completing Beads tasks
6. **Keep tasks.md** as master backlog reference
7. **Use `bd ready`** every morning to orient yourself

---

**Last Updated:** October 21, 2025
**Current Feature:** 002-fullstack-platform
**Active Tasks:** 4 CMS enhancement tasks ready
