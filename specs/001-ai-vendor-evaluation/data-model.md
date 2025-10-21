# Data Model: AI Vendor Evaluation Framework

**Feature**: 001-ai-vendor-evaluation
**Date**: 2025-10-19
**Version**: 1.0.0

This document defines all data entities, their relationships, validation rules, and state transitions for the VendorEval3 application.

---

## Overview

The VendorEval3 data model is **client-side only** with no backend database. All data persists in browser LocalStorage using JSON serialization. The model supports:

- Creating and managing vendor evaluations
- Storing answers to 20 framework questions across 6 categories
- Calculating category and overall grades based on answer patterns
- Supporting dual voice mode content (Direct & Suitable for Work)
- Pre-analyzed vendor examples (Glean)

---

## Entity Relationship Diagram

```
┌─────────────────┐
│   Evaluation    │
│  (Root Entity)  │
└────────┬────────┘
         │
         │ has many
         │
    ┌────▼────┐
    │ Answer  │
    └────┬────┘
         │
         │ references
         │
    ┌────▼────────┐
    │  Question   │
    └────┬────────┘
         │
         │ belongs to
         │
    ┌────▼────────┐
    │  Category   │
    └─────────────┘
```

---

## Entity Definitions

### 1. Evaluation

**Description**: A complete or in-progress vendor assessment containing vendor name, answers to 20 questions, and calculated grades.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | `string` | Yes | UUID v4 format | Unique evaluation identifier |
| `vendorName` | `string` | Yes | 1-100 chars, non-empty | Name of vendor being evaluated |
| `createdAt` | `string` | Yes | ISO 8601 datetime | When evaluation was created |
| `updatedAt` | `string` | Yes | ISO 8601 datetime | Last modification time |
| `answers` | `Answer[]` | Yes | Array length = 20 | Array of answers to all questions |
| `categoryGrades` | `Record<CategoryKey, CategoryGrade>` | Yes | All 6 categories present | Calculated grades per category |
| `overallGrade` | `CategoryGrade` | Yes | Valid grade value | Overall vendor assessment |

**State Transitions**:
- **Draft**: When created, answers array may contain nulls
- **In Progress**: User is actively answering questions
- **Complete**: All 20 answers are non-null
- **Archived**: User has completed and moved to another evaluation

**Validation Rules**:
1. `vendorName` must be unique per user (prevent duplicate evaluations)
2. `answers` array must always have exactly 20 elements (one per question)
3. `updatedAt` must be >= `createdAt`
4. `categoryGrades` must contain all 6 category keys
5. `overallGrade` is calculated, not user-input

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "vendorName": "Glean",
  "createdAt": "2025-10-19T10:30:00Z",
  "updatedAt": "2025-10-19T11:45:00Z",
  "answers": [
    {
      "questionId": "see-1",
      "value": "yes",
      "note": "They showed us all system prompts in demo",
      "timestamp": "2025-10-19T10:35:00Z"
    },
    // ... 19 more answers
  ],
  "categoryGrades": {
    "see": "green",
    "change": "yellow",
    "use": "green",
    "adapt": "yellow",
    "leave": "red",
    "learn": "grey"
  },
  "overallGrade": "yellow"
}
```

---

### 2. Answer

**Description**: A user's response to a single evaluation question, including value, optional note, and timestamp.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `questionId` | `string` | Yes | Must exist in questions data | Reference to question being answered |
| `value` | `AnswerValue` | No | Enum: yes, no, not-enough-info, null | User's answer (null = not answered yet) |
| `note` | `string` | No | Max 5000 chars | Optional context or evidence |
| `timestamp` | `string` | Yes | ISO 8601 datetime | When answer was last updated |

**Validation Rules**:
1. `questionId` must reference a valid question from questions.ts
2. `value` must be one of: "yes", "no", "not-enough-info", or null
3. `note` length must not exceed 5000 characters
4. `timestamp` must be valid ISO 8601 format

**Business Rules**:
- Answering "not-enough-info" for majority of questions in a category → grey grade
- Answering "no" to ANY critical question → category gets red flag
- Notes are optional but recommended for "no" answers (provide evidence)

**Example**:
```json
{
  "questionId": "see-2",
  "value": "no",
  "note": "Vendor refused to disclose which models they use, citing 'competitive advantage'",
  "timestamp": "2025-10-19T10:40:15Z"
}
```

---

### 3. Question

**Description**: One of 20 framework questions used to evaluate vendors. Questions are static data (not user-modifiable).

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | `string` | Yes | Format: `{category}-{num}` | Unique question identifier |
| `categoryKey` | `CategoryKey` | Yes | Enum: see, change, use, adapt, leave, learn | Which category this belongs to |
| `text` | `string` | Yes | Non-empty | Question text shown to user |
| `isCritical` | `boolean` | Yes | - | If true, "no" answer triggers red flag |
| `explanations` | `object` | Yes | Contains direct & suitableForWork | Help text in both voice modes |

**Sub-structure: explanations**:

| Field | Type | Description |
|-------|------|-------------|
| `explanations.direct` | `QuestionExplanation` | Candid, direct tone |
| `explanations.suitableForWork` | `QuestionExplanation` | Professional, formal tone |

**Sub-structure: QuestionExplanation**:

| Field | Type | Description |
|-------|------|-------------|
| `whyMatters` | `string` | Explains importance of this question |
| `goodLooksLike` | `string` | Example of positive vendor behavior |
| `badLooksLike` | `string` | Red flags or concerning responses |
| `whatToAsk` | `string` | Specific questions to ask vendor |

**Validation Rules**:
1. `id` must be unique across all questions
2. `id` must follow format: `{categoryKey}-{1-based index}`
3. `categoryKey` must be valid CategoryKey enum value
4. Both `explanations.direct` and `explanations.suitableForWork` must be complete
5. All explanation strings must be non-empty

**Critical Questions** (isCritical: true):
- Questions that reveal deal-breakers (hidden prompts, no data export, vendor lock-in)
- A "no" answer to ANY critical question causes the category to show red flag
- Examples: "Can you see the system prompts?", "Can you export all data?"

**Example**:
```json
{
  "id": "see-1",
  "categoryKey": "see",
  "text": "Can you see the system prompts?",
  "isCritical": true,
  "explanations": {
    "direct": {
      "whyMatters": "Because vendors hide their prompts for a reason. If they won't show you how it works, they're either incompetent or hiding something worse.",
      "goodLooksLike": "They show you everything: prompts, models, routing logic. No secrets.",
      "badLooksLike": "They say 'proprietary' and change the subject. That's a red flag.",
      "whatToAsk": "Can I see your system prompts? What models are you using? How do you route requests?"
    },
    "suitableForWork": {
      "whyMatters": "Transparency enables informed decision-making and risk assessment throughout the vendor relationship.",
      "goodLooksLike": "Vendor provides comprehensive documentation of system architecture including prompt engineering and model selection.",
      "badLooksLike": "Vendor cites intellectual property concerns without offering alternative disclosure mechanisms.",
      "whatToAsk": "What level of system visibility can you provide for evaluation purposes?"
    }
  }
}
```

---

### 4. Category

**Description**: One of 6 evaluation dimensions used to group questions and calculate scores.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `key` | `CategoryKey` | Yes | Enum: see, change, use, adapt, leave, learn | Unique category identifier |
| `title` | `string` | Yes | Non-empty | Display name |
| `subtitle` | `string` | Yes | Non-empty | One-sentence description |
| `color` | `string` | Yes | Valid hex color | Default color for category box |
| `questionIds` | `string[]` | Yes | Array length 3-4 | Question IDs belonging to this category |

**Category Keys & Meanings**:

| Key | Title | Description |
|-----|-------|-------------|
| `see` | SEE | Can you see how it works? (transparency) |
| `change` | CHANGE | Can you control it? (configurability) |
| `use` | USE | Is it actually useful? (output quality) |
| `adapt` | ADAPT | Can it evolve? (future-proofing) |
| `leave` | LEAVE | Can you exit? (no vendor lock-in) |
| `learn` | LEARN | Does it build capability? (skills transfer) |

**Validation Rules**:
1. `key` must be unique across all categories
2. Each category must have 3-4 questions (balanced evaluation)
3. `color` must be valid hex code (#RRGGBB format)
4. All `questionIds` must reference valid questions

**Example**:
```json
{
  "key": "see",
  "title": "SEE",
  "subtitle": "Can you see how it works?",
  "color": "#DFF7FF",
  "questionIds": ["see-1", "see-2", "see-3"]
}
```

---

### 5. VoiceMode

**Description**: Global user preference for content tone throughout the application.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `current` | `VoiceMode` | Yes | Enum: direct, suitable-for-work | Active voice mode |

**Values**:
- `direct`: Candid, cuts through BS, names what vendors hide
- `suitable-for-work`: Professional, politically safe, formal tone

**Storage**:
- Stored separately from evaluations in LocalStorage
- Key: `ai-vendor-voice-mode`
- Persists across sessions

**Default**: `direct` (users can toggle to suitable-for-work)

**Example**:
```json
"direct"
```

---

### 6. PreAnalyzedVendor

**Description**: Complete vendor evaluation created by framework authors, used as reference example.

**Fields**:

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `vendorName` | `string` | Yes | Non-empty | Vendor name |
| `logoUrl` | `string` | No | Valid URL or relative path | Vendor logo image |
| `completedAt` | `string` | Yes | ISO 8601 datetime | When analysis was completed |
| `evaluation` | `Evaluation` | Yes | Valid evaluation object | Complete evaluation data |
| `summary` | `string` | Yes | Non-empty | Executive summary (3-5 sentences) |
| `redFlags` | `string[]` | Yes | Array of strings | Critical concerns found |

**Validation Rules**:
1. `evaluation` must be a complete Evaluation (all 20 questions answered)
2. `summary` should be 3-5 sentences (guideline, not enforced)
3. `redFlags` array can be empty (if no red flags found)

**Example**:
```json
{
  "vendorName": "Glean",
  "logoUrl": "/vendors/glean-logo.png",
  "completedAt": "2025-10-15T00:00:00Z",
  "evaluation": {
    "id": "pre-analyzed-glean",
    "vendorName": "Glean",
    "createdAt": "2025-10-15T00:00:00Z",
    "updatedAt": "2025-10-15T00:00:00Z",
    "answers": [ /* ... 20 complete answers with evidence ... */ ],
    "categoryGrades": {
      "see": "yellow",
      "change": "yellow",
      "use": "green",
      "adapt": "green",
      "leave": "red",
      "learn": "yellow"
    },
    "overallGrade": "yellow"
  },
  "summary": "Glean offers strong search capabilities and solid output quality. However, vendor lock-in concerns are significant - no data export and proprietary model routing. Configuration options are limited. Good for organizations prioritizing search quality over flexibility.",
  "redFlags": [
    "No data export capability - all search history locked in Glean",
    "Proprietary model selection - cannot choose or change models",
    "Limited prompt visibility - system prompts are not disclosed"
  ]
}
```

---

## Derived Types

### CategoryGrade

**Description**: Color-coded assessment of a category based on answer patterns.

**Type**: `'green' | 'yellow' | 'red' | 'grey' | null`

**Meaning**:
- `green`: Strong performance, no concerns (mostly "yes" answers)
- `yellow`: Acceptable with caveats (mix of yes/no, some concerns)
- `red`: Critical issues found (any critical question answered "no")
- `grey`: Insufficient information (majority "not-enough-info" answers)
- `null`: No answers yet (evaluation just started)

**Calculation Logic**:
1. If ANY critical question = "no" → **red**
2. If majority of answers = "not-enough-info" → **grey**
3. If majority of answers = "yes" → **green**
4. If mix of yes/no with no critical failures → **yellow**
5. If no answers yet → **null**

---

## LocalStorage Schema

### Primary Storage Key: `ai-vendor-evaluations`

**Structure**:
```typescript
{
  version: "1.0.0",
  currentEvaluationId: string | null,
  evaluations: Evaluation[]
}
```

**Fields**:
- `version`: Schema version for future migrations
- `currentEvaluationId`: ID of evaluation user is actively working on (null if none)
- `evaluations`: Array of all saved evaluations

**Constraints**:
- Maximum ~20 evaluations (5-10MB LocalStorage limit)
- Each evaluation ~250KB (with notes)
- Total storage: ~5MB

### Secondary Storage Key: `ai-vendor-voice-mode`

**Structure**:
```typescript
"direct" | "suitable-for-work"
```

**Purpose**: Persist user's voice mode preference across sessions

---

## Data Validation

### Client-Side Validation

All validation happens client-side (no backend). Use TypeScript types + runtime validation.

**Validation Library**: Zod (recommended) or manual validation

**Example Validation**:
```typescript
import { z } from 'zod';

const AnswerSchema = z.object({
  questionId: z.string().regex(/^(see|change|use|adapt|leave|learn)-\d+$/),
  value: z.enum(['yes', 'no', 'not-enough-info']).nullable(),
  note: z.string().max(5000).optional(),
  timestamp: z.string().datetime(),
});

const EvaluationSchema = z.object({
  id: z.string().uuid(),
  vendorName: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  answers: z.array(AnswerSchema).length(20),
  categoryGrades: z.record(z.enum(['green', 'yellow', 'red', 'grey']).nullable()),
  overallGrade: z.enum(['green', 'yellow', 'red', 'grey']).nullable(),
});
```

---

## Data Migrations

### Version 1.0.0 → Future Versions

When schema changes are needed:

1. Increment version number in storage
2. Create migration function
3. Run migration on app load
4. Preserve old data as backup

**Example Migration**:
```typescript
function migrateStorageSchema(oldVersion: string): StorageSchema {
  const rawData = localStorage.getItem('ai-vendor-evaluations');
  const data = JSON.parse(rawData || '{}');

  if (oldVersion === '1.0.0' && data.version === '1.0.0') {
    return data; // No migration needed
  }

  // Example: Version 2.0.0 adds new field
  if (data.version === '1.0.0') {
    data.version = '2.0.0';
    data.evaluations.forEach(eval => {
      eval.tags = []; // Add new field with default value
    });
  }

  return data;
}
```

---

## State Management

### React Context for Global State

**VoiceMode**: Managed via Context API
```typescript
const VoiceModeContext = createContext<{
  mode: VoiceMode;
  setMode: (mode: VoiceMode) => void;
}>(null!);
```

**Current Evaluation**: Managed via Context API
```typescript
const EvaluationContext = createContext<{
  evaluation: Evaluation | null;
  updateAnswer: (questionId: string, value: AnswerValue, note?: string) => void;
  saveEvaluation: () => Promise<void>;
  loadEvaluation: (id: string) => void;
  createEvaluation: (vendorName: string) => void;
}>(null!);
```

---

## Performance Considerations

### LocalStorage Read/Write Patterns

**Optimization**: Debounce writes to avoid excessive localStorage operations

```typescript
// Good: Debounced save (500ms idle)
const debouncedSave = debounce((evaluation: Evaluation) => {
  localStorage.setItem('ai-vendor-evaluations', JSON.stringify(evaluation));
}, 500);
```

### Memory Usage

- **In-memory**: Current evaluation only (~250KB)
- **LocalStorage**: All evaluations (~5MB max)
- **No memory leaks**: Clean up listeners on unmount

---

## Security Considerations

### Data Privacy

- **No cloud storage**: Data never leaves browser
- **No analytics**: No tracking of user evaluations
- **No telemetry**: No error reporting with user data

### Input Sanitization

- **React auto-escapes**: XSS protection by default
- **Note validation**: Max length enforced to prevent storage bloat
- **No eval()**: Never use `eval()` or `Function()` on user input

---

## Testing Data

### Mock Data for Development

**Location**: `src/data/__mocks__/`

**Example Mock Evaluation**:
```typescript
export const mockEvaluation: Evaluation = {
  id: 'mock-001',
  vendorName: 'Example Vendor',
  createdAt: '2025-10-19T10:00:00Z',
  updatedAt: '2025-10-19T11:00:00Z',
  answers: [/* ... 20 mock answers ... */],
  categoryGrades: {
    see: 'green',
    change: 'yellow',
    use: 'green',
    adapt: 'yellow',
    leave: 'red',
    learn: 'grey',
  },
  overallGrade: 'yellow',
};
```

---

## Next Steps

1. ✅ Data model complete (this document)
2. Create TypeScript interfaces in `contracts/types.ts`
3. Implement data validation with Zod
4. Create LocalStorage utilities in `src/utils/storage.ts`
5. Implement scoring logic in `src/utils/scoring.ts`

---

**Data Model Version**: 1.0.0
**Last Updated**: 2025-10-19
**Status**: Complete - Ready for implementation
