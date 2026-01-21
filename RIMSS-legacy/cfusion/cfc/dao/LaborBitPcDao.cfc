import cfc.model.LaborBitPc;
import cfc.utils.Datasource;

component output="false" displayName="LaborBitPcDao" name="LaborBitPcDao" {
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
	public any function create(required LaborBitPc newLaborBitPc) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LABOR_BIT_PC ( " &
                    "LABOR_BIT_ID, LABOR_ID, BIT_PARTNO, BIT_NAME, INS_BY,  " & 
                    "INS_DATE, SENT_IMDS, BIT_SEQ, BIT_WUC, HOW_MAL,  " & 
                    "BIT_QTY, FSC, BIT_DELETE, VALID, VAL_BY,  " & 
                    "VAL_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getLaborBitId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getLaborBitId()) and !len(trim(arguments.newLaborBitPc.getLaborBitId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getLaborId()) and !len(trim(arguments.newLaborBitPc.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitPartno()) and !len(trim(arguments.newLaborBitPc.getBitPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitName()) and !len(trim(arguments.newLaborBitPc.getBitName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getInsBy()) and !len(trim(arguments.newLaborBitPc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLaborBitPc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborBitPc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getSentImds()) and !len(trim(arguments.newLaborBitPc.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitSeq()) and !len(trim(arguments.newLaborBitPc.getBitSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitWuc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitWuc()) and !len(trim(arguments.newLaborBitPc.getBitWuc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getHowMal()) and !len(trim(arguments.newLaborBitPc.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitQty()) and !len(trim(arguments.newLaborBitPc.getBitQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getFsc()) and !len(trim(arguments.newLaborBitPc.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getBitDelete())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getBitDelete()) and !len(trim(arguments.newLaborBitPc.getBitDelete()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getValid()) and !len(trim(arguments.newLaborBitPc.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborBitPc.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborBitPc.getValBy()) and !len(trim(arguments.newLaborBitPc.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newLaborBitPc.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborBitPc.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="LaborBitPcDao could not insert the following record: #arguments.newLaborBitPc.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string laborBitId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new LaborBitPc();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.laborBitId = arguments.laborBitId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborBitPcDao could not find the following record: Labor_Bit_Id[#arguments.laborBitId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LaborBitPc();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborBitPcDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required LaborBitPc chgLaborBitPc) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LABOR_BIT_PC SET " & 
                    "LABOR_ID = ?, BIT_PARTNO = ?, BIT_NAME = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, SENT_IMDS = ?, BIT_SEQ = ?, BIT_WUC = ?, HOW_MAL = ?,  " &
                    "BIT_QTY = ?, FSC = ?, BIT_DELETE = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ? " &
                "WHERE LABOR_BIT_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getLaborId()) and !len(trim(arguments.chgLaborBitPc.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitPartno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitPartno()) and !len(trim(arguments.chgLaborBitPc.getBitPartno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitName()) and !len(trim(arguments.chgLaborBitPc.getBitName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getInsBy()) and !len(trim(arguments.chgLaborBitPc.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborBitPc.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborBitPc.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getSentImds())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getSentImds()) and !len(trim(arguments.chgLaborBitPc.getSentImds()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitSeq())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitSeq()) and !len(trim(arguments.chgLaborBitPc.getBitSeq()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitWuc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitWuc()) and !len(trim(arguments.chgLaborBitPc.getBitWuc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getHowMal()) and !len(trim(arguments.chgLaborBitPc.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitQty()) and !len(trim(arguments.chgLaborBitPc.getBitQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getFsc()) and !len(trim(arguments.chgLaborBitPc.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getBitDelete())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getBitDelete()) and !len(trim(arguments.chgLaborBitPc.getBitDelete()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getValid()) and !len(trim(arguments.chgLaborBitPc.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborBitPc.getValBy()) and !len(trim(arguments.chgLaborBitPc.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborBitPc.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborBitPc.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborBitPc.getLaborBitId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LaborBitPcDao could not update the following record: #arguments.chgLaborBitPc.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string laborBitId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LABOR_BIT_PC " &
                "WHERE LABOR_BIT_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.laborBitId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LaborBitPcDao could not delete the following record: Labor_Bit_Id[#arguments.laborBitId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LABOR_BIT_ID, LABOR_ID, BIT_PARTNO, BIT_NAME, INS_BY,  " & 
                    "INS_DATE, SENT_IMDS, BIT_SEQ, BIT_WUC, HOW_MAL,  " & 
                    "BIT_QTY, FSC, BIT_DELETE, VALID, VAL_BY,  " & 
                    "VAL_DATE " &
                "FROM GLOBALEYE.LABOR_BIT_PC ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"laborBitId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_BIT_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_BIT_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.laborBitId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"laborId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.laborId)),cfsqltype="CF_SQL_VARCHAR");
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
