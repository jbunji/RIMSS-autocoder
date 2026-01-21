import cfc.model.LocByLoc;
import cfc.utils.Datasource;

component output="false" displayName="LocByLocDao" name="LocByLocDao" {
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
	public any function create(required LocByLoc newLocByLoc) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LOC_BY_LOC ( " &
                    "LBL_ID, GROUP_CD, LOC_ID1, LOC_ID2, INS_BY,  " & 
                    "INS_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLocByLoc.getLblId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocByLoc.getLblId()) and !len(trim(arguments.newLocByLoc.getLblId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocByLoc.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocByLoc.getGroupCd()) and !len(trim(arguments.newLocByLoc.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocByLoc.getLocId1())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocByLoc.getLocId1()) and !len(trim(arguments.newLocByLoc.getLocId1()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocByLoc.getLocId2())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocByLoc.getLocId2()) and !len(trim(arguments.newLocByLoc.getLocId2()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocByLoc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocByLoc.getInsBy()) and !len(trim(arguments.newLocByLoc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLocByLoc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLocByLoc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="LocByLocDao could not insert the following record: #arguments.newLocByLoc.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string lblId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new LocByLoc();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.lblId = arguments.lblId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LocByLocDao could not find the following record: Lbl_Id[#arguments.lblId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LocByLoc();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LocByLocDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required LocByLoc chgLocByLoc) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LOC_BY_LOC SET " & 
                    "GROUP_CD = ?, LOC_ID1 = ?, LOC_ID2 = ?, INS_BY = ?,  " &
                    "INS_DATE = ? " &
                "WHERE LBL_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLocByLoc.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocByLoc.getGroupCd()) and !len(trim(arguments.chgLocByLoc.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocByLoc.getLocId1())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocByLoc.getLocId1()) and !len(trim(arguments.chgLocByLoc.getLocId1()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocByLoc.getLocId2())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocByLoc.getLocId2()) and !len(trim(arguments.chgLocByLoc.getLocId2()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocByLoc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocByLoc.getInsBy()) and !len(trim(arguments.chgLocByLoc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLocByLoc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLocByLoc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLocByLoc.getLblId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LocByLocDao could not update the following record: #arguments.chgLocByLoc.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string lblId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LOC_BY_LOC " &
                "WHERE LBL_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.lblId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LocByLocDao could not delete the following record: Lbl_Id[#arguments.lblId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LBL_ID, GROUP_CD, LOC_ID1, LOC_ID2, INS_BY,  " & 
                    "INS_DATE " &
                "FROM GLOBALEYE.LOC_BY_LOC ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"lblId")) {
            if (whereClauseFound) {
                local.sql &= " AND LBL_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LBL_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.lblId)),cfsqltype="CF_SQL_VARCHAR");
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
