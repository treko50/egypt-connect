# Supabase Setup Guide

## 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

## 2. Create New Project

1. Click "New Project"
2. Enter project details:
   - **Name**: egypt-connect
   - **Database Password**: (generate strong password - save it!)
   - **Region**: Choose closest to your users (e.g., Europe Central)
   - **Pricing Plan**: Free
3. Click "Create new project" (takes ~2 minutes)

## 3. Get API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGci...
service_role key: eyJhbGci... (keep this SECRET!)
```

## 4. Add Environment Variables

Create/update `.env.local` file:

```env
# Clerk (existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (NEW)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## 5. Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the editor
5. Click **Run** (bottom right)

You should see: "Success. No rows returned"

## 6. Verify Tables Created

1. Go to **Table Editor** in sidebar
2. You should see 4 tables:
   - ✅ users
   - ✅ appointments
   - ✅ documents
   - ✅ payments

## 7. Configure Storage (for documents)

1. Go to **Storage** in sidebar
2. Click "Create a new bucket"
3. Name: `documents`
4. Make it **private** (users can only access their own files)
5. Click "Create bucket"

## 8. Set Storage Policies

1. Click on the `documents` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. Choose "For full customization"
5. Add this policy:

**Name**: Users can upload own documents

**SELECT**:
```sql
(bucket_id = 'documents'::text)
AND (auth.uid()::text = (storage.foldername(name))[1])
```

**INSERT**:
```sql
(bucket_id = 'documents'::text)
AND (auth.uid()::text = (storage.foldername(name))[1])
```

**DELETE**:
```sql
(bucket_id = 'documents'::text)
AND (auth.uid()::text = (storage.foldername(name))[1])
```

## 9. Test Connection

Restart your Next.js dev server:
```bash
npm run dev
```

Check console - should see no Supabase errors.

## 10. Free Tier Limits

✅ **500MB** database storage
✅ **1GB** file storage
✅ **50K** monthly active users
✅ **2GB** bandwidth/month

**You're all set!** The app will now store user data in Supabase instead of Clerk's metadata.
