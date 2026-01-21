import cfc.model.Location;
import cfc.utils.Datasource;

component output="false" displayName="LocationDao" name="LocationDao" {
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
	public any function create(required Location newLocation) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.LOCATION ( " &
                    "LOC_ID, MAJCOM_CD, SITE_CD, UNIT_CD, DESCRIPTION,  " & 
                    "ACTIVE, INS_BY, INS_DATE, SQUAD_CD, GEOLOC,  " & 
                    "DISPLAY_NAME, CT_LOC_ID, CHG_BY, CHG_DATE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newLocation.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getLocId()) and !len(trim(arguments.newLocation.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getMajcomCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getMajcomCd()) and !len(trim(arguments.newLocation.getMajcomCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getSiteCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getSiteCd()) and !len(trim(arguments.newLocation.getSiteCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getUnitCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getUnitCd()) and !len(trim(arguments.newLocation.getUnitCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getDescription()) and !len(trim(arguments.newLocation.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getActive()) and !len(trim(arguments.newLocation.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getInsBy()) and !len(trim(arguments.newLocation.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newLocation.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLocation.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newLocation.getSquadCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getSquadCd()) and !len(trim(arguments.newLocation.getSquadCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getGeoloc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getGeoloc()) and !len(trim(arguments.newLocation.getGeoloc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getDisplayName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getDisplayName()) and !len(trim(arguments.newLocation.getDisplayName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getCtLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getCtLocId()) and !len(trim(arguments.newLocation.getCtLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newLocation.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newLocation.getChgBy()) and !len(trim(arguments.newLocation.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newLocation.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newLocation.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
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
            throw(type="CreateException", message=local.msg, detail="LocationDao could not insert the following record: #arguments.newLocation.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string locId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Location();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.locId = arguments.locId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LocationDao could not find the following record: Loc_Id[#arguments.locId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Location();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="LocationDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required Location chgLocation) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.LOCATION SET " & 
                    "MAJCOM_CD = ?, SITE_CD = ?, UNIT_CD = ?, DESCRIPTION = ?,  " &
                    "ACTIVE = ?, INS_BY = ?, INS_DATE = ?, SQUAD_CD = ?, GEOLOC = ?,  " &
                    "DISPLAY_NAME = ?, CT_LOC_ID = ?, CHG_BY = ?, CHG_DATE = ? " &
                "WHERE LOC_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getMajcomCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getMajcomCd()) and !len(trim(arguments.chgLocation.getMajcomCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getSiteCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getSiteCd()) and !len(trim(arguments.chgLocation.getSiteCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getUnitCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getUnitCd()) and !len(trim(arguments.chgLocation.getUnitCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getDescription())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getDescription()) and !len(trim(arguments.chgLocation.getDescription()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getActive()) and !len(trim(arguments.chgLocation.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getInsBy()) and !len(trim(arguments.chgLocation.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLocation.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLocation.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getSquadCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getSquadCd()) and !len(trim(arguments.chgLocation.getSquadCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getGeoloc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getGeoloc()) and !len(trim(arguments.chgLocation.getGeoloc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getDisplayName())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getDisplayName()) and !len(trim(arguments.chgLocation.getDisplayName()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getCtLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getCtLocId()) and !len(trim(arguments.chgLocation.getCtLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgLocation.getChgBy()) and !len(trim(arguments.chgLocation.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgLocation.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgLocation.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgLocation.getLocId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="LocationDao could not update the following record: #arguments.chgLocation.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string locId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.LOCATION " &
                "WHERE LOC_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.locId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="LocationDao could not delete the following record: Loc_Id[#arguments.locId#]");
        }
	}

    public Query function getLocationsByUnitCode(required string unitCode) {
        var filter = {};
        var qry = '';

        local.filter.unitCd = arguments.unitCode;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LocationDao could not find the following record: UNIT_CD[#arguments.unitCode#]");
        }
    }

    public Query function getLocationBySiteUnitCode(required string siteCode, required string unitCode) {
        var filter = {};
        var qry = '';

        local.filter.siteCd = arguments.siteCode;
        local.filter.unitCd = arguments.unitCode;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="LocationDao could not find the following record: UNIT_CD[#arguments.unitCode#]");
        }
    }

    public Query function getLocIdValueListByUnitCode(required string unitCode) {
        var qry = '';

        /* get all records from database */
        local.filter.unitCd = arguments.unitCode;
        local.qry=findByFilter(local.filter);

        /* return success */
        return local.qry;
    }

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT LOC_ID, MAJCOM_CD, SITE_CD, UNIT_CD, DESCRIPTION,  " & 
                    "ACTIVE, INS_BY, INS_DATE, SQUAD_CD, GEOLOC,  " & 
                    "DISPLAY_NAME, CT_LOC_ID, CHG_BY, CHG_DATE " &
                "FROM GLOBALEYE.LOCATION ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"locId")) {
            if (whereClauseFound) {
                local.sql &= " AND LOC_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE LOC_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.locId)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"squadCd")) {
            if (whereClauseFound) {
                local.sql &= " AND SQUAD_CD = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SQUAD_CD = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.squadCd)),cfsqltype="CF_SQL_VARCHAR");
        }

        if (StructKeyExists(arguments.filter,"unitCd")) {
            if (whereClauseFound) {
                local.sql &= " AND UNIT_CD = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE UNIT_CD = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.unitCd)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"siteCd")) {
            if (whereClauseFound) {
                local.sql &= " AND SITE_CD = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SITE_CD = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.siteCd)),cfsqltype="CF_SQL_VARCHAR");
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
