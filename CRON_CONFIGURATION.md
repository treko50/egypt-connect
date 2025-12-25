# Cron Jobs Configuration Guide

This app uses Vercel Cron Jobs to automate appointment management tasks.

## Current Cron Jobs

### 1. Complete Appointments (`/api/cron/complete-appointments`)
- **What it does**: Automatically marks confirmed appointments as "completed" after their end time passes
- **Default Schedule**: Daily at midnight UTC (`0 0 * * *`)
- **Hobby Plan Compatible**: ✅ Yes

### 2. Send Reminders (`/api/cron/send-reminders`)
- **What it does**: Sends email reminders to clients 24 hours before their confirmed appointments
- **Default Schedule**: Daily at 8 AM UTC (`0 8 * * *`)
- **Hobby Plan Compatible**: ✅ Yes

## Vercel Plan Limitations

### Hobby Plan (Free)
- ✅ **Allowed**: Daily cron jobs only
- ❌ **Not Allowed**: Hourly, every 15 minutes, etc.
- **Current Config**: Already optimized for hobby plan

### Pro Plan ($20/month)
- ✅ **Allowed**: Any frequency (hourly, every 15 min, etc.)
- **Recommended Config**: See below

## How to Change Cron Schedules

### Step 1: Edit `vercel.json`

Open `vercel.json` and modify the `schedule` field:

```json
{
  "crons": [
    {
      "path": "/api/cron/complete-appointments",
      "schedule": "YOUR_SCHEDULE_HERE"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "YOUR_SCHEDULE_HERE"
    }
  ]
}
```

### Step 2: Choose Your Schedule

**Cron Syntax**: `minute hour day month day-of-week`

Common patterns:
- `0 0 * * *` - Daily at midnight
- `0 */6 * * *` - Every 6 hours
- `0 * * * *` - Every hour
- `*/30 * * * *` - Every 30 minutes
- `*/15 * * * *` - Every 15 minutes
- `*/5 * * * *` - Every 5 minutes

### Step 3: Deploy

```bash
git add vercel.json
git commit -m "Update cron schedules"
git push
```

Vercel will automatically update the cron jobs on the next deployment.

## Recommended Schedules by Plan

### Hobby Plan (Current Default)

```json
{
  "crons": [
    {
      "path": "/api/cron/complete-appointments",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

**Trade-offs**:
- ✅ Free
- ❌ Appointments only complete once per day
- ❌ Reminders only sent once per day (may miss appointments booked same-day)

### Pro Plan - Balanced (Recommended)

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

**Trade-offs**:
- ✅ Appointments complete every 6 hours (max 6 hour delay)
- ✅ Reminders checked every hour
- ✅ Good balance of responsiveness and resource usage

### Pro Plan - High Frequency

```json
{
  "crons": [
    {
      "path": "/api/cron/complete-appointments",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

**Trade-offs**:
- ✅ Very responsive (15-30 min delays max)
- ⚠️ Higher resource usage
- ⚠️ More function invocations (may increase costs at scale)

## Security: Cron Secret

Both cron endpoints are protected by a secret token to prevent unauthorized access.

### Setup

1. Add `CRON_SECRET` to your `.env` file:
   ```
   CRON_SECRET=your-random-secret-here
   ```

2. Add the same secret to Vercel environment variables:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `CRON_SECRET` with the same value
   - Scope: Production, Preview, Development

3. Generate a secure secret:
   ```bash
   # On Mac/Linux
   openssl rand -base64 32

   # Or use any password generator
   ```

### How It Works

When Vercel triggers a cron job, it sends an `Authorization` header:
```
Authorization: Bearer <your-cron-secret>
```

The API endpoints verify this matches your `CRON_SECRET` before executing.

## Manual Testing

You can test cron endpoints locally or in production:

### Local Testing

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/complete-appointments
```

### Production Testing

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/send-reminders
```

## Monitoring

### View Cron Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on a deployment → Runtime Logs
3. Filter by `/api/cron` to see cron job executions

### Check Last Run

Vercel Dashboard → Your Project → Settings → Cron Jobs shows:
- Last execution time
- Success/failure status
- Next scheduled run

## Troubleshooting

### Cron Job Not Running

1. **Check Vercel Dashboard**: Settings → Cron Jobs
   - Verify crons are enabled
   - Check last execution status

2. **Verify Schedule**:
   - Use [crontab.guru](https://crontab.guru) to validate your cron expression
   - Ensure it's compatible with your Vercel plan

3. **Check Environment Variables**:
   - Verify `CRON_SECRET` is set in Vercel
   - Check Supabase credentials are set

4. **Review Logs**:
   - Deployments → Runtime Logs
   - Look for errors in `/api/cron/*` endpoints

### "Unauthorized" Errors

- `CRON_SECRET` mismatch between `.env` and Vercel
- Secret not set in Vercel environment variables
- Typo in the secret value

### Cron Limit Exceeded (Hobby Plan)

Error: "Hobby accounts are limited to daily cron jobs"

**Solution**: Change schedules to daily:
- `0 0 * * *` or `0 [hour] * * *`
- Or upgrade to Pro plan

## Alternative: Self-Hosted Cron

If you need more frequent runs without upgrading:

### Option 1: External Cron Service

Use a service like [cron-job.org](https://cron-job.org):
1. Create account
2. Add HTTP request to your API endpoints
3. Set frequency as needed
4. Add your `CRON_SECRET` as Authorization header

### Option 2: GitHub Actions

Create `.github/workflows/cron.yml`:

```yaml
name: Cron Jobs
on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes

jobs:
  complete-appointments:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron
        run: |
          curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://your-domain.com/api/cron/complete-appointments
```

### Option 3: Render/Railway Cron

Deploy on Render or Railway which offer more generous cron limits on free tiers.

## Best Practices

1. **Start Conservative**: Begin with daily crons, increase frequency only if needed
2. **Monitor Costs**: Higher frequency = more invocations = potential cost increase
3. **Set Alerts**: Use Vercel's monitoring to alert on cron failures
4. **Test Thoroughly**: Always test cron endpoints manually before relying on scheduled runs
5. **Document Changes**: Keep a changelog of schedule modifications

## Questions?

- Vercel Cron Docs: https://vercel.com/docs/cron-jobs
- Cron Syntax: https://crontab.guru
- Support: Check Vercel dashboard for cron job status and logs
