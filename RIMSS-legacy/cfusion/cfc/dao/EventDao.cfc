import cfc.model.Event;
import cfc.utils.Datasource;

component output="false" displayName="EventDao" name="EventDao" {
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
	public any function create(required Event newEvent) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.EVENT ( " &
                    "EVENT_ID, LOC_ID, SOURCE, SOURCE_CAT, SENT_IMDS,  " & 
                    "INS_BY, INS_DATE, VALID, VAL_BY, VAL_DATE,  " & 
                    "WUC_CD, WC_CD, MAINT_TYPE_EE, SQUAD, NON_IMDS,  " & 
                    "ASSET_ID, JOB_NO, TAIL_NO, DISCREPANCY, START_JOB,  " & 
                    "STOP_JOB, WHEN_DISC, PRIORITY, SYMBOL, TCTO_ID,  " & 
                    "IMDS_USERID, ETIC_DATE, EDIT_FLAG, OLD_JOB, CHG_BY,  " & 
                    "CHG_DATE, HOW_MAL, LRU_IND, SRD, PEC,  " & 
                    "MTI, EVENT_TYPE, SORTIE_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newEvent.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getEventId()) and !len(trim(arguments.newEvent.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getLocId()) and !len(trim(arguments.newEvent.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSource())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSource()) and !len(trim(arguments.newEvent.getSource()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSourceCat())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSourceCat()) and !len(trim(arguments.newEvent.getSourceCat()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSentImds()) and !len(trim(arguments.newEvent.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getInsBy()) and !len(trim(arguments.newEvent.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newEvent.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newEvent.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getValid()) and !len(trim(arguments.newEvent.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getValBy()) and !len(trim(arguments.newEvent.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newEvent.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newEvent.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getWucCd()) and !len(trim(arguments.newEvent.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getWcCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getWcCd()) and !len(trim(arguments.newEvent.getWcCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getMaintTypeEe())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getMaintTypeEe()) and !len(trim(arguments.newEvent.getMaintTypeEe()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSquad())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSquad()) and !len(trim(arguments.newEvent.getSquad()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getNonImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getNonImds()) and !len(trim(arguments.newEvent.getNonImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getAssetId()) and !len(trim(arguments.newEvent.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getJobNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getJobNo()) and !len(trim(arguments.newEvent.getJobNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getTailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getTailNo()) and !len(trim(arguments.newEvent.getTailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getDiscrepancy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getDiscrepancy()) and !len(trim(arguments.newEvent.getDiscrepancy()))) ? "true" : "false");
        if (IsDate(arguments.newEvent.getStartJob())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getStartJob()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newEvent.getStopJob())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getStopJob()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newEvent.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getWhenDisc()) and !len(trim(arguments.newEvent.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getPriority())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getPriority()) and !len(trim(arguments.newEvent.getPriority()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSymbol())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSymbol()) and !len(trim(arguments.newEvent.getSymbol()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getTctoId()) and !len(trim(arguments.newEvent.getTctoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getImdsUserid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getImdsUserid()) and !len(trim(arguments.newEvent.getImdsUserid()))) ? "true" : "false");
        if (IsDate(arguments.newEvent.getEticDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getEticDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newEvent.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getEditFlag()) and !len(trim(arguments.newEvent.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getOldJob())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getOldJob()) and !len(trim(arguments.newEvent.getOldJob()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getChgBy()) and !len(trim(arguments.newEvent.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newEvent.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newEvent.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newEvent.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getHowMal()) and !len(trim(arguments.newEvent.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getLruInd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getLruInd()) and !len(trim(arguments.newEvent.getLruInd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSrd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSrd()) and !len(trim(arguments.newEvent.getSrd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getPec())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getPec()) and !len(trim(arguments.newEvent.getPec()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getMti())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getMti()) and !len(trim(arguments.newEvent.getMti()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getEventType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getEventType()) and !len(trim(arguments.newEvent.getEventType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newEvent.getSortieId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newEvent.getSortieId()) and !len(trim(arguments.newEvent.getSortieId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="EventDao could not insert the following record: #arguments.newEvent.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string eventId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Event();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.eventId = arguments.eventId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="EventDao could not find the following record: Event_Id[#arguments.eventId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Event();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="EventDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Event chgEvent) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.EVENT SET " & 
                    "LOC_ID = ?, SOURCE = ?, SOURCE_CAT = ?, SENT_IMDS = ?,  " &
                    "INS_BY = ?, INS_DATE = ?, VALID = ?, VAL_BY = ?, VAL_DATE = ?,  " &
                    "WUC_CD = ?, WC_CD = ?, MAINT_TYPE_EE = ?, SQUAD = ?, NON_IMDS = ?,  " &
                    "ASSET_ID = ?, JOB_NO = ?, TAIL_NO = ?, DISCREPANCY = ?, START_JOB = ?,  " &
                    "STOP_JOB = ?, WHEN_DISC = ?, PRIORITY = ?, SYMBOL = ?, TCTO_ID = ?,  " &
                    "IMDS_USERID = ?, ETIC_DATE = ?, EDIT_FLAG = ?, OLD_JOB = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, HOW_MAL = ?, LRU_IND = ?, SRD = ?, PEC = ?,  " &
                    "MTI = ?, EVENT_TYPE = ?, SORTIE_ID = ? " &
                "WHERE EVENT_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getLocId()) and !len(trim(arguments.chgEvent.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSource())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSource()) and !len(trim(arguments.chgEvent.getSource()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSourceCat())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSourceCat()) and !len(trim(arguments.chgEvent.getSourceCat()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSentImds()) and !len(trim(arguments.chgEvent.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getInsBy()) and !len(trim(arguments.chgEvent.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgEvent.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getValid()) and !len(trim(arguments.chgEvent.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getValBy()) and !len(trim(arguments.chgEvent.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgEvent.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getWucCd()) and !len(trim(arguments.chgEvent.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getWcCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getWcCd()) and !len(trim(arguments.chgEvent.getWcCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getMaintTypeEe())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getMaintTypeEe()) and !len(trim(arguments.chgEvent.getMaintTypeEe()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSquad())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSquad()) and !len(trim(arguments.chgEvent.getSquad()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getNonImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getNonImds()) and !len(trim(arguments.chgEvent.getNonImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getAssetId()) and !len(trim(arguments.chgEvent.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getJobNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getJobNo()) and !len(trim(arguments.chgEvent.getJobNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getTailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getTailNo()) and !len(trim(arguments.chgEvent.getTailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getDiscrepancy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getDiscrepancy()) and !len(trim(arguments.chgEvent.getDiscrepancy()))) ? "true" : "false");
        if (IsDate(arguments.chgEvent.getStartJob())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getStartJob()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgEvent.getStopJob())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getStopJob()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getWhenDisc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getWhenDisc()) and !len(trim(arguments.chgEvent.getWhenDisc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getPriority())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getPriority()) and !len(trim(arguments.chgEvent.getPriority()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSymbol())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSymbol()) and !len(trim(arguments.chgEvent.getSymbol()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getTctoId()) and !len(trim(arguments.chgEvent.getTctoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getImdsUserid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getImdsUserid()) and !len(trim(arguments.chgEvent.getImdsUserid()))) ? "true" : "false");
        if (IsDate(arguments.chgEvent.getEticDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getEticDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getEditFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getEditFlag()) and !len(trim(arguments.chgEvent.getEditFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getOldJob())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getOldJob()) and !len(trim(arguments.chgEvent.getOldJob()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getChgBy()) and !len(trim(arguments.chgEvent.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgEvent.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgEvent.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getHowMal()) and !len(trim(arguments.chgEvent.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getLruInd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getLruInd()) and !len(trim(arguments.chgEvent.getLruInd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSrd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSrd()) and !len(trim(arguments.chgEvent.getSrd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getPec())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getPec()) and !len(trim(arguments.chgEvent.getPec()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getMti())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getMti()) and !len(trim(arguments.chgEvent.getMti()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getEventType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getEventType()) and !len(trim(arguments.chgEvent.getEventType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getSortieId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgEvent.getSortieId()) and !len(trim(arguments.chgEvent.getSortieId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgEvent.getEventId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="EventDao could not update the following record: #arguments.chgEvent.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string eventId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.EVENT " &
                "WHERE EVENT_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.eventId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="EventDao could not delete the following record: Event_Id[#arguments.eventId#]");
        }
	}

    /* count */
    public numeric function count() {
        var qry = "";
        var q=new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.setsql('SELECT COUNT(EVENT_ID) AS total FROM GLOBALEYE.EVENT');
        local.qry=local.q.execute().getresult();
        return local.qry.total[1];
    }

    /* get sequence nextval */
    public string function nextval() {
        var qry = "";
        var q=new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.setsql('SELECT GLOBALEYE.EVENT_SEQ.NEXTVAL AS EVENT_ID FROM GLOBALEYE.EVENT');
        local.qry=local.q.execute().getresult();
        return local.qry["EVENT_ID"][1];
    }

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT EVENT_ID, LOC_ID, SOURCE, SOURCE_CAT, SENT_IMDS,  " & 
                    "INS_BY, INS_DATE, VALID, VAL_BY, VAL_DATE,  " & 
                    "WUC_CD, WC_CD, MAINT_TYPE_EE, SQUAD, NON_IMDS,  " & 
                    "ASSET_ID, JOB_NO, TAIL_NO, DISCREPANCY, START_JOB,  " & 
                    "STOP_JOB, WHEN_DISC, PRIORITY, SYMBOL, TCTO_ID,  " & 
                    "IMDS_USERID, ETIC_DATE, EDIT_FLAG, OLD_JOB, CHG_BY,  " & 
                    "CHG_DATE, HOW_MAL, LRU_IND, SRD, PEC,  " & 
                    "MTI, EVENT_TYPE, SORTIE_ID " &
                "FROM GLOBALEYE.EVENT ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"eventId")) {
            if (whereClauseFound) {
                local.sql &= " AND EVENT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE EVENT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.eventId)),cfsqltype="CF_SQL_VARCHAR");
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
