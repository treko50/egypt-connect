# 🚀 Quick Start Guide - Egypt Connect Design

**Get up and running in 5 minutes!**

---

## For Designers 🎨

### Step 1: Read This (2 minutes)
```
📖 Start Here: DESIGN_SYSTEM.md
   ↓
   Learn the color palette (Egyptian Blue + Gold)
   ↓
   Understand typography (Inter font)
   ↓
   Review spacing system (4px base)
```

### Step 2: Open Figma (1 minute)
```
1. Create new file: "Egypt Connect"
2. Install plugins:
   - Iconify (icons)
   - Unsplash (images)
   - Contrast (accessibility)
```

### Step 3: Follow the Guide (2 minutes)
```
📖 Follow: FIGMA_GUIDE.md
   ↓
   Create color styles (Primary, Secondary, Neutrals)
   ↓
   Create text styles (Headings, Body, Labels)
   ↓
   Build your first button component
```

**🎉 You're ready to design!**

---

## For Developers 💻

### Step 1: Set Up Project (2 minutes)
```bash
cd egypt-connect
npm install
```

### Step 2: Read Components (2 minutes)
```
📖 Read: COMPONENT_LIBRARY.md
   ↓
   See Button examples
   ↓
   See Card examples
   ↓
   Copy a page template
```

### Step 3: Start Building (1 minute)
```bash
npm run dev
# Open http://localhost:3000
```

**🎉 You're ready to code!**

---

## Color Cheat Sheet

```
Primary (Egyptian Blue):
#0788A8  ← Use this for buttons, links

Secondary (Egyptian Gold):
#F9CB00  ← Use this for accents

Neutrals:
#111827  ← Dark text
#6B7280  ← Light text
#F9FAFB  ← Light background
```

---

## Component Cheat Sheet

```tsx
// Button
<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// Input
<Label>Email</Label>
<Input type="email" placeholder="you@example.com" />
```

---

## File Structure Quick Reference

```
egypt-connect/
├── 📄 DESIGN_SYSTEM.md      ← Design specs
├── 📄 FIGMA_GUIDE.md        ← How to design
├── 📄 COMPONENT_LIBRARY.md  ← How to code
├── src/
│   ├── app/
│   │   └── page.tsx         ← Landing page
│   ├── components/
│   │   ├── ui/              ← Reusable components
│   │   ├── Header.tsx       ← Navigation
│   │   └── Footer.tsx       ← Footer
│   └── lib/
│       └── utils.ts         ← Utilities
```

---

## Common Tasks

### I want to...

**...change colors?**
→ Edit `src/app/globals.css` (lines 6-70)

**...add a new page?**
→ Copy from [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) "Page Templates"

**...use a button?**
→ `<Button>Text</Button>`

**...use a card?**
→ See [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) "Card" section

**...understand the design?**
→ Read [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

**...design in Figma?**
→ Follow [FIGMA_GUIDE.md](./FIGMA_GUIDE.md)

---

## 5-Minute Design Checklist

For designers creating a new component:

```
□ Use colors from palette (Primary/Secondary/Neutral)
□ Use Inter font
□ Use 4px spacing units (4, 8, 12, 16, 24, 32)
□ Use border radius 12px (buttons) or 16px (cards)
□ Check contrast with Stark plugin
□ Add hover state
□ Make it responsive
```

---

## 5-Minute Code Checklist

For developers implementing a design:

```
□ Import from @/components/ui/
□ Use Tailwind classes
□ Follow existing patterns
□ Make it responsive (md:, lg: breakpoints)
□ Add proper TypeScript types
□ Test accessibility
□ Check on mobile
```

---

## Need Help?

```
Design questions:
  → DESIGN_SYSTEM.md
  → FIGMA_GUIDE.md

Code questions:
  → COMPONENT_LIBRARY.md
  → README.md

Can't find it:
  → DOCUMENTATION_INDEX.md (full navigation)
```

---

## Visual Quick Reference

```
Primary Color:   ███  #0788A8 (Egyptian Blue)
Secondary Color: ███  #F9CB00 (Egyptian Gold)

Spacing:   4px  8px  16px  24px  32px
           ▌    ▌▌   ▌▌▌▌  ▌▌▌▌▌▌ ▌▌▌▌▌▌▌▌

Radius:    12px (Buttons)  16px (Cards)
           ╭───╮            ╭────╮
           │   │            │    │
           ╰───╯            ╰────╯

Fonts:     Inter (300, 400, 500, 600, 700, 800)
Sizes:     12px  14px  16px  18px  24px  36px  48px
```

---

## Example: Build Your First Card

**In Figma (2 minutes):**
```
1. Create frame 320×auto
2. Add auto layout (Shift+A)
3. Padding: 24px
4. Border radius: 16px
5. Fill: White
6. Border: 1px Gray/200
7. Shadow: SM
```

**In Code (2 minutes):**
```tsx
<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Feature Name</CardTitle>
    <CardDescription>
      Feature description goes here
    </CardDescription>
  </CardHeader>
</Card>
```

**🎉 Done!**

---

## Most Common Components

```tsx
// 1. Button (Primary Action)
<Button size="lg">Get Started</Button>

// 2. Feature Card
<Card className="hover:shadow-xl transition-all">
  <CardHeader>
    <div className="w-14 h-14 bg-primary-100 rounded-xl" />
    <CardTitle>Feature</CardTitle>
  </CardHeader>
</Card>

// 3. Input Field
<div className="space-y-2">
  <Label>Email</Label>
  <Input type="email" />
</div>

// 4. Page Layout
<>
  <Header />
  <main className="min-h-screen">
    {/* Your content */}
  </main>
  <Footer />
</>
```

---

## Keyboard Shortcuts (Figma)

```
⌘K          Search
⌘⌥K         Create component
Shift+A     Auto layout
⌘D          Duplicate
⌘G          Group
Shift+1     Zoom to fit
```

---

## Tailwind Quick Reference

```tsx
// Colors
className="bg-primary-500 text-white"
className="text-gray-600"

// Spacing
className="p-6 m-4 gap-2"

// Layout
className="flex items-center justify-between"
className="grid grid-cols-3 gap-6"

// Responsive
className="text-base md:text-lg lg:text-xl"
className="hidden md:block"

// Rounded
className="rounded-xl"

// Shadow
className="shadow-md hover:shadow-lg"
```

---

## Ready to Start?

### Designers:
1. Open [FIGMA_GUIDE.md](./FIGMA_GUIDE.md)
2. Create Figma file
3. Start designing!

### Developers:
1. Run `npm run dev`
2. Open [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)
3. Start coding!

---

**You've got this! 🚀**

*Questions? Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) for full navigation*
