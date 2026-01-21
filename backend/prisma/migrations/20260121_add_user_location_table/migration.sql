-- CreateTable
CREATE TABLE "user_location" (
    "user_location_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "loc_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_location_pkey" PRIMARY KEY ("user_location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_location_user_id_loc_id_key" ON "user_location"("user_id", "loc_id");

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_location" ADD CONSTRAINT "user_location_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
