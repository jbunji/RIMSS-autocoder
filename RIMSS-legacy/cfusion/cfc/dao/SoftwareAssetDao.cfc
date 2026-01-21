import cfc.model.SoftwareAsset;
import cfc.utils.Datasource;

component output="false" displayName="SoftwareAssetDao" name="SoftwareAssetDao" {
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
	public any function create(required SoftwareAsset newSoftwareAsset) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.SOFTWARE_ASSET ( " &
                    "ASSET_ID, SW_ID, INS_BY, INS_DATE, EFF_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newSoftwareAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftwareAsset.getAssetId()) and !len(trim(arguments.newSoftwareAsset.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftwareAsset.getSwId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftwareAsset.getSwId()) and !len(trim(arguments.newSoftwareAsset.getSwId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftwareAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftwareAsset.getInsBy()) and !len(trim(arguments.newSoftwareAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newSoftwareAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftwareAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newSoftwareAsset.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftwareAsset.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="SoftwareAssetDao could not insert the following record: #arguments.newSoftwareAsset.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string assetId, string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new SoftwareAsset();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="SoftwareAssetDao could not find the following record: Asset_Id[#arguments.assetId#] and Sw_Id[#arguments.swId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new SoftwareAsset();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="SoftwareAssetDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required SoftwareAsset chgSoftwareAsset) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.SOFTWARE_ASSET SET " & 
                    "INS_BY = ?, INS_DATE = ?, EFF_DATE = ? " &
                    " " &
                "WHERE ASSET_ID = ? AND SW_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgSoftwareAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftwareAsset.getInsBy()) and !len(trim(arguments.chgSoftwareAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftwareAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftwareAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgSoftwareAsset.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftwareAsset.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftwareAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.chgSoftwareAsset.getSwId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="SoftwareAssetDao could not update the following record: #arguments.chgSoftwareAsset.toString()#");
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
        var sql="DELETE FROM GLOBALEYE.SOFTWARE_ASSET " &
                "WHERE ASSET_ID = ? AND SW_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");
        local.q.addParam(value=ucase(trim(arguments.swId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="SoftwareAssetDao could not delete the following record: Asset_Id[#arguments.assetId#] and Sw_Id[#arguments.swId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, SW_ID, INS_BY, INS_DATE, EFF_DATE " & 
                    " " &
                "FROM GLOBALEYE.SOFTWARE_ASSET ";

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
