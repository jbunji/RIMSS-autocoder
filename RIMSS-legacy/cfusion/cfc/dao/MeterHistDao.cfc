import cfc.model.MeterHist;
import cfc.utils.Datasource;

component output="false" displayName="MeterHistDao" name="MeterHistDao" {
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
	public any function create(required MeterHist newMeterHist) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.METER_HIST ( " &
                    "METER_ID, ASSET_ID, METER_TYPE, METER_ACTION, CHANGED,  " & 
                    "VALID, INS_BY, INS_DATE, METER_IN, METER_OUT,  " & 
                    "REPAIR_ID, REMARKS, CHG_BY, CHG_DATE, SEQ_NUM,  " & 
                    "FAILURE, LABOR_ID, EVENT_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getMeterId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getMeterId()) and !len(trim(arguments.newMeterHist.getMeterId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getAssetId()) and !len(trim(arguments.newMeterHist.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getMeterType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getMeterType()) and !len(trim(arguments.newMeterHist.getMeterType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getMeterAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getMeterAction()) and !len(trim(arguments.newMeterHist.getMeterAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getChanged())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getChanged()) and !len(trim(arguments.newMeterHist.getChanged()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getValid()) and !len(trim(arguments.newMeterHist.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getInsBy()) and !len(trim(arguments.newMeterHist.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newMeterHist.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newMeterHist.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getMeterIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getMeterIn()) and !len(trim(arguments.newMeterHist.getMeterIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getMeterOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getMeterOut()) and !len(trim(arguments.newMeterHist.getMeterOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getRepairId()) and !len(trim(arguments.newMeterHist.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getRemarks()) and !len(trim(arguments.newMeterHist.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getChgBy()) and !len(trim(arguments.newMeterHist.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newMeterHist.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newMeterHist.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getSeqNum())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getSeqNum()) and !len(trim(arguments.newMeterHist.getSeqNum()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getFailure())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getFailure()) and !len(trim(arguments.newMeterHist.getFailure()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getLaborId()) and !len(trim(arguments.newMeterHist.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMeterHist.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMeterHist.getEventId()) and !len(trim(arguments.newMeterHist.getEventId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="MeterHistDao could not insert the following record: #arguments.newMeterHist.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string meterId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new MeterHist();
        var filter = {};
        var msg = "";
		var qry="";

        writeLog(file="RIMSS", text="MeterHistDao.cfc - read - Enter (#arguments.meterId#)");
        
        local.filter.meterId = arguments.meterId;
        local.qry=findByFilter(local.filter);

		writeLog(file="RIMSS", text="MeterHistDao.cfc - read - Exit (#arguments.meterId#)");

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="MeterHistDao could not find the following record: Meter_Id[#arguments.meterId#]");
        }
    }
    
    
    /* read by event_id - Kevin */
    public Query function readByEventId(required string eventId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new MeterHist();
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
            local.msg = "RIMSS was unable to perform the requested search by EventId.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="MeterHistDao could not find the following record: ROWID[#arguments.eventId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new MeterHist();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="MeterHistDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required MeterHist chgMeterHist) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.METER_HIST SET " & 
                    "ASSET_ID = ?, METER_TYPE = ?, METER_ACTION = ?, CHANGED = ?,  " &
                    "VALID = ?, INS_BY = ?, INS_DATE = ?, METER_IN = ?, METER_OUT = ?,  " &
                    "REPAIR_ID = ?, REMARKS = ?, CHG_BY = ?, CHG_DATE = ?, SEQ_NUM = ?,  " &
                    "FAILURE = ?, LABOR_ID = ?, EVENT_ID = ? " &
                "WHERE METER_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getAssetId()) and !len(trim(arguments.chgMeterHist.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getMeterType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getMeterType()) and !len(trim(arguments.chgMeterHist.getMeterType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getMeterAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getMeterAction()) and !len(trim(arguments.chgMeterHist.getMeterAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getChanged())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getChanged()) and !len(trim(arguments.chgMeterHist.getChanged()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getValid()) and !len(trim(arguments.chgMeterHist.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getInsBy()) and !len(trim(arguments.chgMeterHist.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgMeterHist.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgMeterHist.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getMeterIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getMeterIn()) and !len(trim(arguments.chgMeterHist.getMeterIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getMeterOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getMeterOut()) and !len(trim(arguments.chgMeterHist.getMeterOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getRepairId()) and !len(trim(arguments.chgMeterHist.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getRemarks()) and !len(trim(arguments.chgMeterHist.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getChgBy()) and !len(trim(arguments.chgMeterHist.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgMeterHist.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgMeterHist.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getSeqNum())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getSeqNum()) and !len(trim(arguments.chgMeterHist.getSeqNum()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getFailure())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getFailure()) and !len(trim(arguments.chgMeterHist.getFailure()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getLaborId()) and !len(trim(arguments.chgMeterHist.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMeterHist.getEventId()) and !len(trim(arguments.chgMeterHist.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMeterHist.getMeterId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="MeterHistDao could not update the following record: #arguments.chgMeterHist.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string meterId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.METER_HIST " &
                "WHERE METER_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.meterId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="MeterHistDao could not delete the following record: Meter_Id[#arguments.meterId#]");
        }
	}

    /* count */
    public numeric function count() {
        var qry = "";
        var q=new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.setsql('SELECT COUNT(METER_ID) AS total FROM GLOBALEYE.METER_HIST');
        local.qry=local.q.execute().getresult();
        return local.qry.total[1];
    }

    /* get sequence nextval */
    public string function nextval() {
        var qry = "";
        var q=new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.setsql('SELECT GLOBALEYE.METER_HIST_SEQ.NEXTVAL AS METER_ID FROM GLOBALEYE.METER_HIST');
        local.qry=local.q.execute().getresult();
        return local.qry["METER_ID"][1];
    }

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT METER_ID, ASSET_ID, METER_TYPE, METER_ACTION, CHANGED,  " & 
                    "VALID, INS_BY, INS_DATE, METER_IN, METER_OUT,  " & 
                    "REPAIR_ID, REMARKS, CHG_BY, CHG_DATE, SEQ_NUM,  " & 
                    "FAILURE, LABOR_ID, EVENT_ID " &
                "FROM GLOBALEYE.METER_HIST ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"meterId")) {
            if (whereClauseFound) {
                local.sql &= " AND METER_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE METER_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.meterId)),cfsqltype="CF_SQL_VARCHAR");
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
        
        // IF Add - Kevin 13 Nov 2013
        if (StructKeyExists(arguments.filter,"eventId")) {
            if (whereClauseFound) {
                local.sql &= " AND _ID EVENT_ID= ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE EVENT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.eventId)),cfsqltype="CF_SQL_VARCHAR");
        }
        // If Add end

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
