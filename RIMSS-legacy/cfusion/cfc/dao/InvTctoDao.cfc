import cfc.model.InvTcto;
import cfc.utils.Datasource;

component output="false" displayName="InvTctoDao" name="InvTctoDao" {
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
	public any function create(required InvTcto newInvTcto) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.INV_TCTO ( " &
                    "TCTO_NO, TCTO_ID, PROGRAM_ID, SYS_TYPE, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "CREATE_DATE, CREATED_BY, EFF_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getTctoNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getTctoNo()) and !len(trim(arguments.newInvTcto.getTctoNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getTctoId()) and !len(trim(arguments.newInvTcto.getTctoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getProgramId()) and !len(trim(arguments.newInvTcto.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getSysType()) and !len(trim(arguments.newInvTcto.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getRemarks()) and !len(trim(arguments.newInvTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getIsValid()) and !len(trim(arguments.newInvTcto.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getValBy()) and !len(trim(arguments.newInvTcto.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvTcto.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvTcto.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getChgBy()) and !len(trim(arguments.newInvTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newInvTcto.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvTcto.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvTcto.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvTcto.getCreatedBy()) and !len(trim(arguments.newInvTcto.getCreatedBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="InvTctoDao could not insert the following record: #arguments.newInvTcto.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string tctoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new InvTcto();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.tctoId = arguments.tctoId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="InvTctoDao could not find the following record: Tcto_Id[#arguments.tctoId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new InvTcto();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="InvTctoDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required InvTcto chgInvTcto) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.INV_TCTO SET " & 
                    "TCTO_NO = ?, PROGRAM_ID = ?, SYS_TYPE = ?, REMARKS = ?,  " &
                    "IS_VALID = ?, VAL_BY = ?, VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?,  " &
                    "CREATE_DATE = ?, CREATED_BY = ?, EFF_DATE = ? " &
                "WHERE TCTO_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getTctoNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getTctoNo()) and !len(trim(arguments.chgInvTcto.getTctoNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getProgramId()) and !len(trim(arguments.chgInvTcto.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getSysType()) and !len(trim(arguments.chgInvTcto.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getRemarks()) and !len(trim(arguments.chgInvTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getIsValid()) and !len(trim(arguments.chgInvTcto.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getValBy()) and !len(trim(arguments.chgInvTcto.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvTcto.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvTcto.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getChgBy()) and !len(trim(arguments.chgInvTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgInvTcto.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvTcto.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvTcto.getCreatedBy()) and !len(trim(arguments.chgInvTcto.getCreatedBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvTcto.getTctoNo())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="InvTctoDao could not update the following record: #arguments.chgInvTcto.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string tctoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.INV_TCTO " &
                "WHERE TCTO_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.tctoId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="InvTctoDao could not delete the following record: Tcto_Id[#arguments.tctoId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT TCTO_NO, TCTO_ID, PROGRAM_ID, SYS_TYPE, REMARKS,  " & 
                    "IS_VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE,  " & 
                    "CREATE_DATE, CREATED_BY, EFF_DATE " &
                "FROM CORE_TABLES.INV_TCTO ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"tctoId")) {
            if (whereClauseFound) {
                local.sql &= " AND TCTO_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE TCTO_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.tctoId)),cfsqltype="CF_SQL_VARCHAR");
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
