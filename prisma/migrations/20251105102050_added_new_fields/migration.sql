/*
  Warnings:

  - The primary key for the `stores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[shop]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `stores` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FulfillmentStatus" AS ENUM ('IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ATTEMPTED_DELIVERY', 'FAILURE');

-- AlterTable
ALTER TABLE "stores" DROP CONSTRAINT "stores_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "carriers" (
    "id" TEXT NOT NULL,
    "carrierName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillments" (
    "id" TEXT NOT NULL,
    "fulfillmentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "trackingUrl" TEXT NOT NULL,
    "status" "FulfillmentStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,

    CONSTRAINT "fulfillments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fulfillmentLineItems" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "variantTitle" TEXT NOT NULL,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL,
    "grams" DOUBLE PRECISION NOT NULL,
    "price" TEXT NOT NULL,
    "totalDiscount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fulfillmentId" TEXT NOT NULL,

    CONSTRAINT "fulfillmentLineItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carriers_carrierName_key" ON "carriers"("carrierName");

-- CreateIndex
CREATE INDEX "carriers_id_idx" ON "carriers"("id");

-- CreateIndex
CREATE INDEX "carriers_carrierName_idx" ON "carriers"("carrierName");

-- CreateIndex
CREATE UNIQUE INDEX "fulfillments_fulfillmentId_key" ON "fulfillments"("fulfillmentId");

-- CreateIndex
CREATE INDEX "fulfillments_id_idx" ON "fulfillments"("id");

-- CreateIndex
CREATE INDEX "fulfillments_fulfillmentId_idx" ON "fulfillments"("fulfillmentId");

-- CreateIndex
CREATE INDEX "fulfillmentLineItems_id_idx" ON "fulfillmentLineItems"("id");

-- CreateIndex
CREATE UNIQUE INDEX "stores_shop_key" ON "stores"("shop");

-- CreateIndex
CREATE INDEX "stores_id_idx" ON "stores"("id");

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fulfillmentLineItems" ADD CONSTRAINT "fulfillmentLineItems_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "fulfillments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
