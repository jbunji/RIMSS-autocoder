import cfc.model.Repair;
import cfc.utils.Datasource;

component output="false" displayName="RepairDao" name="RepairDao" {
    variables.instance = {
        datasource = 0
    };

	/* Auto-generated method
       Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
		return this ;
	}

    /* retrieve datasource object from variables.instance */
    private any function getDatasource() {
        return variables.instance.datasource;
    }
	
	/* create */
	public any function create(required Repair newRepair) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.REPAIR ( " &
                    "REPAIR_ID, REPAIR_SEQ, EVENT_ID, INS_BY, INS_DATE,  " & 
                    "MICAP, MICAP_LOGIN, DAMAGE, CHIEF_REVIEW, SUPER_REVIEW,  " & 
                    "ETI_CHANGE, REPEAT_RECUR, SENT_IMDS, VALID, VAL_BY,  " & 
                    "VAL_DATE, TYPE_MAINT, PWC, WUC_CD, HOW_MAL,  " & 
                    "WHEN_DISC, SHOP_STATUS, SRD_CD, ASSET_ID, NARRATIVE,  " & 
                    "START_DATE, STOP_DATE, ETIC_DATE, RECV_DATE, TAG_NO,  " & 
                    "DOC_NO, SYMBOL, EQUIP_ID, FSC, ETI_IN,  " & 
                    "ETI_OUT, ETI_DELTA, ETI_DELTA_NON_CND, DEFER_STATUS, EDIT_FLAG,  " & 
                    "OLD_JOB, CHG_BY, CHG_DATE, LEGACY_PK, JOB_TYPE,  " & 
                    "STATION_TYPE, JST_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newRepair.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getRepairId()) and !len(trim(arguments.newRepair.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getRepairSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getRepairSeq()) and !len(trim(arguments.newRepair.getRepairSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEventId()) and !len(trim(arguments.newRepair.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getInsBy()) and !len(trim(arguments.newRepair.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newRepair.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepair.getMicap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getMicap()) and !len(trim(arguments.newRepair.getMicap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getMicapLogin())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getMicapLogin()) and !len(trim(arguments.newRepair.getMicapLogin()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getDamage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getDamage()) and !len(trim(arguments.newRepair.getDamage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getChiefReview())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getChiefReview()) and !len(trim(arguments.newRepair.getChiefReview()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getSuperReview())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getSuperReview()) and !len(trim(arguments.newRepair.getSuperReview()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEtiChange())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEtiChange()) and !len(trim(arguments.newRepair.getEtiChange()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getRepeatRecur())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getRepeatRecur()) and !len(trim(arguments.newRepair.getRepeatRecur()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getSentImds()) and !len(trim(arguments.newRepair.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getValid()) and !len(trim(arguments.newRepair.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getValBy()) and !len(trim(arguments.newRepair.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newRepair.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepair.getTypeMaint())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getTypeMaint()) and !len(trim(arguments.newRepair.getTypeMaint()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getPwc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getPwc()) and !len(trim(arguments.newRepair.getPwc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getWucCd()) and !len(trim(arguments.newRepair.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getHowMal()) and !len(trim(arguments.newRepair.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getWhenDisc()) and !len(trim(arguments.newRepair.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getShopStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getShopStatus()) and !len(trim(arguments.newRepair.getShopStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getSrdCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getSrdCd()) and !len(trim(arguments.newRepair.getSrdCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getAssetId()) and !len(trim(arguments.newRepair.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getNarrative())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getNarrative()) and !len(trim(arguments.newRepair.getNarrative()))) ? "true" : "false");
        if (IsDate(arguments.newRepair.getStartDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getStartDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newRepair.getStopDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getStopDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newRepair.getEticDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getEticDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newRepair.getRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepair.getTagNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getTagNo()) and !len(trim(arguments.newRepair.getTagNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getDocNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getDocNo()) and !len(trim(arguments.newRepair.getDocNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getSymbol())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getSymbol()) and !len(trim(arguments.newRepair.getSymbol()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEquipId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEquipId()) and !len(trim(arguments.newRepair.getEquipId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getFsc()) and !len(trim(arguments.newRepair.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEtiIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEtiIn()) and !len(trim(arguments.newRepair.getEtiIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEtiOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEtiOut()) and !len(trim(arguments.newRepair.getEtiOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEtiDelta())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEtiDelta()) and !len(trim(arguments.newRepair.getEtiDelta()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEtiDeltaNonCnd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEtiDeltaNonCnd()) and !len(trim(arguments.newRepair.getEtiDeltaNonCnd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getDeferStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getDeferStatus()) and !len(trim(arguments.newRepair.getDeferStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getEditFlag()) and !len(trim(arguments.newRepair.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getOldJob())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getOldJob()) and !len(trim(arguments.newRepair.getOldJob()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getChgBy()) and !len(trim(arguments.newRepair.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newRepair.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepair.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepair.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getLegacyPk()) and !len(trim(arguments.newRepair.getLegacyPk()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getJobType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getJobType()) and !len(trim(arguments.newRepair.getJobType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getStationType()) and !len(trim(arguments.newRepair.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepair.getJstId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepair.getJstId()) and !len(trim(arguments.newRepair.getJstId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="RepairDao could not insert the following record: #arguments.newRepair.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string repairId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Repair();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.repairId = arguments.repairId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="RepairDao could not find the following record: Repair_Id[#arguments.repairId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Repair();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.rowId = arguments.rowId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="RepairDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Repair chgRepair) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.REPAIR SET " & 
                    "REPAIR_SEQ = ?, EVENT_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "MICAP = ?, MICAP_LOGIN = ?, DAMAGE = ?, CHIEF_REVIEW = ?, SUPER_REVIEW = ?,  " &
                    "ETI_CHANGE = ?, REPEAT_RECUR = ?, SENT_IMDS = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, TYPE_MAINT = ?, PWC = ?, WUC_CD = ?, HOW_MAL = ?,  " &
                    "WHEN_DISC = ?, SHOP_STATUS = ?, SRD_CD = ?, ASSET_ID = ?, NARRATIVE = ?,  " &
                    "START_DATE = ?, STOP_DATE = ?, ETIC_DATE = ?, RECV_DATE = ?, TAG_NO = ?,  " &
                    "DOC_NO = ?, SYMBOL = ?, EQUIP_ID = ?, FSC = ?, ETI_IN = ?,  " &
                    "ETI_OUT = ?, ETI_DELTA = ?, ETI_DELTA_NON_CND = ?, DEFER_STATUS = ?, EDIT_FLAG = ?,  " &
                    "OLD_JOB = ?, CHG_BY = ?, CHG_DATE = ?, LEGACY_PK = ?, JOB_TYPE = ?,  " &
                    "STATION_TYPE = ?, JST_ID = ? " &
                "WHERE REPAIR_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getRepairSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getRepairSeq()) and !len(trim(arguments.chgRepair.getRepairSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEventId()) and !len(trim(arguments.chgRepair.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getInsBy()) and !len(trim(arguments.chgRepair.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgRepair.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getMicap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getMicap()) and !len(trim(arguments.chgRepair.getMicap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getMicapLogin())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getMicapLogin()) and !len(trim(arguments.chgRepair.getMicapLogin()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getDamage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getDamage()) and !len(trim(arguments.chgRepair.getDamage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getChiefReview())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getChiefReview()) and !len(trim(arguments.chgRepair.getChiefReview()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getSuperReview())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getSuperReview()) and !len(trim(arguments.chgRepair.getSuperReview()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEtiChange())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEtiChange()) and !len(trim(arguments.chgRepair.getEtiChange()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getRepeatRecur())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getRepeatRecur()) and !len(trim(arguments.chgRepair.getRepeatRecur()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getSentImds()) and !len(trim(arguments.chgRepair.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getValid()) and !len(trim(arguments.chgRepair.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getValBy()) and !len(trim(arguments.chgRepair.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgRepair.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getTypeMaint())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getTypeMaint()) and !len(trim(arguments.chgRepair.getTypeMaint()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getPwc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getPwc()) and !len(trim(arguments.chgRepair.getPwc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getWucCd()) and !len(trim(arguments.chgRepair.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getHowMal()) and !len(trim(arguments.chgRepair.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getWhenDisc()) and !len(trim(arguments.chgRepair.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getShopStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getShopStatus()) and !len(trim(arguments.chgRepair.getShopStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getSrdCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getSrdCd()) and !len(trim(arguments.chgRepair.getSrdCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getAssetId()) and !len(trim(arguments.chgRepair.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getNarrative())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getNarrative()) and !len(trim(arguments.chgRepair.getNarrative()))) ? "true" : "false");
        if (IsDate(arguments.chgRepair.getStartDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getStartDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgRepair.getStopDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getStopDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgRepair.getEticDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getEticDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgRepair.getRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getTagNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getTagNo()) and !len(trim(arguments.chgRepair.getTagNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getDocNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getDocNo()) and !len(trim(arguments.chgRepair.getDocNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getSymbol())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getSymbol()) and !len(trim(arguments.chgRepair.getSymbol()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEquipId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEquipId()) and !len(trim(arguments.chgRepair.getEquipId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getFsc()) and !len(trim(arguments.chgRepair.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEtiIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEtiIn()) and !len(trim(arguments.chgRepair.getEtiIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEtiOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEtiOut()) and !len(trim(arguments.chgRepair.getEtiOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEtiDelta())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEtiDelta()) and !len(trim(arguments.chgRepair.getEtiDelta()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEtiDeltaNonCnd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEtiDeltaNonCnd()) and !len(trim(arguments.chgRepair.getEtiDeltaNonCnd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getDeferStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getDeferStatus()) and !len(trim(arguments.chgRepair.getDeferStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getEditFlag()) and !len(trim(arguments.chgRepair.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getOldJob())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getOldJob()) and !len(trim(arguments.chgRepair.getOldJob()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getChgBy()) and !len(trim(arguments.chgRepair.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgRepair.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepair.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getLegacyPk()) and !len(trim(arguments.chgRepair.getLegacyPk()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getJobType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getJobType()) and !len(trim(arguments.chgRepair.getJobType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getStationType()) and !len(trim(arguments.chgRepair.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getJstId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepair.getJstId()) and !len(trim(arguments.chgRepair.getJstId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepair.getRepairId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="RepairDao could not update the following record: #arguments.chgRepair.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string repairId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.REPAIR " &
                "WHERE REPAIR_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.repairId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="RepairDao could not delete the following record: Repair_Id[#arguments.repairId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT REPAIR_ID, REPAIR_SEQ, EVENT_ID, INS_BY, INS_DATE,  " & 
                    "MICAP, MICAP_LOGIN, DAMAGE, CHIEF_REVIEW, SUPER_REVIEW,  " & 
                    "ETI_CHANGE, REPEAT_RECUR, SENT_IMDS, VALID, VAL_BY,  " & 
                    "VAL_DATE, TYPE_MAINT, PWC, WUC_CD, HOW_MAL,  " & 
                    "WHEN_DISC, SHOP_STATUS, SRD_CD, ASSET_ID, NARRATIVE,  " & 
                    "START_DATE, STOP_DATE, ETIC_DATE, RECV_DATE, TAG_NO,  " & 
                    "DOC_NO, SYMBOL, EQUIP_ID, FSC, ETI_IN,  " & 
                    "ETI_OUT, ETI_DELTA, ETI_DELTA_NON_CND, DEFER_STATUS, EDIT_FLAG,  " & 
                    "OLD_JOB, CHG_BY, CHG_DATE, LEGACY_PK, JOB_TYPE,  " & 
                    "STATION_TYPE, JST_ID " &
                "FROM GLOBALEYE.REPAIR ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"repairId")) {
            if (whereClauseFound) {
                local.sql &= " AND REPAIR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE REPAIR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.repairId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
