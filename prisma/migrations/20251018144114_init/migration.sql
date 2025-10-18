-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV', 'BOOK', 'GAME');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "creators" JSONB,
    "coverImageUrl" TEXT,
    "description" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,
    "rating" DECIMAL(2,1),
    "note" TEXT,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "consumedOn" TIMESTAMP(3),

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaSource" (
    "id" TEXT NOT NULL,
    "mediaItemId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "LogEntry_userId_idx" ON "LogEntry"("userId");

-- CreateIndex
CREATE INDEX "LogEntry_mediaItemId_idx" ON "LogEntry"("mediaItemId");

-- CreateIndex
CREATE INDEX "MediaSource_provider_externalId_idx" ON "MediaSource"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaSource_mediaItemId_provider_key" ON "MediaSource"("mediaItemId", "provider");

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaSource" ADD CONSTRAINT "MediaSource_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
