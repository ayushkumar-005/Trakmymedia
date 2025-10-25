-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileComplete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "passwordHash" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;
