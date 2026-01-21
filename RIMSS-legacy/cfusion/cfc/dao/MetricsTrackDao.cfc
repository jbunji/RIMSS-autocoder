import cfc.model.MetricsTrack;
import cfc.utils.Datasource;

component output="false" displayName="MetricsTrackDao" name="MetricsTrackDao" {
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
	public any function create(required MetricsTrack newMetricsTrack) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.METRICS_TRACK ( " &
                    "TRACK_ID, INS_BY, INS_DATE, ASSET_ID, REPAIR_ID,  " & 
                    "VET_TYPE, VET_STATUS, TYPE_FAIL, VET_DATE, REMARKS,  " & 
                    "CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getTrackId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getTrackId()) and !len(trim(arguments.newMetricsTrack.getTrackId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getInsBy()) and !len(trim(arguments.newMetricsTrack.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newMetricsTrack.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newMetricsTrack.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getAssetId()) and !len(trim(arguments.newMetricsTrack.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getRepairId()) and !len(trim(arguments.newMetricsTrack.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getVetType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getVetType()) and !len(trim(arguments.newMetricsTrack.getVetType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getVetStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getVetStatus()) and !len(trim(arguments.newMetricsTrack.getVetStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getTypeFail())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getTypeFail()) and !len(trim(arguments.newMetricsTrack.getTypeFail()))) ? "true" : "false");
        if (IsDate(arguments.newMetricsTrack.getVetDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newMetricsTrack.getVetDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getRemarks()) and !len(trim(arguments.newMetricsTrack.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newMetricsTrack.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newMetricsTrack.getChgBy()) and !len(trim(arguments.newMetricsTrack.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newMetricsTrack.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newMetricsTrack.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="MetricsTrackDao could not insert the following record: #arguments.newMetricsTrack.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string trackId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new MetricsTrack();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.trackId = arguments.trackId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="MetricsTrackDao could not find the following record: Track_Id[#arguments.trackId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new MetricsTrack();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="MetricsTrackDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required MetricsTrack chgMetricsTrack) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.METRICS_TRACK SET " & 
                    "INS_BY = ?, INS_DATE = ?, ASSET_ID = ?, REPAIR_ID = ?,  " &
                    "VET_TYPE = ?, VET_STATUS = ?, TYPE_FAIL = ?, VET_DATE = ?, REMARKS = ?,  " &
                    "CHG_BY = ?, CHG_DATE = ? " &
                "WHERE TRACK_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getInsBy()) and !len(trim(arguments.chgMetricsTrack.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgMetricsTrack.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgMetricsTrack.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getAssetId()) and !len(trim(arguments.chgMetricsTrack.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getRepairId()) and !len(trim(arguments.chgMetricsTrack.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getVetType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getVetType()) and !len(trim(arguments.chgMetricsTrack.getVetType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getVetStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getVetStatus()) and !len(trim(arguments.chgMetricsTrack.getVetStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getTypeFail())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getTypeFail()) and !len(trim(arguments.chgMetricsTrack.getTypeFail()))) ? "true" : "false");
        if (IsDate(arguments.chgMetricsTrack.getVetDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgMetricsTrack.getVetDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getRemarks()) and !len(trim(arguments.chgMetricsTrack.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgMetricsTrack.getChgBy()) and !len(trim(arguments.chgMetricsTrack.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgMetricsTrack.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgMetricsTrack.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgMetricsTrack.getTrackId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="MetricsTrackDao could not update the following record: #arguments.chgMetricsTrack.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string trackId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.METRICS_TRACK " &
                "WHERE TRACK_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.trackId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="MetricsTrackDao could not delete the following record: Track_Id[#arguments.trackId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT TRACK_ID, INS_BY, INS_DATE, ASSET_ID, REPAIR_ID,  " & 
                    "VET_TYPE, VET_STATUS, TYPE_FAIL, VET_DATE, REMARKS,  " & 
                    "CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.METRICS_TRACK ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"trackId")) {
            if (whereClauseFound) {
                local.sql &= " AND TRACK_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE TRACK_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.trackId)),cfsqltype="CF_SQL_VARCHAR");
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
