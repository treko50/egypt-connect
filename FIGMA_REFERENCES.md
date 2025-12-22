# 🎨 Figma Design References & Resources

## Quick Links

### Essential Figma Resources
- **Figma Official Site**: https://www.figma.com/
- **Figma Community**: https://www.figma.com/community
- **Figma Learn**: https://www.figma.com/resources/learn-design/

---

## 📦 Design System File Structure

Create your Figma file with this exact structure:

```
Egypt Connect Design System
│
├── 📄 Cover (Landing page for the file)
│   ├── Project Title
│   ├── Version Info
│   ├── Color Palette Preview
│   └── Navigation to other pages
│
├── 🎨 Foundation
│   ├── Frame: Color Palette
│   │   ├── Primary Colors (10 shades)
│   │   ├── Secondary Colors (10 shades)
│   │   ├── Neutrals (10 shades)
│   │   └── Semantic Colors (Success, Warning, Error, Info)
│   ├── Frame: Typography
│   │   ├── Headings (H1-H6)
│   │   ├── Body Text (Large, Base, Small)
│   │   └── Labels
│   ├── Frame: Spacing & Grid
│   │   ├── 4px base unit
│   │   ├── Spacing examples
│   │   └── Grid layouts
│   ├── Frame: Icons
│   │   ├── Navigation icons
│   │   ├── Action icons
│   │   └── Status icons
│   └── Frame: Effects
│       ├── Shadow examples
│       ├── Border radius examples
│       └── Gradient examples
│
├── 🧩 Components
│   ├── Frame: Buttons
│   │   ├── Component: Button/Primary
│   │   ├── Component: Button/Secondary
│   │   ├── Component: Button/Outline
│   │   ├── Component: Button/Ghost
│   │   ├── Component: Button/Destructive
│   │   └── Variants for each (Default, Hover, Active, Disabled)
│   ├── Frame: Inputs
│   │   ├── Component: Input/Text
│   │   ├── Component: Input/Email
│   │   ├── Component: Input/Password
│   │   └── States (Default, Focus, Error, Disabled)
│   ├── Frame: Cards
│   │   ├── Component: Card/Basic
│   │   ├── Component: Card/WithImage
│   │   ├── Component: Card/Feature
│   │   └── Component: Card/Stats
│   ├── Frame: Navigation
│   │   ├── Component: Header
│   │   ├── Component: NavLink
│   │   ├── Component: MobileMenu
│   │   └── Component: Footer
│   ├── Frame: Modals
│   │   ├── Component: Modal/Default
│   │   ├── Component: Modal/Confirmation
│   │   └── Component: Modal/Form
│   ├── Frame: Forms
│   │   ├── Component: FormField
│   │   ├── Component: Checkbox
│   │   ├── Component: Radio
│   │   └── Component: Select
│   └── Frame: Data Display
│       ├── Component: Table
│       ├── Component: Badge
│       └── Component: Toast
│
├── 📄 Templates
│   ├── Frame: Landing Page (1440×1024)
│   │   ├── Header
│   │   ├── Hero Section
│   │   ├── Features Grid
│   │   ├── CTA Section
│   │   └── Footer
│   ├── Frame: Auth Pages (1440×900)
│   │   ├── Sign In
│   │   └── Sign Up
│   ├── Frame: Dashboard (1440×900)
│   │   ├── Sidebar
│   │   ├── Stats Cards
│   │   ├── Data Table
│   │   └── Charts
│   ├── Frame: Calendar (1440×900)
│   │   ├── Month View
│   │   ├── Day View
│   │   └── Event Modal
│   └── Frame: Profile (1440×900)
│       ├── User Info
│       ├── Settings
│       └── Preferences
│
├── 🔄 Prototypes
│   ├── Frame: User Flow - Sign Up
│   ├── Frame: User Flow - Booking
│   └── Frame: User Flow - Calendar
│
└── 📱 Mobile Designs
    ├── Frame: Mobile Landing (375×812)
    ├── Frame: Mobile Calendar (375×812)
    └── Frame: Mobile Menu (375×812)
```

---

## 🎨 Step-by-Step: Creating Your First Component

### Example: Primary Button

**1. Create Base Frame**
```
Frame size: Auto width, 44px height
Name: "Button/Primary"
Enable Auto Layout
```

**2. Auto Layout Settings**
```
Direction: Horizontal
Spacing: 8px
Padding: 12px horizontal, 12px vertical
Alignment: Center, Middle
```

**3. Add Text**
```
Text: "Button"
Font: Inter
Size: 14px
Weight: 600 (Semibold)
Color: #FFFFFF
```

**4. Apply Styles**
```
Fill: #0788A8 (Primary/500)
Corner radius: 12px
Add Effect: Shadow/SM
```

**5. Create Component** (⌘+Option+K or Ctrl+Alt+K)
```
Name: "Button/Primary"
Description: "Primary action button"
```

**6. Add Variants**
```
Property: State
Values: Default, Hover, Active, Disabled

For Hover:
- Fill: #067098 (Primary/600)
- Shadow: Shadow/MD
- Add prototype: While hovering → Change to Hover

For Active:
- Fill: #055878 (Primary/700)

For Disabled:
- Fill: #D1D5DB (Gray/300)
- Opacity: 60%
```

---

## 🎯 Figma Keyboard Shortcuts

### Essential Shortcuts

| Action | Mac | Windows |
|--------|-----|---------|
| Create Component | ⌘⌥K | Ctrl+Alt+K |
| Create Frame | ⌘⌥G | Ctrl+Alt+G |
| Auto Layout | Shift+A | Shift+A |
| Pick Color | Ctrl+C | Ctrl+C |
| Toggle UI | ⌘\ | Ctrl+\ |
| Zoom to Fit | Shift+1 | Shift+1 |
| Zoom to 100% | Shift+0 | Shift+0 |
| Duplicate | ⌘D | Ctrl+D |
| Group | ⌘G | Ctrl+G |
| Ungroup | ⌘⇧G | Ctrl+Shift+G |

### Layout Shortcuts

| Action | Shortcut |
|--------|----------|
| Align Left | ⌥A |
| Align Right | ⌥D |
| Align Top | ⌥W |
| Align Bottom | ⌥S |
| Distribute Horizontal | ⌥H |
| Distribute Vertical | ⌥V |

---

## 🔌 Essential Plugins

### Must-Have Plugins

1. **Iconify** (Free)
   - Purpose: Access 150,000+ icons
   - Use for: All icon needs
   - Install: https://www.figma.com/community/plugin/735098390272716381

2. **Unsplash** (Free)
   - Purpose: High-quality stock photos
   - Use for: Hero images, placeholders
   - Install: https://www.figma.com/community/plugin/738454987945972471

3. **Content Reel** (Free)
   - Purpose: Generate realistic content
   - Use for: Names, emails, addresses
   - Install: https://www.figma.com/community/plugin/731627216655469013

4. **Stark** (Free tier available)
   - Purpose: Accessibility checking
   - Use for: Contrast ratios, color blindness simulation
   - Install: https://www.figma.com/community/plugin/732603254453395948

5. **Contrast** (Free)
   - Purpose: Check WCAG compliance
   - Use for: Text color validation
   - Install: https://www.figma.com/community/plugin/748533339900865323

6. **Auto Layout** (Built-in)
   - Purpose: Responsive component creation
   - Use for: All components
   - Keyboard: Shift+A

7. **Component Inspector** (Free)
   - Purpose: View component structure
   - Use for: Understanding complex components
   - Install: https://www.figma.com/community/plugin/739270174833022089

---

## 📐 Design Token Export

### Color Variables (CSS)

Copy these into your `globals.css`:

```css
/* Egyptian Blue - Primary */
--primary-50: #e6f4f8;
--primary-100: #b3dce8;
--primary-200: #80c4d8;
--primary-300: #4dacc8;
--primary-400: #2a99b8;
--primary-500: #0788a8;  /* Main */
--primary-600: #067098;
--primary-700: #055878;
--primary-800: #044058;
--primary-900: #022838;

/* Egyptian Gold - Secondary */
--secondary-50: #fef8e7;
--secondary-100: #fdedb3;
--secondary-200: #fce280;
--secondary-300: #fbd74d;
--secondary-400: #fad126;
--secondary-500: #f9cb00;  /* Main */
--secondary-600: #e0b800;
--secondary-700: #b89400;
--secondary-800: #907000;
--secondary-900: #684c00;
```

---

## 🎨 Component Examples with Screenshots

### Button States

```
┌─────────────────┐
│   Get Started   │  ← Default (Primary/500)
└─────────────────┘

┌─────────────────┐
│   Get Started   │  ← Hover (Primary/600 + Shadow)
└─────────────────┘

┌─────────────────┐
│   Get Started   │  ← Active/Pressed (Primary/700)
└─────────────────┘

┌─────────────────┐
│   Get Started   │  ← Disabled (Gray/300, 60% opacity)
└─────────────────┘
```

### Card Component

```
┌───────────────────────────────┐
│  ┌───┐                        │
│  │ 🎨 │  Smart Scheduling      │  ← Icon + Title
│  └───┘                        │
│                               │
│  AI-powered calendar that     │  ← Description
│  adapts to your needs         │
│                               │
└───────────────────────────────┘
```

---

## 🌐 Design Inspiration Sites

### Reference These for Ideas

1. **Dribbble** - https://dribbble.com/
   - Search: "SaaS dashboard", "Calendar UI", "Landing page"

2. **Behance** - https://www.behance.net/
   - Search: "Web design", "UI kit"

3. **Mobbin** - https://mobbin.com/
   - Mobile app design patterns

4. **Land-book** - https://land-book.com/
   - Landing page inspiration

5. **UI Movement** - https://uimovement.com/
   - Animated UI examples

6. **Pages.xyz** - https://www.pages.xyz/
   - Website screenshots

### Specific Examples to Study

**Modern SaaS Designs:**
- Linear: https://linear.app/
- Vercel: https://vercel.com/
- Stripe: https://stripe.com/
- Notion: https://www.notion.so/
- Cal.com: https://cal.com/

**Calendar Designs:**
- Google Calendar
- Calendly: https://calendly.com/
- Fantastical
- Apple Calendar

---

## 📱 Responsive Design Frames

### Standard Artboard Sizes

**Desktop:**
```
Frame: Desktop
Size: 1440 × 1024px
Grid: 12 columns, 24px gutter
Max content: 1200px
```

**Tablet:**
```
Frame: Tablet
Size: 768 × 1024px
Grid: 8 columns, 16px gutter
```

**Mobile:**
```
Frame: iPhone 14
Size: 390 × 844px
Grid: 4 columns, 16px gutter
```

---

## 🔄 Prototyping Interactions

### Common Interactions

**Button Click:**
```
Trigger: On Click
Action: Navigate to → [Target Frame]
Animation: Smart Animate
Duration: 300ms
Easing: Ease Out
```

**Hover State:**
```
Trigger: While Hovering
Action: Change to → [Hover Variant]
Animation: Smart Animate
Duration: 150ms
Easing: Ease In Out
```

**Modal Open:**
```
Trigger: On Click
Action: Open Overlay
Position: Center
Close on Click Outside: Yes
Background: #000000 at 40%
```

**Form Input Focus:**
```
Trigger: While Pressing
Action: Change to → [Focus Variant]
Animation: Instant
```

---

## 📤 Export Settings for Developers

### Icons
```
Format: SVG
Settings:
- Include "id" attribute
- Outline text
- Simplify stroke
```

### Images
```
Format: PNG @ 2x
or
Format: WebP (for web)
```

### Component Code
```
Use Figma Dev Mode:
1. Select component
2. Click Inspect tab
3. Copy CSS/Tailwind code
4. Adjust for React/Next.js
```

---

## 🎓 Learning Path

### Beginner (Week 1-2)
1. ✅ Figma basics tutorial (2 hours)
2. ✅ Create color styles
3. ✅ Create text styles
4. ✅ Build first button component
5. ✅ Create simple card

### Intermediate (Week 3-4)
1. ✅ Master Auto Layout
2. ✅ Create component variants
3. ✅ Build navigation header
4. ✅ Design form components
5. ✅ Create landing page template

### Advanced (Week 5-6)
1. ✅ Component library organization
2. ✅ Complex prototyping
3. ✅ Responsive variants
4. ✅ Design system documentation
5. ✅ Developer handoff

---

## 🤝 Collaboration Best Practices

### File Organization
- Use clear naming conventions
- Group related components
- Add descriptions to components
- Version major changes

### Comments
```
Use comments for:
- Design decisions
- Questions for developers
- Implementation notes
- Known issues
```

### Sharing
```
View Only: For stakeholders
Can Edit: For design team
Dev Mode: For developers
```

---

## 🔍 Quality Checklist

Before finalizing designs:

- [ ] All colors use defined styles
- [ ] Text uses defined text styles
- [ ] Components are properly named
- [ ] Variants cover all states
- [ ] Spacing follows 4px grid
- [ ] Contrast ratios meet WCAG AA
- [ ] Responsive variants created
- [ ] Prototypes work correctly
- [ ] Components documented
- [ ] Export settings configured

---

## 📚 Additional Resources

### Figma YouTube Channels
- **Figma Official**: https://www.youtube.com/@Figma
- **DesignCourse**: https://www.youtube.com/c/DesignCourse
- **Femke**: https://www.youtube.com/c/Femke
- **Jesse Showalter**: https://www.youtube.com/c/JesseShowalter

### Design Systems to Study
- **Material Design 3**: https://m3.material.io/
- **Ant Design**: https://ant.design/
- **Atlassian Design**: https://atlassian.design/
- **IBM Carbon**: https://carbondesignsystem.com/

### Icon Libraries
- **Lucide**: https://lucide.dev/ ⭐ (Used in project)
- **Heroicons**: https://heroicons.com/
- **Phosphor**: https://phosphoricons.com/
- **Feather**: https://feathericons.com/

---

## 💡 Pro Tips

1. **Use Styles for Everything** - Makes updates instant
2. **Name Layers Properly** - Helps with code generation
3. **Keep Consistent Spacing** - Use 4, 8, 12, 16, 24, 32, 48px
4. **Test Accessibility** - Use Stark plugin regularly
5. **Document Decisions** - Add notes explaining why
6. **Version Control** - Save major versions
7. **Prototype Early** - Test flows before finalizing
8. **Get Feedback** - Share work-in-progress
9. **Stay Organized** - Clean up regularly
10. **Learn Shortcuts** - Speed up your workflow

---

**Ready to design?** Start with the [FIGMA_GUIDE.md](./FIGMA_GUIDE.md) for step-by-step instructions!

**Need help?** Check the [Figma Community Forum](https://forum.figma.com/)

---

*Last Updated: December 21, 2025*
