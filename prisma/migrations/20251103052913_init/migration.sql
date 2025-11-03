-- CreateTable
CREATE TABLE "stores" (
    "shop" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT false,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("shop")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "shop" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "appLoadId" TEXT NOT NULL,
    "shop" TEXT,
    "INP" DOUBLE PRECISION,
    "FID" DOUBLE PRECISION,
    "CLS" DOUBLE PRECISION,
    "LCP" DOUBLE PRECISION,
    "FCP" DOUBLE PRECISION,
    "TTFB" DOUBLE PRECISION,
    "raw_json" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("appLoadId")
);

-- CreateIndex
CREATE INDEX "stores_shop_idx" ON "stores"("shop");

-- CreateIndex
CREATE INDEX "session_id_idx" ON "session"("id");

-- CreateIndex
CREATE INDEX "session_shop_idx" ON "session"("shop");
