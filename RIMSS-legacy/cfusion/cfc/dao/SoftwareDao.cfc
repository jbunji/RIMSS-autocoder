import cfc.model.Software;
import cfc.utils.Datasource;

component output="false" displayName="SoftwareDao" name="SoftwareDao" {
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
	public any function create(required Software newSoftware) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.SOFTWARE ( " &
                    "SW_ID, SW_NUMBER, SW_TYPE, SYS_ID, INS_BY,  " & 
                    "INS_DATE, ACTIVE, CPIN_FLAG, REVISION, REVISION_DATE,  " & 
                    "SW_TITLE, SW_DESC, EFF_DATE, VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSwId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSwId()) and !len(trim(arguments.newSoftware.getSwId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSwNumber())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSwNumber()) and !len(trim(arguments.newSoftware.getSwNumber()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSwType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSwType()) and !len(trim(arguments.newSoftware.getSwType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSysId()) and !len(trim(arguments.newSoftware.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getInsBy()) and !len(trim(arguments.newSoftware.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newSoftware.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftware.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getActive()) and !len(trim(arguments.newSoftware.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getCpinFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getCpinFlag()) and !len(trim(arguments.newSoftware.getCpinFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getRevision())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getRevision()) and !len(trim(arguments.newSoftware.getRevision()))) ? "true" : "false");
        if (IsDate(arguments.newSoftware.getRevisionDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftware.getRevisionDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSwTitle())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSwTitle()) and !len(trim(arguments.newSoftware.getSwTitle()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getSwDesc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getSwDesc()) and !len(trim(arguments.newSoftware.getSwDesc()))) ? "true" : "false");
        if (IsDate(arguments.newSoftware.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftware.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getValid()) and !len(trim(arguments.newSoftware.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getValBy()) and !len(trim(arguments.newSoftware.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newSoftware.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftware.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSoftware.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSoftware.getChgBy()) and !len(trim(arguments.newSoftware.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newSoftware.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSoftware.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="SoftwareDao could not insert the following record: #arguments.newSoftware.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string swId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Software();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="SoftwareDao could not find the following record: Sw_Id[#arguments.swId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Software();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="SoftwareDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Software chgSoftware) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.SOFTWARE SET " & 
                    "SW_NUMBER = ?, SW_TYPE = ?, SYS_ID = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, ACTIVE = ?, CPIN_FLAG = ?, REVISION = ?, REVISION_DATE = ?,  " &
                    "SW_TITLE = ?, SW_DESC = ?, EFF_DATE = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ? " &
                "WHERE SW_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSwNumber())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getSwNumber()) and !len(trim(arguments.chgSoftware.getSwNumber()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSwType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getSwType()) and !len(trim(arguments.chgSoftware.getSwType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getSysId()) and !len(trim(arguments.chgSoftware.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getInsBy()) and !len(trim(arguments.chgSoftware.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftware.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftware.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getActive()) and !len(trim(arguments.chgSoftware.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getCpinFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getCpinFlag()) and !len(trim(arguments.chgSoftware.getCpinFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getRevision())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getRevision()) and !len(trim(arguments.chgSoftware.getRevision()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftware.getRevisionDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftware.getRevisionDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSwTitle())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getSwTitle()) and !len(trim(arguments.chgSoftware.getSwTitle()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSwDesc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getSwDesc()) and !len(trim(arguments.chgSoftware.getSwDesc()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftware.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftware.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getValid()) and !len(trim(arguments.chgSoftware.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getValBy()) and !len(trim(arguments.chgSoftware.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftware.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftware.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSoftware.getChgBy()) and !len(trim(arguments.chgSoftware.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSoftware.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSoftware.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSoftware.getSwId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="SoftwareDao could not update the following record: #arguments.chgSoftware.toString()#");
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
        var sql="DELETE FROM GLOBALEYE.SOFTWARE " &
                "WHERE SW_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.swId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="SoftwareDao could not delete the following record: Sw_Id[#arguments.swId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT SW_ID, SW_NUMBER, SW_TYPE, SYS_ID, INS_BY,  " & 
                    "INS_DATE, ACTIVE, CPIN_FLAG, REVISION, REVISION_DATE,  " & 
                    "SW_TITLE, SW_DESC, EFF_DATE, VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.SOFTWARE ";

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
