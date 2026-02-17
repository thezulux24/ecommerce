-- AlterTable
ALTER TABLE "Bundle" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];
