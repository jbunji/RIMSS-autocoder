import cfc.model.LaborPart;
import cfc.utils.Datasource;

component output="false" displayName="LaborPartDao" name="LaborPartDao" {
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
	public any function create(required LaborPart newLaborPart) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LABOR_PART ( " &
                    "LABOR_PART_ID, LABOR_ID, ASSET_ID, INS_BY, INS_DATE,  " & 
                    "PART_ACTION, HOW_MAL, TAG_NO, PART_QTY, REFDES,  " & 
                    "FSC, WUC_CD, LEGACY_PK, IS_PQDR, DR_NUM) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getLaborPartId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getLaborPartId()) and !len(trim(arguments.newLaborPart.getLaborPartId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getLaborId()) and !len(trim(arguments.newLaborPart.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getAssetId()) and !len(trim(arguments.newLaborPart.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getInsBy()) and !len(trim(arguments.newLaborPart.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLaborPart.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLaborPart.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getPartAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getPartAction()) and !len(trim(arguments.newLaborPart.getPartAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getHowMal()) and !len(trim(arguments.newLaborPart.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getTagNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getTagNo()) and !len(trim(arguments.newLaborPart.getTagNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getPartQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getPartQty()) and !len(trim(arguments.newLaborPart.getPartQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getRefdes())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getRefdes()) and !len(trim(arguments.newLaborPart.getRefdes()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getFsc()) and !len(trim(arguments.newLaborPart.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getWucCd()) and !len(trim(arguments.newLaborPart.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getLegacyPk()) and !len(trim(arguments.newLaborPart.getLegacyPk()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getIsPqdr())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getIsPqdr()) and !len(trim(arguments.newLaborPart.getIsPqdr()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getDrNum())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getDrNum()) and !len(trim(arguments.newLaborPart.getDrNum()))) ? "true" : "false");
        
        
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="LaborPartDao could not insert the following record: #arguments.newLaborPart.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string laborPartId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new LaborPart();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.laborPartId = arguments.laborPartId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborPartDao could not find the following record: Labor_Part_Id[#arguments.laborPartId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LaborPart();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborPartDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
    public Query function readByLaborId(required string laborId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LaborPart();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.laborId = arguments.laborId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LaborPartDao could not find the following record: LABORID[#arguments.laborId#]");
        }
    }
    
    /* read by row_id */
    public Query function readByLaborIdPartAction(required string laborId, required string partAction) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new LaborPart();
        var filter = {};
        var msg = "";
        var qry="";
        
        local.filter.laborId = arguments.laborId;
        local.filter.partAction = arguments.partAction;
        local.qry=findByFilter(local.filter);

        /* load value object */
        return local.qry;
    }

	/* update */
	public void function update(required LaborPart chgLaborPart) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LABOR_PART SET " & 
                    "LABOR_ID = ?, ASSET_ID = ?, INS_BY = ?, INS_DATE = ?,  " &
                    "PART_ACTION = ?, HOW_MAL = ?, TAG_NO = ?, PART_QTY = ?, REFDES = ?,  " &
                    "FSC = ?, WUC_CD = ?, LEGACY_PK = ?, IS_PQDR = ?, DR_NUM = ? " &
                "WHERE LABOR_PART_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getLaborId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getLaborId()) and !len(trim(arguments.chgLaborPart.getLaborId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getAssetId()) and !len(trim(arguments.chgLaborPart.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getInsBy()) and !len(trim(arguments.chgLaborPart.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLaborPart.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLaborPart.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getPartAction())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getPartAction()) and !len(trim(arguments.chgLaborPart.getPartAction()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getHowMal())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getHowMal()) and !len(trim(arguments.chgLaborPart.getHowMal()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getTagNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getTagNo()) and !len(trim(arguments.chgLaborPart.getTagNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getPartQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getPartQty()) and !len(trim(arguments.chgLaborPart.getPartQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getRefdes())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getRefdes()) and !len(trim(arguments.chgLaborPart.getRefdes()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getFsc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getFsc()) and !len(trim(arguments.chgLaborPart.getFsc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getWucCd()) and !len(trim(arguments.chgLaborPart.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getLegacyPk())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLaborPart.getLegacyPk()) and !len(trim(arguments.chgLaborPart.getLegacyPk()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getIsPqdr())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getIsPqdr()) and !len(trim(arguments.newLaborPart.getIsPqdr()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLaborPart.getDrNum())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLaborPart.getDrNum()) and !len(trim(arguments.newLaborPart.getDrNum()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.chgLaborPart.getLaborPartId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LaborPartDao could not update the following record: #arguments.chgLaborPart.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string laborPartId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LABOR_PART " &
                "WHERE LABOR_PART_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.laborPartId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LaborPartDao could not delete the following record: Labor_Part_Id[#arguments.laborPartId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LABOR_PART_ID, LABOR_ID, ASSET_ID, INS_BY, INS_DATE,  " & 
                    "PART_ACTION, HOW_MAL, TAG_NO, PART_QTY, REFDES,  " & 
                    "FSC, WUC_CD, LEGACY_PK, IS_PQDR, DR_NUM " &
                "FROM GLOBALEYE.LABOR_PART ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"laborPartId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_PART_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_PART_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.laborPartId)),cfsqltype="CF_SQL_VARCHAR");
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
        
        if (StructKeyExists(arguments.filter,"laborId")) {
            if (whereClauseFound) {
                local.sql &= " AND LABOR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LABOR_ID = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.laborId),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"partAction")) {
            if (whereClauseFound) {
                local.sql &= " AND PART_ACTION = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE PART_ACTION = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.partAction),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
