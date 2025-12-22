# 🎨 Egypt Connect - Component Reference Library

## Quick Start

This document provides ready-to-use component patterns and code examples for building Egypt Connect pages.

---

## 🧩 Core Components

### Button

**Import:**
```tsx
import { Button } from "@/components/ui/button"
```

**Variants:**
```tsx
// Primary (default)
<Button>Click me</Button>

// Secondary (Gold accent)
<Button variant="secondary">Secondary</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost (transparent)
<Button variant="ghost">Ghost</Button>

// Destructive (red)
<Button variant="destructive">Delete</Button>

// Link style
<Button variant="link">Link</Button>
```

**Sizes:**
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**With Icons:**
```tsx
import { Plus, Calendar } from "lucide-react"

<Button className="gap-2">
  <Plus className="h-4 w-4" />
  Add Event
</Button>
```

---

### Card

**Import:**
```tsx
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
```

**Basic Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>
```

**Feature Card:**
```tsx
<Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300">
  <CardHeader>
    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
      <Icon className="h-7 w-7" />
    </div>
    <CardTitle>Feature Name</CardTitle>
    <CardDescription>Feature description</CardDescription>
  </CardHeader>
</Card>
```

**Stats Card:**
```tsx
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-sm font-medium text-gray-600">
      Total Users
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">1,234</div>
    <p className="text-sm text-green-600 flex items-center gap-1">
      <ArrowUp className="h-4 w-4" />
      12% from last month
    </p>
  </CardContent>
</Card>
```

---

### Input & Label

**Import:**
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

**Form Field:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="you@example.com" 
  />
</div>
```

**With Error State:**
```tsx
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input 
    id="password" 
    type="password" 
    className="border-red-500 focus-visible:ring-red-500"
  />
  <p className="text-sm text-red-600">Password is required</p>
</div>
```

---

### Header

**Import:**
```tsx
import { Header } from "@/components/Header"
```

**Usage:**
```tsx
<Header />
```

Features:
- Sticky navigation with glass effect
- Responsive mobile menu
- User authentication status
- Active route highlighting

---

### Footer

**Import:**
```tsx
import { Footer } from "@/components/Footer"
```

**Usage:**
```tsx
<Footer />
```

---

## 📋 Page Templates

### Landing Page Pattern

```tsx
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl md:text-7xl font-bold">
                Your Headline
              </h1>
              <p className="mb-10 text-xl text-gray-600">
                Your subheading description
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/action">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/learn">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

### Dashboard Pattern

```tsx
<div className="min-h-screen bg-gray-50">
  <Header />
  <main className="container mx-auto px-4 py-8">
    {/* Page Header */}
    <div className="mb-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome back!</p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,234</div>
        </CardContent>
      </Card>
      {/* More stat cards... */}
    </div>

    {/* Content Area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Main content */}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sidebar</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sidebar content */}
        </CardContent>
      </Card>
    </div>
  </main>
</div>
```

---

## 🎨 Styling Patterns

### Color Usage

**Primary (Egyptian Blue):**
```tsx
// Backgrounds
className="bg-primary-50"   // Lightest
className="bg-primary-500"  // Main
className="bg-primary-900"  // Darkest

// Text
className="text-primary-600"

// Borders
className="border-primary-500"
```

**Secondary (Egyptian Gold):**
```tsx
className="bg-secondary-500"  // Main gold
className="text-secondary-600"
```

**Gradients:**
```tsx
className="bg-gradient-to-br from-primary-500 to-primary-700"
className="bg-gradient-to-br from-secondary-400 to-secondary-600"
className="gradient-primary"  // Utility class
className="gradient-gold"     // Utility class
```

### Shadows

```tsx
className="shadow-sm"   // Subtle
className="shadow-md"   // Medium
className="shadow-lg"   // Large
className="shadow-xl"   // Extra large
```

### Rounded Corners

```tsx
className="rounded-lg"   // 12px - inputs, small cards
className="rounded-xl"   // 16px - buttons, cards
className="rounded-2xl"  // 24px - large cards
className="rounded-full" // Pills, avatars
```

### Spacing

```tsx
// Padding
className="p-4"   // 16px all sides
className="px-6"  // 24px horizontal
className="py-8"  // 32px vertical

// Margin
className="mt-8"  // 32px top
className="mb-6"  // 24px bottom

// Gap (for flex/grid)
className="gap-4"  // 16px between items
```

---

## 🎭 Animation Patterns

### Hover Effects

**Scale on Hover:**
```tsx
className="transition-all duration-300 hover:scale-105"
```

**Shadow on Hover:**
```tsx
className="transition-all duration-200 hover:shadow-xl"
```

**Color Change:**
```tsx
className="transition-colors duration-200 hover:bg-primary-50"
```

### Fade In Animation

```tsx
className="animate-fade-in"
```

### Slide Up Animation

```tsx
className="animate-slide-up"
```

---

## 🖼️ Icon Usage

**Import from Lucide:**
```tsx
import { 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Home,
  Settings,
  Plus,
  X,
  Check,
  ChevronRight,
  ArrowRight 
} from "lucide-react"
```

**Usage:**
```tsx
<Calendar className="h-5 w-5" />
<Clock className="h-4 w-4 text-gray-600" />
<Plus className="h-6 w-6 text-white" />
```

**With Button:**
```tsx
<Button>
  <Plus className="h-4 w-4" />
  Add Item
</Button>
```

---

## 📱 Responsive Patterns

### Grid Layouts

**1-2-3 Columns:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

**Sidebar Layout:**
```tsx
className="grid grid-cols-1 lg:grid-cols-4 gap-6"

// Main content
className="lg:col-span-3"

// Sidebar
className="lg:col-span-1"
```

### Hide/Show on Mobile

```tsx
// Hide on mobile, show on desktop
className="hidden md:block"

// Show on mobile, hide on desktop
className="md:hidden"
```

### Responsive Text

```tsx
className="text-2xl md:text-4xl lg:text-6xl"
```

### Responsive Spacing

```tsx
className="py-8 md:py-16 lg:py-24"
```

---

## 🎯 Common Patterns

### Loading State

```tsx
<Button disabled>
  <Loader2 className="h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Empty State

```tsx
<div className="text-center py-12">
  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
    <Inbox className="h-8 w-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    No items yet
  </h3>
  <p className="text-gray-600 mb-4">
    Get started by creating your first item
  </p>
  <Button>
    <Plus className="h-4 w-4" />
    Create Item
  </Button>
</div>
```

### Alert/Notification

```tsx
<div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
  <div className="flex gap-3">
    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <div>
      <h4 className="font-semibold text-blue-900">Information</h4>
      <p className="text-sm text-blue-700">Your message here</p>
    </div>
  </div>
</div>
```

### Badge

```tsx
<span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700">
  New
</span>
```

---

## 📚 Full Page Examples

### Example: Simple Form Page

```tsx
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message"
                  className="flex min-h-[120px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Your message"
                />
              </div>
              
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

---

## 🔧 Utility Classes

### Glass Effect (Glassmorphism)

```tsx
className="glass-effect"
// Equivalent to: bg-background/80 backdrop-blur-xl border border-white/20
```

### Text Balance

```tsx
className="text-balance"
// Better text wrapping for headings
```

### Truncate Text

```tsx
className="truncate"           // Single line
className="line-clamp-2"       // 2 lines
className="line-clamp-3"       // 3 lines
```

---

## 📝 Tips & Best Practices

1. **Consistency**: Always use the same spacing units (4, 8, 12, 16, 24, 32, 48, 64px)
2. **Hierarchy**: Use text sizes to create clear visual hierarchy
3. **White Space**: Don't be afraid of empty space
4. **Touch Targets**: Minimum 44px height for clickable elements
5. **Contrast**: Ensure text has proper contrast ratios
6. **Loading States**: Always provide feedback for async operations
7. **Error States**: Show clear, helpful error messages
8. **Animations**: Keep them subtle and purposeful

---

**Last Updated**: December 21, 2025
