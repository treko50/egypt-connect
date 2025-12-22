# 🎨 Egypt Connect - Complete Figma Design Guide

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [File Structure](#file-structure)
3. [Creating Design Tokens](#creating-design-tokens)
4. [Component Building](#component-building)
5. [Page Layouts](#page-layouts)
6. [Prototyping](#prototyping)
7. [Export & Handoff](#export--handoff)

---

## 🚀 Getting Started

### Prerequisites
- Figma account (free or professional)
- Understanding of Auto Layout
- Basic knowledge of components and variants

### Initial Setup (15 minutes)

1. **Create New File**
   - Go to Figma → New Design File
   - Name: "Egypt Connect - Design System"
   - Set canvas background to `#F9FAFB`

2. **Install Plugins**
   ```
   - Iconify (for icons)
   - Contrast (accessibility)
   - Content Reel (placeholder content)
   - Unsplash (images)
   - Auto Layout (if not built-in)
   ```

3. **Create Pages**
   - 🎨 Foundation
   - 🧩 Components
   - 📄 Templates
   - 🔄 Prototypes
   - 📱 Mobile
   - 🗂️ Archive

---

## 📁 File Structure

```
Egypt Connect Design System
│
├── 🎨 Foundation
│   ├── Color Palette
│   ├── Typography
│   ├── Spacing & Grid
│   ├── Icons Library
│   └── Effects (Shadows)
│
├── 🧩 Components
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Navigation
│   ├── Modals
│   ├── Forms
│   └── Data Display
│
├── 📄 Templates
│   ├── Landing Page
│   ├── Auth Pages
│   ├── Dashboard
│   ├── Calendar
│   └── Profile
│
├── 🔄 Prototypes
│   └── User Flows
│
└── 📱 Mobile
    └── Responsive Variants
```

---

## 🎨 Creating Design Tokens

### Step 1: Color Styles

**Primary Colors**
1. Create rectangle (100×100px)
2. Fill with `#0788A8`
3. Select → Right click → "Create Style"
4. Name: `Primary/500` (main)
5. Repeat for all shades (50-900)

**Naming Convention:**
```
Primary/50
Primary/100
...
Primary/900

Secondary/50
Secondary/100
...

Gray/50
...

Semantic/Success
Semantic/Error
Semantic/Warning
Semantic/Info
```

**Quick Setup (Copy/Paste into Figma):**
```
Primary Colors:
#E6F4F8 → Primary/50
#B3DCE8 → Primary/100
#80C4D8 → Primary/200
#4DACC8 → Primary/300
#2A99B8 → Primary/400
#0788A8 → Primary/500 ⭐ Main
#067098 → Primary/600
#055878 → Primary/700
#044058 → Primary/800
#022838 → Primary/900

Gold/Secondary:
#FEF8E7 → Secondary/50
#FDEDB3 → Secondary/100
#FCE280 → Secondary/200
#FBD74D → Secondary/300
#FAD126 → Secondary/400
#F9CB00 → Secondary/500 ⭐ Main
#E0B800 → Secondary/600
#B89400 → Secondary/700
#907000 → Secondary/800
#684C00 → Secondary/900
```

### Step 2: Typography Styles

**Create Text Styles:**
1. Create text layer
2. Set font: Inter
3. Configure size, weight, line height
4. Right click → "Create Style"

**Text Style Setup:**

| Style Name | Size | Weight | Line Height |
|------------|------|--------|-------------|
| Heading/H1 | 60px | Bold (700) | 72px |
| Heading/H2 | 48px | Bold (700) | 60px |
| Heading/H3 | 36px | Semibold (600) | 44px |
| Heading/H4 | 30px | Semibold (600) | 38px |
| Heading/H5 | 24px | Semibold (600) | 32px |
| Heading/H6 | 20px | Semibold (600) | 28px |
| Body/Large | 18px | Regular (400) | 28px |
| Body/Base | 16px | Regular (400) | 24px |
| Body/Small | 14px | Regular (400) | 20px |
| Body/XSmall | 12px | Regular (400) | 16px |
| Label/Large | 16px | Medium (500) | 24px |
| Label/Base | 14px | Medium (500) | 20px |
| Label/Small | 12px | Medium (500) | 16px |

### Step 3: Effect Styles (Shadows)

**Create Shadow Effects:**

1. **Shadow/XS**
   - Y: 1px, Blur: 2px
   - Color: #000000 at 5% opacity

2. **Shadow/SM**
   - Y: 1px, Blur: 3px, #000 @ 10%
   - Y: 1px, Blur: 2px, #000 @ 10% (layer 2)

3. **Shadow/MD**
   - Y: 4px, Blur: 6px, Spread: -1px, #000 @ 10%
   - Y: 2px, Blur: 4px, Spread: -2px, #000 @ 10%

4. **Shadow/LG**
   - Y: 10px, Blur: 15px, Spread: -3px, #000 @ 10%
   - Y: 4px, Blur: 6px, Spread: -4px, #000 @ 10%

5. **Shadow/XL**
   - Y: 20px, Blur: 25px, Spread: -5px, #000 @ 10%
   - Y: 8px, Blur: 10px, Spread: -6px, #000 @ 10%

---

## 🧩 Component Building

### Button Component (Step-by-Step)

**1. Create Base Button**
```
Frame: 
- Auto Layout
- Padding: 12px (vertical), 24px (horizontal)
- Spacing: 8px (if with icon)
- Corner radius: 12px
- Min width: 120px
```

**2. Add Text**
```
Text: "Button"
Style: Label/Base
Color: White
```

**3. Create Component**
- Select frame → Create Component (⌘⌥K)
- Name: "Button"

**4. Add Variants**

Create variant properties:
- **Type**: Primary, Secondary, Ghost, Outline
- **Size**: Small, Medium, Large
- **State**: Default, Hover, Active, Disabled
- **Icon**: None, Left, Right

**Variant Configurations:**

*Primary - Medium - Default:*
- Fill: Primary/500
- Text: White
- Shadow: Shadow/SM

*Primary - Medium - Hover:*
- Fill: Primary/600
- Shadow: Shadow/MD
- Transform: Scale 1.02

*Primary - Medium - Active:*
- Fill: Primary/700
- Shadow: Shadow/SM

*Primary - Medium - Disabled:*
- Fill: Gray/300
- Text: Gray/500
- Opacity: 0.6

*Secondary - Medium - Default:*
- Fill: Gray/100
- Text: Gray/900
- Border: 1px Gray/300

### Card Component

**1. Create Base Frame**
```
Frame:
- Width: 320px
- Height: Auto (use auto layout)
- Padding: 24px
- Corner radius: 16px
- Fill: White
- Border: 1px solid Gray/200
- Shadow: Shadow/SM
```

**2. Add Content Structure**
```
Auto Layout (Vertical):
- Image/Icon (48×48px)
- Title (Heading/H5)
- Description (Body/Small, Gray/600)
- Action Button (optional)
- Spacing: 16px between elements
```

**3. Create Variants**
- **Type**: Basic, WithImage, WithAction, Featured
- **State**: Default, Hover

### Input Field Component

**1. Create Input Frame**
```
Frame:
- Width: 320px
- Height: 44px
- Padding: 12px 16px
- Corner radius: 12px
- Fill: White
- Border: 1px Gray/300
```

**2. Add Label Above**
```
Text: "Label"
Style: Label/Small
Color: Gray/700
Position: 8px above input
```

**3. Add Placeholder**
```
Text: "Enter text..."
Style: Body/Base
Color: Gray/400
```

**4. Create Variants**
- **Type**: Text, Email, Password, Textarea
- **State**: Default, Focus, Error, Disabled

*Focus State:*
- Border: 2px Primary/500
- Shadow: 0 0 0 4px Primary/100

*Error State:*
- Border: 1px Error
- Helper text in red below

### Navigation Component

**1. Create Header Frame**
```
Frame:
- Width: 1440px (desktop)
- Height: 64px
- Padding: 0 24px
- Fill: White with 80% opacity
- Backdrop blur: 12px (use effect)
- Border bottom: 1px Gray/200
```

**2. Add Nav Items**
```
Auto Layout (Horizontal):
- Logo (left)
- Nav Links (center)
- User Menu (right)
- Align items: Center
```

**3. Nav Link Component**
```
Frame:
- Padding: 8px 16px
- Corner radius: 8px
- Text: Label/Base

States:
- Default: Gray/700
- Hover: Background Gray/100
- Active: Background Primary/50, Text Primary/600
```

---

## 📄 Page Layouts

### Landing Page Template

**Hero Section**
```
Frame: 1440×700px

Structure:
┌────────────────────────────────┐
│  Navigation (sticky)            │
├────────────────────────────────┤
│                                 │
│   Heading (H1)                  │
│   Subheading (Body/Large)       │
│   CTA Buttons                   │
│   Hero Image/Illustration       │
│                                 │
└────────────────────────────────┘

Grid: 12 columns, 24px gutter
Max content width: 1200px
```

**Features Section**
```
3-Column Grid:
- Each feature card
- Icon (56×56px)
- Title (Heading/H5)
- Description (Body/Base)
- Spacing: 48px between cards
```

**Testimonials**
```
Horizontal scroll:
- Card width: 380px
- Spacing: 24px
- Avatar + Name + Quote
```

### Dashboard Layout

**Structure:**
```
┌─────┬──────────────────────────┐
│     │  Top Bar (64px)          │
│ S   ├──────────────────────────┤
│ i   │                          │
│ d   │  Main Content Area       │
│ e   │  (Grid or Flex)          │
│ b   │                          │
│ a   │  - Stats Cards (top)     │
│ r   │  - Data Table (middle)   │
│     │  - Charts (bottom)       │
│ 240 │                          │
│ px  │                          │
└─────┴──────────────────────────┘
```

**Stats Card**
```
Card:
- 280×140px
- Padding: 24px
- Icon + Value + Label + Trend
- Color coding for metrics
```

### Calendar Page

**Layout:**
```
┌──────────────────────────────────┐
│  Header: Month selector + Views  │
├──────────────────────────────────┤
│                                   │
│  Calendar Grid (7×6)              │
│  - Today highlighted              │
│  - Events as colored dots         │
│  - Hover shows event preview      │
│                                   │
├──────────────────────────────────┤
│  Sidebar: Upcoming events         │
└──────────────────────────────────┘
```

**Day Cell:**
```
48×48px minimum
- Date number (top-left)
- Event indicators (dots)
- Hover: Background Gray/50
- Selected: Border Primary/500
```

---

## 🔄 Prototyping

### Essential Interactions

**1. Button Click**
```
Trigger: On Click
Action: Navigate to → [Target Frame]
Animation: Smart Animate
Duration: 300ms
Easing: Ease Out
```

**2. Modal Open**
```
Trigger: On Click
Action: Open Overlay
Position: Center
Close on click outside: Yes
Background: Black 40% opacity
```

**3. Form Validation**
```
Trigger: On Click (Submit)
Action: Change to → Error state
Animation: Instant
```

**4. Hover States**
```
Trigger: While Hovering
Action: Change to → Hover variant
Animation: Smart Animate
Duration: 150ms
```

### User Flow Examples

**Booking Flow:**
1. Landing → Click "Schedule"
2. Calendar View → Select date
3. Time Slot Modal → Select time
4. Confirmation Form → Fill details
5. Success Screen → Confirmation

**Sign Up Flow:**
1. Landing → Click "Sign Up"
2. Sign Up Form
3. Email Verification
4. Welcome Screen
5. Dashboard

---

## 📤 Export & Handoff

### Export Settings

**Icons:**
- Format: SVG
- Settings: Include "id" attribute

**Images:**
- Format: PNG @ 2x
- WebP for web delivery

**Components:**
```
Export for:
- iOS: @1x, @2x, @3x
- Android: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- Web: SVG (icons), PNG @2x (images)
```

### Developer Handoff

**Use Figma Dev Mode:**
1. Enable Dev Mode
2. Select frame/component
3. Copy CSS/Tailwind code
4. Export assets

**Inspect Panel Shows:**
- Spacing values
- Color values (in CSS variables)
- Typography styles
- Shadow effects

**CSS Export Example:**
```css
.button-primary {
  padding: 12px 24px;
  background: hsl(var(--primary-500));
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}
```

---

## 🎯 Quick Reference Checklist

### Before Starting:
- [ ] Installed required plugins
- [ ] Created page structure
- [ ] Set up color styles
- [ ] Created typography styles
- [ ] Added shadow effects

### Components to Build:
- [ ] Buttons (all variants)
- [ ] Input fields
- [ ] Cards
- [ ] Navigation
- [ ] Modals
- [ ] Forms
- [ ] Calendar components
- [ ] Data tables
- [ ] Toasts

### Pages to Design:
- [ ] Landing page (Desktop + Mobile)
- [ ] Sign in page
- [ ] Sign up page
- [ ] Dashboard
- [ ] Calendar view
- [ ] Profile page

### Final Steps:
- [ ] Create prototypes
- [ ] Test all interactions
- [ ] Check accessibility (contrast)
- [ ] Prepare handoff documentation
- [ ] Export assets

---

## 📚 Learning Resources

### Figma Tutorials:
1. **Figma Official**: https://www.figma.com/resources/learn-design/
2. **DesignCourse**: https://www.youtube.com/c/DesignCourse
3. **Femke**: https://www.youtube.com/c/Femke

### Design Inspiration:
- **Dribbble**: https://dribbble.com/tags/dashboard
- **Behance**: https://www.behance.net/
- **Mobbin**: https://mobbin.com/ (mobile designs)

### Component Libraries to Study:
- **Ant Design**: https://ant.design/
- **Material Design 3**: https://m3.material.io/
- **Shadcn/ui**: https://ui.shadcn.com/

---

## 🤝 Collaboration Tips

### For Teams:
1. **Use Branching**: Create branches for experiments
2. **Component Library**: Keep in separate file
3. **Naming Convention**: Use consistent prefixes
4. **Comments**: Add notes for developers
5. **Version History**: Name major versions

### Review Process:
1. Share link with "Can View" access
2. Collect feedback using comments
3. Address feedback in iterations
4. Mark resolved comments
5. Prepare final handoff

---

## 🎨 Egyptian Design Elements

### Subtle Cultural Touches:

**Patterns:**
- Create pattern from basic shapes
- Opacity: 2-3%
- Use as background overlay

**Color Accents:**
- Gold highlights on premium features
- Blue from Egyptian palette for trust elements

**Custom Icons:**
- Pyramid for hierarchy
- Papyrus scroll for documents
- Palm tree for calendar/dates
- Sun disk for dashboard/home

---

**Need Help?** 
- Figma Community: https://forum.figma.com/
- Discord: Figma Official Server

**Last Updated**: December 21, 2025
