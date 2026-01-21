import cfc.model.LocSet;
import cfc.utils.Datasource;

component output="false" displayName="LocSetDao" name="LocSetDao" {
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
	public any function create(required LocSet newLocSet) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LOC_SET ( " &
                    "SET_ID, SET_NAME, LOC_ID, INS_BY, INS_DATE,  " & 
                    "ACTIVE, DISPLAY_NAME) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getSetId()) and !len(trim(arguments.newLocSet.getSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getSetName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getSetName()) and !len(trim(arguments.newLocSet.getSetName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getLocId()) and !len(trim(arguments.newLocSet.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getInsBy()) and !len(trim(arguments.newLocSet.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLocSet.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLocSet.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getActive()) and !len(trim(arguments.newLocSet.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocSet.getDisplayName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocSet.getDisplayName()) and !len(trim(arguments.newLocSet.getDisplayName()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="LocSetDao could not insert the following record: #arguments.newLocSet.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string setId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new LocSet();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.setId = arguments.setId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LocSetDao could not find the following record: Set_Id[#arguments.setId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LocSet();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LocSetDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required LocSet chgLocSet) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LOC_SET SET " & 
                    "SET_NAME = ?, LOC_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "ACTIVE = ?, DISPLAY_NAME = ? " &
                "WHERE SET_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getSetName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocSet.getSetName()) and !len(trim(arguments.chgLocSet.getSetName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocSet.getLocId()) and !len(trim(arguments.chgLocSet.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocSet.getInsBy()) and !len(trim(arguments.chgLocSet.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLocSet.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLocSet.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocSet.getActive()) and !len(trim(arguments.chgLocSet.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getDisplayName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocSet.getDisplayName()) and !len(trim(arguments.chgLocSet.getDisplayName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocSet.getSetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LocSetDao could not update the following record: #arguments.chgLocSet.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string setId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LOC_SET " &
                "WHERE SET_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.setId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LocSetDao could not delete the following record: Set_Id[#arguments.setId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT SET_ID, SET_NAME, LOC_ID, INS_BY, INS_DATE,  " & 
                    "ACTIVE, DISPLAY_NAME " &
                "FROM GLOBALEYE.LOC_SET ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"setId")) {
            if (whereClauseFound) {
                local.sql &= " AND SET_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SET_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.setId)),cfsqltype="CF_SQL_VARCHAR");
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
