import cfc.model.PartnoWucP2;
import cfc.utils.Datasource;

component output="false" displayName="PartnoWucP2Dao" name="PartnoWucP2Dao" {
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
	public any function create(required PartnoWucP2 newPartnoWucP2) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.PARTNO_WUC_P2 ( " &
                    "PN_WUC_ID, PARTNO_ID, WUC_CD, SYS_ID, LOC_ID,  " & 
                    "ACTIVE, TWO_LEVEL, ETI_METER, GOLD_FLAG, CLASSIFIED,  " & 
                    "NOC_FLAG, STATION_TYPE, INS_BY, INS_DATE, IPB_TO,  " & 
                    "FIGURE, FIGURE_INDEX, REFDES, NHA_ID, CHG_BY,  " & 
                    "CHG_DATE, NHA_WUC_CD, VALID, VAL_BY, VAL_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getPnWucId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getPnWucId()) and !len(trim(arguments.newPartnoWucP2.getPnWucId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getPartnoId()) and !len(trim(arguments.newPartnoWucP2.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getWucCd()) and !len(trim(arguments.newPartnoWucP2.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getSysId()) and !len(trim(arguments.newPartnoWucP2.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getLocId()) and !len(trim(arguments.newPartnoWucP2.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getActive()) and !len(trim(arguments.newPartnoWucP2.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getTwoLevel())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getTwoLevel()) and !len(trim(arguments.newPartnoWucP2.getTwoLevel()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getEtiMeter())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getEtiMeter()) and !len(trim(arguments.newPartnoWucP2.getEtiMeter()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getGoldFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getGoldFlag()) and !len(trim(arguments.newPartnoWucP2.getGoldFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getClassified())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getClassified()) and !len(trim(arguments.newPartnoWucP2.getClassified()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getNocFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getNocFlag()) and !len(trim(arguments.newPartnoWucP2.getNocFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getStationType()) and !len(trim(arguments.newPartnoWucP2.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getInsBy()) and !len(trim(arguments.newPartnoWucP2.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartnoWucP2.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartnoWucP2.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getIpbTo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getIpbTo()) and !len(trim(arguments.newPartnoWucP2.getIpbTo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getFigure())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getFigure()) and !len(trim(arguments.newPartnoWucP2.getFigure()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getFigureIndex())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getFigureIndex()) and !len(trim(arguments.newPartnoWucP2.getFigureIndex()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getRefdes())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getRefdes()) and !len(trim(arguments.newPartnoWucP2.getRefdes()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getNhaId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getNhaId()) and !len(trim(arguments.newPartnoWucP2.getNhaId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getChgBy()) and !len(trim(arguments.newPartnoWucP2.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartnoWucP2.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartnoWucP2.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getNhaWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getNhaWucCd()) and !len(trim(arguments.newPartnoWucP2.getNhaWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getValid()) and !len(trim(arguments.newPartnoWucP2.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newPartnoWucP2.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newPartnoWucP2.getValBy()) and !len(trim(arguments.newPartnoWucP2.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newPartnoWucP2.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newPartnoWucP2.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="PartnoWucP2Dao could not insert the following record: #arguments.newPartnoWucP2.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string pnWucId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new PartnoWucP2();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.pnWucId = arguments.pnWucId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="PartnoWucP2Dao could not find the following record: Pn_Wuc_Id[#arguments.pnWucId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new PartnoWucP2();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="PartnoWucP2Dao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required PartnoWucP2 chgPartnoWucP2) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.PARTNO_WUC_P2 SET " & 
                    "PARTNO_ID = ?, WUC_CD = ?, SYS_ID = ?, LOC_ID = ?,  " &
                    "ACTIVE = ?, TWO_LEVEL = ?, ETI_METER = ?, GOLD_FLAG = ?, CLASSIFIED = ?,  " &
                    "NOC_FLAG = ?, STATION_TYPE = ?, INS_BY = ?, INS_DATE = ?, IPB_TO = ?,  " &
                    "FIGURE = ?, FIGURE_INDEX = ?, REFDES = ?, NHA_ID = ?, CHG_BY = ?,  " &
                    "CHG_DATE = ?, NHA_WUC_CD = ?, VALID = ?, VAL_BY = ?, VAL_DATE = ? " &
                    " " &
                "WHERE PN_WUC_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getPartnoId()) and !len(trim(arguments.chgPartnoWucP2.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getWucCd()) and !len(trim(arguments.chgPartnoWucP2.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getSysId()) and !len(trim(arguments.chgPartnoWucP2.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getLocId()) and !len(trim(arguments.chgPartnoWucP2.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getActive()) and !len(trim(arguments.chgPartnoWucP2.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getTwoLevel())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getTwoLevel()) and !len(trim(arguments.chgPartnoWucP2.getTwoLevel()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getEtiMeter())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getEtiMeter()) and !len(trim(arguments.chgPartnoWucP2.getEtiMeter()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getGoldFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getGoldFlag()) and !len(trim(arguments.chgPartnoWucP2.getGoldFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getClassified())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getClassified()) and !len(trim(arguments.chgPartnoWucP2.getClassified()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getNocFlag())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getNocFlag()) and !len(trim(arguments.chgPartnoWucP2.getNocFlag()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getStationType()) and !len(trim(arguments.chgPartnoWucP2.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getInsBy()) and !len(trim(arguments.chgPartnoWucP2.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartnoWucP2.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartnoWucP2.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getIpbTo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getIpbTo()) and !len(trim(arguments.chgPartnoWucP2.getIpbTo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getFigure())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getFigure()) and !len(trim(arguments.chgPartnoWucP2.getFigure()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getFigureIndex())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getFigureIndex()) and !len(trim(arguments.chgPartnoWucP2.getFigureIndex()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getRefdes())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getRefdes()) and !len(trim(arguments.chgPartnoWucP2.getRefdes()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getNhaId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getNhaId()) and !len(trim(arguments.chgPartnoWucP2.getNhaId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getChgBy()) and !len(trim(arguments.chgPartnoWucP2.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartnoWucP2.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartnoWucP2.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getNhaWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getNhaWucCd()) and !len(trim(arguments.chgPartnoWucP2.getNhaWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getValid()) and !len(trim(arguments.chgPartnoWucP2.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgPartnoWucP2.getValBy()) and !len(trim(arguments.chgPartnoWucP2.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgPartnoWucP2.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgPartnoWucP2.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgPartnoWucP2.getPnWucId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="PartnoWucP2Dao could not update the following record: #arguments.chgPartnoWucP2.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string pnWucId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.PARTNO_WUC_P2 " &
                "WHERE PN_WUC_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.pnWucId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="PartnoWucP2Dao could not delete the following record: Pn_Wuc_Id[#arguments.pnWucId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT PN_WUC_ID, PARTNO_ID, WUC_CD, SYS_ID, LOC_ID,  " & 
                    "ACTIVE, TWO_LEVEL, ETI_METER, GOLD_FLAG, CLASSIFIED,  " & 
                    "NOC_FLAG, STATION_TYPE, INS_BY, INS_DATE, IPB_TO,  " & 
                    "FIGURE, FIGURE_INDEX, REFDES, NHA_ID, CHG_BY,  " & 
                    "CHG_DATE, NHA_WUC_CD, VALID, VAL_BY, VAL_DATE " & 
                    " " &
                "FROM GLOBALEYE.PARTNO_WUC_P2 ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"pnWucId")) {
            if (whereClauseFound) {
                local.sql &= " AND PN_WUC_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE PN_WUC_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.pnWucId)),cfsqltype="CF_SQL_VARCHAR");
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
