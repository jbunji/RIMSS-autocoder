import cfc.model.CfgMeters;
import cfc.utils.Datasource;

component output="false" displayName="CfgMetersDao" name="CfgMetersDao" {
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
	public any function create(required CfgMeters newCfgMeters) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.CFG_METERS ( " &
                    "ASSET_ID, EVENT_ID, METER_TYPE, VALUE_IN, VALUE_OUT,  " & 
                    "IS_METER_CHG, METER_SEQ, OPER_HRS, BENCH_HRS, EFF_DATE,  " & 
                    "SOURCE_TABLE, SOURCE_DUMMY_PK, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? " & 
                        ")";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getAssetId()) and !len(trim(arguments.newCfgMeters.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getEventId()) and !len(trim(arguments.newCfgMeters.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getMeterType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getMeterType()) and !len(trim(arguments.newCfgMeters.getMeterType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getValueIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getValueIn()) and !len(trim(arguments.newCfgMeters.getValueIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getValueOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getValueOut()) and !len(trim(arguments.newCfgMeters.getValueOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getIsMeterChg())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getIsMeterChg()) and !len(trim(arguments.newCfgMeters.getIsMeterChg()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getMeterSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getMeterSeq()) and !len(trim(arguments.newCfgMeters.getMeterSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getOperHrs())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getOperHrs()) and !len(trim(arguments.newCfgMeters.getOperHrs()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getBenchHrs())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getBenchHrs()) and !len(trim(arguments.newCfgMeters.getBenchHrs()))) ? "true" : "false");
        if (IsDate(arguments.newCfgMeters.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgMeters.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getSourceTable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getSourceTable()) and !len(trim(arguments.newCfgMeters.getSourceTable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getSourceDummyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getSourceDummyPk()) and !len(trim(arguments.newCfgMeters.getSourceDummyPk()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getRemarks()) and !len(trim(arguments.newCfgMeters.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getIsValid()) and !len(trim(arguments.newCfgMeters.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getValBy()) and !len(trim(arguments.newCfgMeters.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgMeters.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgMeters.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getChgBy()) and !len(trim(arguments.newCfgMeters.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgMeters.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgMeters.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newCfgMeters.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgMeters.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgMeters.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgMeters.getCreatedBy()) and !len(trim(arguments.newCfgMeters.getCreatedBy()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CfgMetersDao could not insert the following record: #arguments.newCfgMeters.toString()#");
        }
	}
	
	/* read */
	public Query function read(required String eventId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CfgMeters();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgMetersDao could not find the following record: ");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CfgMeters();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgMetersDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

    /* read by row_id */
    public Query function readByCurrentMeter(required string assetId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CfgMeters();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.assetId = arguments.assetId;
        
        local.qry=findByFilter(local.filter);
        
        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested to obtain the current meter reading.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgMetersDao could not find the following record: ASSETID[#arguments.assetId#]");
        }
    }

	/* update */
	public void function update(required CfgMeters chgCfgMeters) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
		   
		var msg = "";
        var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.CFG_METERS SET " & 
                    "ASSET_ID = ?, METER_TYPE = ?, VALUE_IN = ?, VALUE_OUT = ?,  " &
                    "IS_METER_CHG = ?, METER_SEQ = ?, OPER_HRS = ?, BENCH_HRS = ?, EFF_DATE = ?,  " &
                    "SOURCE_TABLE = ?, SOURCE_DUMMY_PK = ?, REMARKS = ?, IS_VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?, CREATE_DATE = ?, CREATED_BY = ? " &
                    " " &
                "WHERE  EVENT_ID = ?";

        /* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getAssetId()) and !len(trim(arguments.chgCfgMeters.getAssetId()))) ? "true" : "false");        
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getMeterType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getMeterType()) and !len(trim(arguments.chgCfgMeters.getMeterType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getValueIn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getValueIn()) and !len(trim(arguments.chgCfgMeters.getValueIn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getValueOut())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getValueOut()) and !len(trim(arguments.chgCfgMeters.getValueOut()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getIsMeterChg())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getIsMeterChg()) and !len(trim(arguments.chgCfgMeters.getIsMeterChg()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getMeterSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getMeterSeq()) and !len(trim(arguments.chgCfgMeters.getMeterSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getOperHrs())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getOperHrs()) and !len(trim(arguments.chgCfgMeters.getOperHrs()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getBenchHrs())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getBenchHrs()) and !len(trim(arguments.chgCfgMeters.getBenchHrs()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgMeters.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgMeters.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getSourceTable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getSourceTable()) and !len(trim(arguments.chgCfgMeters.getSourceTable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getSourceDummyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getSourceDummyPk()) and !len(trim(arguments.chgCfgMeters.getSourceDummyPk()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getRemarks()) and !len(trim(arguments.chgCfgMeters.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getIsValid()) and !len(trim(arguments.chgCfgMeters.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getValBy()) and !len(trim(arguments.chgCfgMeters.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgMeters.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgMeters.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getChgBy()) and !len(trim(arguments.chgCfgMeters.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgMeters.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgMeters.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgCfgMeters.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgMeters.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgMeters.getCreatedBy()) and !len(trim(arguments.chgCfgMeters.getCreatedBy()))) ? "true" : "false");        
        local.q.addParam(value=ucase(trim(arguments.chgCfgMeters.getEventId())),cfsqltype="CF_SQL_VARCHAR");
      
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CfgMetersDao could not update the following record: #arguments.chgCfgMeters.toString()#");
        }
	    
	}
	
	/* delete */
	public void function delete(required ) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.CFG_METERS " &
                "WHERE  ";

		/* delete from database */
                
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CfgMetersDao could not delete the following record: ");
        }
	}
	
	public void function deleteMeterEvent(required assetId, required eventId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        
        var msg = "";
        var qry="";
        var q=new query();
        
        var sql="DELETE FROM CORE_TABLES.CFG_METERS " &
                "WHERE ASSET_ID = ? " &
                "AND EVENT_ID = ?";

		/* delete from database */
		local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.assetId) and !len(trim(arguments.assetId))) ? "true" : "false");        
        local.q.addParam(value=ucase(trim(arguments.eventId)),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.eventId) and !len(trim(arguments.eventId))) ? "true" : "false");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CfgMetersDao could not delete the following record: ");
        }
	}
	

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, EVENT_ID, METER_TYPE, VALUE_IN, DECODE(VALUE_OUT, NULL, VALUE_IN, VALUE_OUT) VALUE_OUT,  " & 
                    "IS_METER_CHG, METER_SEQ, OPER_HRS, BENCH_HRS, EFF_DATE,  " & 
                    "SOURCE_TABLE, SOURCE_DUMMY_PK, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY " & 
                    " " &
                "FROM CORE_TABLES.CFG_METERS M ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"eventId")) {
            if (whereClauseFound) {
                local.sql &= " AND EVENT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE EVENT_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.eventId),cfsqltype="CF_SQL_VARCHAR");
            local.sql &= " AND ROWNUM = 1 "; // This ensures only a single record is returned. CFG_METERS does not contain a PK or natural key.  
        }
        
        if (StructKeyExists(arguments.filter,"assetId")) {
            if (whereClauseFound) {
                local.sql &= " AND ASSET_ID = ? " &
                             " AND EFF_DATE = (SELECT MAX(EFF_DATE) " &
                             "                 FROM CORE_TABLES.CFG_METERS " &
                             "                 WHERE ASSET_ID = M.ASSET_ID " &
                             "                 AND IS_VALID = 'Y' )" &
                             " AND CHG_DATE = (SELECT MAX(CHG_DATE) " &
                             "                 FROM CORE_TABLES.CFG_METERS " &
                             "                 WHERE ASSET_ID = M.ASSET_ID " &
                             "                 AND EFF_DATE = M.EFF_DATE " &
                             "                 AND IS_VALID = 'Y' )" &
                             " AND IS_VALID = 'Y' ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ASSET_ID = ? " &
                             " AND EFF_DATE = (SELECT MAX(EFF_DATE) " &
                             "                 FROM CORE_TABLES.CFG_METERS " &
                             "                 WHERE ASSET_ID = M.ASSET_ID " &
                             "                 AND IS_VALID = 'Y' )" &
                             " AND CHG_DATE = (SELECT MAX(CHG_DATE) " &
                             "                 FROM CORE_TABLES.CFG_METERS " &
                             "                 WHERE ASSET_ID = M.ASSET_ID " &
                             "                 AND EFF_DATE = M.EFF_DATE " &
                             "                 AND IS_VALID = 'Y' )" &
                             " AND IS_VALID = 'Y' ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.assetId),cfsqltype="CF_SQL_VARCHAR");
            local.sql &= " AND ROWNUM = 1 "; // This ensures only a single record is returned. CFG_METERS does not contain a PK or natural key.  
        }
        
        local.sql &= " ORDER BY CREATE_DATE DESC ";

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
