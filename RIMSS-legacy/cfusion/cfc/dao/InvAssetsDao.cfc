import cfc.model.InvAssets;
import cfc.utils.Datasource;

component output="false" displayName="InvAssetsDao" name="InvAssetsDao" {
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
	public any function create(required InvAssets newInvAssets) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO CORE_TABLES.INV_ASSETS ( " &
                    "ASSET_ID, SYS_ID, SERNO, IS_ACTIVE, ASSIGNED_LOC_ID,  " & 
                    "CURRENT_LOC_ID, MAINT_LOC_ID, OWNER_ID, MFG_DATE, ACCEPT_DATE,  " & 
                    "ETIC, DISCREP, EDD, MSN_CAP, STATUS,  " & 
                    "NEXT_NDI_DATE, SENT_BY, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, DATA_SOURCE, CREATE_DATE,  " & 
                    "CREATED_BY, OLD_ASSET_ID, TCN, DEPLOYED_DATE, OWNER_LOC_ID,  " & 
                    "IN_TRANSIT_SHIP_DATE, IN_TRANSIT_RECV_DATE, SHIPPER, CFO_ASSET_ID, IS_CFO_TRACKED,  " & 
                    "LOTNO, EFF_DATE, IS_REPORTABLE, NEXT_NDI_DUE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getAssetId()) and !len(trim(arguments.newInvAssets.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getSysId()) and !len(trim(arguments.newInvAssets.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getSerno()) and !len(trim(arguments.newInvAssets.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getIsActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getIsActive()) and !len(trim(arguments.newInvAssets.getIsActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getAssignedLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getAssignedLocId()) and !len(trim(arguments.newInvAssets.getAssignedLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getCurrentLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getCurrentLocId()) and !len(trim(arguments.newInvAssets.getCurrentLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getMaintLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getMaintLocId()) and !len(trim(arguments.newInvAssets.getMaintLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getOwnerId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getOwnerId()) and !len(trim(arguments.newInvAssets.getOwnerId()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getMfgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getMfgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newInvAssets.getAcceptDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getAcceptDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getEtic())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getEtic()) and !len(trim(arguments.newInvAssets.getEtic()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getDiscrep())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getDiscrep()) and !len(trim(arguments.newInvAssets.getDiscrep()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getEdd())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getEdd()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getMsnCap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getMsnCap()) and !len(trim(arguments.newInvAssets.getMsnCap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getStatus()) and !len(trim(arguments.newInvAssets.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getNextNdiDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getNextNdiDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getSentBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getSentBy()) and !len(trim(arguments.newInvAssets.getSentBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getRemarks()) and !len(trim(arguments.newInvAssets.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getIsValid()) and !len(trim(arguments.newInvAssets.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getValBy()) and !len(trim(arguments.newInvAssets.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getChgBy()) and !len(trim(arguments.newInvAssets.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getDataSource())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getDataSource()) and !len(trim(arguments.newInvAssets.getDataSource()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getCreatedBy()) and !len(trim(arguments.newInvAssets.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getOldAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getOldAssetId()) and !len(trim(arguments.newInvAssets.getOldAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getTcn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getTcn()) and !len(trim(arguments.newInvAssets.getTcn()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getOwnerLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getOwnerLocId()) and !len(trim(arguments.newInvAssets.getOwnerLocId()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getInTransitShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getInTransitShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newInvAssets.getInTransitRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getInTransitRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getShipper()) and !len(trim(arguments.newInvAssets.getShipper()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getCfoAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getCfoAssetId()) and !len(trim(arguments.newInvAssets.getCfoAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getIsCfoTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getIsCfoTracked()) and !len(trim(arguments.newInvAssets.getIsCfoTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getLotno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getLotno()) and !len(trim(arguments.newInvAssets.getLotno()))) ? "true" : "false");
        if (IsDate(arguments.newInvAssets.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newInvAssets.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getIsReportable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getIsReportable()) and !len(trim(arguments.newInvAssets.getIsReportable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newInvAssets.getNextNdiDue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newInvAssets.getNextNdiDue()) and !len(trim(arguments.newInvAssets.getNextNdiDue()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="InvAssetsDao could not insert the following record: #arguments.newInvAssets.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new InvAssets();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.assetId = arguments.assetId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="InvAssetsDao could not find the following record: Asset_Id[#arguments.assetId#]");
        }
    }

    public Query function readBySysIdSerno(required string sysId, required string serno) {
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.sysId = arguments.sysId;
        local.filter.serno = arguments.serno;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="InvAssetsDao could not find the following record: Asset_Id[#arguments.assetId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new InvAssets();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="InvAssetsDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required InvAssets chgInvAssets) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE CORE_TABLES.INV_ASSETS SET " & 
                    "SYS_ID = ?, SERNO = ?, IS_ACTIVE = ?, ASSIGNED_LOC_ID = ?,  " &
                    "CURRENT_LOC_ID = ?, MAINT_LOC_ID = ?, OWNER_ID = ?, MFG_DATE = ?, ACCEPT_DATE = ?,  " &
                    "ETIC = ?, DISCREP = ?, EDD = ?, MSN_CAP = ?, STATUS = ?,  " &
                    "NEXT_NDI_DATE = ?, SENT_BY = ?, REMARKS = ?, IS_VALID = ?, VAL_BY = ?,  " &
                    "VAL_DATE = ?, CHG_BY = ?, CHG_DATE = ?, DATA_SOURCE = ?, CREATE_DATE = ?,  " &
                    "CREATED_BY = ?, OLD_ASSET_ID = ?, TCN = ?, DEPLOYED_DATE = ?, OWNER_LOC_ID = ?,  " &
                    "IN_TRANSIT_SHIP_DATE = ?, IN_TRANSIT_RECV_DATE = ?, SHIPPER = ?, CFO_ASSET_ID = ?, IS_CFO_TRACKED = ?,  " &
                    "LOTNO = ?, EFF_DATE = ?, IS_REPORTABLE = ?, NEXT_NDI_DUE = ? " &
                "WHERE ASSET_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getSysId()) and !len(trim(arguments.chgInvAssets.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getSerno()) and !len(trim(arguments.chgInvAssets.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getIsActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getIsActive()) and !len(trim(arguments.chgInvAssets.getIsActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getAssignedLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getAssignedLocId()) and !len(trim(arguments.chgInvAssets.getAssignedLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getCurrentLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getCurrentLocId()) and !len(trim(arguments.chgInvAssets.getCurrentLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getMaintLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getMaintLocId()) and !len(trim(arguments.chgInvAssets.getMaintLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getOwnerId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getOwnerId()) and !len(trim(arguments.chgInvAssets.getOwnerId()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getMfgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getMfgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgInvAssets.getAcceptDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getAcceptDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getEtic())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getEtic()) and !len(trim(arguments.chgInvAssets.getEtic()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getDiscrep())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getDiscrep()) and !len(trim(arguments.chgInvAssets.getDiscrep()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getEdd())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getEdd()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getMsnCap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getMsnCap()) and !len(trim(arguments.chgInvAssets.getMsnCap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getStatus()) and !len(trim(arguments.chgInvAssets.getStatus()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getNextNdiDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getNextNdiDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getSentBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getSentBy()) and !len(trim(arguments.chgInvAssets.getSentBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getRemarks()) and !len(trim(arguments.chgInvAssets.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getIsValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getIsValid()) and !len(trim(arguments.chgInvAssets.getIsValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getValBy()) and !len(trim(arguments.chgInvAssets.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getChgBy()) and !len(trim(arguments.chgInvAssets.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getDataSource())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getDataSource()) and !len(trim(arguments.chgInvAssets.getDataSource()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getCreateDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getCreateDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getCreatedBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getCreatedBy()) and !len(trim(arguments.chgInvAssets.getCreatedBy()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getOldAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getOldAssetId()) and !len(trim(arguments.chgInvAssets.getOldAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getTcn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getTcn()) and !len(trim(arguments.chgInvAssets.getTcn()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getOwnerLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getOwnerLocId()) and !len(trim(arguments.chgInvAssets.getOwnerLocId()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getInTransitShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getInTransitShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgInvAssets.getInTransitRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getInTransitRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getShipper()) and !len(trim(arguments.chgInvAssets.getShipper()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getCfoAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getCfoAssetId()) and !len(trim(arguments.chgInvAssets.getCfoAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getIsCfoTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getIsCfoTracked()) and !len(trim(arguments.chgInvAssets.getIsCfoTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getLotno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getLotno()) and !len(trim(arguments.chgInvAssets.getLotno()))) ? "true" : "false");
        if (IsDate(arguments.chgInvAssets.getEffDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgInvAssets.getEffDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getIsReportable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getIsReportable()) and !len(trim(arguments.chgInvAssets.getIsReportable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getNextNdiDue())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgInvAssets.getNextNdiDue()) and !len(trim(arguments.chgInvAssets.getNextNdiDue()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgInvAssets.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="InvAssetsDao could not update the following record: #arguments.chgInvAssets.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM CORE_TABLES.INV_ASSETS " &
                "WHERE ASSET_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="InvAssetsDao could not delete the following record: Asset_Id[#arguments.assetId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, SYS_ID, SERNO, IS_ACTIVE, ASSIGNED_LOC_ID,  " & 
                    "CURRENT_LOC_ID, MAINT_LOC_ID, OWNER_ID, MFG_DATE, ACCEPT_DATE,  " & 
                    "ETIC, DISCREP, EDD, MSN_CAP, STATUS,  " & 
                    "NEXT_NDI_DATE, SENT_BY, REMARKS, IS_VALID, VAL_BY,  " & 
                    "VAL_DATE, CHG_BY, CHG_DATE, DATA_SOURCE, CREATE_DATE,  " & 
                    "CREATED_BY, OLD_ASSET_ID, TCN, DEPLOYED_DATE, OWNER_LOC_ID,  " & 
                    "IN_TRANSIT_SHIP_DATE, IN_TRANSIT_RECV_DATE, SHIPPER, CFO_ASSET_ID, IS_CFO_TRACKED,  " & 
                    "LOTNO, EFF_DATE, IS_REPORTABLE, NEXT_NDI_DUE " &
                "FROM CORE_TABLES.INV_ASSETS ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"assetId")) {
            if (whereClauseFound) {
                local.sql &= " AND ASSET_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ASSET_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.assetId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"sysId")) {
            if (whereClauseFound) {
                local.sql &= " AND SYS_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SYS_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.assetId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"serno")) {
            if (whereClauseFound) {
                local.sql &= " AND SERNO = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE SERNO = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.assetId)),cfsqltype="CF_SQL_VARCHAR");
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
