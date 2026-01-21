import cfc.model.CodeByCode;
import cfc.utils.Datasource;

component output="false" displayName="CodeByCodeDao" name="CodeByCodeDao" {
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
	public any function create(required CodeByCode newCodeByCode) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CODE_BY_CODE ( " &
                    "CBC_ID, GROUP_CD, CODE_A, CODE_B, INS_BY,  " & 
                    "INS_DATE, SORT_ORDER, LOC_ID, KEY_AREA, RU_TYPE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getCbcId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getCbcId()) and !len(trim(arguments.newCodeByCode.getCbcId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getGroupCd()) and !len(trim(arguments.newCodeByCode.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getCodeA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getCodeA()) and !len(trim(arguments.newCodeByCode.getCodeA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getCodeB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getCodeB()) and !len(trim(arguments.newCodeByCode.getCodeB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getInsBy()) and !len(trim(arguments.newCodeByCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCodeByCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCodeByCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getSortOrder()) and !len(trim(arguments.newCodeByCode.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getLocId()) and !len(trim(arguments.newCodeByCode.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getKeyArea())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getKeyArea()) and !len(trim(arguments.newCodeByCode.getKeyArea()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCodeByCode.getRuType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCodeByCode.getRuType()) and !len(trim(arguments.newCodeByCode.getRuType()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CodeByCodeDao could not insert the following record: #arguments.newCodeByCode.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string cbcId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CodeByCode();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.cbcId = arguments.cbcId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeByCodeDao could not find the following record: Cbc_Id[#arguments.cbcId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CodeByCode();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeByCodeDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CodeByCode chgCodeByCode) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CODE_BY_CODE SET " & 
                    "GROUP_CD = ?, CODE_A = ?, CODE_B = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, SORT_ORDER = ?, LOC_ID = ?, KEY_AREA = ?, RU_TYPE = ? " &
                    " " &
                "WHERE CBC_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getGroupCd()) and !len(trim(arguments.chgCodeByCode.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getCodeA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getCodeA()) and !len(trim(arguments.chgCodeByCode.getCodeA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getCodeB())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getCodeB()) and !len(trim(arguments.chgCodeByCode.getCodeB()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getInsBy()) and !len(trim(arguments.chgCodeByCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCodeByCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCodeByCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getSortOrder()) and !len(trim(arguments.chgCodeByCode.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getLocId()) and !len(trim(arguments.chgCodeByCode.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getKeyArea())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getKeyArea()) and !len(trim(arguments.chgCodeByCode.getKeyArea()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getRuType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCodeByCode.getRuType()) and !len(trim(arguments.chgCodeByCode.getRuType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCodeByCode.getCbcId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CodeByCodeDao could not update the following record: #arguments.chgCodeByCode.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string cbcId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CODE_BY_CODE " &
                "WHERE CBC_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.cbcId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CodeByCodeDao could not delete the following record: Cbc_Id[#arguments.cbcId#]");
        }
	}

    /* getAllByGroupCd */
    public Query function getAllByGroupCd(required string groupCd) {
        var filter = {};
        var qry = '';

        // get all records from database with the passed groupCd
        local.filter.groupCd = arguments.groupCd;
        local.qry=findByFilter(local.filter);

        // return success
        return local.qry;
    }

    /* getAllByCodeA */
    public Query function getAllByCodeA(required string codeA) {
        var filter = {};
        var qry = '';

        // get all records from database with the passed codeA
        local.filter.codeA = arguments.codeA;
        local.qry=findByFilter(local.filter);

        // return success
        return local.qry;
    }

    /* getAllByCodeB */
    public Query function getAllByCodeB(required string codeB) {
        var filter = {};
        var qry = '';

        // get all records from database with the passed codeB
        local.filter.codeB = arguments.codeB;
        local.qry=findByFilter(local.filter);

        // return success
        return local.qry;
    }

    /* getAllByLocId */
    public Query function getAllByLocId(required string locId) {
        var filter = {};
        var qry = '';

        // get all records from database with the passed locId
        local.filter.locId = arguments.locId;
        local.qry=findByFilter(local.filter);

        // return success
        return local.qry;
    }

    public Query function getAllCodeBAsValueListByCodeA(required string codea) {
        var filter = {};
        var qry = '';

        local.filter.codeA = arguments.codea;
        local.qry = findByFilter(local.filter);

        /* return success */
        return local.qry;
    }

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT CBC_ID, GROUP_CD, CODE_A, CODE_B, INS_BY,  " & 
                    "INS_DATE, SORT_ORDER, LOC_ID, KEY_AREA, RU_TYPE " & 
                    " " &
                "FROM GLOBALEYE.CODE_BY_CODE ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"cbcId")) {
            if (whereClauseFound) {
                local.sql &= " AND CBC_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CBC_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.cbcId)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"codeA")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_A = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_A = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeA)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"codeB")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_B = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_B = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeB)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"groupCd")) {
            if (whereClauseFound) {
                local.sql &= " AND GROUP_CD = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE GROUP_CD = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.groupCd)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"locId")) {
            if (whereClauseFound) {
                local.sql &= " AND LOC_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LOC_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeA)),cfsqltype="CF_SQL_VARCHAR");
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
