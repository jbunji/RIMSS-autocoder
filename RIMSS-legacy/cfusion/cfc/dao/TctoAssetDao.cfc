import cfc.model.TctoAsset;
import cfc.utils.Datasource;

component output="false" displayName="TctoAssetDao" name="TctoAssetDao" {
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
	public any function create(required TctoAsset newTctoAsset) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.TCTO_ASSET ( " &
                    "TCTO_ID, ASSET_ID, INS_BY, INS_DATE, VALID,  " & 
                    "VAL_BY, VAL_DATE, REMARKS, COMPLETE_DATE, CHG_BY,  " & 
                    "CHG_DATE, REPAIR_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getTctoId()) and !len(trim(arguments.newTctoAsset.getTctoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getAssetId()) and !len(trim(arguments.newTctoAsset.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getInsBy()) and !len(trim(arguments.newTctoAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newTctoAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTctoAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getValid()) and !len(trim(arguments.newTctoAsset.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getValBy()) and !len(trim(arguments.newTctoAsset.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newTctoAsset.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTctoAsset.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getRemarks()) and !len(trim(arguments.newTctoAsset.getRemarks()))) ? "true" : "false");
        if (IsDate(arguments.newTctoAsset.getCompleteDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTctoAsset.getCompleteDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getChgBy()) and !len(trim(arguments.newTctoAsset.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newTctoAsset.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTctoAsset.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTctoAsset.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTctoAsset.getRepairId()) and !len(trim(arguments.newTctoAsset.getRepairId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="TctoAssetDao could not insert the following record: #arguments.newTctoAsset.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string tctoId, string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new TctoAsset();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.tctoId = arguments.tctoId;
        local.filter.assetId = arguments.assetId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="TctoAssetDao could not find the following record: Tcto_Id[#arguments.tctoId#] and Asset_Id[#arguments.assetId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new TctoAsset();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="TctoAssetDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
     public Query function readByRepairId(required string repairId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new TctoAsset();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.repairId = arguments.repairId;
        local.qry=findByFilter(local.filter);

        
        return local.qry;
        
    }

	/* update */
	public void function update(required TctoAsset chgTctoAsset) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.TCTO_ASSET SET " & 
                    "INS_BY = ?, INS_DATE = ?, VALID = ?,  " &
                    "VAL_BY = ?, VAL_DATE = ?, REMARKS = ?, COMPLETE_DATE = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, REPAIR_ID = ? " &
                "WHERE TCTO_ID = ? AND ASSET_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getInsBy()) and !len(trim(arguments.chgTctoAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getValid()) and !len(trim(arguments.chgTctoAsset.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getValBy()) and !len(trim(arguments.chgTctoAsset.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getRemarks()) and !len(trim(arguments.chgTctoAsset.getRemarks()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getCompleteDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getCompleteDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getChgBy()) and !len(trim(arguments.chgTctoAsset.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getRepairId())),cfsqltype="CF_SQL_VARCHAR"); 
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getTctoId())),cfsqltype="CF_SQL_VARCHAR");        
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="TctoAssetDao could not update the following record: #arguments.chgTctoAsset.toString()#");
        }
	}
	
	public void function updateByRepairId(required TctoAsset chgTctoAsset) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.TCTO_ASSET SET " & 
                    "INS_BY = ?, INS_DATE = ?, VALID = ?,  " &
                    "VAL_BY = ?, VAL_DATE = ?, REMARKS = ?, COMPLETE_DATE = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, TCTO_ID = ?, ASSET_ID = ? " &
                "WHERE REPAIR_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getInsBy()) and !len(trim(arguments.chgTctoAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getValid()) and !len(trim(arguments.chgTctoAsset.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getValBy()) and !len(trim(arguments.chgTctoAsset.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getRemarks()) and !len(trim(arguments.chgTctoAsset.getRemarks()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getCompleteDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getCompleteDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTctoAsset.getChgBy()) and !len(trim(arguments.chgTctoAsset.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTctoAsset.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTctoAsset.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getTctoId())),cfsqltype="CF_SQL_VARCHAR");        
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.chgTctoAsset.getRepairId())),cfsqltype="CF_SQL_VARCHAR"); 
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="TctoAssetDao could not update the following record: #arguments.chgTctoAsset.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string tctoId, string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.TCTO_ASSET " &
                "WHERE TCTO_ID = ? AND ASSET_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.tctoId)),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="TctoAssetDao could not delete the following record: Tcto_Id[#arguments.tctoId#] and Asset_Id[#arguments.assetId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT TCTO_ID, ASSET_ID, INS_BY, INS_DATE, VALID,  " & 
                    "VAL_BY, VAL_DATE, REMARKS, COMPLETE_DATE, CHG_BY,  " & 
                    "CHG_DATE, REPAIR_ID " &
                "FROM GLOBALEYE.TCTO_ASSET ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"tctoId")) {
            if (whereClauseFound) {
                local.sql &= " AND TCTO_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE TCTO_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.tctoId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"assetId")) {
            if (whereClauseFound) {
                local.sql &= " AND ASSET_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ASSET_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.assetId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
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
