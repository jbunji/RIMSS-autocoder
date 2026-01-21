import cfc.model.BadActor;
import cfc.utils.Datasource;

component output="false" displayName="BadActorDao" name="BadActorDao" {
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
	public any function create(required BadActor newBadActor) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.BAD_ACTOR ( " &
                    "BAD_ACTOR_ID, LOC_ID, SYS_ID, STATUS_PERIOD, STATUS_PERIOD_TYPE,  " & 
                    "INS_BY, INS_DATE, ACTIVE, MULTI_AC, STATUS_COUNT,  " & 
                    "STATUS_CD, CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getBadActorId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getBadActorId()) and !len(trim(arguments.newBadActor.getBadActorId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getLocId()) and !len(trim(arguments.newBadActor.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getSysId()) and !len(trim(arguments.newBadActor.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getStatusPeriod())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getStatusPeriod()) and !len(trim(arguments.newBadActor.getStatusPeriod()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getStatusPeriodType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getStatusPeriodType()) and !len(trim(arguments.newBadActor.getStatusPeriodType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getInsBy()) and !len(trim(arguments.newBadActor.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newBadActor.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newBadActor.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getActive()) and !len(trim(arguments.newBadActor.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getMultiAc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getMultiAc()) and !len(trim(arguments.newBadActor.getMultiAc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getStatusCount())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getStatusCount()) and !len(trim(arguments.newBadActor.getStatusCount()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getStatusCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getStatusCd()) and !len(trim(arguments.newBadActor.getStatusCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newBadActor.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newBadActor.getChgBy()) and !len(trim(arguments.newBadActor.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newBadActor.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newBadActor.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="BadActorDao could not insert the following record: #arguments.newBadActor.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string badActorId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new BadActor();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.badActorId = arguments.badActorId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="BadActorDao could not find the following record: Bad_Actor_Id[#arguments.badActorId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new BadActor();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="BadActorDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required BadActor chgBadActor) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.BAD_ACTOR SET " & 
                    "LOC_ID = ?, SYS_ID = ?, STATUS_PERIOD = ?, STATUS_PERIOD_TYPE = ?,  " &
                    "INS_BY = ?, INS_DATE = ?, ACTIVE = ?, MULTI_AC = ?, STATUS_COUNT = ?,  " &
                    "STATUS_CD = ?, CHG_BY = ?, CHG_DATE = ? " &
                "WHERE BAD_ACTOR_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getLocId()) and !len(trim(arguments.chgBadActor.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getSysId()) and !len(trim(arguments.chgBadActor.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getStatusPeriod())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getStatusPeriod()) and !len(trim(arguments.chgBadActor.getStatusPeriod()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getStatusPeriodType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getStatusPeriodType()) and !len(trim(arguments.chgBadActor.getStatusPeriodType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getInsBy()) and !len(trim(arguments.chgBadActor.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgBadActor.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgBadActor.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getActive()) and !len(trim(arguments.chgBadActor.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getMultiAc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getMultiAc()) and !len(trim(arguments.chgBadActor.getMultiAc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getStatusCount())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getStatusCount()) and !len(trim(arguments.chgBadActor.getStatusCount()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getStatusCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getStatusCd()) and !len(trim(arguments.chgBadActor.getStatusCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgBadActor.getChgBy()) and !len(trim(arguments.chgBadActor.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgBadActor.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgBadActor.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgBadActor.getBadActorId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="BadActorDao could not update the following record: #arguments.chgBadActor.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string badActorId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.BAD_ACTOR " &
                "WHERE BAD_ACTOR_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.badActorId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="BadActorDao could not delete the following record: Bad_Actor_Id[#arguments.badActorId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT BAD_ACTOR_ID, LOC_ID, SYS_ID, STATUS_PERIOD, STATUS_PERIOD_TYPE,  " & 
                    "INS_BY, INS_DATE, ACTIVE, MULTI_AC, STATUS_COUNT,  " & 
                    "STATUS_CD, CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.BAD_ACTOR ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"badActorId")) {
            if (whereClauseFound) {
                local.sql &= " AND BAD_ACTOR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE BAD_ACTOR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.badActorId)),cfsqltype="CF_SQL_VARCHAR");
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
