# Local Testing Guide - Stripe Integration

This guide shows you how to test the complete appointment booking flow locally **without real payments** using Stripe's test mode.

## Prerequisites

- ✅ Stripe account created
- ✅ Test API keys from Stripe Dashboard
- ✅ Stripe CLI installed (optional but recommended)
- ✅ Database migration 005 applied
- ✅ Development server running

---

## Step 1: Set Up Test Mode

### Get Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy your test keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### Add to .env.local

```bash
# Test Mode Keys (NO REAL MONEY)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_SECRET_KEY=sk_test_51ABC123...

# Webhook secret (we'll get this next)
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Step 2: Set Up Webhook Testing (2 Options)

### Option A: Using Stripe CLI (Recommended)

**Install Stripe CLI:**
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows (with Scoop)
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

**Login and Forward Webhooks:**
```bash
# Login to Stripe
stripe login

# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Copy the webhook signing secret** displayed in terminal:
```
> Ready! Your webhook signing secret is whsec_abc123... (^C to quit)
```

Add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

### Option B: Skip Webhooks (Simpler, but incomplete)

If you don't want to set up webhooks yet:
1. Skip the webhook secret in `.env.local`
2. You can test payment UI, but appointments won't be created automatically
3. You'll need to manually create appointments for testing

---

## Step 3: Start Development Server

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2 (if using webhooks): Forward Stripe events
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Step 4: Test the Complete Booking Flow

### Navigate to Booking Page

Open your browser:
```
http://localhost:3000/booking
```

### Step-by-Step Testing

#### **Step 1: Select Consultation Type**
- Choose any consultation type (e.g., "Initial Consultation - $500")
- Select a date and time
- Fill in appointment details:
  - Title: "Test Legal Consultation"
  - Description: "Testing the booking system"
- Click **"Continue to Documents →"**

#### **Step 2: Upload Documents (Optional)**
- You can upload test files or skip this step
- Click **"Continue to Notes →"**

#### **Step 3: Add Client Notes**
- Add some test notes (optional):
  ```
  Test notes for the consultation.
  - Question 1
  - Question 2
  ```
- Click **"Continue to Payment →"**

#### **Step 4: Payment (TEST MODE)**

You'll see the Stripe payment form. Use these **test card numbers**:

**✅ Successful Payment:**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34 (any future date)
CVC: 123 (any 3 digits)
ZIP: 12345 (any 5 digits)
```

**🔒 3D Secure Authentication (Tests authentication flow):**
```
Card Number: 4000 0025 0000 3155
Expiry: 12/34
CVC: 123
ZIP: 12345
```
You'll see an authentication popup - click "Complete" to approve.

**❌ Declined Payment:**
```
Card Number: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
ZIP: 12345
```

**⚠️ Insufficient Funds:**
```
Card Number: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
ZIP: 12345
```

[Full test card list](https://stripe.com/docs/testing#cards)

---

## Step 5: Verify the Payment Flow

### What Happens After Payment:

1. **Payment Processing:**
   - Stripe processes the test payment instantly
   - You'll see "Processing Payment..." briefly

2. **Success Page:**
   - Redirects to `/booking/success`
   - Shows confirmation message
   - Displays next steps

3. **Webhook Event (if configured):**
   - Stripe sends `payment_intent.succeeded` event
   - Your webhook creates the appointment in database
   - Sets `payment_status` to 'paid'

4. **Check Terminal Logs:**
   ```bash
   # In Terminal 2 (Stripe CLI), you'll see:
   --> payment_intent.succeeded [evt_abc123]
   <-- [200] POST http://localhost:3000/api/webhooks/stripe
   ```

---

## Step 6: Verify in Stripe Dashboard

### View Test Payments

1. Go to [Stripe Dashboard → Payments](https://dashboard.stripe.com/test/payments)
2. You should see your test payment listed
3. Click on it to see full details:
   - Amount: $500.00
   - Status: Succeeded
   - Customer: (test email)
   - Metadata: appointment details

### View Webhook Events

1. Go to [Stripe Dashboard → Developers → Events](https://dashboard.stripe.com/test/events)
2. You'll see all webhook events triggered
3. Click on `payment_intent.succeeded` to see payload

---

## Step 7: Verify in Database

### Check Supabase Database

1. Go to Supabase Dashboard → Table Editor
2. Open `appointments` table
3. Find your test appointment:
   - `title`: "Test Legal Consultation"
   - `status`: "pending" (awaiting judge confirmation)
   - `payment_status`: "paid"
   - `payment_intent_id`: "pi_..." (Stripe ID)
   - `amount_paid`: 500
   - `currency`: "usd"

---

## Testing Different Scenarios

### Scenario 1: Successful Payment → Appointment Created
```
✅ Use card: 4242 4242 4242 4242
✅ Complete booking flow
✅ Check database for new appointment
✅ Verify payment_status = 'paid'
```

### Scenario 2: Failed Payment → No Appointment
```
❌ Use card: 4000 0000 0000 9995
❌ Payment fails
❌ User sees error message
❌ No appointment created in database
```

### Scenario 3: 3D Secure Authentication
```
🔒 Use card: 4000 0025 0000 3155
🔒 Complete authentication popup
✅ Payment succeeds after auth
✅ Appointment created
```

### Scenario 4: Follow-up Booking
**First, create a completed appointment:**
1. Book initial consultation (use test card)
2. Manually update in Supabase: `status = 'completed'`

**Then test follow-up:**
1. Go to `/booking`
2. Select "Follow-up Session"
3. Select the completed appointment
4. Complete payment
5. Verify `parent_appointment_id` is set

---

## Monitoring & Debugging

### Check Application Logs

```bash
# In Terminal 1 (dev server):
# You'll see logs like:

POST /api/create-payment-intent 200 in 1234ms
Payment intent created: pi_abc123
POST /api/webhooks/stripe 200 in 456ms
Payment succeeded: pi_abc123
Appointment created: appt_xyz789
```

### Check Stripe CLI Logs

```bash
# In Terminal 2:
# You'll see webhook events:

2024-12-24 02:30:15 --> payment_intent.created [evt_1]
2024-12-24 02:30:16 --> payment_intent.succeeded [evt_2]
2024-12-24 02:30:16 <-- [200] POST /api/webhooks/stripe
```

### Check Browser Console

```javascript
// Open DevTools → Console
// You'll see payment flow logs:

"Creating payment intent..."
"Payment intent created: pi_abc123"
"Payment successful!"
"Redirecting to success page..."
```

---

## Common Issues & Solutions

### Issue 1: "Failed to create payment intent"

**Possible Causes:**
- Invalid Stripe API keys
- Missing `.env.local` file
- Using live keys instead of test keys

**Solution:**
```bash
# Check .env.local has test keys
cat .env.local | grep STRIPE

# Should show pk_test_ and sk_test_
```

### Issue 2: Webhook not receiving events

**Possible Causes:**
- Stripe CLI not running
- Wrong webhook URL
- Incorrect webhook secret

**Solution:**
```bash
# Restart Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Verify the URL matches your dev server port
# Copy the new webhook secret to .env.local
```

### Issue 3: Appointment not created after payment

**Possible Causes:**
- Webhook not configured
- Database migration not applied
- Webhook signature verification failed

**Solution:**
```bash
# Check webhook is receiving events
# Check Terminal 2 for webhook logs

# Check database migration 005 is applied
# Go to Supabase → Database → check appointments table has payment fields

# Check webhook secret is correct in .env.local
```

### Issue 4: CORS errors

**Solution:**
- Stripe Elements should work on localhost
- If you see CORS issues, ensure you're using `http://localhost:3000` not `127.0.0.1`

---

## Test Payment Amounts

You can test different amounts by modifying the booking:

**Current Pricing (USD):**
- Initial Consultation: $500
- Standard Consultation: $300
- Follow-up Session: $200
- Premium Consultation: $750
- Document Review: $250

**To test custom amounts:**
Edit `src/app/api/create-payment-intent/route.ts`:
```typescript
const PRICING = {
  initial: 10,    // Test with $10 instead of $500
  standard: 5,
  // etc.
}
```

---

## Testing Without Webhooks

If you skip webhook setup, you can still test the payment UI:

1. **Manual Appointment Creation:**
   ```sql
   -- Create test appointment in Supabase
   INSERT INTO appointments (
     user_id,
     title,
     start_time,
     end_time,
     consultation_type,
     status,
     payment_status,
     amount_paid,
     currency
   ) VALUES (
     'your-user-id',
     'Test Appointment',
     '2024-02-01 10:00:00',
     '2024-02-01 11:00:00',
     'initial',
     'pending',
     'paid',
     500,
     'usd'
   );
   ```

2. **Test Payment UI Only:**
   - Complete booking flow
   - Enter test card
   - Payment will succeed in Stripe
   - But appointment won't auto-create
   - Manually create it in Supabase for further testing

---

## Judge Dashboard Testing

After creating test appointments:

1. **Set your user as a judge:**
   ```sql
   UPDATE users
   SET role = 'judge'
   WHERE clerk_id = 'your-clerk-id';
   ```

2. **Access judge dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```

3. **Test features:**
   - View all appointments
   - Filter by status
   - Click "View Details" on appointment
   - Update status (pending → confirmed → completed)
   - Add judge notes (shared with client)
   - Add internal notes (private)
   - Save changes

---

## End-to-End Test Checklist

- [ ] Environment variables configured
- [ ] Stripe CLI running (webhook forwarding)
- [ ] Dev server running (`npm run dev`)
- [ ] Navigate to `/booking`
- [ ] Select consultation type
- [ ] Choose date/time
- [ ] Fill appointment details
- [ ] Upload document (optional)
- [ ] Add client notes
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] See success page
- [ ] Verify webhook event in Terminal 2
- [ ] Check Stripe Dashboard for payment
- [ ] Check Supabase for appointment
- [ ] Verify `payment_status = 'paid'`
- [ ] Set user as judge in database
- [ ] Access `/admin/dashboard`
- [ ] View appointment details
- [ ] Update appointment status
- [ ] Add judge notes
- [ ] Save changes

---

## Important Reminders

🔒 **Security:**
- Test keys only work in test mode
- No real money is charged
- Test cards are detected and blocked in live mode

💡 **Best Practices:**
- Always use test mode during development
- Never commit API keys to git
- Use webhook forwarding for local testing
- Check Stripe Dashboard regularly

⚠️ **Limitations:**
- Test mode has no real money
- Some features behave differently (e.g., payouts)
- Test data is separate from live data
- Test webhooks may have slight delays

---

## Quick Reference: Test Cards

| Scenario | Card Number | Result |
|----------|------------|--------|
| Success | `4242 4242 4242 4242` | ✅ Payment succeeds |
| 3D Secure | `4000 0025 0000 3155` | 🔒 Requires authentication |
| Declined | `4000 0000 0000 9995` | ❌ Payment declined |
| Insufficient Funds | `4000 0000 0000 9995` | ❌ Insufficient funds |
| Expired Card | `4000 0000 0000 0069` | ❌ Expired card |
| Incorrect CVC | `4000 0000 0000 0127` | ❌ Incorrect CVC |

**All test cards:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

---

## Need Help?

- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Test Card Numbers](https://stripe.com/docs/testing#cards)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

Happy testing! 🎉
