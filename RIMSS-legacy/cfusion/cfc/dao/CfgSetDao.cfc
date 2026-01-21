import cfc.model.CfgSet;
import cfc.utils.Datasource;

component output="false" displayName="CfgSetDao" name="CfgSetDao" {
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
	public any function create(required CfgSet newCfgSet) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.CFG_SET ( " &
                    "CFG_SET_ID, CFG_NAME, CFG_TYPE, PGM_ID, ACTIVE,  " & 
                    "DESCRIPTION, INS_BY, INS_DATE, PARTNO_ID, CHG_BY,  " & 
                    "CHG_DATE, SYS_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getCfgSetId()) and !len(trim(arguments.newCfgSet.getCfgSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getCfgName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getCfgName()) and !len(trim(arguments.newCfgSet.getCfgName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getCfgType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getCfgType()) and !len(trim(arguments.newCfgSet.getCfgType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getPgmId()) and !len(trim(arguments.newCfgSet.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getActive()) and !len(trim(arguments.newCfgSet.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getDescription()) and !len(trim(arguments.newCfgSet.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getInsBy()) and !len(trim(arguments.newCfgSet.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgSet.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgSet.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getPartnoId()) and !len(trim(arguments.newCfgSet.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getChgBy()) and !len(trim(arguments.newCfgSet.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newCfgSet.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newCfgSet.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newCfgSet.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newCfgSet.getSysId()) and !len(trim(arguments.newCfgSet.getSysId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="CfgSetDao could not insert the following record: #arguments.newCfgSet.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string cfgSetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new CfgSet();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.cfgSetId = arguments.cfgSetId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgSetDao could not find the following record: Cfg_Set_Id[#arguments.cfgSetId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new CfgSet();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="CfgSetDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required CfgSet chgCfgSet) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.CFG_SET SET " & 
                    "CFG_NAME = ?, CFG_TYPE = ?, PGM_ID = ?, ACTIVE = ?,  " &
                    "DESCRIPTION = ?, INS_BY = ?, INS_DATE = ?, PARTNO_ID = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, SYS_ID = ? " &
                "WHERE CFG_SET_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getCfgName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getCfgName()) and !len(trim(arguments.chgCfgSet.getCfgName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getCfgType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getCfgType()) and !len(trim(arguments.chgCfgSet.getCfgType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getPgmId()) and !len(trim(arguments.chgCfgSet.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getActive()) and !len(trim(arguments.chgCfgSet.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getDescription()) and !len(trim(arguments.chgCfgSet.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getInsBy()) and !len(trim(arguments.chgCfgSet.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgSet.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgSet.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getPartnoId()) and !len(trim(arguments.chgCfgSet.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getChgBy()) and !len(trim(arguments.chgCfgSet.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgCfgSet.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgCfgSet.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgCfgSet.getSysId()) and !len(trim(arguments.chgCfgSet.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgCfgSet.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="CfgSetDao could not update the following record: #arguments.chgCfgSet.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string cfgSetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.CFG_SET " &
                "WHERE CFG_SET_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.cfgSetId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="CfgSetDao could not delete the following record: Cfg_Set_Id[#arguments.cfgSetId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT CFG_SET_ID, CFG_NAME, CFG_TYPE, PGM_ID, ACTIVE,  " & 
                    "DESCRIPTION, INS_BY, INS_DATE, PARTNO_ID, CHG_BY,  " & 
                    "CHG_DATE, SYS_ID " &
                "FROM GLOBALEYE.CFG_SET ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"cfgSetId")) {
            if (whereClauseFound) {
                local.sql &= " AND CFG_SET_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE CFG_SET_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.cfgSetId)),cfsqltype="CF_SQL_VARCHAR");
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
