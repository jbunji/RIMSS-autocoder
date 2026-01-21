import cfc.model.InvSoftware;
import cfc.utils.Datasource;

component output="false" displayName="InvSoftwareDao" name="InvSoftwareDao" {
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
	public any function create(required InvSoftware newInvSoftware) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.INV_SOFTWARE ( " &
                    "SW_ID, SW_NUMBER, REVISION, IS_CPIN, SW_DESC,  " & 
                    "PROGRAM_ID, SW_TYPE, SW_TITLE, EFF_DATE, IS_PENDING,  " & 
                    "REMARKS, IS_VALID, VAL_BY, VAL_DATE, CHG_BY,  " & 
                    "CHG_DATE, CREATE_DATE, CREATED_BY) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getSwId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getSwId()) and !len(trim(arguments.newInvSoftware.getSwId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getSwNumber())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getSwNumber()) and !len(trim(arguments.newInvSoftware.getSwNumber()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getRevision())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getRevision()) and !len(trim(arguments.newInvSoftware.getRevision()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getIsCpin())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getIsCpin()) and !len(trim(arguments.newInvSoftware.getIsCpin()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getSwDesc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getSwDesc()) and !len(trim(arguments.newInvSoftware.getSwDesc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getProgramId()) and !len(trim(arguments.newInvSoftware.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getSwType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getSwType()) and !len(trim(arguments.newInvSoftware.getSwType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getSwTitle())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getSwTitle()) and !len(trim(arguments.newInvSoftware.getSwTitle()))) ? "true" : "false");
        if (IsDate(arguments.newInvSoftware.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSoftware.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getIsPending())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getIsPending()) and !len(trim(arguments.newInvSoftware.getIsPending()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getRemarks()) and !len(trim(arguments.newInvSoftware.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getIsValid()) and !len(trim(arguments.newInvSoftware.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getValBy()) and !len(trim(arguments.newInvSoftware.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvSoftware.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSoftware.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getChgBy()) and !len(trim(arguments.newInvSoftware.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvSoftware.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSoftware.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newInvSoftware.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvSoftware.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvSoftware.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvSoftware.getCreatedBy()) and !len(trim(arguments.newInvSoftware.getCreatedBy()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="InvSoftwareDao could not insert the following record: #arguments.newInvSoftware.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new InvSoftware();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.swId = arguments.swId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="InvSoftwareDao could not find the following record: Sw_Id[#arguments.swId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new InvSoftware();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="InvSoftwareDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required InvSoftware chgInvSoftware) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.INV_SOFTWARE SET " & 
                    "SW_NUMBER = ?, REVISION = ?, IS_CPIN = ?, SW_DESC = ?,  " &
                    "PROGRAM_ID = ?, SW_TYPE = ?, SW_TITLE = ?, EFF_DATE = ?, IS_PENDING = ?,  " &
                    "REMARKS = ?, IS_VALID = ?, VAL_BY = ?, VAL_DATE = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, CREATE_DATE = ?, CREATED_BY = ? " &
                "WHERE SW_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getSwNumber())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getSwNumber()) and !len(trim(arguments.chgInvSoftware.getSwNumber()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getRevision())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getRevision()) and !len(trim(arguments.chgInvSoftware.getRevision()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getIsCpin())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getIsCpin()) and !len(trim(arguments.chgInvSoftware.getIsCpin()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getSwDesc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getSwDesc()) and !len(trim(arguments.chgInvSoftware.getSwDesc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getProgramId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getProgramId()) and !len(trim(arguments.chgInvSoftware.getProgramId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getSwType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getSwType()) and !len(trim(arguments.chgInvSoftware.getSwType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getSwTitle())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getSwTitle()) and !len(trim(arguments.chgInvSoftware.getSwTitle()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSoftware.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSoftware.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getIsPending())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getIsPending()) and !len(trim(arguments.chgInvSoftware.getIsPending()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getRemarks()) and !len(trim(arguments.chgInvSoftware.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getIsValid()) and !len(trim(arguments.chgInvSoftware.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getValBy()) and !len(trim(arguments.chgInvSoftware.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSoftware.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSoftware.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getChgBy()) and !len(trim(arguments.chgInvSoftware.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvSoftware.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSoftware.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgInvSoftware.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvSoftware.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvSoftware.getCreatedBy()) and !len(trim(arguments.chgInvSoftware.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvSoftware.getSwId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="InvSoftwareDao could not update the following record: #arguments.chgInvSoftware.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.INV_SOFTWARE " &
                "WHERE SW_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.swId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="InvSoftwareDao could not delete the following record: Sw_Id[#arguments.swId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT SW_ID, SW_NUMBER, REVISION, IS_CPIN, SW_DESC,  " & 
                    "PROGRAM_ID, SW_TYPE, SW_TITLE, EFF_DATE, IS_PENDING,  " & 
                    "REMARKS, IS_VALID, VAL_BY, VAL_DATE, CHG_BY,  " & 
                    "CHG_DATE, CREATE_DATE, CREATED_BY " &
                "FROM CORE_TABLES.INV_SOFTWARE ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"swId")) {
            if (whereClauseFound) {
                local.sql &= " AND SW_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SW_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.swId)),cfsqltype="CF_SQL_VARCHAR");
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
