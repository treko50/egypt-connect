-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationInMinutes" INTEGER NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleAvailability" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,

    CONSTRAINT "ScheduleAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clerkUserIdIndex" ON "Event"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_clerkUserId_key" ON "Schedule"("clerkUserId");

-- CreateIndex
CREATE INDEX "scheduleIdIndex" ON "ScheduleAvailability"("scheduleId");

-- AddForeignKey
ALTER TABLE "ScheduleAvailability" ADD CONSTRAINT "ScheduleAvailability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
