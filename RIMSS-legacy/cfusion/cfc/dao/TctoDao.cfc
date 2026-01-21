import cfc.model.Tcto;
import cfc.utils.Datasource;

component output="false" displayName="TctoDao" name="TctoDao" {
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
	public any function create(required Tcto newTcto) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.TCTO ( " &
                    "TCTO_ID, PGM_ID, TCTO_NO, ACTIVE, SYS_TYPE,  " & 
                    "INS_BY, INS_DATE, EFF_DATE, REMARKS, CHG_BY,  " & 
                    "CHG_DATE, STATION_TYPE, TCTO_TYPE, TCTO_CODE, WUC_CD,  " & 
                    "OLD_PARTNO_ID, NEW_PARTNO_ID) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newTcto.getTctoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getTctoId()) and !len(trim(arguments.newTcto.getTctoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getPgmId()) and !len(trim(arguments.newTcto.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getTctoNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getTctoNo()) and !len(trim(arguments.newTcto.getTctoNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getActive()) and !len(trim(arguments.newTcto.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getSysType()) and !len(trim(arguments.newTcto.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getInsBy()) and !len(trim(arguments.newTcto.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newTcto.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTcto.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getRemarks()) and !len(trim(arguments.newTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getChgBy()) and !len(trim(arguments.newTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newTcto.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getStationType()) and !len(trim(arguments.newTcto.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getTctoType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getTctoType()) and !len(trim(arguments.newTcto.getTctoType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getTctoCode())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getTctoCode()) and !len(trim(arguments.newTcto.getTctoCode()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getWucCd()) and !len(trim(arguments.newTcto.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getOldPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getOldPartnoId()) and !len(trim(arguments.newTcto.getOldPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newTcto.getNewPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newTcto.getNewPartnoId()) and !len(trim(arguments.newTcto.getNewPartnoId()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="TctoDao could not insert the following record: #arguments.newTcto.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string tctoId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Tcto();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="TctoDao could not find the following record: Tcto_Id[#arguments.tctoId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Tcto();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="TctoDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Tcto chgTcto) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.TCTO SET " & 
                    "PGM_ID = ?, TCTO_NO = ?, ACTIVE = ?, SYS_TYPE = ?,  " &
                    "INS_BY = ?, INS_DATE = ?, EFF_DATE = ?, REMARKS = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, STATION_TYPE = ?, TCTO_TYPE = ?, TCTO_CODE = ?, WUC_CD = ?,  " &
                    "OLD_PARTNO_ID = ?, NEW_PARTNO_ID = ? " &
                "WHERE TCTO_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getPgmId()) and !len(trim(arguments.chgTcto.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getTctoNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getTctoNo()) and !len(trim(arguments.chgTcto.getTctoNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getActive()) and !len(trim(arguments.chgTcto.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getSysType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getSysType()) and !len(trim(arguments.chgTcto.getSysType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getInsBy()) and !len(trim(arguments.chgTcto.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTcto.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTcto.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgTcto.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTcto.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getRemarks()) and !len(trim(arguments.chgTcto.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getChgBy()) and !len(trim(arguments.chgTcto.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgTcto.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgTcto.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getStationType()) and !len(trim(arguments.chgTcto.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getTctoType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getTctoType()) and !len(trim(arguments.chgTcto.getTctoType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getTctoCode())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getTctoCode()) and !len(trim(arguments.chgTcto.getTctoCode()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getWucCd()) and !len(trim(arguments.chgTcto.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getOldPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getOldPartnoId()) and !len(trim(arguments.chgTcto.getOldPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getNewPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgTcto.getNewPartnoId()) and !len(trim(arguments.chgTcto.getNewPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgTcto.getTctoId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="TctoDao could not update the following record: #arguments.chgTcto.toString()#");
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
        var sql="DELETE FROM GLOBALEYE.TCTO " &
                "WHERE TCTO_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.tctoId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="TctoDao could not delete the following record: Tcto_Id[#arguments.tctoId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT TCTO_ID, PGM_ID, TCTO_NO, ACTIVE, SYS_TYPE,  " & 
                    "INS_BY, INS_DATE, EFF_DATE, REMARKS, CHG_BY,  " & 
                    "CHG_DATE, STATION_TYPE, TCTO_TYPE, TCTO_CODE, WUC_CD,  " & 
                    "OLD_PARTNO_ID, NEW_PARTNO_ID " &
                "FROM GLOBALEYE.TCTO ";

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
