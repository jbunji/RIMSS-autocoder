import cfc.model.Sorties;
import cfc.utils.Datasource;

component output="false" displayName="SortiesDao" name="SortiesDao" {
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
	public any function create(required Sorties newSorties) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.SORTIES ( " &
                    "SORTIE_ID, MISSION_ID, SERNO, AC_TAILNO, SORTIE_DATE,  " & 
                    "ASSET_ID, SORTIE_EFFECT, AC_STATION, AC_TYPE, CURRENT_UNIT, ASSIGNED_UNIT, " & 
                    "RANGE, REASON, REMARKS, SOURCE_DATA, INS_BY,  " & 
                    "INS_DATE, CHG_BY, CHG_DATE, VALID, VAL_BY,  " & 
                    "VAL_DATE, PGM_ID, IS_NON_PODDED, IS_DEBRIEF, IS_LIVE_MONITOR) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " & 
                        "?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newSorties.getSortieId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getSortieId()) and !len(trim(arguments.newSorties.getSortieId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getMissionId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getMissionId()) and !len(trim(arguments.newSorties.getMissionId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getSerno()) and !len(trim(arguments.newSorties.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getAcTailno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getAcTailno()) and !len(trim(arguments.newSorties.getAcTailno()))) ? "true" : "false");
        if (IsDate(arguments.newSorties.getSortieDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSorties.getSortieDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSorties.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getAssetId()) and !len(trim(arguments.newSorties.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getSortieEffect())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getSortieEffect()) and !len(trim(arguments.newSorties.getSortieEffect()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getAcStation())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getAcStation()) and !len(trim(arguments.newSorties.getAcStation()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getAcType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getAcType()) and !len(trim(arguments.newSorties.getAcType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getCurrentUnit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getCurrentUnit()) and !len(trim(arguments.newSorties.getCurrentUnit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getAssignedUnit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getAssignedUnit()) and !len(trim(arguments.newSorties.getAssignedUnit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getRange())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getRange()) and !len(trim(arguments.newSorties.getRange()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getReason())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getReason()) and !len(trim(arguments.newSorties.getReason()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getRemarks()) and !len(trim(arguments.newSorties.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getSourceData())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getSourceData()) and !len(trim(arguments.newSorties.getSourceData()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getInsBy()) and !len(trim(arguments.newSorties.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newSorties.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSorties.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSorties.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getChgBy()) and !len(trim(arguments.newSorties.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newSorties.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSorties.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSorties.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getValid()) and !len(trim(arguments.newSorties.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getValBy()) and !len(trim(arguments.newSorties.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newSorties.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSorties.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSorties.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getPgmId()) and !len(trim(arguments.newSorties.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getIsNonPodded())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getIsNonPodded()) and !len(trim(arguments.newSorties.getIsNonPodded()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getIsDebrief())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getIsDebrief()) and !len(trim(arguments.newSorties.getIsDebrief()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSorties.getIsLiveMonitor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSorties.getIsLiveMonitor()) and !len(trim(arguments.newSorties.getIsLiveMonitor()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="SortiesDao could not insert the following record: #arguments.newSorties.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string sortieId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Sorties();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.sortieId = arguments.sortieId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="SortiesDao could not find the following record: Sortie_Id[#arguments.sortieId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Sorties();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="SortiesDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Sorties chgSorties) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.SORTIES SET " & 
                    "MISSION_ID = ?, SERNO = ?, AC_TAILNO = ?, SORTIE_DATE = ?,  " &
                    "ASSET_ID = ?, SORTIE_EFFECT = ?, AC_STATION = ?, AC_TYPE = ?, CURRENT_UNIT = ?, ASSIGNED_UNIT = ?, " &
                    "RANGE = ?, REASON = ?, REMARKS = ?, SOURCE_DATA = ?, INS_BY = ?,  " &
                    "INS_DATE = ?, CHG_BY = ?, CHG_DATE = ?, VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, PGM_ID = ?, IS_NON_PODDED = ?, IS_DEBRIEF = ?, IS_LIVE_MONITOR = ?  " &
                "WHERE SORTIE_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getMissionId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getMissionId()) and !len(trim(arguments.chgSorties.getMissionId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getSerno()) and !len(trim(arguments.chgSorties.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getAcTailno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getAcTailno()) and !len(trim(arguments.chgSorties.getAcTailno()))) ? "true" : "false");
        if (IsDate(arguments.chgSorties.getSortieDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSorties.getSortieDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getAssetId()) and !len(trim(arguments.chgSorties.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getSortieEffect())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getSortieEffect()) and !len(trim(arguments.chgSorties.getSortieEffect()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getAcStation())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getAcStation()) and !len(trim(arguments.chgSorties.getAcStation()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getAcType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getAcType()) and !len(trim(arguments.chgSorties.getAcType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getCurrentUnit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getCurrentUnit()) and !len(trim(arguments.chgSorties.getCurrentUnit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getAssignedUnit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getAssignedUnit()) and !len(trim(arguments.chgSorties.getAssignedUnit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getRange())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getRange()) and !len(trim(arguments.chgSorties.getRange()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getReason())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getReason()) and !len(trim(arguments.chgSorties.getReason()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getRemarks()) and !len(trim(arguments.chgSorties.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getSourceData())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getSourceData()) and !len(trim(arguments.chgSorties.getSourceData()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getInsBy()) and !len(trim(arguments.chgSorties.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSorties.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSorties.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getChgBy()) and !len(trim(arguments.chgSorties.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSorties.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSorties.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getValid()) and !len(trim(arguments.chgSorties.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getValBy()) and !len(trim(arguments.chgSorties.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSorties.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSorties.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getPgmId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getPgmId()) and !len(trim(arguments.chgSorties.getPgmId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getIsNonPodded())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getIsNonPodded()) and !len(trim(arguments.chgSorties.getIsNonPodded()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getIsDebrief())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getIsDebrief()) and !len(trim(arguments.chgSorties.getIsDebrief()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getIsLiveMonitor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSorties.getIsLiveMonitor()) and !len(trim(arguments.chgSorties.getIsLiveMonitor()))) ? "true" : "false");
        
        local.q.addParam(value=ucase(trim(arguments.chgSorties.getSortieId())),cfsqltype="CF_SQL_VARCHAR");
      
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;
		
        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="SortiesDao could not update the following record: #arguments.chgSorties.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string sortieId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.SORTIES " &
                "WHERE SORTIE_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.sortieId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="SortiesDao could not delete the following record: Sortie_Id[#arguments.sortieId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT SORTIE_ID, MISSION_ID, SERNO, AC_TAILNO, SORTIE_DATE,  " & 
                    "ASSET_ID, SORTIE_EFFECT, AC_STATION, AC_TYPE, CURRENT_UNIT, ASSIGNED_UNIT, " & 
                    "RANGE, REASON, REMARKS, SOURCE_DATA, INS_BY,  " & 
                    "INS_DATE, CHG_BY, CHG_DATE, VALID, VAL_BY,  " & 
                    "VAL_DATE, PGM_ID, IS_NON_PODDED, IS_DEBRIEF, IS_LIVE_MONITOR " &
                "FROM GLOBALEYE.SORTIES ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"sortieId")) {
            if (whereClauseFound) {
                local.sql &= " AND SORTIE_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SORTIE_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.sortieId)),cfsqltype="CF_SQL_VARCHAR");
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
