import cfc.model.LaborStatus;
import cfc.utils.Datasource;

component output="false" displayName="LaborStatusDao" name="LaborStatusDao" {
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
	public any function create(required LaborStatus newLaborStatus) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LABOR_STATUS ( " &
                    "LAB_STAT_ID, LABOR_ID, INS_BY, INS_DATE, STATUS,  " & 
                    "STATUS_DATE, REMARKS, CREW_ID, CHG_BY, CHG_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getLabStatId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getLabStatId()) and !len(trim(arguments.newLaborStatus.getLabStatId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getLaborId()) and !len(trim(arguments.newLaborStatus.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getInsBy()) and !len(trim(arguments.newLaborStatus.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLaborStatus.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborStatus.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getStatus()) and !len(trim(arguments.newLaborStatus.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.newLaborStatus.getStatusDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborStatus.getStatusDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getRemarks()) and !len(trim(arguments.newLaborStatus.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getCrewId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getCrewId()) and !len(trim(arguments.newLaborStatus.getCrewId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborStatus.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborStatus.getChgBy()) and !len(trim(arguments.newLaborStatus.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newLaborStatus.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborStatus.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="LaborStatusDao could not insert the following record: #arguments.newLaborStatus.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string labStatId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new LaborStatus();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.labStatId = arguments.labStatId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborStatusDao could not find the following record: Lab_Stat_Id[#arguments.labStatId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LaborStatus();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborStatusDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required LaborStatus chgLaborStatus) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LABOR_STATUS SET " & 
                    "LABOR_ID = ?, INS_BY = ?, INS_DATE = ?, STATUS = ?,  " &
                    "STATUS_DATE = ?, REMARKS = ?, CREW_ID = ?, CHG_BY = ?, CHG_DATE = ? " &
                    " " &
                "WHERE LAB_STAT_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getLaborId()) and !len(trim(arguments.chgLaborStatus.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getInsBy()) and !len(trim(arguments.chgLaborStatus.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborStatus.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborStatus.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getStatus()) and !len(trim(arguments.chgLaborStatus.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborStatus.getStatusDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborStatus.getStatusDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getRemarks()) and !len(trim(arguments.chgLaborStatus.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getCrewId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getCrewId()) and !len(trim(arguments.chgLaborStatus.getCrewId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborStatus.getChgBy()) and !len(trim(arguments.chgLaborStatus.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborStatus.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborStatus.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborStatus.getLabStatId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LaborStatusDao could not update the following record: #arguments.chgLaborStatus.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string labStatId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LABOR_STATUS " &
                "WHERE LAB_STAT_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.labStatId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LaborStatusDao could not delete the following record: Lab_Stat_Id[#arguments.labStatId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LAB_STAT_ID, LABOR_ID, INS_BY, INS_DATE, STATUS,  " & 
                    "STATUS_DATE, REMARKS, CREW_ID, CHG_BY, CHG_DATE " & 
                    " " &
                "FROM GLOBALEYE.LABOR_STATUS ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"labStatId")) {
            if (whereClauseFound) {
                local.sql &= " AND LAB_STAT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LAB_STAT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.labStatId)),cfsqltype="CF_SQL_VARCHAR");
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
