// Shopify Buy Button Integration Configuration

export const SHOPIFY_CONFIG = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || 'your-store.myshopify.com',
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
  apiVersion: '2024-01',
}

// Product IDs for different consultation types
export const CONSULTATION_PRODUCTS = {
  initial: process.env.NEXT_PUBLIC_SHOPIFY_INITIAL_CONSULTATION_ID || '',
  followUp: process.env.NEXT_PUBLIC_SHOPIFY_FOLLOWUP_CONSULTATION_ID || '',
  extended: process.env.NEXT_PUBLIC_SHOPIFY_EXTENDED_CONSULTATION_ID || '',
}

// Shopify Storefront API types
export interface ShopifyProduct {
  id: string
  title: string
  description: string
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        priceV2: {
          amount: string
          currencyCode: string
        }
      }
    }>
  }
}

export interface CartItem {
  variantId: string
  quantity: number
  customAttributes?: Array<{
    key: string
    value: string
  }>
}
