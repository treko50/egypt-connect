# Locale Redirect Fix

## Problem
When accessing the application, it was redirecting to `/ar` (Arabic) instead of `/en` (English) by default, showing a blank page.

## Root Cause
The `next-intl` middleware was detecting the browser's language preference (Accept-Language header) and automatically redirecting to `/ar` if the browser was set to Arabic.

## Solution Applied

### 1. Disabled Automatic Locale Detection
Updated `src/middleware.ts`:

```typescript
const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false  // ← Added this line
})
```

This ensures the app always defaults to English (`/en`) unless explicitly navigated to `/ar`.

### 2. Root Redirect
The root page (`src/app/page.tsx`) explicitly redirects to `/en`:

```typescript
export default function RootPage() {
  redirect('/en')
}
```

## How to Access the Application

### Correct URLs:
- ✅ **English**: `http://localhost:3000/en`
- ✅ **Arabic**: `http://localhost:3000/ar`

### Port Note:
The default Next.js dev server runs on port **3000**. If that port is already in use, it will try:
- Port 3001
- Port 3002
- Port 3003
- etc.

**Check your terminal** to see which port the server actually started on:
```
▲ Next.js 15.0.2
- Local:        http://localhost:3003  ← Use this URL
```

## How to Test Both Languages

### English Version:
1. Navigate to `http://localhost:3000/en`
2. Should see the homepage in English
3. All navigation links will stay on `/en/*` routes

### Arabic Version:
1. Navigate to `http://localhost:3000/ar`
2. Should see the homepage in Arabic with RTL layout
3. All navigation links will stay on `/ar/*` routes

### Language Switcher:
- The language switcher dropdown in the header allows toggling between English and Arabic
- It preserves the current page path (e.g., `/en/calendar` → `/ar/calendar`)

## If You Still See a Blank Page

### Troubleshooting Steps:

1. **Clear Browser Cache**
   ```
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito/Private mode
   ```

2. **Check Browser Console**
   ```
   - Press F12
   - Look for errors in the Console tab
   - Check Network tab for failed requests
   ```

3. **Kill All Old Processes**
   ```bash
   # Windows PowerShell
   Get-Process -Name node | Stop-Process -Force

   # Then restart
   npm run dev
   ```

4. **Verify You're on the Correct Port**
   - Don't assume it's port 3000
   - Check the terminal output
   - Use the exact URL shown

5. **Try Both Locales Directly**
   ```
   http://localhost:3000/en/calendar
   http://localhost:3000/ar/calendar
   http://localhost:3000/en/profile
   http://localhost:3000/ar/profile
   ```

## Expected Behavior After Fix

### Accessing Root (`/`):
1. Redirects to `/en` automatically
2. Shows English homepage
3. No more automatic redirect to `/ar`

### Direct Navigation:
- `/en` → English homepage ✅
- `/ar` → Arabic homepage (RTL) ✅
- `/en/calendar` → English calendar ✅
- `/ar/calendar` → Arabic calendar (RTL) ✅

### Browser Language Detection:
- **Disabled** by default
- App always starts in English
- User can manually switch to Arabic using language switcher

## Alternative: Enable Smart Detection

If you WANT the app to detect browser language, change the middleware:

```typescript
const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true  // ← Set to true
})
```

This will:
- Detect browser's Accept-Language header
- Redirect to `/ar` if browser is set to Arabic
- Redirect to `/en` if browser is set to English or other languages

## Testing Checklist

- [ ] Access `http://localhost:3000` → Should redirect to `/en`
- [ ] Access `http://localhost:3000/en` → Should show English homepage
- [ ] Access `http://localhost:3000/ar` → Should show Arabic homepage with RTL
- [ ] Click language switcher → Should toggle between `/en` and `/ar`
- [ ] Navigate to `/en/calendar` → Should show calendar in English
- [ ] Navigate to `/ar/calendar` → Should show calendar in Arabic (RTL)
- [ ] All pages render without blank screens
- [ ] No console errors

## Development Workflow

1. **Start Server**
   ```bash
   npm run dev
   ```

2. **Note the Port**
   ```
   - Local:        http://localhost:3000  ← Use this
   ```

3. **Open Browser**
   ```
   http://localhost:3000/en  ← Start here
   ```

4. **Test Language Switching**
   - Use the language switcher in the header
   - Or manually navigate to `/ar` routes

## Production Deployment Notes

When deploying to production:

1. Set `localeDetection: true` if you want automatic detection
2. Or keep it `false` for explicit English default
3. Ensure all environment variables are set
4. Test both `/en` and `/ar` routes in production
5. Verify RTL layout works correctly for Arabic

---

**Status**: ✅ **FIXED**
**Updated**: December 21, 2024
**Issue**: Redirecting to /ar instead of /en
**Solution**: Disabled automatic locale detection in middleware
