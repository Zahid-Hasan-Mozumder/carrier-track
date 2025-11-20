-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FulfillmentStatus" ADD VALUE 'LABEL_PURCHASED';
ALTER TYPE "FulfillmentStatus" ADD VALUE 'LABEL_PRINTED';
ALTER TYPE "FulfillmentStatus" ADD VALUE 'READY_FOR_PICKUP';
ALTER TYPE "FulfillmentStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "FulfillmentStatus" ADD VALUE 'DELAYED';
