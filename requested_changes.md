# Requested Changes for AI Vendor Evaluation Tool

## Change 1: Add Emojis to Category Sections

Each of the 6 evaluation criteria sections needs an appropriate emoji added to its heading:

- **SEE** (Can you see how this works?) → Add 👁️ emoji
- **CHANGE** (Can you modify or control it?) → Add ✏️ emoji  
- **TEACH** (Does it help you understand why it matters?) → Add 📚 emoji
- **USE** (Is it genuinely useful or theater?) → Add ⚡ emoji
- **ADAPT** (Does it scale across organizational levels?) → Add 📈 emoji
- **LEAVE** (Can you take your work elsewhere?) → Add 🚪 emoji

**Implementation:** Add these emojis to the section headings wherever SEE, CHANGE, TEACH, USE, ADAPT, and LEAVE appear as criteria headers throughout the evaluation form.

---

## Change 2: Restore Summary/Grading Section at Bottom

There used to be a summary section that grades the tool based on all evaluation criteria. This section was moved from the top to the bottom but has now disappeared entirely.

**Requirements:**
- Place this section at the **bottom** of the evaluation (after all questions are answered)
- The section should provide an overall assessment across all 6 criteria (SEE, CHANGE, TEACH, USE, ADAPT, LEAVE)
- Include brief explanations for each criterion's assessment
- Add a "Bottom Line" summary statement that synthesizes the overall evaluation
- Style it prominently (consider dark background box similar to the specification's "Bottom Line Section")

**Reference from specs:** 
```
#### Evaluation across criteria:
- **SEE (Transparency):** [Assessment] - [Brief explanation]
- **CHANGE (Control):** [Assessment] - [Brief explanation]
- **TEACH (Learning):** [Assessment] - [Brief explanation]
- **USE (Anti-Theater):** [Assessment] - [Brief explanation]
- **ADAPT (Flexibility):** [Assessment] - [Brief explanation]
- **LEAVE (Portability):** [Assessment] - [Brief explanation]

#### Summary Statement:
- "💡 Bottom line: [One-sentence synthesis]"
```

---

## Change 3: Add Info Icons to Questions

**Requirement:** Add a small info icon (ℹ️ or similar) next to each question that users can click to open an overlay explaining why that question matters.

**Implementation Details:**

1. **Visual Design:**
   - Small, unobtrusive icon placed immediately after the question text
   - Icon should be clickable/tappable
   - Use a standard info icon (ℹ️) or a circular "i" icon

2. **Overlay Behavior:**
   - Click/tap opens a modal or popover overlay
   - Overlay contains explanation of why the question matters
   - Overlay should be easy to close (X button, click outside, ESC key)
   - Overlay should not interfere with form completion

3. **Content Structure:**
   - Each overlay needs a brief explanation (2-4 sentences) about:
     - Why this question is important
     - What it reveals about the vendor
     - How it connects to avoiding AI theater or vendor lock-in

4. **Example Implementation:**
   ```
   Question: "Can you view the actual prompts?"  [ℹ️]
   
   [When clicked, shows overlay:]
   "Why this matters: Prompt visibility is fundamental to transparency. 
   If you can't see the prompts, you can't understand what the system is 
   actually doing or troubleshoot issues. Hidden prompts often indicate 
   vendor lock-in and make it impossible to replicate functionality elsewhere."
   ```

5. **Apply to:**
   - All primary questions in each component section
   - All sub-questions where the reasoning isn't obvious
   - Reality Check section questions (especially important here)

**Note:** The explanatory text for each question should be derived from the evaluation framework and grading criteria already documented in the project knowledge.

---

## Implementation Approach

1. Review existing HTML/CSS structure in both spec kit and prototype files
2. Add emoji characters to criterion headers consistently throughout
3. Rebuild/restore the summary section at the bottom of the form
4. Create reusable info icon component with overlay functionality
5. Add info icons to all relevant questions
6. Write explanatory text for each question's overlay (can reference existing framework documentation)
7. Test overlay functionality (open/close, mobile responsiveness)

---

## Additional Context

The user mentioned: "Ask these questions when you're talking to a sales rep."

This suggests the questions (and their info overlays) should be framed to help executives understand what to ask vendors during sales conversations, not just for post-purchase evaluation.

Consider adding this context to the info overlays where relevant - explaining how to use these questions proactively during vendor selection.
