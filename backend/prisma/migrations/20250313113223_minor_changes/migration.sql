-- AlterTable
ALTER TABLE "TakeAssignment" ADD COLUMN     "score" DOUBLE PRECISION,
ALTER COLUMN "answers" DROP NOT NULL;
