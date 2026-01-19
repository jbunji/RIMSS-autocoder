-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DEPOT_MANAGER', 'FIELD_TECHNICIAN', 'VIEWER');

-- CreateTable
CREATE TABLE "program" (
    "pgm_id" SERIAL NOT NULL,
    "pgm_cd" VARCHAR(10) NOT NULL,
    "pgm_name" VARCHAR(100) NOT NULL,
    "pgm_desc" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "program_pkey" PRIMARY KEY ("pgm_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_program" (
    "user_program_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_program_pkey" PRIMARY KEY ("user_program_id")
);

-- CreateTable
CREATE TABLE "code" (
    "code_id" SERIAL NOT NULL,
    "code_type" VARCHAR(50) NOT NULL,
    "code_value" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "code_pkey" PRIMARY KEY ("code_id")
);

-- CreateTable
CREATE TABLE "code_group" (
    "cdgrp_id" SERIAL NOT NULL,
    "group_cd" VARCHAR(50) NOT NULL,
    "code_id" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(255),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_group_pkey" PRIMARY KEY ("cdgrp_id")
);

-- CreateTable
CREATE TABLE "location" (
    "loc_id" SERIAL NOT NULL,
    "majcom_cd" VARCHAR(10),
    "site_cd" VARCHAR(20),
    "unit_cd" VARCHAR(20),
    "squad_cd" VARCHAR(20),
    "description" VARCHAR(255),
    "geoloc" VARCHAR(100),
    "display_name" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "location_pkey" PRIMARY KEY ("loc_id")
);

-- CreateTable
CREATE TABLE "part_list" (
    "partno_id" SERIAL NOT NULL,
    "partno" VARCHAR(50) NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "sys_type" VARCHAR(20),
    "noun" VARCHAR(100),
    "nsn" VARCHAR(20),
    "cage" VARCHAR(10),
    "nha_id" INTEGER,
    "config" VARCHAR(50),
    "unit_price" DECIMAL(12,2),
    "sn_tracked" BOOLEAN NOT NULL DEFAULT true,
    "wuc_cd" VARCHAR(10),
    "mds_cd" VARCHAR(10),
    "version" VARCHAR(20),
    "errc" VARCHAR(10),
    "lsru_flag" BOOLEAN NOT NULL DEFAULT false,
    "loc_idr" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "part_list_pkey" PRIMARY KEY ("partno_id")
);

-- CreateTable
CREATE TABLE "asset" (
    "asset_id" SERIAL NOT NULL,
    "partno_id" INTEGER NOT NULL,
    "serno" VARCHAR(50) NOT NULL,
    "status_cd" VARCHAR(10) NOT NULL DEFAULT 'FMC',
    "loc_ida" INTEGER,
    "loc_idc" INTEGER,
    "nha_asset_id" INTEGER,
    "cfg_set_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "reportable" BOOLEAN NOT NULL DEFAULT true,
    "cfo_tracked" BOOLEAN NOT NULL DEFAULT false,
    "bad_actor" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "uii" VARCHAR(50),
    "etic" TIMESTAMP(3),
    "lotno" VARCHAR(50),
    "mfg_date" TIMESTAMP(3),
    "accept_date" TIMESTAMP(3),
    "next_ndi_date" TIMESTAMP(3),
    "deployed_date" TIMESTAMP(3),
    "tcn" VARCHAR(50),
    "shipper" VARCHAR(50),
    "ship_date" TIMESTAMP(3),
    "recv_date" TIMESTAMP(3),
    "eti" DECIMAL(10,2),
    "eti_liate" DECIMAL(10,2),
    "in_transit" BOOLEAN NOT NULL DEFAULT false,
    "tail_no" VARCHAR(20),
    "remarks" TEXT,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "asset_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "cfg_set" (
    "cfg_set_id" SERIAL NOT NULL,
    "cfg_name" VARCHAR(100) NOT NULL,
    "cfg_type" VARCHAR(20),
    "pgm_id" INTEGER NOT NULL,
    "partno_id" INTEGER,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "cfg_set_pkey" PRIMARY KEY ("cfg_set_id")
);

-- CreateTable
CREATE TABLE "cfg_list" (
    "list_id" SERIAL NOT NULL,
    "cfg_set_id" INTEGER NOT NULL,
    "partno_p" INTEGER NOT NULL,
    "partno_c" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "qpa" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "cfg_list_pkey" PRIMARY KEY ("list_id")
);

-- CreateTable
CREATE TABLE "event" (
    "event_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "loc_id" INTEGER,
    "job_no" VARCHAR(20),
    "discrepancy" TEXT,
    "start_job" TIMESTAMP(3),
    "stop_job" TIMESTAMP(3),
    "when_disc" VARCHAR(10),
    "how_mal" VARCHAR(10),
    "wuc_cd" VARCHAR(10),
    "priority" VARCHAR(10),
    "symbol" VARCHAR(10),
    "event_type" VARCHAR(20),
    "sortie_id" INTEGER,
    "source" VARCHAR(20),
    "source_cat" VARCHAR(20),
    "sent_imds" BOOLEAN NOT NULL DEFAULT false,
    "non_imds" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "etic_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "repair" (
    "repair_id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "repair_seq" INTEGER NOT NULL DEFAULT 1,
    "asset_id" INTEGER,
    "start_date" TIMESTAMP(3),
    "stop_date" TIMESTAMP(3),
    "type_maint" VARCHAR(10),
    "how_mal" VARCHAR(10),
    "when_disc" VARCHAR(10),
    "shop_status" VARCHAR(20),
    "narrative" TEXT,
    "tag_no" VARCHAR(50),
    "doc_no" VARCHAR(50),
    "eti_in" DECIMAL(10,2),
    "eti_out" DECIMAL(10,2),
    "eti_delta" DECIMAL(10,2),
    "micap" BOOLEAN NOT NULL DEFAULT false,
    "micap_login" VARCHAR(50),
    "damage" VARCHAR(100),
    "chief_review" BOOLEAN NOT NULL DEFAULT false,
    "super_review" BOOLEAN NOT NULL DEFAULT false,
    "eti_change" BOOLEAN NOT NULL DEFAULT false,
    "repeat_recur" BOOLEAN NOT NULL DEFAULT false,
    "sent_imds" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "repair_pkey" PRIMARY KEY ("repair_id")
);

-- CreateTable
CREATE TABLE "labor" (
    "labor_id" SERIAL NOT NULL,
    "repair_id" INTEGER NOT NULL,
    "labor_seq" INTEGER NOT NULL DEFAULT 1,
    "asset_id" INTEGER,
    "action_taken" VARCHAR(10),
    "how_mal" VARCHAR(10),
    "when_disc" VARCHAR(10),
    "type_maint" VARCHAR(10),
    "cat_labor" VARCHAR(10),
    "start_date" TIMESTAMP(3),
    "stop_date" TIMESTAMP(3),
    "hours" DECIMAL(5,2),
    "crew_chief" VARCHAR(50),
    "crew_size" INTEGER,
    "corrective" TEXT,
    "discrepancy" TEXT,
    "remarks" TEXT,
    "corrected_by" VARCHAR(50),
    "inspected_by" VARCHAR(50),
    "bit_log" TEXT,
    "sent_imds" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "labor_pkey" PRIMARY KEY ("labor_id")
);

-- CreateTable
CREATE TABLE "labor_part" (
    "labor_part_id" SERIAL NOT NULL,
    "labor_id" INTEGER NOT NULL,
    "asset_id" INTEGER,
    "partno_id" INTEGER,
    "part_action" VARCHAR(20),
    "qty" INTEGER NOT NULL DEFAULT 1,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "labor_part_pkey" PRIMARY KEY ("labor_part_id")
);

-- CreateTable
CREATE TABLE "labor_bit_pc" (
    "labor_bit_id" SERIAL NOT NULL,
    "labor_id" INTEGER NOT NULL,
    "bit_partno" VARCHAR(50),
    "bit_name" VARCHAR(100),
    "bit_seq" INTEGER,
    "bit_wuc" VARCHAR(10),
    "how_mal" VARCHAR(10),
    "bit_qty" INTEGER,
    "fsc" VARCHAR(10),
    "bit_delete" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "labor_bit_pc_pkey" PRIMARY KEY ("labor_bit_id")
);

-- CreateTable
CREATE TABLE "asset_inspection" (
    "hist_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "repair_id" INTEGER,
    "wuc_cd" VARCHAR(10),
    "jst_id" INTEGER,
    "pmi_type" VARCHAR(20),
    "complete_date" TIMESTAMP(3),
    "next_due_date" TIMESTAMP(3),
    "completed_etm" DECIMAL(10,2),
    "next_due_etm" DECIMAL(10,2),
    "job_no" VARCHAR(20),
    "completed_by" VARCHAR(50),
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "asset_inspection_pkey" PRIMARY KEY ("hist_id")
);

-- CreateTable
CREATE TABLE "meter_hist" (
    "meter_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "repair_id" INTEGER,
    "labor_id" INTEGER,
    "event_id" INTEGER,
    "meter_type" VARCHAR(20),
    "meter_action" VARCHAR(20),
    "meter_in" DECIMAL(10,2),
    "meter_out" DECIMAL(10,2),
    "changed" BOOLEAN NOT NULL DEFAULT false,
    "failure" BOOLEAN NOT NULL DEFAULT false,
    "seq_num" INTEGER,
    "remarks" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "meter_hist_pkey" PRIMARY KEY ("meter_id")
);

-- CreateTable
CREATE TABLE "cfg_meters" (
    "meter_id" SERIAL NOT NULL,
    "cfg_set_id" INTEGER NOT NULL,
    "meter_type" VARCHAR(20),
    "meter_value" DECIMAL(10,2),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "cfg_meters_pkey" PRIMARY KEY ("meter_id")
);

-- CreateTable
CREATE TABLE "software" (
    "sw_id" SERIAL NOT NULL,
    "sw_number" VARCHAR(50) NOT NULL,
    "sw_type" VARCHAR(20),
    "sys_id" INTEGER,
    "revision" VARCHAR(20),
    "revision_date" TIMESTAMP(3),
    "sw_title" VARCHAR(100),
    "sw_desc" TEXT,
    "eff_date" TIMESTAMP(3),
    "cpin_flag" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "software_pkey" PRIMARY KEY ("sw_id")
);

-- CreateTable
CREATE TABLE "software_asset" (
    "sw_asset_id" SERIAL NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "sw_id" INTEGER NOT NULL,
    "eff_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "software_asset_pkey" PRIMARY KEY ("sw_asset_id")
);

-- CreateTable
CREATE TABLE "sorties" (
    "sortie_id" SERIAL NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "asset_id" INTEGER,
    "mission_id" VARCHAR(50),
    "serno" VARCHAR(50),
    "ac_tailno" VARCHAR(20),
    "sortie_date" TIMESTAMP(3),
    "sortie_effect" VARCHAR(10),
    "ac_station" VARCHAR(20),
    "ac_type" VARCHAR(20),
    "current_unit" VARCHAR(20),
    "assigned_unit" VARCHAR(20),
    "range" VARCHAR(20),
    "reason" VARCHAR(100),
    "remarks" TEXT,
    "source_data" VARCHAR(50),
    "is_non_podded" BOOLEAN NOT NULL DEFAULT false,
    "is_debrief" BOOLEAN NOT NULL DEFAULT false,
    "is_live_monitor" BOOLEAN NOT NULL DEFAULT false,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "sorties_pkey" PRIMARY KEY ("sortie_id")
);

-- CreateTable
CREATE TABLE "tcto" (
    "tcto_id" SERIAL NOT NULL,
    "pgm_id" INTEGER NOT NULL,
    "tcto_no" VARCHAR(50) NOT NULL,
    "tcto_type" VARCHAR(20),
    "tcto_code" VARCHAR(20),
    "wuc_cd" VARCHAR(10),
    "sys_type" VARCHAR(20),
    "station_type" VARCHAR(20),
    "old_partno_id" INTEGER,
    "new_partno_id" INTEGER,
    "eff_date" TIMESTAMP(3),
    "remarks" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "tcto_pkey" PRIMARY KEY ("tcto_id")
);

-- CreateTable
CREATE TABLE "tcto_asset" (
    "tcto_asset_id" SERIAL NOT NULL,
    "tcto_id" INTEGER NOT NULL,
    "asset_id" INTEGER NOT NULL,
    "repair_id" INTEGER,
    "complete_date" TIMESTAMP(3),
    "remarks" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "val_by" VARCHAR(50),
    "val_date" TIMESTAMP(3),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "tcto_asset_pkey" PRIMARY KEY ("tcto_asset_id")
);

-- CreateTable
CREATE TABLE "sru_order" (
    "order_id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "repair_id" INTEGER,
    "partno_id" INTEGER,
    "asset_id" INTEGER,
    "loc_id" INTEGER,
    "sru_id" VARCHAR(50),
    "doc_no" VARCHAR(50),
    "order_date" TIMESTAMP(3),
    "order_qty" INTEGER NOT NULL DEFAULT 1,
    "status" VARCHAR(20) NOT NULL DEFAULT 'REQUEST',
    "micap" BOOLEAN NOT NULL DEFAULT false,
    "delivery_dest" VARCHAR(100),
    "delivery_priority" VARCHAR(20),
    "ujc" VARCHAR(20),
    "acknowledge_date" TIMESTAMP(3),
    "fill_date" TIMESTAMP(3),
    "repl_sru_ship_date" TIMESTAMP(3),
    "repl_sru_recv_date" TIMESTAMP(3),
    "shipper" VARCHAR(50),
    "tcn" VARCHAR(50),
    "rem_shipper" VARCHAR(50),
    "rem_tcn" VARCHAR(50),
    "rem_sru_ship_date" TIMESTAMP(3),
    "receiver" VARCHAR(50),
    "receive_qty" INTEGER,
    "receive_date" TIMESTAMP(3),
    "esd" TIMESTAMP(3),
    "wuc_cd" VARCHAR(10),
    "remarks" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "sru_order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "bad_actor" (
    "bad_actor_id" SERIAL NOT NULL,
    "loc_id" INTEGER,
    "sys_id" INTEGER,
    "status_period" INTEGER,
    "status_period_type" VARCHAR(20),
    "status_count" INTEGER,
    "status_cd" VARCHAR(10),
    "multi_ac" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "bad_actor_pkey" PRIMARY KEY ("bad_actor_id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "attachment_id" SERIAL NOT NULL,
    "event_id" INTEGER,
    "repair_id" INTEGER,
    "attachment_name" VARCHAR(255) NOT NULL,
    "attachment_type" VARCHAR(50),
    "file_path" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "notification" (
    "msg_id" SERIAL NOT NULL,
    "pgm_id" INTEGER,
    "loc_id" INTEGER,
    "msg_text" TEXT NOT NULL,
    "priority" VARCHAR(20),
    "start_date" TIMESTAMP(3),
    "stop_date" TIMESTAMP(3),
    "from_user" VARCHAR(50),
    "to_user" VARCHAR(50),
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "ack_by" VARCHAR(50),
    "ack_date" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("msg_id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(20) NOT NULL,
    "table_name" VARCHAR(50) NOT NULL,
    "record_id" INTEGER,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "adm_variable" (
    "var_id" SERIAL NOT NULL,
    "var_name" VARCHAR(50) NOT NULL,
    "var_value" TEXT,
    "var_desc" VARCHAR(255),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "ins_by" VARCHAR(50),
    "ins_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chg_by" VARCHAR(50),
    "chg_date" TIMESTAMP(3),

    CONSTRAINT "adm_variable_pkey" PRIMARY KEY ("var_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "program_pgm_cd_key" ON "program"("pgm_cd");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_program_user_id_pgm_id_key" ON "user_program"("user_id", "pgm_id");

-- CreateIndex
CREATE UNIQUE INDEX "code_code_type_code_value_key" ON "code"("code_type", "code_value");

-- CreateIndex
CREATE UNIQUE INDEX "part_list_partno_pgm_id_key" ON "part_list"("partno", "pgm_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_partno_id_serno_key" ON "asset"("partno_id", "serno");

-- CreateIndex
CREATE UNIQUE INDEX "software_asset_asset_id_sw_id_key" ON "software_asset"("asset_id", "sw_id");

-- CreateIndex
CREATE UNIQUE INDEX "tcto_tcto_no_pgm_id_key" ON "tcto"("tcto_no", "pgm_id");

-- CreateIndex
CREATE UNIQUE INDEX "tcto_asset_tcto_id_asset_id_key" ON "tcto_asset"("tcto_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "adm_variable_var_name_key" ON "adm_variable"("var_name");

-- AddForeignKey
ALTER TABLE "user_program" ADD CONSTRAINT "user_program_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_program" ADD CONSTRAINT "user_program_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_group" ADD CONSTRAINT "code_group_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("code_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_list" ADD CONSTRAINT "part_list_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "part_list" ADD CONSTRAINT "part_list_nha_id_fkey" FOREIGN KEY ("nha_id") REFERENCES "part_list"("partno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_partno_id_fkey" FOREIGN KEY ("partno_id") REFERENCES "part_list"("partno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_loc_ida_fkey" FOREIGN KEY ("loc_ida") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_loc_idc_fkey" FOREIGN KEY ("loc_idc") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_nha_asset_id_fkey" FOREIGN KEY ("nha_asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset" ADD CONSTRAINT "asset_cfg_set_id_fkey" FOREIGN KEY ("cfg_set_id") REFERENCES "cfg_set"("cfg_set_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_set" ADD CONSTRAINT "cfg_set_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_set" ADD CONSTRAINT "cfg_set_partno_id_fkey" FOREIGN KEY ("partno_id") REFERENCES "part_list"("partno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_list" ADD CONSTRAINT "cfg_list_cfg_set_id_fkey" FOREIGN KEY ("cfg_set_id") REFERENCES "cfg_set"("cfg_set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_list" ADD CONSTRAINT "cfg_list_partno_p_fkey" FOREIGN KEY ("partno_p") REFERENCES "part_list"("partno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_list" ADD CONSTRAINT "cfg_list_partno_c_fkey" FOREIGN KEY ("partno_c") REFERENCES "part_list"("partno_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_sortie_id_fkey" FOREIGN KEY ("sortie_id") REFERENCES "sorties"("sortie_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair" ADD CONSTRAINT "repair_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor" ADD CONSTRAINT "labor_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor" ADD CONSTRAINT "labor_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor_part" ADD CONSTRAINT "labor_part_labor_id_fkey" FOREIGN KEY ("labor_id") REFERENCES "labor"("labor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor_part" ADD CONSTRAINT "labor_part_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor_part" ADD CONSTRAINT "labor_part_partno_id_fkey" FOREIGN KEY ("partno_id") REFERENCES "part_list"("partno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "labor_bit_pc" ADD CONSTRAINT "labor_bit_pc_labor_id_fkey" FOREIGN KEY ("labor_id") REFERENCES "labor"("labor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_inspection" ADD CONSTRAINT "asset_inspection_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_inspection" ADD CONSTRAINT "asset_inspection_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_hist" ADD CONSTRAINT "meter_hist_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_hist" ADD CONSTRAINT "meter_hist_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_hist" ADD CONSTRAINT "meter_hist_labor_id_fkey" FOREIGN KEY ("labor_id") REFERENCES "labor"("labor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meter_hist" ADD CONSTRAINT "meter_hist_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cfg_meters" ADD CONSTRAINT "cfg_meters_cfg_set_id_fkey" FOREIGN KEY ("cfg_set_id") REFERENCES "cfg_set"("cfg_set_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_asset" ADD CONSTRAINT "software_asset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "software_asset" ADD CONSTRAINT "software_asset_sw_id_fkey" FOREIGN KEY ("sw_id") REFERENCES "software"("sw_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sorties" ADD CONSTRAINT "sorties_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sorties" ADD CONSTRAINT "sorties_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tcto" ADD CONSTRAINT "tcto_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tcto_asset" ADD CONSTRAINT "tcto_asset_tcto_id_fkey" FOREIGN KEY ("tcto_id") REFERENCES "tcto"("tcto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tcto_asset" ADD CONSTRAINT "tcto_asset_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tcto_asset" ADD CONSTRAINT "tcto_asset_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sru_order" ADD CONSTRAINT "sru_order_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sru_order" ADD CONSTRAINT "sru_order_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sru_order" ADD CONSTRAINT "sru_order_partno_id_fkey" FOREIGN KEY ("partno_id") REFERENCES "part_list"("partno_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sru_order" ADD CONSTRAINT "sru_order_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "asset"("asset_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sru_order" ADD CONSTRAINT "sru_order_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bad_actor" ADD CONSTRAINT "bad_actor_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_repair_id_fkey" FOREIGN KEY ("repair_id") REFERENCES "repair"("repair_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_pgm_id_fkey" FOREIGN KEY ("pgm_id") REFERENCES "program"("pgm_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_loc_id_fkey" FOREIGN KEY ("loc_id") REFERENCES "location"("loc_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
