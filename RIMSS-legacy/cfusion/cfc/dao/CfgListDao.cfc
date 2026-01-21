import cfc.model.CfgList;
import cfc.utils.Datasource;

component output="false" displayName="CfgListDao" name="CfgListDao" {
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
	public any function create(required CfgList newCfgList) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CFG_LIST ( " &
                    "LIST_ID, CFG_SET_ID, PARTNO_P, PARTNO_C, SORT_ORDER,  " & 
                    "ACTIVE,QPA, INS_BY, INS_DATE, CHG_BY, CHG_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getListId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getListId()) and !len(trim(arguments.newCfgList.getListId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getCfgSetId()) and !len(trim(arguments.newCfgList.getCfgSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getPartnoP())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getPartnoP()) and !len(trim(arguments.newCfgList.getPartnoP()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getPartnoC())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getPartnoC()) and !len(trim(arguments.newCfgList.getPartnoC()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getSortOrder()) and !len(trim(arguments.newCfgList.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getActive()) and !len(trim(arguments.newCfgList.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getQPA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getQPA()) and !len(trim(arguments.newCfgList.getQPA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getInsBy()) and !len(trim(arguments.newCfgList.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgList.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgList.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgList.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgList.getChgBy()) and !len(trim(arguments.newCfgList.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgList.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgList.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="CfgListDao could not insert the following record: #arguments.newCfgList.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string listId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CfgList();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.listId = arguments.listId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgListDao could not find the following record: List_Id[#arguments.listId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CfgList();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgListDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CfgList chgCfgList) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CFG_LIST SET " & 
                    "CFG_SET_ID = ?, PARTNO_P = ?, PARTNO_C = ?, SORT_ORDER = ?,  " &
                    "ACTIVE = ?, QPA = ?, INS_BY = ?, INS_DATE = ?, CHG_BY = ?, CHG_DATE = ? " &
                    " " &
                "WHERE LIST_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getCfgSetId()) and !len(trim(arguments.chgCfgList.getCfgSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getPartnoP())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getPartnoP()) and !len(trim(arguments.chgCfgList.getPartnoP()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getPartnoC())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getPartnoC()) and !len(trim(arguments.chgCfgList.getPartnoC()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getSortOrder())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getSortOrder()) and !len(trim(arguments.chgCfgList.getSortOrder()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getActive()) and !len(trim(arguments.chgCfgList.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getQPA())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getQPA()) and !len(trim(arguments.chgCfgList.getQPA()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getInsBy()) and !len(trim(arguments.chgCfgList.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgList.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgList.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgList.getChgBy()) and !len(trim(arguments.chgCfgList.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgList.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgList.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgList.getListId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CfgListDao could not update the following record: #arguments.chgCfgList.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string listId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CFG_LIST " &
                "WHERE LIST_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.listId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CfgListDao could not delete the following record: List_Id[#arguments.listId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LIST_ID, CFG_SET_ID, PARTNO_P, PARTNO_C, SORT_ORDER,  " & 
                    "ACTIVE, INS_BY, INS_DATE, QPA, CHG_BY, CHG_DATE " & 
                    " " &
                "FROM GLOBALEYE.CFG_LIST ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"listId")) {
            if (whereClauseFound) {
                local.sql &= " AND LIST_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LIST_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.listId)),cfsqltype="CF_SQL_VARCHAR");
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
