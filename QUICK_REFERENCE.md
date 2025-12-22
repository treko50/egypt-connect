# Quick Reference - Egypt Connect

## 🎯 What Changed

1. **Judge Name**: Ahmed Karim → **Hatem Elnahal**
2. **New Profile Page**: `/profile` with full judge bio
3. **Shopify Booking**: Integrated payment system in calendar
4. **Three Services**: Initial (500 EGP), Follow-up (300 EGP), Extended (900 EGP)

## 🚦 Quick Start

```bash
# Run the app
npm run dev

# Visit these pages:
http://localhost:3000          # Home
http://localhost:3000/profile  # Judge Profile
http://localhost:3000/calendar # Booking Calendar
```

## 📋 Booking Flow

1. User clicks "Book Consultation"
2. Selects date from calendar
3. Chooses time slot
4. Picks consultation type
5. Clicks "Book & Pay with Shopify"
6. Redirected to Shopify checkout

## 🔑 Environment Setup

```env
# Required for Shopify
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token
NEXT_PUBLIC_SHOPIFY_INITIAL_CONSULTATION_ID=gid://shopify/Product/xxx
NEXT_PUBLIC_SHOPIFY_FOLLOWUP_CONSULTATION_ID=gid://shopify/Product/xxx
NEXT_PUBLIC_SHOPIFY_EXTENDED_CONSULTATION_ID=gid://shopify/Product/xxx
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/hardcoded-strings.ts` | Judge name & profile data |
| `src/app/(private)/profile/page.tsx` | Profile page |
| `src/app/(private)/calendar/page.tsx` | Booking calendar |
| `src/components/ShopifyBookingWidget.tsx` | Payment widget |
| `src/lib/shopify-config.ts` | Shopify settings |
| `SHOPIFY_SETUP.md` | Setup instructions |

## 🛠️ Todo Before Production

- [ ] Replace `/public/main_pic.jpg` with actual judge photo
- [ ] Setup Shopify store with consultation products
- [ ] Add real product IDs to `.env.local`
- [ ] Implement Shopify Storefront API
- [ ] Test payment flow end-to-end
- [ ] Update contact email/phone in profile page

## 💡 Color Reference

```css
/* Primary - Egyptian Blue */
--primary-600: #0788A8;

/* Secondary - Egyptian Gold */
--secondary-500: #F9CB00;
```

## 📞 Support Info (Placeholder)

- Email: judge@egyptconnect.com
- Phone: +20 123 456 7890
- Location: Cairo, Egypt

*Update in: `src/app/(private)/profile/page.tsx`*

---

**Status**: ✅ Ready for Shopify configuration

See [UPDATES_SUMMARY.md](UPDATES_SUMMARY.md) for complete details.
