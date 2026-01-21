import cfc.model.AdmVariable;
import cfc.utils.Datasource;
import cfc.utils.javaLoggerProxy;

component output="false" displayName="AdmVariableDao" name="AdmVariableDao" {
    variables.instance = {
        datasource = 0,
        javaLoggerProxy = new javaLoggerProxy()
    };

	/* Auto-generated method
       Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
		return this ;
	}

    private any function getJavaLoggerProxy() {
       return variables.instance.javaLoggerProxy;      
    }
    
    private any function getComponentName(){
        var local = {};
        if(StructKeyexists(getMetaData(this),"name")) {
           variables.instance.componentName = getMetaData(this).name;   
        }
        return variables.instance.componentName;      
    }
	
	/* create */
	public any function create(required AdmVariable newAdmVariable) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.ADM_VARIABLE ( " &
                    "VAR_ID, VAR_GROUP, VAR_VALUE, VAR_TYPE, ACTIVE,  " & 
                    "INS_BY, INS_DATE, CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getVarId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getVarId()) and !len(trim(arguments.newAdmVariable.getVarId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getVarGroup())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getVarGroup()) and !len(trim(arguments.newAdmVariable.getVarGroup()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getVarValue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getVarValue()) and !len(trim(arguments.newAdmVariable.getVarValue()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getVarType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getVarType()) and !len(trim(arguments.newAdmVariable.getVarType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getActive()) and !len(trim(arguments.newAdmVariable.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getInsBy()) and !len(trim(arguments.newAdmVariable.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newAdmVariable.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAdmVariable.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAdmVariable.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAdmVariable.getChgBy()) and !len(trim(arguments.newAdmVariable.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAdmVariable.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAdmVariable.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="AdmVariableDao could not insert the following record: #arguments.newAdmVariable.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string varId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new AdmVariable();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.varId = arguments.varId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AdmVariableDao could not find the following record: Var_Id[#arguments.varId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new AdmVariable();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AdmVariableDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

    /* reads ADM_VARIABLE by VAR_GROUP */
    public Query function readByVarGroup(required string varGroup) {
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.varGroup = arguments.varGroup;
        local.qry=findByFilter(local.filter);

        if (local.qry.recordcount gt 0) {
            /* load value object */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw (type="NoQueryResultException", message=local.msg, detail="AdmVariableDao could not find the following record: VAR_GROUP[#arguments.varGroup#]");
        }

        /* return success */
        return local.obj;
    }

	/* update */
	public void function update(required AdmVariable chgAdmVariable) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();

        var sql="UPDATE GLOBALEYE.ADM_VARIABLE SET " & 
                    "VAR_GROUP = ?, VAR_VALUE = ?, VAR_TYPE = ?, ACTIVE = ?,  " &
                    "INS_BY = ?, INS_DATE = ?, CHG_BY = ?, CHG_DATE = ? " &
                "WHERE VAR_ID = ? ";

        //getJavaLoggerProxy().fine(message="#serializeJSON(arguments.chgAdmVariable)#",sourceClass=getComponentName(), methodName="update");
 
		/* update database */
        local.q.setDatasource(variables.instance.datasource.getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getVarGroup())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getVarGroup()) and !len(trim(arguments.chgAdmVariable.getVarGroup()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getVarValue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getVarValue()) and !len(trim(arguments.chgAdmVariable.getVarValue()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getVarType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getVarType()) and !len(trim(arguments.chgAdmVariable.getVarType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getActive()) and !len(trim(arguments.chgAdmVariable.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getInsBy()) and !len(trim(arguments.chgAdmVariable.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAdmVariable.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAdmVariable.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAdmVariable.getChgBy()) and !len(trim(arguments.chgAdmVariable.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAdmVariable.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAdmVariable.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAdmVariable.getVarId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        getJavaLoggerProxy().fine(message="Updated AdmVariable.  Record count is #local.recordcount#",sourceClass=getComponentName(), methodName="update");
 
        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AdmVariableDao could not update the following record: #arguments.chgAdmVariable.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string varId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.ADM_VARIABLE " &
                "WHERE VAR_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.varId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AdmVariableDao could not delete the following record: Var_Id[#arguments.varId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT VAR_ID, VAR_GROUP, VAR_VALUE, VAR_TYPE, ACTIVE,  " & 
                    "INS_BY, INS_DATE, CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.ADM_VARIABLE ";

        local.objQuery.setDatasource(variables.instance.datasource.getDsName());

        
        
        if (StructKeyExists(arguments.filter,"varId")) {
            if (whereClauseFound) {
                local.sql &= " AND VAR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE VAR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.varId)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"varGroup")) {
            if (whereClauseFound) {
                local.sql &= " AND VAR_GROUP = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE VAR_GROUP = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.varGroup)),cfsqltype="CF_SQL_VARCHAR");
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
