import cfc.model.CfgActs;
import cfc.utils.Datasource;

component output="false" displayName="CfgActsDao" name="CfgActsDao" {
    variables.instance = {};
    variables.instance.datasource = 0;

	/* Auto-generated method
       Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
		return this ;
	}
	
	/* create */
	public any function create(required CfgActs newCfgActs) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.CFG_ACTS ( " &
                    "ASSET_ID, A_DELAYS, B_DELAYS, BEARING, DISTANCE,  " & 
                    "ELEVATION, LATITUDE, LONGITUDE, RX_SENS_A, RX_SENS_B,  " & 
                    "TX_PWR_A, TX_PWR_B, UMBIL_CODE, POD_ID, FREQUENCY,  " & 
                    "DEPLOYED_DATE, REMARKS, IS_VALID, VAL_BY, VAL_DATE,  " & 
                    "CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY, ACCESSIBILITY,  " & 
                    "DF_TUBE_CNT, EFF_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getAssetId()) and !len(trim(arguments.newCfgActs.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getADelays())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getADelays()) and !len(trim(arguments.newCfgActs.getADelays()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getBDelays())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getBDelays()) and !len(trim(arguments.newCfgActs.getBDelays()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getBearing())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getBearing()) and !len(trim(arguments.newCfgActs.getBearing()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getDistance())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getDistance()) and !len(trim(arguments.newCfgActs.getDistance()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getElevation())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getElevation()) and !len(trim(arguments.newCfgActs.getElevation()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getLatitude())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getLatitude()) and !len(trim(arguments.newCfgActs.getLatitude()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getLongitude())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getLongitude()) and !len(trim(arguments.newCfgActs.getLongitude()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getRxSensA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRxSensA()) and !len(trim(arguments.newCfgActs.getRxSensA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getRxSensB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRxSensB()) and !len(trim(arguments.newCfgActs.getRxSensB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getTxPwrA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getTxPwrA()) and !len(trim(arguments.newCfgActs.getTxPwrA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getTxPwrB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getTxPwrB()) and !len(trim(arguments.newCfgActs.getTxPwrB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getUmbilCode())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getUmbilCode()) and !len(trim(arguments.newCfgActs.getUmbilCode()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getPodId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getPodId()) and !len(trim(arguments.newCfgActs.getPodId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getFrequency())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getFrequency()) and !len(trim(arguments.newCfgActs.getFrequency()))) ? "true" : "false");
        if (IsDate(arguments.newCfgActs.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgActs.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRemarks()) and !len(trim(arguments.newCfgActs.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getIsValid()) and !len(trim(arguments.newCfgActs.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getValBy()) and !len(trim(arguments.newCfgActs.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgActs.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgActs.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getChgBy()) and !len(trim(arguments.newCfgActs.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgActs.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgActs.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newCfgActs.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgActs.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getCreatedBy()) and !len(trim(arguments.newCfgActs.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getAccessibility())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getAccessibility()) and !len(trim(arguments.newCfgActs.getAccessibility()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgActs.getDfTubeCnt())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getDfTubeCnt()) and !len(trim(arguments.newCfgActs.getDfTubeCnt()))) ? "true" : "false");
        if (IsDate(arguments.newCfgActs.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgActs.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CfgActsDao could not insert the following record: #arguments.newCfgActs.toString()#");
        }
	}
	
	/* read */
	public Query function read(required ) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CfgActs();
        var filter = {};
        var msg = "";
		var qry="";

        
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgActsDao could not find the following record: ");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CfgActs();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgActsDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CfgActs chgCfgActs) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.CFG_ACTS SET " & 
                    "ASSET_ID = ?, A_DELAYS = ?, B_DELAYS = ?, BEARING = ?, DISTANCE = ?,  " &
                    "ELEVATION = ?, LATITUDE = ?, LONGITUDE = ?, RX_SENS_A = ?, RX_SENS_B = ?,  " &
                    "TX_PWR_A = ?, TX_PWR_B = ?, UMBIL_CODE = ?, POD_ID = ?, FREQUENCY = ?,  " &
                    "DEPLOYED_DATE = ?, REMARKS = ?, IS_VALID = ?, VAL_BY = ?, VAL_DATE = ?,  " &
                    "CHG_BY = ?, CHG_DATE = ?, CREATE_DATE = ?, CREATED_BY = ?, ACCESSIBILITY = ?,  " &
                    "DF_TUBE_CNT = ?, EFF_DATE = ? " &
                "WHERE  ";

		/* update database */
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getAssetId()) and !len(trim(arguments.newCfgActs.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getADelays())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getADelays()) and !len(trim(arguments.newCfgActs.getADelays()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getBDelays())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getBDelays()) and !len(trim(arguments.newCfgActs.getBDelays()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getBearing())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getBearing()) and !len(trim(arguments.newCfgActs.getBearing()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getDistance())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getDistance()) and !len(trim(arguments.newCfgActs.getDistance()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getElevation())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getElevation()) and !len(trim(arguments.newCfgActs.getElevation()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getLatitude())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getLatitude()) and !len(trim(arguments.newCfgActs.getLatitude()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getLongitude())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getLongitude()) and !len(trim(arguments.newCfgActs.getLongitude()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getRxSensA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRxSensA()) and !len(trim(arguments.newCfgActs.getRxSensA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getRxSensB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRxSensB()) and !len(trim(arguments.newCfgActs.getRxSensB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getTxPwrA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getTxPwrA()) and !len(trim(arguments.newCfgActs.getTxPwrA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getTxPwrB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getTxPwrB()) and !len(trim(arguments.newCfgActs.getTxPwrB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getUmbilCode())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getUmbilCode()) and !len(trim(arguments.newCfgActs.getUmbilCode()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getPodId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getPodId()) and !len(trim(arguments.newCfgActs.getPodId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getFrequency())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getFrequency()) and !len(trim(arguments.newCfgActs.getFrequency()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgActs.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgActs.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getRemarks()) and !len(trim(arguments.newCfgActs.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getIsValid()) and !len(trim(arguments.newCfgActs.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getValBy()) and !len(trim(arguments.newCfgActs.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgActs.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgActs.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getChgBy()) and !len(trim(arguments.newCfgActs.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgActs.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgActs.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgCfgActs.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgActs.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getCreatedBy()) and !len(trim(arguments.newCfgActs.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getAccessibility())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getAccessibility()) and !len(trim(arguments.newCfgActs.getAccessibility()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgActs.getDfTubeCnt())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgActs.getDfTubeCnt()) and !len(trim(arguments.newCfgActs.getDfTubeCnt()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgActs.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgActs.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CfgActsDao could not update the following record: #arguments.chgCfgActs.toString()#");
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
        var sql="DELETE FROM CORE_TABLES.CFG_ACTS " &
                "WHERE  ";

		/* delete from database */
                
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CfgActsDao could not delete the following record: ");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, A_DELAYS, B_DELAYS, BEARING, DISTANCE,  " & 
                    "ELEVATION, LATITUDE, LONGITUDE, RX_SENS_A, RX_SENS_B,  " & 
                    "TX_PWR_A, TX_PWR_B, UMBIL_CODE, POD_ID, FREQUENCY,  " & 
                    "DEPLOYED_DATE, REMARKS, IS_VALID, VAL_BY, VAL_DATE,  " & 
                    "CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY, ACCESSIBILITY,  " & 
                    "DF_TUBE_CNT, EFF_DATE " &
                "FROM CORE_TABLES.CFG_ACTS ";

        local.objQuery.setDatasource(variables.instance.datasource.getDsName());

        
        
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
