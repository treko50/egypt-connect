# Appointment-Based Architecture Design

## Overview
This document outlines the restructured architecture for appointment management, document handling, and role-based access.

## Key Changes

### 1. Documents Move to Appointment Level
**Before**: Documents stored at user level with no context
**After**: Documents belong to specific appointments

**Benefits**:
- Documents have context (which case/session)
- Judge can review documents per appointment
- Better organization for multi-session clients

### 2. Role-Based Access Control

#### Roles:
- **Client**: Books appointments, uploads documents, views own data
- **Judge**: Admin access, sees all appointments, manages all documents

#### Judge User Setup:
```sql
UPDATE users SET
  role = 'judge',
  judge_title = 'Senior Legal Consultant & Judge',
  is_accepting_bookings = true
WHERE email = 'judge@egyptconnect.com';
```

### 3. Appointment Hierarchy

```
Initial Consultation (required first)
    ├── Follow-up #1
    ├── Follow-up #2
    └── Follow-up #3
```

**Rules**:
- Clients must complete an initial consultation before booking follow-ups
- Follow-ups link to their parent appointment via `parent_appointment_id`
- Judge can see full appointment chain and all related documents

### 4. Three Types of Notes

| Note Type | Visible to Client | Visible to Judge | Purpose |
|-----------|------------------|------------------|---------|
| `client_notes` | ✅ (write) | ✅ (read) | Client's questions/context before session |
| `judge_notes` | ✅ (read) | ✅ (write) | Shared session summary, recommendations |
| `internal_notes` | ❌ | ✅ (write) | Private judge notes |

## Database Schema

### Updated Tables

#### `users`
```sql
+ role VARCHAR(20) DEFAULT 'client'
+ judge_title VARCHAR(100)
+ judge_bio TEXT
+ judge_specialties TEXT[]
+ is_accepting_bookings BOOLEAN DEFAULT false
```

#### `appointments`
```sql
+ assigned_judge_id UUID          -- Auto-assigned, supports future multi-judge
+ parent_appointment_id UUID      -- Links follow-ups to initial
+ consultation_type VARCHAR(50)   -- 'initial', 'followUp', etc.
+ client_notes TEXT               -- Client's pre-session notes
+ judge_notes TEXT                -- Shared notes
+ internal_notes TEXT             -- Judge-only notes
```

#### `documents`
```sql
- user_id UUID                    -- REMOVED: Redundant (user accessible via appointment)
+ appointment_id UUID             -- Links to appointment (user via appointments.user_id)
+ uploaded_by VARCHAR(20)         -- 'client' or 'judge'
+ description TEXT                -- What is this document?
```

## New Features

### For Clients:

1. **Enhanced Booking Flow**
   - Step 1: Select date/time/type
   - Step 2: Upload documents (optional)
   - Step 3: Add notes/questions for judge
   - Step 4: Payment
   - After booking: Can add more documents until appointment time

2. **Follow-up Booking**
   - Only available if they have completed appointments
   - Select which previous appointment to follow up on
   - See documents from previous session
   - See judge notes from previous session

3. **Appointment History**
   - View all past and upcoming appointments
   - See judge notes for completed sessions
   - Download documents per session

### For Judge (Admin):

1. **Dashboard** (`/admin/dashboard`)
   - Calendar view of all appointments
   - Filter by status, date, consultation type
   - Search clients

2. **Appointment Detail View**
   - Client information
   - Full appointment chain (if follow-up)
   - All documents for this session
   - Documents from previous sessions (if follow-up)
   - Add judge notes (shared with client)
   - Add internal notes (private)

3. **Document Management**
   - Upload documents on behalf of client
   - Download all documents for a case
   - Add document descriptions

## Implementation Phases

### Phase 1: Database Migration ✅
- [x] Create migration files (003 & 004)
- [x] Run migration 003 in Supabase
- [ ] Run migration 004 in Supabase (removes redundant user_id from documents)
- [x] Update TypeScript types
- [ ] Test database constraints

### Phase 2: Remove User-Level Documents
Files to modify:
- [ ] Remove "Documents" tab from `/settings` page
- [ ] Update navigation
- [ ] Archive or migrate existing user-level documents

### Phase 3: Enhanced Booking Flow
New/Modified files:
- [ ] Create `BookingFlowProvider` context
- [ ] Create `DocumentUploadStep` component
- [ ] Create `ClientNotesStep` component
- [ ] Modify `/calendar` page to include multi-step flow
- [ ] Update booking API to accept documents and notes

### Phase 4: Follow-up Booking Logic
New/Modified files:
- [ ] Create API route to fetch completed appointments: `GET /api/appointments/completed`
- [ ] Create `FollowUpSelector` component
- [ ] Modify booking flow to show parent appointment selector
- [ ] Add validation: prevent follow-up without completed appointment

### Phase 5: Judge Dashboard
New files:
- [ ] `/admin/dashboard/page.tsx` - Main dashboard
- [ ] `/admin/appointments/[id]/page.tsx` - Appointment detail
- [ ] `components/admin/AppointmentCalendar.tsx`
- [ ] `components/admin/AppointmentDetailView.tsx`
- [ ] `components/admin/JudgeNotesEditor.tsx`
- [ ] `components/admin/AppointmentDocuments.tsx`
- [ ] Middleware to protect `/admin/*` routes (role check)

### Phase 6: API Routes
New/Modified:
- [ ] `GET /api/admin/appointments` - All appointments for judge
- [ ] `GET /api/appointments/[id]` - Single appointment with documents
- [ ] `POST /api/appointments/[id]/notes` - Add/update judge notes
- [ ] `GET /api/appointments/[id]/documents` - Get documents for appointment
- [ ] `POST /api/appointments/[id]/documents` - Upload document
- [ ] `GET /api/appointments/completed` - Completed appointments for follow-up

## Access Control Middleware

```typescript
// middleware/requireJudge.ts
export function requireJudge() {
  const { userId } = await auth()
  const user = await getUser(userId)

  if (user.role !== 'judge') {
    redirect('/unauthorized')
  }
}
```

## UI Components Needed

### Client-Facing:
1. `BookingFlowStepper` - Multi-step booking wizard
2. `DocumentUploadZone` - Drag-drop document upload
3. `AppointmentHistory` - List of past appointments
4. `FollowUpSelector` - Choose parent appointment
5. `SessionDocuments` - View documents per session

### Judge Dashboard:
1. `AppointmentCalendar` - Full calendar with all bookings
2. `AppointmentCard` - Preview card in list view
3. `AppointmentDetailPanel` - Full appointment details
4. `DocumentViewer` - View/download documents
5. `NotesEditor` - Rich text editor for notes
6. `ClientHistoryTimeline` - Visual timeline of client's appointments

## Database Views for Performance

### `judge_appointments_view`
Pre-joins appointment, client, and document count for dashboard.

### `client_appointments_view`
Filtered view showing only client's own appointments.

## Migration Steps

1. **Backup database** before running migration
2. Run migration SQL in Supabase SQL Editor
3. Verify triggers and constraints work
4. Set judge user role manually if needed
5. Update application TypeScript types
6. Deploy changes in phases

## Future Enhancements

1. **Multiple Judges**: Already supported via `assigned_judge_id`
2. **Judge Availability**: Add calendar blocking for judges
3. **Appointment Templates**: Pre-filled documents for certain case types
4. **Document OCR**: Extract text from uploaded PDFs
5. **Client Portal**: Dedicated client dashboard
6. **Email Notifications**: When judge adds notes
7. **Video Conferencing**: Integrate Zoom/Meet for remote sessions

## Testing Checklist

- [ ] Client can book initial consultation
- [ ] Client cannot book follow-up without completed appointment
- [ ] Documents upload to specific appointment
- [ ] Judge can see all appointments
- [ ] Judge can add shared notes
- [ ] Judge can add private notes
- [ ] Client can see judge shared notes
- [ ] Client cannot see internal notes
- [ ] Follow-up shows parent appointment documents
- [ ] Auto-assign judge works
- [ ] Role-based route protection works
