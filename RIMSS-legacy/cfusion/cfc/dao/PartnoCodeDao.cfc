import cfc.model.PartnoCode;
import cfc.utils.Datasource;

component output="false" displayName="PartnoCodeDao" name="PartnoCodeDao" {
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
	public any function create(required PartnoCode newPartnoCode) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.PARTNO_CODE ( " &
                    "PN_CD_ID, PARTNO_ID, CODE_ID, INS_BY, INS_DATE,  " & 
                    "LOC_ID, GROUP_CD, STATION_TYPE, CONTRACTED, PRIORITY_FLAG,  " & 
                    "CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getPnCdId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getPnCdId()) and !len(trim(arguments.newPartnoCode.getPnCdId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getPartnoId()) and !len(trim(arguments.newPartnoCode.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getCodeId()) and !len(trim(arguments.newPartnoCode.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getInsBy()) and !len(trim(arguments.newPartnoCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartnoCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartnoCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getLocId()) and !len(trim(arguments.newPartnoCode.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getGroupCd()) and !len(trim(arguments.newPartnoCode.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getStationType()) and !len(trim(arguments.newPartnoCode.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getContracted())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getContracted()) and !len(trim(arguments.newPartnoCode.getContracted()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getPriorityFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getPriorityFlag()) and !len(trim(arguments.newPartnoCode.getPriorityFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoCode.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoCode.getChgBy()) and !len(trim(arguments.newPartnoCode.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartnoCode.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartnoCode.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="PartnoCodeDao could not insert the following record: #arguments.newPartnoCode.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string pnCdId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new PartnoCode();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.pnCdId = arguments.pnCdId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="PartnoCodeDao could not find the following record: Pn_Cd_Id[#arguments.pnCdId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new PartnoCode();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="PartnoCodeDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required PartnoCode chgPartnoCode) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.PARTNO_CODE SET " & 
                    "PARTNO_ID = ?, CODE_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "LOC_ID = ?, GROUP_CD = ?, STATION_TYPE = ?, CONTRACTED = ?, PRIORITY_FLAG = ?,  " &
                    "CHG_BY = ?, CHG_DATE = ? " &
                "WHERE PN_CD_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getPartnoId()) and !len(trim(arguments.chgPartnoCode.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getCodeId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getCodeId()) and !len(trim(arguments.chgPartnoCode.getCodeId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getInsBy()) and !len(trim(arguments.chgPartnoCode.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartnoCode.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartnoCode.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getLocId()) and !len(trim(arguments.chgPartnoCode.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getGroupCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getGroupCd()) and !len(trim(arguments.chgPartnoCode.getGroupCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getStationType()) and !len(trim(arguments.chgPartnoCode.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getContracted())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getContracted()) and !len(trim(arguments.chgPartnoCode.getContracted()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getPriorityFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getPriorityFlag()) and !len(trim(arguments.chgPartnoCode.getPriorityFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoCode.getChgBy()) and !len(trim(arguments.chgPartnoCode.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartnoCode.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartnoCode.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartnoCode.getPnCdId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="PartnoCodeDao could not update the following record: #arguments.chgPartnoCode.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string pnCdId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.PARTNO_CODE " &
                "WHERE PN_CD_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.pnCdId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="PartnoCodeDao could not delete the following record: Pn_Cd_Id[#arguments.pnCdId#]");
        }
	}

    public Query function getPartnoIdAsValueListByProgram(required string program) {
        var filter = {};
        var qry = '';

        /* get all records from database */
        local.filter.codeId = arguments.program;
        local.qry=findByFilter(local.filter);

        /* return success */
        return local.qry;
    }

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT PN_CD_ID, PARTNO_ID, CODE_ID, INS_BY, INS_DATE,  " & 
                    "LOC_ID, GROUP_CD, STATION_TYPE, CONTRACTED, PRIORITY_FLAG,  " & 
                    "CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.PARTNO_CODE ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"pnCdId")) {
            if (whereClauseFound) {
                local.sql &= " AND PN_CD_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE PN_CD_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.pnCdId)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"codeId")) {
            if (whereClauseFound) {
                local.sql &= " AND CODE_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CODE_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.codeId)),cfsqltype="CF_SQL_VARCHAR");
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
