# Vercel Deployment Guide

## Quick Start

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   Go to Project Settings → Environment Variables and add all variables from `.env.example`:

   **Required:**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_SES_FROM_EMAIL`
   - `CRON_SECRET` (generate with `openssl rand -base64 32`)

   **Optional:**
   - `WHEREBY_API_KEY`
   - `MULTI_AGENT_SERVICE_URL`
   - `MULTI_AGENT_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Cron Jobs Configuration

### Current Setup (Hobby Plan Compatible)

The app includes automated cron jobs in `vercel.json`:

- **Complete Appointments**: Runs daily at midnight UTC
- **Send Reminders**: Runs daily at 8 AM UTC

**⚠️ Important**: Vercel Hobby plan only supports daily cron jobs.

### For Pro Plan Users

If you have Vercel Pro, you can increase cron frequency:

1. Edit `vercel.json`
2. Update `schedule` fields
3. Commit and push

**Example Pro Plan Config:**
```json
{
  "crons": [
    {
      "path": "/api/cron/complete-appointments",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```

📖 **Full Guide**: See [CRON_CONFIGURATION.md](./CRON_CONFIGURATION.md) for detailed cron setup instructions.

## Post-Deployment Steps

### 1. Update Clerk Webhook

Add your Vercel domain to Clerk:
1. Go to Clerk Dashboard → Webhooks
2. Update webhook URL to: `https://your-domain.vercel.app/api/webhooks/clerk`

### 2. Update Stripe Webhook

Add your Vercel domain to Stripe:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Update `STRIPE_WEBHOOK_SECRET` in Vercel env vars with new signing secret

### 3. Update AWS SES

If using a custom domain:
1. Verify your domain in AWS SES
2. Update `AWS_SES_FROM_EMAIL` to use your domain
3. Update environment variable in Vercel

### 4. Test Cron Jobs

Manually trigger cron endpoints to verify they work:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/complete-appointments
```

### 5. Update Application URLs

Update these environment variables with your Vercel URL:
- `NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app`
- Update any email templates with correct URLs

## Custom Domain (Optional)

### Add Custom Domain

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Configure DNS as instructed by Vercel

### Update Environment Variables

After adding custom domain:
1. Update `NEXT_PUBLIC_APP_URL` to your custom domain
2. Update webhook URLs in Clerk and Stripe
3. Redeploy to apply changes

## Monitoring & Logs

### View Logs

- **Runtime Logs**: Deployments → Click deployment → Runtime Logs
- **Build Logs**: Deployments → Click deployment → Build Logs
- **Cron Logs**: Filter logs by `/api/cron`

### Analytics

Vercel provides built-in analytics:
- Dashboard → Your Project → Analytics
- View page views, performance metrics, errors

### Alerts

Set up alerts for:
- Failed deployments
- Runtime errors
- Cron job failures

Go to Project Settings → Notifications

## Troubleshooting

### Build Failures

**Check:**
1. All dependencies in `package.json`
2. Build logs for specific errors
3. Environment variables are set correctly

**Common Issues:**
- Missing environment variables
- TypeScript errors
- Import/export issues

### Runtime Errors

**Check:**
1. Runtime logs in Vercel dashboard
2. Environment variables in production
3. Database connection (Supabase)
4. API keys are valid

### Cron Job Not Running

**Check:**
1. Settings → Cron Jobs shows jobs are enabled
2. `CRON_SECRET` is set in environment variables
3. Cron schedule is valid for your plan (daily for hobby)
4. Runtime logs for cron errors

**Solution:**
See [CRON_CONFIGURATION.md](./CRON_CONFIGURATION.md) for detailed troubleshooting.

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk authentication public key |
| `CLERK_SECRET_KEY` | Yes | Clerk authentication secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe public key |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (full access) |
| `AWS_REGION` | Yes | AWS region for SES |
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key for SES |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key for SES |
| `AWS_SES_FROM_EMAIL` | Yes | Sender email address |
| `CRON_SECRET` | Yes | Secret to secure cron endpoints |
| `WHEREBY_API_KEY` | No | Whereby video meeting API key |
| `MULTI_AGENT_SERVICE_URL` | No | Multi-agent service URL |

## Performance Optimization

### Edge Functions

Some routes can be deployed to Vercel Edge for better performance:
- Static pages
- API routes with minimal logic

### Caching

Vercel automatically caches:
- Static assets
- Built pages
- API responses (with proper headers)

### Image Optimization

Vercel optimizes images automatically:
- Uses Next.js Image component
- Serves WebP when supported
- Responsive images

## Cost Optimization (Hobby Plan)

### Stay Within Limits

**Hobby Plan Includes:**
- 100 GB bandwidth/month
- Unlimited static requests
- 100 GB-hours serverless execution
- Daily cron jobs only

**To Optimize:**
1. Use ISR (Incremental Static Regeneration) for mostly-static pages
2. Cache API responses when possible
3. Optimize images
4. Use daily cron jobs (already configured)

### Monitor Usage

Dashboard → Your Project → Usage shows:
- Bandwidth consumption
- Serverless execution time
- Build minutes used

## Upgrading to Pro

Benefits of Pro plan ($20/month):
- 1 TB bandwidth
- Advanced analytics
- Hourly/minute-level cron jobs
- Password protection
- Priority support

To upgrade:
1. Dashboard → Account Settings → Billing
2. Select Pro plan
3. Update `vercel.json` cron schedules as needed

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Community**: https://github.com/vercel/vercel/discussions

## Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Webhooks updated (Clerk, Stripe)
- [ ] Custom domain configured (if applicable)
- [ ] Cron jobs tested manually
- [ ] AWS SES domain verified
- [ ] Database seeded with initial data
- [ ] Test accounts created
- [ ] Error monitoring set up
- [ ] Analytics enabled
- [ ] Backup plan for database
- [ ] Documentation updated with production URLs
