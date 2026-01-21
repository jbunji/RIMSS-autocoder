import cfc.model.InvSystems;
import cfc.utils.Datasource;

component output="false" displayName="InvSystemsDao" name="InvSystemsDao" {
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
	public any function create(required InvSystems newInvSystems) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.INV_SYSTEMS ( " &
                    "SYS_ID, FFF_ID, CAGE, PARTNO, VERSION,  " & 
                    "NSN, IS_ACTIVE, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY,  " & 
                    "PROGRAM_ID, SYS_TYPE, NOUN, MDS, M_NSN,  " & 
                    "NEW_COST, EXCH_COST, CONFIG, SRD, OLD_SYS_ID,  " & 
                    "IS_PARS, EFF_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getSysId()) and !len(trim(arguments.newInvSystems.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getFffId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getFffId()) and !len(trim(arguments.newInvSystems.getFffId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getCage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getCage()) and !len(trim(arguments.newInvSystems.getCage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getPartno()) and !len(trim(arguments.newInvSystems.getPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getVersion())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getVersion()) and !len(trim(arguments.newInvSystems.getVersion()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getNsn()) and !len(trim(arguments.newInvSystems.getNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getIsActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getIsActive()) and !len(trim(arguments.newInvSystems.getIsActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getRemarks()) and !len(trim(arguments.newInvSystems.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getIsValid()) and !len(trim(arguments.newInvSystems.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getValBy()) and !len(trim(arguments.newInvSystems.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvSystems.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSystems.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getChgBy()) and !len(trim(arguments.newInvSystems.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvSystems.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSystems.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newInvSystems.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSystems.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getCreatedBy()) and !len(trim(arguments.newInvSystems.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getProgramId()) and !len(trim(arguments.newInvSystems.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getSysType()) and !len(trim(arguments.newInvSystems.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getNoun())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getNoun()) and !len(trim(arguments.newInvSystems.getNoun()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getMds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getMds()) and !len(trim(arguments.newInvSystems.getMds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getMNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getMNsn()) and !len(trim(arguments.newInvSystems.getMNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getNewCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getNewCost()) and !len(trim(arguments.newInvSystems.getNewCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getExchCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getExchCost()) and !len(trim(arguments.newInvSystems.getExchCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getConfig())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getConfig()) and !len(trim(arguments.newInvSystems.getConfig()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getSrd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getSrd()) and !len(trim(arguments.newInvSystems.getSrd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getOldSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getOldSysId()) and !len(trim(arguments.newInvSystems.getOldSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSystems.getIsPars())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSystems.getIsPars()) and !len(trim(arguments.newInvSystems.getIsPars()))) ? "true" : "false");
        if (IsDate(arguments.newInvSystems.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSystems.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="InvSystemsDao could not insert the following record: #arguments.newInvSystems.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string sysId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new InvSystems();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.sysId = arguments.sysId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="InvSystemsDao could not find the following record: Sys_Id[#arguments.sysId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new InvSystems();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="InvSystemsDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required InvSystems chgInvSystems) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.INV_SYSTEMS SET " & 
                    "FFF_ID = ?, CAGE = ?, PARTNO = ?, VERSION = ?,  " &
                    "NSN = ?, IS_ACTIVE = ?, REMARKS = ?, IS_VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?, CREATE_DATE = ?, CREATED_BY = ?,  " &
                    "PROGRAM_ID = ?, SYS_TYPE = ?, NOUN = ?, MDS = ?, M_NSN = ?,  " &
                    "NEW_COST = ?, EXCH_COST = ?, CONFIG = ?, SRD = ?, OLD_SYS_ID = ?,  " &
                    "IS_PARS = ?, EFF_DATE = ? " &
                "WHERE SYS_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getFffId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getFffId()) and !len(trim(arguments.chgInvSystems.getFffId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getCage())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getCage()) and !len(trim(arguments.chgInvSystems.getCage()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getPartno()) and !len(trim(arguments.chgInvSystems.getPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getVersion())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getVersion()) and !len(trim(arguments.chgInvSystems.getVersion()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getNsn()) and !len(trim(arguments.chgInvSystems.getNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getIsActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getIsActive()) and !len(trim(arguments.chgInvSystems.getIsActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getRemarks()) and !len(trim(arguments.chgInvSystems.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getIsValid()) and !len(trim(arguments.chgInvSystems.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getValBy()) and !len(trim(arguments.chgInvSystems.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSystems.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSystems.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getChgBy()) and !len(trim(arguments.chgInvSystems.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSystems.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSystems.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgInvSystems.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSystems.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getCreatedBy()) and !len(trim(arguments.chgInvSystems.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getProgramId()) and !len(trim(arguments.chgInvSystems.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getSysType()) and !len(trim(arguments.chgInvSystems.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getNoun())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getNoun()) and !len(trim(arguments.chgInvSystems.getNoun()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getMds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getMds()) and !len(trim(arguments.chgInvSystems.getMds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getMNsn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getMNsn()) and !len(trim(arguments.chgInvSystems.getMNsn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getNewCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getNewCost()) and !len(trim(arguments.chgInvSystems.getNewCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getExchCost())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getExchCost()) and !len(trim(arguments.chgInvSystems.getExchCost()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getConfig())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getConfig()) and !len(trim(arguments.chgInvSystems.getConfig()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getSrd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getSrd()) and !len(trim(arguments.chgInvSystems.getSrd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getOldSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getOldSysId()) and !len(trim(arguments.chgInvSystems.getOldSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getIsPars())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSystems.getIsPars()) and !len(trim(arguments.chgInvSystems.getIsPars()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSystems.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSystems.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSystems.getSysId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="InvSystemsDao could not update the following record: #arguments.chgInvSystems.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string sysId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.INV_SYSTEMS " &
                "WHERE SYS_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.sysId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="InvSystemsDao could not delete the following record: Sys_Id[#arguments.sysId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT SYS_ID, FFF_ID, CAGE, PARTNO, VERSION,  " & 
                    "NSN, IS_ACTIVE, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, CREATE_DATE, CREATED_BY,  " & 
                    "PROGRAM_ID, SYS_TYPE, NOUN, MDS, M_NSN,  " & 
                    "NEW_COST, EXCH_COST, CONFIG, SRD, OLD_SYS_ID,  " & 
                    "IS_PARS, EFF_DATE " &
                "FROM CORE_TABLES.INV_SYSTEMS ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"sysId")) {
            if (whereClauseFound) {
                local.sql &= " AND SYS_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SYS_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.sysId)),cfsqltype="CF_SQL_VARCHAR");
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
