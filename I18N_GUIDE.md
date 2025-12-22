# Multi-Language Support (i18n)

Egypt Connect now supports **English** and **Arabic** with full RTL (Right-to-Left) layout support for Arabic.

## 🌍 Features

- **Two Languages**: English (en) and Arabic (ar)
- **RTL Layout**: Automatic RTL layout for Arabic
- **URL-based Routing**: Clean URLs like `/en/calendar` and `/ar/calendar`
- **Language Switcher**: Easy toggle between languages in the header
- **Full Translation**: All UI text, labels, and content translated
- **SEO-Friendly**: Proper locale metadata and language tags

## 🚀 Quick Usage

### For Users

1. Click the **Globe icon** (🌐) in the header
2. Select **English** or **العربية** (Arabic)
3. The page will reload in the selected language
4. The URL will update to reflect the locale

### For Developers

#### Using Translations in Components

```typescript
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('navigation')
  
  return <h1>{t('home')}</h1>
}
```

#### Adding New Translations

1. Open `messages/en.json` for English
2. Add your translation key:
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My description"
  }
}
```

3. Open `messages/ar.json` for Arabic
4. Add the Arabic translation:
```json
{
  "mySection": {
    "title": "عنواني",
    "description": "وصفي"
  }
}
```

## 📁 File Structure

```
messages/
├── en.json          # English translations
└── ar.json          # Arabic translations

src/
├── i18n.ts          # i18n configuration
├── middleware.ts    # Locale detection and routing
└── components/
    └── LanguageSwitcher.tsx  # Language switcher component
```

## 🎨 RTL Support

The app automatically applies RTL layout for Arabic:

- Layout direction changes to right-to-left
- Navigation aligns to the right
- Text flows from right to left
- Icons and UI elements flip appropriately

### CSS Classes for RTL

```css
/* Automatically flips in RTL */
[dir="rtl"] .rtl\:flip {
  transform: scaleX(-1);
}

/* Text alignment */
[dir="rtl"] .rtl\:text-right {
  text-align: right;
}
```

## 🔧 Configuration

### Supported Locales

Currently supported: `en` (English) and `ar` (Arabic)

To add more languages:

1. Add locale to `src/i18n.ts`:
```typescript
export const locales = ['en', 'ar', 'fr'] as const
```

2. Create translation file `messages/fr.json`

3. Update middleware in `src/middleware.ts`:
```typescript
const intlMiddleware = createMiddleware({
  locales: ['en', 'ar', 'fr'],
  defaultLocale: 'en'
})
```

### Default Locale

The default locale is **English (en)**. Users without a locale preference will see English.

## 📝 Translation Keys

### Main Sections

- `common` - Common UI elements (language names, buttons)
- `navigation` - Navigation menu items
- `home` - Landing page content
- `calendar` - Calendar page
- `profile` - Profile page  
- `booking` - Booking widget
- `judge` - Judge information
- `footer` - Footer content

### Example Usage

```typescript
const t = useTranslations('home')
t('title')              // "Schedule Your Legal Consultation..."
t('features.title')     // "Why Choose Our Platform"
```

## 🌐 URLs

The app uses **locale prefixes** for non-English languages:

- English: `https://egyptconnect.com/` or `/en/`
- Arabic: `https://egyptconnect.com/ar/`

Examples:
- `/en/calendar` - Calendar in English
- `/ar/calendar` - Calendar in Arabic (التقويم)
- `/en/profile` - Profile in English
- `/ar/profile` - Profile in Arabic (الملف الشخصي)

## 🎯 Best Practices

1. **Always use translation keys** - Never hardcode text
2. **Keep keys organized** - Use nested objects for related content
3. **Provide context** - Use descriptive key names
4. **Test both languages** - Ensure layouts work in both LTR and RTL
5. **Consider text length** - Arabic text can be longer/shorter than English

## 🔍 Testing

### Switch Languages

1. Visit http://localhost:3000
2. Click the Globe icon in header
3. Select Arabic (العربية)
4. Verify RTL layout
5. Check all pages work correctly

### Verify Translations

- Check all buttons and labels are translated
- Verify no English text appears in Arabic mode
- Test navigation in both languages
- Confirm date/time formats are appropriate

## 💡 Tips

- **Arabic Typography**: The app uses Inter font which supports Arabic characters
- **Numbers**: Consider using Arabic-Indic numerals for Arabic locale if needed
- **Dates**: Use `toLocaleDateString()` with locale parameter for proper formatting
- **Currency**: EGP (Egyptian Pound) formatting should match locale

## 🐛 Troubleshooting

**Issue**: Language switcher not working
- Clear browser cache
- Check middleware configuration
- Verify translation files exist

**Issue**: Layout broken in Arabic
- Check RTL CSS classes
- Verify `dir="rtl"` attribute on html tag
- Test flexbox and grid layouts

**Issue**: Missing translations
- Check translation key exists in both en.json and ar.json
- Verify no typos in translation keys
- Restart dev server after adding new keys

---

For more information, see [next-intl documentation](https://next-intl-docs.vercel.app/).
