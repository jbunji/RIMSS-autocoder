import cfc.model.AuxAssetsTcto;
import cfc.utils.Datasource;

component output="false" displayName="AuxAssetsTctoDao" name="AuxAssetsTctoDao" {
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
	public any function create(required AuxAssetsTcto newAuxAssetsTcto) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.AUX_ASSETS_TCTO ( " &
                    "ASSET_ID, TCTO_ID, CREATE_DATE, CREATED_BY, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "EFF_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getAssetId()) and !len(trim(arguments.newAuxAssetsTcto.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getTctoId()) and !len(trim(arguments.newAuxAssetsTcto.getTctoId()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsTcto.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsTcto.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getCreatedBy()) and !len(trim(arguments.newAuxAssetsTcto.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getRemarks()) and !len(trim(arguments.newAuxAssetsTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getIsValid()) and !len(trim(arguments.newAuxAssetsTcto.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getValBy()) and !len(trim(arguments.newAuxAssetsTcto.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsTcto.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsTcto.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAuxAssetsTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAuxAssetsTcto.getChgBy()) and !len(trim(arguments.newAuxAssetsTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAuxAssetsTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAuxAssetsTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAuxAssetsTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="AuxAssetsTctoDao could not insert the following record: #arguments.newAuxAssetsTcto.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string assetId, string tctoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AuxAssetsTcto();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.assetId = arguments.assetId;
        local.filter.tctoId = arguments.tctoId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AuxAssetsTctoDao could not find the following record: Asset_Id[#arguments.assetId#] and Tcto_Id[#arguments.tctoId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new AuxAssetsTcto();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AuxAssetsTctoDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required AuxAssetsTcto chgAuxAssetsTcto) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.AUX_ASSETS_TCTO SET " & 
                    "CREATE_DATE = ?, CREATED_BY = ?, REMARKS = ?,  " &
                    "IS_VALID = ?, VAL_BY = ?, VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?,  " &
                    "EFF_DATE = ? " &
                "WHERE ASSET_ID = ?TCTO_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        if (IsDate(arguments.chgAuxAssetsTcto.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsTcto.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsTcto.getCreatedBy()) and !len(trim(arguments.chgAuxAssetsTcto.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsTcto.getRemarks()) and !len(trim(arguments.chgAuxAssetsTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsTcto.getIsValid()) and !len(trim(arguments.chgAuxAssetsTcto.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsTcto.getValBy()) and !len(trim(arguments.chgAuxAssetsTcto.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAuxAssetsTcto.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsTcto.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAuxAssetsTcto.getChgBy()) and !len(trim(arguments.chgAuxAssetsTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAuxAssetsTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAuxAssetsTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAuxAssetsTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.chgAuxAssetsTcto.getTctoId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AuxAssetsTctoDao could not update the following record: #arguments.chgAuxAssetsTcto.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string assetId, string tctoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.AUX_ASSETS_TCTO " &
                "WHERE ASSET_ID = ? TCTO_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.tctoId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AuxAssetsTctoDao could not delete the following record: Asset_Id[#arguments.assetId#] and Tcto_Id[#arguments.tctoId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, TCTO_ID, CREATE_DATE, CREATED_BY, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "EFF_DATE " &
                "FROM CORE_TABLES.AUX_ASSETS_TCTO ";

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
        
        if (StructKeyExists(arguments.filter,"tctoId")) {
            if (whereClauseFound) {
                local.sql &= " AND TCTO_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE TCTO_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.tctoId)),cfsqltype="CF_SQL_VARCHAR");
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
