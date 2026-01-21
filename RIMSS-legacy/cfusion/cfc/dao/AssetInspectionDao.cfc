import cfc.model.AssetInspection;
import cfc.utils.Datasource;

component output="false" displayName="AssetInspectionDao" name="AssetInspectionDao" {
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
	public any function create(required AssetInspection newAssetInspection) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.ASSET_INSPECTION ( " &
                    "HIST_ID, ASSET_ID, INS_BY, INS_DATE, VALID,  " & 
                    "WUC_CD, JST_ID, REPAIR_ID, COMPLETE_DATE, NEXT_DUE_DATE,  " & 
                    "JOB_NO, COMPLETED_BY, CHG_BY, CHG_DATE, PMI_TYPE,  " & 
                    "COMPLETED_ETM, NEXT_DUE_ETM) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getHistId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getHistId()) and !len(trim(arguments.newAssetInspection.getHistId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getAssetId()) and !len(trim(arguments.newAssetInspection.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getInsBy()) and !len(trim(arguments.newAssetInspection.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newAssetInspection.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAssetInspection.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getValid()) and !len(trim(arguments.newAssetInspection.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getWucCd()) and !len(trim(arguments.newAssetInspection.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getJstId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getJstId()) and !len(trim(arguments.newAssetInspection.getJstId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getRepairId()) and !len(trim(arguments.newAssetInspection.getRepairId()))) ? "true" : "false");
        if (IsDate(arguments.newAssetInspection.getCompleteDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAssetInspection.getCompleteDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAssetInspection.getNextDueDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAssetInspection.getNextDueDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getJobNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getJobNo()) and !len(trim(arguments.newAssetInspection.getJobNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getCompletedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getCompletedBy()) and !len(trim(arguments.newAssetInspection.getCompletedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getChgBy()) and !len(trim(arguments.newAssetInspection.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAssetInspection.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAssetInspection.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getPmiType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getPmiType()) and !len(trim(arguments.newAssetInspection.getPmiType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getCompletedEtm())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getCompletedEtm()) and !len(trim(arguments.newAssetInspection.getCompletedEtm()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAssetInspection.getNextDueEtm())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAssetInspection.getNextDueEtm()) and !len(trim(arguments.newAssetInspection.getNextDueEtm()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="AssetInspectionDao could not insert the following record: #arguments.newAssetInspection.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string histId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AssetInspection();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.histId = arguments.histId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetInspectionDao could not find the following record: Hist_Id[#arguments.histId#]");
        }
    }
    
    
    
    /* readByRepairId */
	public Query function readByRepairId(required string repairId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AssetInspection();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetInspectionDao could not find the following record: Repair_Id[#arguments.repairId#]");
        }
    }
    
    /* readByAssetId */
	public Query function readByAssetId(required string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AssetInspection();
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
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetInspectionDao could not find the following record: Asset_Id[#arguments.assetId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new AssetInspection();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetInspectionDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required AssetInspection chgAssetInspection) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.ASSET_INSPECTION SET " & 
                    "ASSET_ID = ?, INS_BY = ?, INS_DATE = ?, VALID = ?,  " &
                    "WUC_CD = ?, JST_ID = ?, REPAIR_ID = ?, COMPLETE_DATE = ?, NEXT_DUE_DATE = ?,  " &
                    "JOB_NO = ?, COMPLETED_BY = ?, CHG_BY = ?, CHG_DATE = ?, PMI_TYPE = ?,  " &
                    "COMPLETED_ETM = ?, NEXT_DUE_ETM = ? " &
                "WHERE HIST_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getAssetId()) and !len(trim(arguments.chgAssetInspection.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getInsBy()) and !len(trim(arguments.chgAssetInspection.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAssetInspection.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAssetInspection.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getValid()) and !len(trim(arguments.chgAssetInspection.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getWucCd()) and !len(trim(arguments.chgAssetInspection.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getJstId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getJstId()) and !len(trim(arguments.chgAssetInspection.getJstId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getRepairId()) and !len(trim(arguments.chgAssetInspection.getRepairId()))) ? "true" : "false");
        if (IsDate(arguments.chgAssetInspection.getCompleteDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAssetInspection.getCompleteDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAssetInspection.getNextDueDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAssetInspection.getNextDueDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getJobNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getJobNo()) and !len(trim(arguments.chgAssetInspection.getJobNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getCompletedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getCompletedBy()) and !len(trim(arguments.chgAssetInspection.getCompletedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getChgBy()) and !len(trim(arguments.chgAssetInspection.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAssetInspection.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAssetInspection.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getPmiType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getPmiType()) and !len(trim(arguments.chgAssetInspection.getPmiType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getCompletedEtm())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getCompletedEtm()) and !len(trim(arguments.chgAssetInspection.getCompletedEtm()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getNextDueEtm())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAssetInspection.getNextDueEtm()) and !len(trim(arguments.chgAssetInspection.getNextDueEtm()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAssetInspection.getHistId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AssetInspectionDao could not update the following record: #arguments.chgAssetInspection.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string histId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.ASSET_INSPECTION " &
                "WHERE HIST_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.histId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AssetInspectionDao could not delete the following record: Hist_Id[#arguments.histId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT HIST_ID, ASSET_ID, INS_BY, INS_DATE, VALID,  " & 
                    "WUC_CD, JST_ID, REPAIR_ID, COMPLETE_DATE, NEXT_DUE_DATE,  " & 
                    "JOB_NO, COMPLETED_BY, CHG_BY, CHG_DATE, PMI_TYPE,  " & 
                    "COMPLETED_ETM, NEXT_DUE_ETM " &
                "FROM GLOBALEYE.ASSET_INSPECTION ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"histId")) {
            if (whereClauseFound) {
                local.sql &= " AND HIST_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE HIST_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.histId)),cfsqltype="CF_SQL_VARCHAR");
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
            local.objQuery.addParam(value=ucase(trim(arguments.filter.repairId)),cfsqltype="CF_SQL_VARCHAR");
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

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
