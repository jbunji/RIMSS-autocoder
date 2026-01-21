import cfc.model.Code;
import cfc.utils.Datasource;

component output="false" displayName="CodeDao" name="CodeDao" {
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
	public any function create(required Code newCode) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CODE ( " &
                    "CODE_ID, CODE_TYPE, CODE_VALUE, DESCRIPTION, INS_BY,  " & 
                    "INS_DATE, ACTIVE, SORT_ORDER, CT_CODE_ID, CHG_BY,  " & 
                    "CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCode.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getCodeId()) and !len(trim(arguments.newCode.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getCodeType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getCodeType()) and !len(trim(arguments.newCode.getCodeType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getCodeValue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getCodeValue()) and !len(trim(arguments.newCode.getCodeValue()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getDescription()) and !len(trim(arguments.newCode.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getInsBy()) and !len(trim(arguments.newCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCode.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getActive()) and !len(trim(arguments.newCode.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getSortOrder()) and !len(trim(arguments.newCode.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getCtCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getCtCodeId()) and !len(trim(arguments.newCode.getCtCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCode.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCode.getChgBy()) and !len(trim(arguments.newCode.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newCode.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCode.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="CodeDao could not insert the following record: #arguments.newCode.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string codeId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Code();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.codeId = arguments.codeId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: Code_Id[#arguments.codeId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Code();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Code chgCode) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CODE SET " & 
                    "CODE_TYPE = ?, CODE_VALUE = ?, DESCRIPTION = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, ACTIVE = ?, SORT_ORDER = ?, CT_CODE_ID = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ? " &
                "WHERE CODE_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCode.getCodeType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getCodeType()) and !len(trim(arguments.chgCode.getCodeType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getCodeValue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getCodeValue()) and !len(trim(arguments.chgCode.getCodeValue()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getDescription()) and !len(trim(arguments.chgCode.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getInsBy()) and !len(trim(arguments.chgCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCode.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getActive()) and !len(trim(arguments.chgCode.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getSortOrder()) and !len(trim(arguments.chgCode.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getCtCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getCtCodeId()) and !len(trim(arguments.chgCode.getCtCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCode.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCode.getChgBy()) and !len(trim(arguments.chgCode.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCode.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCode.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCode.getCodeId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CodeDao could not update the following record: #arguments.chgCode.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string codeId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CODE " &
                "WHERE CODE_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.codeId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CodeDao could not delete the following record: Code_Id[#arguments.codeId#]");
        }
	}

    /* find code by its code_value */
    public Query function findByCodeTypeCodeValue(required string codeType, required string codeValue) {
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.codeType = arguments.codeType;
        local.filter.codeValue = arguments.codeValue;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: CODE_TYPE[#arguments.codeType#] and CODE_VALUE[#arguments.codeValue#]");
        }
    }

    /* find code by its code_value using regex */
    public Query function getCodeByREValue(required string codeType, required string codeValue) {
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.codeType = arguments.codeType;
        local.filter.reCodeValue = arguments.codeValue;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: CODE_TYPE[#arguments.codeType#] and CODE_VALUE[#arguments.codeValue#]");
        }
    }
   

    /* find code by the core_tables code_id */
    public Query function findByCtCodeId(required string ctCodeId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.ctCodeId = arguments.ctCodeId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: CT_CODE_ID[#arguments.ctCodeId#]");
        }
    }

    /* find codes by their code type */
    public Query function findCodesByCodeType(required string codeType) {
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.codeType = arguments.codeType;
        local.qry=findByFilter(local.filter, "CODE_VALUE");

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CodeDao could not find the following record: CODE_TYPE[#arguments.codeType#]");
        }
    }

    private Query function findByFilter(required struct filter, string orderClause) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT CODE_ID, CODE_TYPE, CODE_VALUE, DESCRIPTION, INS_BY,  " & 
                    "INS_DATE, ACTIVE, SORT_ORDER, CT_CODE_ID, CHG_BY,  " & 
                    "CHG_DATE " &
                "FROM GLOBALEYE.CODE ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"codeId")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeId)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"codeType")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_TYPE = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_TYPE = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeType)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"codeValue")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_VALUE = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_VALUE = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeValue)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"reCodeValue")) {
            if (whereClauseFound) {
                local.sql &= " AND UPPER(TRIM(REGEXP_REPLACE(TRIM(CODE_VALUE),'[^[:alnum:]]',''))) = UPPER(TRIM(REGEXP_REPLACE(TRIM(?),'[^[:alnum:]]',''))) ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE UPPER(TRIM(REGEXP_REPLACE(TRIM(CODE_VALUE),'[^[:alnum:]]',''))) = UPPER(TRIM(REGEXP_REPLACE(TRIM(?),'[^[:alnum:]]',''))) ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.reCodeValue)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"ctCodeId")) {
            if (whereClauseFound) {
                local.sql &= " AND CT_CODE_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CT_CODE_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.ctCodeId),cfsqltype="CF_SQL_VARCHAR");
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

        if (StructKeyExists(arguments, "orderClause")) {
            local.sql &= " ORDER BY #arguments.orderClause# ";
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
