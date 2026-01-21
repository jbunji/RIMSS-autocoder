import cfc.model.CodeByLoc;
import cfc.utils.Datasource;

component output="false" displayName="CodeByLocDao" name="CodeByLocDao" {
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
	public any function create(required CodeByLoc newCodeByLoc) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CODE_BY_LOC ( " &
                    "CBL_ID, LOC_ID, CODE_ID, INS_BY, INS_DATE,  " & 
                    "SORT_ORDER, GROUP_CD, KEY_AREA) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getCblId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getCblId()) and !len(trim(arguments.newCodeByLoc.getCblId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getLocId()) and !len(trim(arguments.newCodeByLoc.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getCodeId()) and !len(trim(arguments.newCodeByLoc.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getInsBy()) and !len(trim(arguments.newCodeByLoc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCodeByLoc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCodeByLoc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getSortOrder()) and !len(trim(arguments.newCodeByLoc.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getGroupCd()) and !len(trim(arguments.newCodeByLoc.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByLoc.getKeyArea())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByLoc.getKeyArea()) and !len(trim(arguments.newCodeByLoc.getKeyArea()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CodeByLocDao could not insert the following record: #arguments.newCodeByLoc.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string cblId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CodeByLoc();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.cblId = arguments.cblId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeByLocDao could not find the following record: Cbl_Id[#arguments.cblId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CodeByLoc();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeByLocDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CodeByLoc chgCodeByLoc) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CODE_BY_LOC SET " & 
                    "LOC_ID = ?, CODE_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "SORT_ORDER = ?, GROUP_CD = ?, KEY_AREA = ? " &
                "WHERE CBL_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getLocId()) and !len(trim(arguments.chgCodeByLoc.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getCodeId()) and !len(trim(arguments.chgCodeByLoc.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getInsBy()) and !len(trim(arguments.chgCodeByLoc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCodeByLoc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCodeByLoc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getSortOrder()) and !len(trim(arguments.chgCodeByLoc.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getGroupCd()) and !len(trim(arguments.chgCodeByLoc.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getKeyArea())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByLoc.getKeyArea()) and !len(trim(arguments.chgCodeByLoc.getKeyArea()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByLoc.getCblId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CodeByLocDao could not update the following record: #arguments.chgCodeByLoc.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string cblId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CODE_BY_LOC " &
                "WHERE CBL_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.cblId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CodeByLocDao could not delete the following record: Cbl_Id[#arguments.cblId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT CBL_ID, LOC_ID, CODE_ID, INS_BY, INS_DATE,  " & 
                    "SORT_ORDER, GROUP_CD, KEY_AREA " &
                "FROM GLOBALEYE.CODE_BY_LOC ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"cblId")) {
            if (whereClauseFound) {
                local.sql &= " AND CBL_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CBL_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.cblId)),cfsqltype="CF_SQL_VARCHAR");
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
