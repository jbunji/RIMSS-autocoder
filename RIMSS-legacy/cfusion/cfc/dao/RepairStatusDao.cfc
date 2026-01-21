import cfc.model.RepairStatus;
import cfc.utils.Datasource;

component output="false" displayName="RepairStatusDao" name="RepairStatusDao" {
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
	public any function create(required RepairStatus newRepairStatus) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.REPAIR_STATUS ( " &
                    "RPSTAT_ID, REPAIR_ID, INS_BY, INS_DATE, STATUS,  " & 
                    "STATUS_DATE, REMARKS, CREW_ID, CHG_BY, CHG_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getRpstatId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getRpstatId()) and !len(trim(arguments.newRepairStatus.getRpstatId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getRepairId()) and !len(trim(arguments.newRepairStatus.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getInsBy()) and !len(trim(arguments.newRepairStatus.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newRepairStatus.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepairStatus.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getStatus()) and !len(trim(arguments.newRepairStatus.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.newRepairStatus.getStatusDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepairStatus.getStatusDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getRemarks()) and !len(trim(arguments.newRepairStatus.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getCrewId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getCrewId()) and !len(trim(arguments.newRepairStatus.getCrewId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newRepairStatus.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newRepairStatus.getChgBy()) and !len(trim(arguments.newRepairStatus.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newRepairStatus.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newRepairStatus.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="RepairStatusDao could not insert the following record: #arguments.newRepairStatus.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string rpstatId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new RepairStatus();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.rpstatId = arguments.rpstatId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="RepairStatusDao could not find the following record: Rpstat_Id[#arguments.rpstatId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new RepairStatus();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="RepairStatusDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required RepairStatus chgRepairStatus) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.REPAIR_STATUS SET " & 
                    "REPAIR_ID = ?, INS_BY = ?, INS_DATE = ?, STATUS = ?,  " &
                    "STATUS_DATE = ?, REMARKS = ?, CREW_ID = ?, CHG_BY = ?, CHG_DATE = ? " &
                    " " &
                "WHERE RPSTAT_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getRepairId()) and !len(trim(arguments.chgRepairStatus.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getInsBy()) and !len(trim(arguments.chgRepairStatus.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgRepairStatus.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepairStatus.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getStatus()) and !len(trim(arguments.chgRepairStatus.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.chgRepairStatus.getStatusDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepairStatus.getStatusDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getRemarks()) and !len(trim(arguments.chgRepairStatus.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getCrewId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getCrewId()) and !len(trim(arguments.chgRepairStatus.getCrewId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgRepairStatus.getChgBy()) and !len(trim(arguments.chgRepairStatus.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgRepairStatus.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgRepairStatus.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgRepairStatus.getRpstatId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="RepairStatusDao could not update the following record: #arguments.chgRepairStatus.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string rpstatId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.REPAIR_STATUS " &
                "WHERE RPSTAT_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.rpstatId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="RepairStatusDao could not delete the following record: Rpstat_Id[#arguments.rpstatId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT RPSTAT_ID, REPAIR_ID, INS_BY, INS_DATE, STATUS,  " & 
                    "STATUS_DATE, REMARKS, CREW_ID, CHG_BY, CHG_DATE " & 
                    " " &
                "FROM GLOBALEYE.REPAIR_STATUS ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"rpstatId")) {
            if (whereClauseFound) {
                local.sql &= " AND RPSTAT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE RPSTAT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.rpstatId)),cfsqltype="CF_SQL_VARCHAR");
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
