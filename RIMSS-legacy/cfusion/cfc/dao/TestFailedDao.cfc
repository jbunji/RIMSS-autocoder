import cfc.model.TestFailed;
import cfc.utils.Datasource;

component output="false" displayName="TestFailedDao" name="TestFailedDao" {
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
	public any function create(required TestFailed newTestFailed) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.TEST_FAILED ( " &
                    "TEST_FAIL_ID, LABOR_ID, TEST_FAIL_CD, TEST_TYPE_CD, INS_BY,  " & 
  					"INS_DATE, CHG_BY, CHG_DATE, VALID, VAL_BY, VAL_DATE  )" & 
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getTestFailId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getTestFailId()) and !len(trim(arguments.newTestFailed.getTestFailId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getLaborId()) and !len(trim(arguments.newTestFailed.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getTestFailCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getTestFailCd()) and !len(trim(arguments.newTestFailed.getTestFailCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getTestTypeCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getTestTypeCd()) and !len(trim(arguments.newTestFailed.getTestTypeCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getInsBy()) and !len(trim(arguments.newTestFailed.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newTestFailed.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTestFailed.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getChgBy()) and !len(trim(arguments.newTestFailed.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newTestFailed.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTestFailed.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getValid()) and !len(trim(arguments.newTestFailed.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTestFailed.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTestFailed.getValBy()) and !len(trim(arguments.newTestFailed.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newTestFailed.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTestFailed.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        
        try {
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;
        } catch (any e) {
        	throw(type="CreateException", message=e.message);
        }
        
        
        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="TestFailedDao could not insert the following record: #arguments.newTestFailed.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string testFailId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new TestFailed();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.testFailId = arguments.testFailId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="TestFailedDao could not find the following record: Test_Fail_Id[#arguments.testFailId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new TestFailed();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="TestFailedDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
    public Query function readByLaborId(required string laborId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new TestFailed();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.laborId = arguments.laborId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="TestFailedDao could not find the following record: Labor_ID[#arguments.laborId#]");
        }
    }

	/* update */
	public void function update(required TestFailed chgTestFailed) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.TEST_FAILED SET " & 
                    "LABOR_ID = ?, TEST_FAIL_CD = ?, TEST_TYPE_CD = ?, INS_BY = ?, " &
                    "INS_DATE = ?, CHG_BY = ?, CHG_DATE = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?  " &
                "WHERE TEST_FAIL_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getLaborId()) and !len(trim(arguments.chgTestFailed.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getTestFailCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getTestFailCd()) and !len(trim(arguments.chgTestFailed.getTestFailCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getTestTypeCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.TestTypeCd()) and !len(trim(arguments.chgTestFailed.TestTypeCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getInsBy()) and !len(trim(arguments.chgTestFailed.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTestFailed.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTestFailed.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getChgBy()) and !len(trim(arguments.chgTestFailed.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTestFailed.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTestFailed.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getValid()) and !len(trim(arguments.chgTestFailed.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getValBy()) and !len(trim(arguments.chgTestFailed.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTestFailed.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTestFailed.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTestFailed.getTestFailId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTestFailed.getTestFailId()) and !len(trim(arguments.chgTestFailed.getTestFailId()))) ? "true" : "false");
                
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="TestFailedDao could not update the following record: #arguments.chgTestFailed.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string testFailId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.TEST_FAILED " &
                "WHERE TEST_FAIL_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.testFailId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="TestFailedDao could not delete the following record: Test_Fail_Id[#arguments.testFailId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT TEST_FAIL_ID, LABOR_ID, TEST_FAIL_CD, TEST_TYPE_CD, INS_BY,  " & 
                    "INS_DATE, CHG_BY, CHG_DATE, VALID, VAL_BY, VAL_DATE  " &
                "FROM GLOBALEYE.TEST_FAILED ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"testFailId")) {
            if (whereClauseFound) {
                local.sql &= " AND TEST_FAIL_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE TEST_FAIL_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.testFailId)),cfsqltype="CF_SQL_VARCHAR");
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
        
        if (StructKeyExists(arguments.filter,"laborId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.laborId),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
