# Shopify Integration for Egypt Connect

This document explains how to set up Shopify for booking consultations with Judge Hatem Elnahal.

## Setup Steps

### 1. Create Shopify Store
1. Sign up for Shopify at https://www.shopify.com
2. Choose a plan (Basic Shopify or higher)
3. Complete store setup

### 2. Create Consultation Products
Create three products in your Shopify store:

**Initial Consultation**
- Title: "Initial Legal Consultation with Judge Hatem Elnahal"
- Price: 500 EGP
- Duration: 60 minutes
- Description: First-time consultation to discuss your legal matter

**Follow-up Consultation**
- Title: "Follow-up Legal Consultation"
- Price: 300 EGP
- Duration: 30 minutes
- Description: Continuation of ongoing legal matter

**Extended Consultation**
- Title: "Extended Legal Consultation"
- Price: 900 EGP
- Duration: 120 minutes
- Description: In-depth consultation for complex legal matters

### 3. Get Storefront API Access Token
1. Go to Shopify Admin > Apps > Develop apps
2. Click "Create an app"
3. Name it "Egypt Connect Booking"
4. Go to "Configuration" tab
5. Under "Storefront API" click "Configure"
6. Enable the following scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
7. Save and install the app
8. Copy the "Storefront API access token"

### 4. Configure Environment Variables
Update your `.env.local` file:

```bash
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_INITIAL_CONSULTATION_ID=gid://shopify/Product/YOUR_PRODUCT_ID
NEXT_PUBLIC_SHOPIFY_FOLLOWUP_CONSULTATION_ID=gid://shopify/Product/YOUR_PRODUCT_ID
NEXT_PUBLIC_SHOPIFY_EXTENDED_CONSULTATION_ID=gid://shopify/Product/YOUR_PRODUCT_ID
```

### 5. Get Product IDs
1. Go to your product in Shopify Admin
2. Look at the URL: `https://admin.shopify.com/store/your-store/products/1234567890`
3. The number at the end is your product ID
4. Convert to GraphQL ID format: `gid://shopify/Product/1234567890`

### 6. Install Dependencies

```bash
npm install shopify-buy
```

### 7. Implement Shopify Storefront API (Optional)

For a complete integration, update `src/components/ShopifyBookingWidget.tsx` to use the Shopify Storefront API:

```typescript
import Client from 'shopify-buy'

const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
})

// Create checkout with custom attributes
const checkout = await client.checkout.create({
  lineItems: [{
    variantId: productVariantId,
    quantity: 1,
    customAttributes: [
      { key: 'Appointment Date', value: date.toISOString() },
      { key: 'Time Slot', value: timeSlot },
      { key: 'Consultation Type', value: consultationType },
    ],
  }],
})

// Redirect to Shopify checkout
window.location.href = checkout.webUrl
```

## Payment Methods

Shopify supports:
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Digital Wallets (Apple Pay, Google Pay)
- Bank Transfers
- Cash on Delivery (if enabled)

## Webhooks (Optional)

Set up webhooks in Shopify to receive booking confirmations:

1. Go to Settings > Notifications > Webhooks
2. Add webhook for "Order creation"
3. URL: `https://your-domain.com/api/webhooks/shopify`
4. This will notify your app when someone books

## Testing

Use Shopify's Bogus Gateway for testing:
- Card: 1 (16 times)
- Expiry: Any future date
- CVV: Any 3 digits

## Resources

- [Shopify Storefront API Docs](https://shopify.dev/docs/api/storefront)
- [Shopify Buy Button SDK](https://shopify.dev/docs/custom-storefronts/tools/buy-button)
- [Custom Storefronts Guide](https://shopify.dev/docs/custom-storefronts)
