-- CreateTable
CREATE TABLE "program_location" (
    "program_location_id" SERIAL NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "loc_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "program_location_pkey" PRIMARY KEY ("program_location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "program_location_pgm_id_loc_id_key" ON "program_location"("pgm_id", "loc_id");

-- AddForeignKey
ALTER TABLE "program_location" ADD CONSTRAINT "program_location_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_location" ADD CONSTRAINT "program_location_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE CASCADE ON UPDATE CASCADE;
