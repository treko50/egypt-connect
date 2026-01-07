# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for the Egypt Connect legal consultation booking system.

## Prerequisites

- Stripe account (sign up at [stripe.com](https://stripe.com))
- Access to your Stripe Dashboard
- Node.js and npm installed

## Step 1: Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete the registration process
3. Verify your email address

## Step 2: Get API Keys

### Test Mode (for Development)

1. Log into your Stripe Dashboard
2. Make sure you're in **Test Mode** (toggle in top right)
3. Navigate to: **Developers** → **API keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Live Mode (for Production)

1. Complete Stripe account verification
2. Switch to **Live Mode** in Stripe Dashboard
3. Navigate to: **Developers** → **API keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 3: Add Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Stripe Keys (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# For Production, replace with live keys:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
# STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
```

**Important:**
- Never commit `.env.local` to git
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` private

## Step 4: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application about payment events.

### Development (using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop install stripe

   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Production (using Stripe Dashboard)

1. Go to: **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your production URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`) and add to production environment variables

## Step 5: Configure Payment Settings

### Currency Settings

The system is configured for **USD payments** by default. To change:

1. Edit `src/app/api/create-payment-intent/route.ts`:
   ```typescript
   const paymentIntent = await stripe.paymentIntents.create({
     amount: amount * 100,
     currency: 'usd', // Change to 'egp' for Egyptian Pounds
     // ...
   })
   ```

2. Update pricing in both:
   - `src/app/api/create-payment-intent/route.ts` (PRICING constant)
   - `src/components/PaymentStep.tsx` (PRICING constant)

### Pricing Configuration

Current pricing (in USD):
```typescript
const PRICING = {
  initial: 500,        // Initial consultation: $500
  standard: 300,       // Standard consultation: $300
  followUp: 200,       // Follow-up session: $200
  premium: 750,        // Premium consultation: $750
  documentReview: 250, // Document review: $250
}
```

To modify prices:
1. Edit the PRICING constant in `src/app/api/create-payment-intent/route.ts`
2. Edit the PRICING constant in `src/components/PaymentStep.tsx`
3. Update pricing display in `src/app/(private)/booking/page.tsx`

## Step 6: Test the Integration

### Test Card Numbers

Use these test card numbers in development:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Exp: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Payment Requires Authentication (3D Secure):**
- Card: `4000 0025 0000 3155`

**Payment Declined:**
- Card: `4000 0000 0000 9995`

**Insufficient Funds:**
- Card: `4000 0000 0000 9995`

Full list: [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

### Testing Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Navigate to booking page: `http://localhost:3000/booking`

4. Complete booking flow:
   - Select consultation type
   - Choose date and time
   - Upload documents (optional)
   - Add client notes
   - Enter payment details using test card
   - Submit payment

5. Check Stripe Dashboard → Payments to see test payment

6. Check webhook events in terminal and Stripe Dashboard

## Step 7: Database Migration

Run the payment fields migration:

```bash
# Connect to your Supabase database and run:
# supabase/migrations/005_add_payment_fields.sql
```

Or through Supabase Dashboard:
1. Go to SQL Editor
2. Paste contents of `005_add_payment_fields.sql`
3. Run query

## Step 8: Go Live Checklist

Before going live with real payments:

- [ ] Complete Stripe account verification
- [ ] Add business bank account for payouts
- [ ] Switch to live API keys in production environment
- [ ] Set up production webhook endpoint
- [ ] Test live payment flow in staging environment
- [ ] Configure email notifications
- [ ] Set up refund policy
- [ ] Review Stripe Dashboard settings
- [ ] Enable fraud detection (Stripe Radar)
- [ ] Configure tax settings if applicable

## Pricing Fees

### Stripe Fees (USD)

**Standard pricing:**
- 2.9% + $0.30 per successful charge
- No setup fees
- No monthly fees
- No hidden costs

**International cards:**
- Additional 1.5% fee for cards issued outside US

**Currency conversion:**
- 1% fee if converting currencies

**Example calculation:**
```
Client pays: $500 USD
Stripe fee: $14.80 (2.9% + $0.30)
You receive: $485.20 USD
```

### Payout Schedule

- **Default:** 2-day rolling basis
- **Configurable:** Daily, weekly, or monthly
- **Can configure in:** Stripe Dashboard → Settings → Payouts

## Security Best Practices

1. **Never expose secret keys:**
   - Keep `STRIPE_SECRET_KEY` server-side only
   - Never commit to version control
   - Use environment variables

2. **Verify webhook signatures:**
   - Already implemented in `/api/webhooks/stripe/route.ts`
   - Prevents fake webhook calls

3. **Use HTTPS in production:**
   - Required for PCI compliance
   - Vercel/Netlify provide this automatically

4. **Enable Stripe Radar:**
   - Automatic fraud detection
   - Free with all Stripe accounts
   - Configure in Stripe Dashboard

5. **Implement proper error handling:**
   - Already implemented in payment components
   - Show user-friendly error messages

## Support & Troubleshooting

### Common Issues

**Issue:** Webhook not receiving events
- **Solution:** Check webhook secret is correct, verify endpoint URL, check Stripe CLI is running (dev)

**Issue:** Payment fails with "Invalid API key"
- **Solution:** Check API keys in `.env.local`, ensure you're using correct mode (test/live)

**Issue:** "No such payment_intent"
- **Solution:** Client secret may have expired, refresh payment intent

**Issue:** Currency mismatch
- **Solution:** Ensure currency in payment intent matches currency in PaymentElement

### Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Support](https://support.stripe.com/)
- [Test Cards](https://stripe.com/docs/testing)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

## Monitoring

### Stripe Dashboard

Monitor your payments in real-time:
- **Home:** Overview of revenue and activity
- **Payments:** All payment transactions
- **Customers:** Client information
- **Disputes:** Handle chargebacks
- **Radar:** Fraud detection insights

### Application Logs

Check application logs for payment-related events:
```bash
# Development
npm run dev

# Check webhook events
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Email Notifications

Configure Stripe to send emails for:
- Successful payments
- Failed payments
- Refunds
- Disputes

Settings → Emails → Configure notifications

## Advanced Features

### Refunds

To issue a refund programmatically:

```typescript
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const refund = await stripe.refunds.create({
  payment_intent: 'pi_xxxxxxxxxxxxx',
  amount: 50000, // $500.00 in cents (or partial refund)
  reason: 'requested_by_customer',
})
```

Or use Stripe Dashboard → Payments → Select payment → Refund

### Subscription Support

Currently configured for one-time payments. To add subscriptions:

1. Create products in Stripe Dashboard
2. Implement subscription flow
3. Handle subscription webhooks

### Multi-currency Support

To accept multiple currencies:

1. Update API to accept currency parameter
2. Configure pricing for each currency
3. Update UI to show currency selector

---

## Quick Start Summary

```bash
# 1. Install dependencies (already done)
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# 2. Add to .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 3. Start development server
npm run dev

# 4. Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 5. Test booking flow at http://localhost:3000/booking
```

---

**Need help?** Contact Stripe Support or review their comprehensive documentation.
