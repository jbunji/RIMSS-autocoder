-- CreateTable
CREATE TABLE "loc_set" (
    "set_id" SERIAL NOT NULL,
    "set_name" VARCHAR(100) NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "loc_id" INTEGER NOT NULL,
    "display_name" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "loc_set_pkey" PRIMARY KEY ("set_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loc_set_set_name_loc_id_key" ON "loc_set"("set_name", "loc_id");

-- AddForeignKey
ALTER TABLE "loc_set" ADD CONSTRAINT "loc_set_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loc_set" ADD CONSTRAINT "loc_set_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
