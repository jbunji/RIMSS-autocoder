import cfc.model.AuxAssetsSw;
import cfc.utils.Datasource;

component output="false" displayName="AuxAssetsSwDao" name="AuxAssetsSwDao" {
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
	public any function create(required AuxAssetsSw newAuxAssetsSw) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.AUX_ASSETS_SW ( " &
                    "ASSET_ID, SW_ID, CREATE_DATE, CREATED_BY, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "EFF_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getAssetId()) and !len(trim(arguments.newAuxAssetsSw.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getSwId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getSwId()) and !len(trim(arguments.newAuxAssetsSw.getSwId()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsSw.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsSw.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getCreatedBy()) and !len(trim(arguments.newAuxAssetsSw.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getRemarks()) and !len(trim(arguments.newAuxAssetsSw.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getIsValid()) and !len(trim(arguments.newAuxAssetsSw.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getValBy()) and !len(trim(arguments.newAuxAssetsSw.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsSw.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsSw.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsSw.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsSw.getChgBy()) and !len(trim(arguments.newAuxAssetsSw.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsSw.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsSw.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAuxAssetsSw.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsSw.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="AuxAssetsSwDao could not insert the following record: #arguments.newAuxAssetsSw.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string assetId, string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AuxAssetsSw();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.assetId = arguments.assetId;
        local.filter.swId = arguments.swId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AuxAssetsSwDao could not find the following record: Asset_Id[#arguments.assetId#] and Sw_Id[#arguments.swId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new AuxAssetsSw();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AuxAssetsSwDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required AuxAssetsSw chgAuxAssetsSw) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.AUX_ASSETS_SW SET " & 
                    "CREATE_DATE = ?, CREATED_BY = ?, REMARKS = ?,  " &
                    "IS_VALID = ?, VAL_BY = ?, VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?,  " &
                    "EFF_DATE = ? " &
                "WHERE ASSET_ID = ?SW_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        if (IsDate(arguments.chgAuxAssetsSw.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsSw.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsSw.getCreatedBy()) and !len(trim(arguments.chgAuxAssetsSw.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsSw.getRemarks()) and !len(trim(arguments.chgAuxAssetsSw.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsSw.getIsValid()) and !len(trim(arguments.chgAuxAssetsSw.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsSw.getValBy()) and !len(trim(arguments.chgAuxAssetsSw.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAuxAssetsSw.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsSw.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsSw.getChgBy()) and !len(trim(arguments.chgAuxAssetsSw.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAuxAssetsSw.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsSw.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAuxAssetsSw.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsSw.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsSw.getSwId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AuxAssetsSwDao could not update the following record: #arguments.chgAuxAssetsSw.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string assetId, string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.AUX_ASSETS_SW " &
                "WHERE ASSET_ID = ? SW_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.swId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AuxAssetsSwDao could not delete the following record: Asset_Id[#arguments.assetId#] and Sw_Id[#arguments.swId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, SW_ID, CREATE_DATE, CREATED_BY, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "EFF_DATE " &
                "FROM CORE_TABLES.AUX_ASSETS_SW ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"assetId")) {
            if (whereClauseFound) {
                local.sql &= " AND ASSET_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ASSET_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.assetId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"swId")) {
            if (whereClauseFound) {
                local.sql &= " AND SW_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SW_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.swId)),cfsqltype="CF_SQL_VARCHAR");
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
