# 🌟 Egypt Connect - Legal Consultation Platform

A modern legal consultation booking platform connecting clients with **Judge Hatem Elnahal**, featuring integrated Shopify payments, appointment scheduling, and a beautiful Egyptian-inspired design with **multi-language support** (English & Arabic).

![Egypt Connect](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF) ![Shopify](https://img.shields.io/badge/Payments-Shopify-96BF48) ![i18n](https://img.shields.io/badge/i18n-English%20%7C%20Arabic-success)

---

## ✨ Features

- 🎨 **Modern Design System** - Fresh, clean UI with Egyptian cultural elements
- 📅 **Interactive Calendar** - Book consultation appointments with ease
- 💳 **Shopify Integration** - Secure payment processing for bookings
- 👤 **Judge Profile** - Detailed profile with expertise, experience, and ratings
- 🔐 **Clerk Authentication** - Secure user management
- 🌍 **Multi-Language Support** - Full English and Arabic translation with RTL layout
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Fully Responsive** - Mobile-first design approach
- ⚡ **Lightning Fast** - Optimized performance with Next.js 15
- 🎭 **Beautiful Animations** - Smooth transitions and micro-interactions
- ♿ **Accessible** - WCAG 2.1 AA compliant

---

## 🌐 Multi-Language Support

Egypt Connect supports **English** and **Arabic** with full RTL (Right-to-Left) layout:

- **Language Switcher**: Easy toggle in the header (🌐)
- **RTL Layout**: Automatic right-to-left layout for Arabic
- **Full Translation**: All UI elements, content, and labels
- **SEO-Friendly**: Proper locale URLs (`/en/calendar` and `/ar/calendar`)

See [I18N_GUIDE.md](./I18N_GUIDE.md) for detailed documentation.

---

## 📋 Consultation Services

### ⏱️ Initial Consultation (60 min) - 500 EGP
First-time consultation to discuss your legal matter in detail with Judge Hatem Elnahal.

### 🔄 Follow-up Consultation (30 min) - 300 EGP
Continuation of ongoing legal matters with brief updates and guidance.

### 📊 Extended Consultation (120 min) - 900 EGP
In-depth consultation for complex legal cases requiring thorough analysis and strategy.

---

## 🎨 Design System

Our design system is inspired by modern SaaS applications with subtle Egyptian cultural touches. It features:

- **Egyptian Blue** primary color palette (#0788A8)
- **Gold** secondary accents (#F9CB00)
- **Modern typography** with Inter font
- **Consistent spacing** based on 4px grid
- **Smooth animations** and transitions
- **Glass morphism** effects

### 📚 Documentation

- **[Design System](./DESIGN_SYSTEM.md)** - Complete design guidelines and specifications
- **[Figma Guide](./FIGMA_GUIDE.md)** - Step-by-step Figma design tutorial
- **[Figma References](./FIGMA_REFERENCES.md)** - Resources, plugins, and shortcuts
- **[Component Library](./COMPONENT_LIBRARY.md)** - Ready-to-use component patterns
- **[Visual Reference](./VISUAL_REFERENCE.md)** - ASCII art layouts and diagrams
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Navigate all documentation
- **[Design Summary](./DESIGN_SUMMARY.md)** - What we built and why

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Clerk account for authentication (https://clerk.com)
- A Shopify store for payment processing (https://www.shopify.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd egypt-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/calendar
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/calendar
   
   # Shopify Integration
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_token
   NEXT_PUBLIC_SHOPIFY_INITIAL_CONSULTATION_ID=gid://shopify/Product/xxx
   NEXT_PUBLIC_SHOPIFY_FOLLOWUP_CONSULTATION_ID=gid://shopify/Product/xxx
   NEXT_PUBLIC_SHOPIFY_EXTENDED_CONSULTATION_ID=gid://shopify/Product/xxx
   
   # Database
   DATABASE_URL=your_database_url
   ```
   
   **See [SHOPIFY_SETUP.md](./SHOPIFY_SETUP.md) for Shopify configuration**ABASE_URL=your_database_url
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
egypt-connect/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (private)/         # Protected pages
│   │   ├── (public)/          # Public pages
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # UI components (buttons, cards, etc.)
│   │   ├── Header.tsx        # Navigation header
│   │   └── Footer.tsx        # Footer component
│   ├── lib/                   # Utility functions
│   └── styles/               # Additional styles
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
├── DESIGN_SYSTEM.md          # Design system documentation
├── FIGMA_GUIDE.md            # Figma design guide
├── COMPONENT_LIBRARY.md      # Component reference
└── README.md                 # This file
```

---

## 🎨 Design Resources

### Figma Design Process

We provide comprehensive documentation for creating Figma designs:

1. **Foundation Setup** - Colors, typography, spacing
2. **Component Creation** - Buttons, cards, inputs, navigation
3. **Page Templates** - Landing, dashboard, calendar
4. **Prototyping** - Interactive flows and animations

**→ See [FIGMA_GUIDE.md](./FIGMA_GUIDE.md) for detailed instructions**

### Color Palette

#### Primary (Egyptian Blue)
- `#0788A8` - Main brand color
- Shades from `#E6F4F8` to `#022838`

#### Secondary (Egyptian Gold)
- `#F9CB00` - Gold accent
- Shades from `#FEF8E7` to `#684C00`

#### Neutrals
- Grays from `#F9FAFB` to `#111827`

### Typography

- **Font Family**: Inter
- **Weights**: 300-800
- **Scale**: 12px to 60px

---

## 🧩 Components

### Core UI Components

- **Button** - Multiple variants (primary, secondary, outline, ghost)
- **Card** - Flexible card component with header, content, footer
- **Input** - Form input with label and validation states
- **Navigation** - Sticky header with glass effect
- **Footer** - Multi-column footer with links

**→ See [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) for usage examples**

### Page Templates

- **Landing Page** - Hero section, features grid, CTA
- **Calendar Page** - Interactive calendar with event management
- **Authentication** - Sign in/up pages with Clerk
- **Dashboard** - Stats and data visualization

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Prisma](https://www.prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
```

---

## 🎯 Key Features Breakdown

### 1. Modern Landing Page

- Hero section with gradient background
- Feature cards with hover effects
- Responsive grid layout
- Call-to-action sections

### 2. Interactive Calendar

- Month view with date selection
- Event indicators
- Upcoming events sidebar
- Quick actions
- Fully responsive

### 3. Authentication

- Secure sign-in/sign-up
- Protected routes
- User profile management
- Session handling

### 4. Design System

- Consistent component library
- Reusable patterns
- Accessibility focused
- Dark mode ready

---

## 🎨 Customization

### Changing Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 193 89% 42%;    /* Egyptian Blue */
  --secondary: 46 100% 50%;  /* Egyptian Gold */
  /* ... other colors */
}
```

### Adding New Components

1. Create component in `src/components/ui/`
2. Follow existing patterns
3. Use Tailwind classes
4. Document in COMPONENT_LIBRARY.md

### Modifying Layout

- Update `src/app/layout.tsx` for global changes
- Modify `src/components/Header.tsx` for navigation
- Edit `src/components/Footer.tsx` for footer

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

---

## ♿ Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Screen reader friendly
- Color contrast compliant (WCAG 2.1 AA)
- Focus visible states

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Follow the design system
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Check the documentation files
- Review the component library

---

## 🙏 Acknowledgments

- Design inspiration from [Linear](https://linear.app/), [Vercel](https://vercel.com/), and [Stripe](https://stripe.com/)
- Icons by [Lucide](https://lucide.dev/)
- UI primitives by [Radix UI](https://www.radix-ui.com/)

---

## 📚 Additional Documentation

- **[Design System](./DESIGN_SYSTEM.md)** - Complete design guidelines
- **[Figma Guide](./FIGMA_GUIDE.md)** - Design in Figma
- **[Component Library](./COMPONENT_LIBRARY.md)** - Component patterns
- **[Agent Integration](./AGENT_INTEGRATION.md)** - Multi-agent setup

---

**Built with ❤️ for Egypt Connect**

*Last Updated: December 21, 2025*
