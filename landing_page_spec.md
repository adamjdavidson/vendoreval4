# Landing Page Specification

## Overview
The landing page is the entry point to the AI Vendor Evaluation Framework. It presents users with two clear paths: learn about the framework or evaluate a vendor.

## Layout Structure

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────────┐
│                    [Header/Nav]                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│                   [Hero Section]                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│        [Card: Learn]         [Card: Evaluate]      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│              [Pre-Analyzed Vendors]                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────┐
│   [Header/Nav]  │
├─────────────────┤
│  [Hero Section] │
├─────────────────┤
│  [Card: Learn]  │
├─────────────────┤
│ [Card: Evaluate]│
├─────────────────┤
│[Pre-Analyzed]   │
└─────────────────┘
```

## Component Specifications

### Header/Navigation (Optional for MVP)

**Layout:**
- Fixed width container: `max-width: 1200px`, centered
- Height: `64px`
- Background: `transparent` or `white` with subtle border

**Content:**
```
[Logo/Wordmark]                    [Framework] [Evaluate] [Vendors]
```

**Styling:**
- Logo: Text "AI Vendor Framework" or icon + text
- Nav links: `font-size: 16px`, `font-weight: 500`, `color: #64748B`
- Hover: `color: #0F172A`, smooth transition

**Mobile:**
- Hamburger menu icon
- Drawer navigation from right

---

### Hero Section

**Layout:**
- Background: `linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)`
- Padding: `80px 24px` (desktop), `60px 20px` (mobile)
- Text alignment: `center`

**Content:**

**Heading:**
```
The AI Vendor Framework
```
- Font: `font-size: 48px` (desktop), `32px` (mobile)
- Font weight: `700` (bold)
- Color: `#0F172A`
- Line height: `1.2`
- Letter spacing: `-0.02em`

**Subheading:**
```
Stop buying black boxes. Evaluate AI tools on what actually matters: 
transparency, control, and capability building.
```
- Font: `font-size: 20px` (desktop), `16px` (mobile)
- Font weight: `400` (regular)
- Color: `#475569`
- Line height: `1.5`
- Max width: `700px`, centered
- Margin top: `16px`

---

### Two-Card Section

**Container:**
- Max width: `1000px`, centered
- Padding: `60px 24px` (desktop), `40px 20px` (mobile)
- Display: `flex`, `gap: 32px`
- Mobile: Stack vertically (`flex-direction: column`)

**Individual Card Specifications:**

#### Card 1: Learn Framework

**Layout:**
- Width: `calc(50% - 16px)` (desktop), `100%` (mobile)
- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border radius: `12px`
- Padding: `32px`
- Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`, smooth transition
- Cursor: `pointer`

**Content Structure:**
```
[Icon]

[Title]

[Description]

[Button]
```

**Icon:**
- Emoji or SVG: 📚 (books/documentation)
- Font size: `48px`
- Margin bottom: `16px`
- Alternative: Use a simple icon from lucide-react like `BookOpen`

**Title:**
```
Learn Framework
```
- Font: `font-size: 24px`, `font-weight: 600`
- Color: `#0F172A`
- Margin bottom: `12px`

**Description:**
```
Understand why AI procurement is different and how to 
think about vendor evaluation
```
- Font: `font-size: 16px`, `font-weight: 400`
- Color: `#64748B`
- Line height: `1.5`
- Margin bottom: `24px`

**Button:**
```
[Explore Framework]
```
- Display: `inline-block`
- Padding: `12px 24px`
- Background: `#F1F5F9`
- Color: `#334155`
- Border: `1px solid #E2E8F0`
- Border radius: `8px`
- Font: `font-size: 16px`, `font-weight: 500`
- Hover: `background: #E2E8F0`
- Transition: `all 0.2s ease`

---

#### Card 2: Evaluate a Vendor

**Layout:** Same as Card 1

**Content Structure:** Same as Card 1

**Icon:**
- Emoji or SVG: ✓ (checkmark)
- Alternative: Use lucide-react `CheckCircle2`

**Title:**
```
Evaluate a Vendor
```

**Description:**
```
Use our 20-question framework to evaluate any AI vendor 
in 10-15 minutes
```

**Button:**
```
[Start Evaluation]
```
- Same styling as Card 1 button
- **Or make this primary**: `background: #3B82F6`, `color: white`
  - This would emphasize this as the main action

---

### Pre-Analyzed Vendors Section

**Container:**
- Max width: `1000px`, centered
- Padding: `40px 24px 80px` (desktop), `30px 20px 60px` (mobile)
- Text alignment: `center`

**Heading:**
```
Or browse pre-analyzed vendors ↓
```
- Font: `font-size: 18px`, `font-weight: 500`
- Color: `#64748B`
- Margin bottom: `24px`

**Vendor List (Initially just Glean):**

**Layout:**
- Display: `flex`, `gap: 16px`, `justify-content: center`
- Mobile: Stack vertically or horizontal scroll

**Vendor Card (Glean):**
```
┌──────────────────────┐
│      [Logo/Icon]     │
│                      │
│        Glean         │
│                      │
│    [View Analysis]   │
└──────────────────────┘
```

- Width: `200px`
- Background: `#FFFFFF`
- Border: `1px solid #E2E8F0`
- Border radius: `8px`
- Padding: `24px`
- Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`, `border-color: #3B82F6`
- Cursor: `pointer`

**Logo/Icon:**
- Size: `48px x 48px`
- Center aligned
- Margin bottom: `12px`
- Can be company logo or placeholder icon

**Vendor Name:**
- Font: `font-size: 18px`, `font-weight: 600`
- Color: `#0F172A`
- Margin bottom: `8px`

**Link:**
```
View Analysis →
```
- Font: `font-size: 14px`, `font-weight: 500`
- Color: `#3B82F6`
- Hover: `color: #2563EB`

---

## Color Palette

### Primary Colors
```css
--primary-50: #F0F9FF;
--primary-100: #E0F2FE;
--primary-500: #3B82F6;  /* Primary action */
--primary-600: #2563EB;  /* Primary hover */
```

### Neutral Colors (Slate)
```css
--slate-50: #F8FAFC;
--slate-100: #F1F5F9;
--slate-200: #E2E8F0;
--slate-400: #94A3B8;
--slate-500: #64748B;  /* Secondary text */
--slate-700: #334155;
--slate-900: #0F172A;  /* Primary text */
```

### Background Gradients
```css
--hero-gradient: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", 
             "Helvetica Neue", Arial, sans-serif;
```

Or use a web font like:
```css
font-family: "Inter", system-ui, sans-serif;
```

### Size Scale
- Heading 1: `48px` / `32px` (mobile)
- Heading 2: `24px` / `20px` (mobile)
- Body Large: `20px` / `16px` (mobile)
- Body: `16px` / `14px` (mobile)
- Small: `14px` / `12px` (mobile)

### Weight Scale
- Regular: `400`
- Medium: `500`
- Semibold: `600`
- Bold: `700`

---

## Spacing System

Use 4px base unit:
- `4px` (0.25rem)
- `8px` (0.5rem)
- `12px` (0.75rem)
- `16px` (1rem)
- `24px` (1.5rem)
- `32px` (2rem)
- `48px` (3rem)
- `64px` (4rem)
- `80px` (5rem)

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Stack cards vertically */
  /* Reduce heading sizes */
  /* Adjust padding */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Possibly keep cards side-by-side */
  /* Adjust container widths */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layout */
  /* Max widths enforced */
}
```

---

## Interaction States

### Cards
- **Default**: Border `#E2E8F0`, shadow subtle
- **Hover**: Border unchanged, shadow elevated, scale `1.01`
- **Active**: Scale `0.99`
- **Transition**: `all 0.2s ease`

### Buttons
- **Default**: Defined per button type above
- **Hover**: Background darkens, cursor pointer
- **Active**: Scale `0.98`
- **Focus**: Outline `2px solid #3B82F6`, offset `2px`

### Links
- **Default**: Color `#3B82F6`
- **Hover**: Color `#2563EB`, underline
- **Visited**: Same as default (don't differentiate)

---

## Accessibility Requirements

1. **Color Contrast**: All text meets WCAG AA (4.5:1 for body, 3:1 for large)
2. **Focus States**: Visible keyboard focus indicators
3. **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
4. **Alt Text**: All decorative images have empty alt or proper descriptions
5. **ARIA Labels**: Interactive elements have descriptive labels
6. **Keyboard Navigation**: All interactive elements reachable via Tab

---

## Animation Guidelines

### Subtle Animations Only
- Hover transitions: `0.2s ease`
- Card hover scale: `transform: scale(1.01)`
- Box shadow transitions on hover
- No auto-playing animations
- Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Technical Implementation Notes

### React Component Structure
```
<LandingPage>
  <Header /> {/* Optional */}
  <HeroSection />
  <TwoCardSection>
    <Card type="learn" />
    <Card type="evaluate" />
  </TwoCardSection>
  <VendorSection>
    <VendorCard vendor="glean" />
  </VendorSection>
</LandingPage>
```

### Routing
- `/` → Landing page
- `/framework` → Documentation site
- `/evaluate` → Evaluation tool
- `/vendors` → Vendor analyses list
- `/vendors/glean` → Specific vendor

### Click Handlers
- Learn card → Navigate to `/framework`
- Evaluate card → Navigate to `/evaluate`
- Glean card → Navigate to `/vendors/glean`

---

## Example Implementation (Simplified React)

```jsx
export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="hero-gradient py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            The AI Vendor Framework
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stop buying black boxes. Evaluate AI tools on what actually 
            matters: transparency, control, and capability building.
          </p>
        </div>
      </section>

      {/* Two Cards */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            icon="📚"
            title="Learn Framework"
            description="Understand why AI procurement is different..."
            buttonText="Explore Framework"
            onClick={() => navigate('/framework')}
          />
          <Card 
            icon="✓"
            title="Evaluate a Vendor"
            description="Use our 20-question framework..."
            buttonText="Start Evaluation"
            onClick={() => navigate('/evaluate')}
            primary
          />
        </div>
      </section>

      {/* Vendors */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-lg font-medium text-slate-600 mb-6">
          Or browse pre-analyzed vendors ↓
        </h2>
        <div className="flex justify-center gap-4">
          <VendorCard 
            name="Glean"
            onClick={() => navigate('/vendors/glean')}
          />
        </div>
      </section>
    </div>
  );
}
```

---

## Design Assets Needed

1. **Logo/Wordmark**: "AI Vendor Framework" text or icon
2. **Icons**: Either emoji or lucide-react icons
3. **Vendor Logos**: Glean logo (and future vendors)
4. **Favicon**: 32x32 icon for browser tab

---

## Open Questions

1. **Header/Nav**: Include in MVP or just have contextual back buttons?
2. **Branding**: Associated with Feedforward or standalone identity?
3. **Primary Button Color**: Blue (#3B82F6) or different color to match category colors from tool?
4. **Icons**: Use emoji (📚, ✓) or more professional icons from lucide-react?

**Recommendation**: 
- Skip header/nav for MVP (cleaner, simpler)
- Use lucide-react icons (more professional)
- Blue primary action is good
- Standalone branding (can add Feedforward mention in footer)