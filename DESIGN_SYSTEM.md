# Egypt Connect - Design System & Figma Documentation

## 🎨 Design Philosophy

Egypt Connect embraces a modern, clean aesthetic inspired by contemporary SaaS applications with Egyptian cultural elements. The design system focuses on:

- **Minimalism**: Clean interfaces with purposeful whitespace
- **Hierarchy**: Clear visual hierarchy guiding user attention
- **Accessibility**: WCAG 2.1 AA compliant color contrasts and interactions
- **Responsiveness**: Mobile-first approach with seamless desktop scaling
- **Cultural Identity**: Subtle Egyptian-inspired patterns and warm color palette

---

## 🎯 Design Principles

### 1. **Clarity Over Complexity**
Every element serves a purpose. Remove what doesn't add value.

### 2. **Consistency**
Reusable components with predictable behavior across the application.

### 3. **Delight**
Smooth animations and micro-interactions that feel natural.

### 4. **Performance**
Fast load times with optimized assets and progressive loading.

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-50:  #e6f4f8   /* Lightest - backgrounds */
--primary-100: #b3dce8   /* Light - hover states */
--primary-200: #80c4d8   /* Medium light */
--primary-300: #4dacc8   /* Medium */
--primary-400: #2a99b8   /* Medium dark */
--primary-500: #0788a8   /* Main - primary actions */
--primary-600: #067098   /* Dark - pressed states */
--primary-700: #055878   /* Darker */
--primary-800: #044058   /* Very dark */
--primary-900: #022838   /* Darkest - text on light */
```

### Secondary Colors (Egyptian Gold)
```css
--secondary-50:  #fef8e7
--secondary-100: #fdedb3
--secondary-200: #fce280
--secondary-300: #fbd74d
--secondary-400: #fad126
--secondary-500: #f9cb00   /* Main gold */
--secondary-600: #e0b800
--secondary-700: #b89400
--secondary-800: #907000
--secondary-900: #684c00
```

### Neutrals
```css
--gray-50:  #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

### Semantic Colors
```css
--success: #10b981   /* Green */
--warning: #f59e0b   /* Amber */
--error: #ef4444     /* Red */
--info: #3b82f6      /* Blue */
```

---

## 📝 Typography

### Font Stack
```css
Primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Mono: 'JetBrains Mono', 'Fira Code', monospace
```

### Type Scale
```css
--text-xs: 0.75rem (12px)    /* Line height: 1rem */
--text-sm: 0.875rem (14px)   /* Line height: 1.25rem */
--text-base: 1rem (16px)     /* Line height: 1.5rem */
--text-lg: 1.125rem (18px)   /* Line height: 1.75rem */
--text-xl: 1.25rem (20px)    /* Line height: 1.75rem */
--text-2xl: 1.5rem (24px)    /* Line height: 2rem */
--text-3xl: 1.875rem (30px)  /* Line height: 2.25rem */
--text-4xl: 2.25rem (36px)   /* Line height: 2.5rem */
--text-5xl: 3rem (48px)      /* Line height: 1 */
--text-6xl: 3.75rem (60px)   /* Line height: 1 */
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

---

## 📐 Spacing System

Based on 4px base unit:
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-20: 5rem (80px)
--space-24: 6rem (96px)
```

---

## 🔲 Border Radius

```css
--radius-sm: 0.375rem (6px)
--radius-md: 0.5rem (8px)
--radius-lg: 0.75rem (12px)
--radius-xl: 1rem (16px)
--radius-2xl: 1.5rem (24px)
--radius-full: 9999px
```

---

## 🎭 Shadows

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

---

## 🎬 Animation & Transitions

### Duration
```css
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

### Easing Functions
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 🧩 Component Library

### Buttons

#### Primary Button
- Background: `--primary-500`
- Hover: `--primary-600`
- Active: `--primary-700`
- Text: White
- Padding: 12px 24px
- Border radius: `--radius-lg`
- Shadow: `--shadow-sm` (hover: `--shadow-md`)

#### Secondary Button
- Background: `--gray-100`
- Hover: `--gray-200`
- Text: `--gray-900`
- Border: 1px solid `--gray-300`

#### Ghost Button
- Background: Transparent
- Hover: `--gray-100`
- Text: `--gray-700`

### Cards
- Background: White
- Border: 1px solid `--gray-200`
- Border radius: `--radius-xl`
- Padding: `--space-6`
- Shadow: `--shadow-sm`
- Hover shadow: `--shadow-md`
- Transition: all 200ms ease

### Inputs
- Height: 44px (touch-friendly)
- Border: 1px solid `--gray-300`
- Focus border: 2px solid `--primary-500`
- Border radius: `--radius-lg`
- Padding: 12px 16px
- Font size: `--text-base`

### Navigation
- Sticky header with backdrop blur
- Height: 64px
- Background: rgba(255, 255, 255, 0.8)
- Backdrop filter: blur(12px)
- Box shadow on scroll

---

## 📱 Responsive Breakpoints

```css
--screen-sm: 640px   /* Mobile landscape */
--screen-md: 768px   /* Tablet portrait */
--screen-lg: 1024px  /* Tablet landscape */
--screen-xl: 1280px  /* Desktop */
--screen-2xl: 1536px /* Large desktop */
```

---

## 🎨 Figma Design Process

### Step 1: Setup Figma File
1. **Create New Figma File**: "Egypt Connect Design System"
2. **Create Pages**:
   - Foundation (Colors, Typography, Spacing)
   - Components
   - Templates
   - Prototypes

### Step 2: Design Tokens
1. Create color styles for all palette colors
2. Create text styles for typography scale
3. Create effect styles for shadows
4. Create grid styles (8px base grid)

### Step 3: Component Creation

#### Essential Components to Design:
1. **Buttons** (Primary, Secondary, Ghost, Icon)
2. **Input Fields** (Text, Email, Password, Textarea)
3. **Cards** (Basic, with image, with actions)
4. **Navigation** (Header, Sidebar, Mobile menu)
5. **Calendar** (Date picker, Event card)
6. **Modals** (Confirmation, Form, Info)
7. **Toasts** (Success, Error, Warning, Info)
8. **Dropdowns** (Select, Menu)
9. **Tables** (Data table, Sortable headers)
10. **Forms** (Login, Sign up, Booking form)

#### Component States to Include:
- Default
- Hover
- Active/Pressed
- Focused
- Disabled
- Loading
- Error

### Step 4: Page Templates

#### Key Pages to Design:
1. **Landing Page**
   - Hero section with CTA
   - Features grid
   - Testimonials
   - Footer

2. **Sign In / Sign Up**
   - Centered card layout
   - Social login options
   - Form validation states

3. **Dashboard**
   - Stats cards
   - Activity feed
   - Quick actions

4. **Calendar Page**
   - Month/Week/Day views
   - Event creation modal
   - Time slot selection
   - Booking confirmation

5. **Profile Page**
   - User information
   - Settings
   - Preferences

### Step 5: Prototype Interactions
- Click interactions between pages
- Hover states
- Modal open/close
- Form submissions
- Drawer/menu animations

---

## 🔧 Figma Resources & Plugins

### Recommended Figma Plugins:
1. **Iconify** - Access to thousands of icons (Lucide, Heroicons)
2. **Unsplash** - High-quality imagery
3. **Content Reel** - Generate realistic content
4. **Contrast** - Check color accessibility
5. **Auto Layout** - Speed up responsive designs
6. **Component Inspector** - Examine component structure

### Design Resources:
- **Lucide Icons**: https://lucide.dev/icons/
- **Heroicons**: https://heroicons.com/
- **Phosphor Icons**: https://phosphoricons.com/
- **Unsplash**: https://unsplash.com/
- **Pexels**: https://www.pexels.com/

---

## 📚 Reference Design Systems

### Inspiration:
1. **Vercel Design**: https://vercel.com/design
2. **Stripe**: https://stripe.com/
3. **Linear**: https://linear.app/
4. **Notion**: https://notion.so/
5. **Shadcn/ui**: https://ui.shadcn.com/
6. **Radix UI**: https://www.radix-ui.com/

### Color Palette Tools:
- **Coolors**: https://coolors.co/
- **Adobe Color**: https://color.adobe.com/
- **Realtime Colors**: https://www.realtimecolors.com/

### Accessibility Checkers:
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Stark Plugin** for Figma

---

## 🎯 Egyptian Cultural Elements

### Subtle Design Touches:
1. **Patterns**: Use simplified hieroglyphic patterns as subtle backgrounds
2. **Colors**: Incorporate Egyptian blue (#1034A6) and gold accents
3. **Icons**: Custom icons inspired by Egyptian art (pyramids, palm trees, sun)
4. **Typography**: Optional: Display headers with geometric sans-serif fonts reminiscent of Egyptian architecture

### Implementation Ideas:
- Background patterns on hero sections (very subtle, 2-3% opacity)
- Gold accents on premium features
- Navigation breadcrumbs styled like hieroglyphic paths
- Loading animations inspired by Egyptian sun symbols

---

## 📋 Component Checklist for Figma

- [ ] Button variants (6 types × 4 states = 24 components)
- [ ] Input fields (5 types × 3 states = 15 components)
- [ ] Cards (4 variants)
- [ ] Navigation (3 variants)
- [ ] Modals (3 types)
- [ ] Forms (3 complete forms)
- [ ] Calendar components (Date picker, Event card)
- [ ] Table components
- [ ] Toast notifications (4 types)
- [ ] Loading states (Spinner, Skeleton, Progress)
- [ ] Empty states (3 variations)
- [ ] Error states (3 variations)

---

## 🚀 Implementation Strategy

### Phase 1: Foundation (Week 1)
- [ ] Set up design tokens in Tailwind config
- [ ] Create base component library
- [ ] Implement color system
- [ ] Set up typography

### Phase 2: Core Components (Week 2)
- [ ] Build all button variants
- [ ] Create form inputs
- [ ] Implement navigation
- [ ] Add card components

### Phase 3: Complex Components (Week 3)
- [ ] Calendar functionality
- [ ] Data tables
- [ ] Modals and overlays
- [ ] Toast system

### Phase 4: Pages (Week 4)
- [ ] Landing page redesign
- [ ] Auth pages (Sign in/up)
- [ ] Dashboard
- [ ] Calendar page
- [ ] Profile page

### Phase 5: Polish & Testing (Week 5)
- [ ] Animations and transitions
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing

---

## 📞 Design Handoff Notes

### For Developers:
1. All spacing uses 4px base unit
2. Colors reference CSS variables from Tailwind config
3. Components use Radix UI primitives
4. Animations should respect `prefers-reduced-motion`
5. All interactive elements have 44px minimum touch target
6. Images should have proper alt text
7. Form inputs have associated labels
8. Focus states must be visible

### Figma to Code:
- Export icons as SVG
- Export images at 2x for retina displays
- Use CSS variables for colors (not hex values)
- Component props should match Figma variants
- Maintain consistent naming convention

---

## 🔄 Version History

- **v1.0.0** (Current) - Initial design system documentation
- Future updates will be tracked here

---

## 📬 Contact & Feedback

For design questions or suggestions:
- Create an issue in the project repository
- Tag designs with `design-system` label
- Request Figma access if needed

---

**Last Updated**: December 21, 2025
