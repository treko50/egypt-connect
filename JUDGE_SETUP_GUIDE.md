# Judge Account Setup Guide

## Setting Up Judge Access for thalabi98@gmail.com

### Step 1: Update Database Role

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Open the file `supabase/set_judge_role.sql` (located in your project)
5. Copy the SQL commands and run them in the SQL Editor
6. You should see a confirmation that 1 row was updated

### Step 2: Access Judge Dashboard

Once the database is updated:

1. Sign in to the application with **thalabi98@gmail.com**
2. Navigate to `/admin/dashboard` or go directly to: `http://localhost:3006/admin/dashboard`
3. You should now see the Judge Dashboard

---

## Judge Dashboard Features

### Main Dashboard (`/admin/dashboard`)

**Stats Overview**
- Pending appointments count (needs confirmation)
- Confirmed appointments count (scheduled)
- Completed appointments count (finished)
- Total appointments count

**Filters**
- **All Appointments**: View all appointments
- **Upcoming**: Confirmed appointments scheduled for the future
- **Pending Approval**: New bookings waiting for your confirmation
- **Completed**: Past appointments that have been marked complete

**Appointments List**
Each appointment shows:
- Title and status badge (Pending/Confirmed/Completed/Cancelled)
- Consultation type (Initial/Follow-up/Premium/Document Review)
- Client name
- Scheduled date and time
- "View Details" button to see full appointment

---

### Appointment Detail View (`/admin/appointments/[id]`)

Click "View Details" on any appointment to access:

#### 1. Appointment Information
- Full title and description
- Current status
- Date and time range
- Consultation type
- Link to parent appointment (for follow-ups and document reviews)

#### 2. Client Information
- Full name
- Email address
- Phone number
- Location

#### 3. Client Notes
- Questions and context provided by the client during booking
- Helps you prepare for the consultation

#### 4. Documents
- **Current Appointment Documents**: Files uploaded for this specific appointment
- **Parent Appointment Documents**: If this is a follow-up or document review, you'll see documents from the original consultation
- Download any document by clicking the download icon
- View file details (size, uploader, upload date)

#### 5. Status Management
Update appointment status with one click:
- **Pending** → Awaiting your confirmation
- **Confirmed** → Appointment confirmed and scheduled
- **Completed** → Appointment finished
- **Cancelled** → Appointment cancelled

#### 6. Shared Notes (Visible to Client)
- Add session summary
- Provide recommendations
- Outline next steps
- These notes will be visible to the client after the appointment

**Example:**
```
- Reviewed employment contract terms
- Discussed legal options for breach of contract
- Recommended gathering additional documentation:
  - Pay stubs from last 3 months
  - Original signed contract
  - Email correspondence with employer
- Follow-up needed in 2 weeks to review progress
```

#### 7. Internal Notes (Private)
- Personal observations
- Case strategy
- Sensitive information
- Only visible to judges (not shared with clients)

**Example:**
```
- Client seems credible, case has merit
- Potential strategy: focus on breach of good faith clause
- May need to refer to labor law specialist if escalates
- Follow up on employer's response by end of month
```

#### 8. Save Changes
Click "Save All Changes" to update:
- Status changes
- Shared notes
- Internal notes

---

## Typical Workflow

### For New Appointments (Pending)

1. **Review** the appointment details
2. **Check** client notes to understand their needs
3. **Review** any uploaded documents
4. **Confirm** the appointment by changing status to "Confirmed"
5. **Add internal notes** about preparation needed
6. **Save changes**

### During/After Consultation

1. **Open** the appointment detail page
2. **Take notes** in the Shared Notes section during or after the session
3. **Add internal observations** in the Internal Notes (Private) section
4. **Upload any new documents** (if feature is added)
5. **Update status** to "Completed" when finished
6. **Save all changes**

### For Follow-up Appointments

1. **Review parent appointment** by clicking the link
2. **Check documents** from previous session (shown separately)
3. **Review previous notes** to provide continuity of care
4. **Add new notes** based on the follow-up discussion
5. **Update status** and **save**

---

## Quick Access URLs

- **Judge Dashboard**: `http://localhost:3006/admin/dashboard`
- **Specific Appointment**: `http://localhost:3006/admin/appointments/[appointment-id]`

---

## Security Notes

- The judge dashboard is protected and only accessible with the 'judge' role
- Non-judge users attempting to access will be redirected to `/unauthorized`
- All changes are tracked with timestamps in the database
- Internal notes are never exposed to clients via the API

---

## Troubleshooting

**Can't access /admin/dashboard?**
- Ensure the SQL script ran successfully
- Sign out and sign back in to refresh your session
- Check that your email in the database matches your Clerk login email

**Don't see any appointments?**
- Appointments are only shown if they're assigned to you
- Try different filters (All, Pending, Upcoming, Completed)
- Create a test appointment from the client side to verify

**Changes not saving?**
- Check browser console for errors
- Ensure you clicked "Save All Changes"
- Refresh the page to see if changes persisted

---

## Next Steps

After setting up your judge account:

1. ✅ Test the dashboard by creating a few sample appointments
2. ✅ Practice the workflow (Pending → Confirmed → Completed)
3. ✅ Add sample notes to understand the shared vs internal notes distinction
4. ✅ Test the document viewing and download features
5. ✅ Explore the parent appointment linking for follow-ups
