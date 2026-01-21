import cfc.model.Labor;
import cfc.utils.Datasource;

component output="false" displayName="LaborDao" name="LaborDao" {
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
	public any function create(required Labor newLabor) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LABOR ( " &
                    "LABOR_ID, REPAIR_ID, LABOR_SEQ, SENT_IMDS, INS_BY,  " & 
                    "INS_DATE, VALID, VAL_BY, VAL_DATE, NEW_SHOP_STATUS,  " & 
                    "TYPE_MAINT, WUC_CD, ACTION_TAKEN, WHEN_DISC, HOW_MAL,  " & 
                    "CAT_LABOR, ASSET_ID, UNITS, START_DATE, STOP_DATE,  " & 
                    "CREW_CHIEF, CREW_SIZE, CORRECTIVE, DISCREPANCY, REMARKS,  " & 
                    "CORRECTED_BY, INSPECTED_BY, HOURS, LABOR_ACTION, STATION_ID,  " & 
                    "BIT_LOG, EDIT_FLAG, OMIT_WCE, CHG_BY, CHG_DATE,  " & 
                    "DDR_DOCNO, TIME_OVERRIDE_FLAG, TEST_GRP, TEST_FAIL_NO, LEGACY_PK " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? " & 
                        ")";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLabor.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getLaborId()) and !len(trim(arguments.newLabor.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getRepairId()) and !len(trim(arguments.newLabor.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getLaborSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getLaborSeq()) and !len(trim(arguments.newLabor.getLaborSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getSentImds()) and !len(trim(arguments.newLabor.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getInsBy()) and !len(trim(arguments.newLabor.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLabor.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLabor.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLabor.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getValid()) and !len(trim(arguments.newLabor.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getValBy()) and !len(trim(arguments.newLabor.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newLabor.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLabor.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLabor.getNewShopStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getNewShopStatus()) and !len(trim(arguments.newLabor.getNewShopStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getTypeMaint())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getTypeMaint()) and !len(trim(arguments.newLabor.getTypeMaint()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getWucCd()) and !len(trim(arguments.newLabor.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getActionTaken())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getActionTaken()) and !len(trim(arguments.newLabor.getActionTaken()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getWhenDisc()) and !len(trim(arguments.newLabor.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getHowMal()) and !len(trim(arguments.newLabor.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getCatLabor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getCatLabor()) and !len(trim(arguments.newLabor.getCatLabor()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getAssetId()) and !len(trim(arguments.newLabor.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getUnits())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getUnits()) and !len(trim(arguments.newLabor.getUnits()))) ? "true" : "false");
        if (IsDate(arguments.newLabor.getStartDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLabor.getStartDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newLabor.getStopDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLabor.getStopDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLabor.getCrewChief())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getCrewChief()) and !len(trim(arguments.newLabor.getCrewChief()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getCrewSize())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getCrewSize()) and !len(trim(arguments.newLabor.getCrewSize()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getCorrective())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getCorrective()) and !len(trim(arguments.newLabor.getCorrective()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getDiscrepancy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getDiscrepancy()) and !len(trim(arguments.newLabor.getDiscrepancy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getRemarks()) and !len(trim(arguments.newLabor.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getCorrectedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getCorrectedBy()) and !len(trim(arguments.newLabor.getCorrectedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getInspectedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getInspectedBy()) and !len(trim(arguments.newLabor.getInspectedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getHours())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getHours()) and !len(trim(arguments.newLabor.getHours()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getLaborAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getLaborAction()) and !len(trim(arguments.newLabor.getLaborAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getStationId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getStationId()) and !len(trim(arguments.newLabor.getStationId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getBitLog())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getBitLog()) and !len(trim(arguments.newLabor.getBitLog()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getEditFlag()) and !len(trim(arguments.newLabor.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getOmitWce())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getOmitWce()) and !len(trim(arguments.newLabor.getOmitWce()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getChgBy()) and !len(trim(arguments.newLabor.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newLabor.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLabor.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLabor.getDdrDocno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getDdrDocno()) and !len(trim(arguments.newLabor.getDdrDocno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getTimeOverrideFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getTimeOverrideFlag()) and !len(trim(arguments.newLabor.getTimeOverrideFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getTestGrp())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getTestGrp()) and !len(trim(arguments.newLabor.getTestGrp()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getTestFailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getTestFailNo()) and !len(trim(arguments.newLabor.getTestFailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLabor.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLabor.getLegacyPk()) and !len(trim(arguments.newLabor.getLegacyPk()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="LaborDao could not insert the following record: #arguments.newLabor.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string laborId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Labor();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.laborId = arguments.laborId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborDao could not find the following record: Labor_Id[#arguments.laborId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Labor();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
     /* read by row_id */
    public Query function readByRepairId(required string repairId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Labor();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborDao could not find the following record: REPAIRID[#arguments.repairId#]");
        }
    }

	/* update */
	public void function update(required Labor chgLabor) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LABOR SET " & 
                    "REPAIR_ID = ?, LABOR_SEQ = ?, SENT_IMDS = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, VALID = ?, VAL_BY = ?, VAL_DATE = ?, NEW_SHOP_STATUS = ?,  " &
                    "TYPE_MAINT = ?, WUC_CD = ?, ACTION_TAKEN = ?, WHEN_DISC = ?, HOW_MAL = ?,  " &
                    "CAT_LABOR = ?, ASSET_ID = ?, UNITS = ?, START_DATE = ?, STOP_DATE = ?,  " &
                    "CREW_CHIEF = ?, CREW_SIZE = ?, CORRECTIVE = ?, DISCREPANCY = ?, REMARKS = ?,  " &
                    "CORRECTED_BY = ?, INSPECTED_BY = ?, HOURS = ?, LABOR_ACTION = ?, STATION_ID = ?,  " &
                    "BIT_LOG = ?, EDIT_FLAG = ?, OMIT_WCE = ?, CHG_BY = ?, CHG_DATE = ?,  " &
                    "DDR_DOCNO = ?, TIME_OVERRIDE_FLAG = ?, TEST_GRP = ?, TEST_FAIL_NO = ?, LEGACY_PK = ? " &
                    " " &
                "WHERE LABOR_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getRepairId()) and !len(trim(arguments.chgLabor.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getLaborSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getLaborSeq()) and !len(trim(arguments.chgLabor.getLaborSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getSentImds()) and !len(trim(arguments.chgLabor.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getInsBy()) and !len(trim(arguments.chgLabor.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLabor.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLabor.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getValid()) and !len(trim(arguments.chgLabor.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getValBy()) and !len(trim(arguments.chgLabor.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLabor.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLabor.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getNewShopStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getNewShopStatus()) and !len(trim(arguments.chgLabor.getNewShopStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getTypeMaint())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getTypeMaint()) and !len(trim(arguments.chgLabor.getTypeMaint()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getWucCd()) and !len(trim(arguments.chgLabor.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getActionTaken())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getActionTaken()) and !len(trim(arguments.chgLabor.getActionTaken()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getWhenDisc()) and !len(trim(arguments.chgLabor.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getHowMal()) and !len(trim(arguments.chgLabor.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getCatLabor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getCatLabor()) and !len(trim(arguments.chgLabor.getCatLabor()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getAssetId()) and !len(trim(arguments.chgLabor.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getUnits())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getUnits()) and !len(trim(arguments.chgLabor.getUnits()))) ? "true" : "false");
        if (IsDate(arguments.chgLabor.getStartDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLabor.getStartDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgLabor.getStopDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLabor.getStopDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getCrewChief())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getCrewChief()) and !len(trim(arguments.chgLabor.getCrewChief()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getCrewSize())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getCrewSize()) and !len(trim(arguments.chgLabor.getCrewSize()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getCorrective())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getCorrective()) and !len(trim(arguments.chgLabor.getCorrective()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getDiscrepancy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getDiscrepancy()) and !len(trim(arguments.chgLabor.getDiscrepancy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getRemarks()) and !len(trim(arguments.chgLabor.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getCorrectedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getCorrectedBy()) and !len(trim(arguments.chgLabor.getCorrectedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getInspectedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getInspectedBy()) and !len(trim(arguments.chgLabor.getInspectedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getHours())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getHours()) and !len(trim(arguments.chgLabor.getHours()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getLaborAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getLaborAction()) and !len(trim(arguments.chgLabor.getLaborAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getStationId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getStationId()) and !len(trim(arguments.chgLabor.getStationId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getBitLog())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getBitLog()) and !len(trim(arguments.chgLabor.getBitLog()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getEditFlag()) and !len(trim(arguments.chgLabor.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getOmitWce())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getOmitWce()) and !len(trim(arguments.chgLabor.getOmitWce()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getChgBy()) and !len(trim(arguments.chgLabor.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLabor.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLabor.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getDdrDocno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getDdrDocno()) and !len(trim(arguments.chgLabor.getDdrDocno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getTimeOverrideFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getTimeOverrideFlag()) and !len(trim(arguments.chgLabor.getTimeOverrideFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getTestGrp())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getTestGrp()) and !len(trim(arguments.chgLabor.getTestGrp()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getTestFailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getTestFailNo()) and !len(trim(arguments.chgLabor.getTestFailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLabor.getLegacyPk()) and !len(trim(arguments.chgLabor.getLegacyPk()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLabor.getLaborId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LaborDao could not update the following record: #arguments.chgLabor.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string laborId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LABOR " &
                "WHERE LABOR_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.laborId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LaborDao could not delete the following record: Labor_Id[#arguments.laborId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LABOR_ID, REPAIR_ID, LABOR_SEQ, SENT_IMDS, INS_BY,  " & 
                    "INS_DATE, VALID, VAL_BY, VAL_DATE, NEW_SHOP_STATUS,  " & 
                    "TYPE_MAINT, WUC_CD, ACTION_TAKEN, WHEN_DISC, HOW_MAL,  " & 
                    "CAT_LABOR, ASSET_ID, UNITS, START_DATE, STOP_DATE,  " & 
                    "CREW_CHIEF, CREW_SIZE, CORRECTIVE, DISCREPANCY, REMARKS,  " & 
                    "CORRECTED_BY, INSPECTED_BY, HOURS, LABOR_ACTION, STATION_ID,  " & 
                    "BIT_LOG, EDIT_FLAG, OMIT_WCE, CHG_BY, CHG_DATE,  " & 
                    "DDR_DOCNO, TIME_OVERRIDE_FLAG, TEST_GRP, TEST_FAIL_NO, LEGACY_PK " & 
                    " " &
                "FROM GLOBALEYE.LABOR ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"laborId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.laborId)),cfsqltype="CF_SQL_VARCHAR");
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
        
        if (StructKeyExists(arguments.filter,"repairId")) {
            if (whereClauseFound) {
                local.sql &= " AND REPAIR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE REPAIR_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.repairId),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        try{
        local.resultQuery = local.objQuery.execute().getResult();
		}catch(any e){
			local = {};
		}
        return local.resultQuery;
    }

}
