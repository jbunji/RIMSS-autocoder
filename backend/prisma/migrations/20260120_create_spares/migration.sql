-- CreateTable
CREATE TABLE "spares" (
    "spare_id" SERIAL NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "partno" VARCHAR(50) NOT NULL,
    "serno" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    "loc_id" INTEGER,
    "warranty_exp" TIMESTAMP(3),
    "mfg_date" TIMESTAMP(3),
    "unit_price" DECIMAL(12,2),
    "remarks" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "spares_pkey" PRIMARY KEY ("spare_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spares_partno_serno_key" ON "spares"("partno", "serno");

-- AddForeignKey
ALTER TABLE "spares" ADD CONSTRAINT "spares_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spares" ADD CONSTRAINT "spares_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;
