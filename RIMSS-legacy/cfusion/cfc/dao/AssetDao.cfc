import cfc.model.Asset;
import cfc.utils.Datasource;

component output="false" displayName="AssetDao" name="AssetDao" {
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
	public any function create(required Asset newAsset) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.ASSET ( " &
                    "ASSET_ID, PARTNO_ID, SERNO, STATUS_CD, LOC_IDA,  " & 
                    "LOC_IDC, INS_BY, INS_DATE, ACTIVE, REPORTABLE,  " & 
                    "CFO_TRACKED, BAD_ACTOR, VALID, VAL_BY, VAL_DATE,  " & 
                    "CHG_BY, CHG_DATE, NHA_ASSET_ID, CFO_ASSET_ID, CT_ASSET_ID,  " & 
                    "UII, ETIC, LOTNO, MFG_DATE, ACCEPT_DATE,  " & 
                    "NEXT_NDI_DATE, DEPLOYED_DATE, TCN, SHIPPER, SHIP_DATE,  " & 
                    "RECV_DATE, ETI, ETI_LIATE, CFG_SET_ID, EQUIP_ID,  " & 
                    "STATION_TYPE, STRING_COUNT, REMARKS, PMEL, IN_TRANSIT,  " & 
                    "SYS_ID, TAIL_NO, SRD_CD, ASSET_TYPE) " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getAssetId()) and !len(trim(arguments.newAsset.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getPartnoId()) and !len(trim(arguments.newAsset.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getSerno()) and !len(trim(arguments.newAsset.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getStatusCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getStatusCd()) and !len(trim(arguments.newAsset.getStatusCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getLocIda())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getLocIda()) and !len(trim(arguments.newAsset.getLocIda()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getLocIdc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getLocIdc()) and !len(trim(arguments.newAsset.getLocIdc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getInsBy()) and !len(trim(arguments.newAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAsset.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getActive()) and !len(trim(arguments.newAsset.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getReportable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getReportable()) and !len(trim(arguments.newAsset.getReportable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getCfoTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getCfoTracked()) and !len(trim(arguments.newAsset.getCfoTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getBadActor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getBadActor()) and !len(trim(arguments.newAsset.getBadActor()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getValid()) and !len(trim(arguments.newAsset.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getValBy()) and !len(trim(arguments.newAsset.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.newAsset.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAsset.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getChgBy()) and !len(trim(arguments.newAsset.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newAsset.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAsset.getNhaAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getNhaAssetId()) and !len(trim(arguments.newAsset.getNhaAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getCfoAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getCfoAssetId()) and !len(trim(arguments.newAsset.getCfoAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getCtAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getCtAssetId()) and !len(trim(arguments.newAsset.getCtAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getUii())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getUii()) and !len(trim(arguments.newAsset.getUii()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getEtic())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getEtic()) and !len(trim(arguments.newAsset.getEtic()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getLotno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getLotno()) and !len(trim(arguments.newAsset.getLotno()))) ? "true" : "false");
        if (IsDate(arguments.newAsset.getMfgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getMfgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAsset.getAcceptDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getAcceptDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAsset.getNextNdiDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getNextNdiDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAsset.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAsset.getTcn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getTcn()) and !len(trim(arguments.newAsset.getTcn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getShipper()) and !len(trim(arguments.newAsset.getShipper()))) ? "true" : "false");
        if (IsDate(arguments.newAsset.getShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newAsset.getRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newAsset.getRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newAsset.getEti())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getEti()) and !len(trim(arguments.newAsset.getEti()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getEtiLiate())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getEtiLiate()) and !len(trim(arguments.newAsset.getEtiLiate()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getCfgSetId()) and !len(trim(arguments.newAsset.getCfgSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getEquipId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getEquipId()) and !len(trim(arguments.newAsset.getEquipId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getStationType()) and !len(trim(arguments.newAsset.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getStringCount())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getStringCount()) and !len(trim(arguments.newAsset.getStringCount()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getRemarks()) and !len(trim(arguments.newAsset.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getPmel())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getPmel()) and !len(trim(arguments.newAsset.getPmel()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getInTransit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getInTransit()) and !len(trim(arguments.newAsset.getInTransit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getSysId()) and !len(trim(arguments.newAsset.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getTailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getTailNo()) and !len(trim(arguments.newAsset.getTailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getSrdCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getSrdCd()) and !len(trim(arguments.newAsset.getSrdCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newAsset.getAssetType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newAsset.getAssetType()) and !len(trim(arguments.newAsset.getAssetType()))) ? "true" : "false");
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="AssetDao could not insert the following record: #arguments.newAsset.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string assetId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new Asset();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetDao could not find the following record: Asset_Id[#arguments.assetId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Asset();
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
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }
    
    /* read by row_id */
    public Query function readByUII(required string uii) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new Asset();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.uii = arguments.uii;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
        	
        	/* Make sure returns only 1 asset record */
        	if(qry.recordcount > 1){
                throw(type="UniqueRecordException", message="UUI '#ucase(trim(arguments.uii))#' returns more than one record", detail="AssetDao could not find a unique asset the following record: UII[#arguments.uii#]");
            }
        	
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetDao could not find the following record: UII[#arguments.uii#]");
        }
    }
    
    /* read by asset_id to get levels */
    public Query function readLevelsByAssetId(required string assetId) {
    	var local = {};
        var local.q=new query();

        local.sql="SELECT ASSET_ID, PARTNO_ID, SERNO, STATUS_CD, LOC_IDA, LOC_IDC, INS_BY, INS_DATE, 
        ACTIVE, REPORTABLE, CFO_TRACKED, BAD_ACTOR, VALID, VAL_BY, VAL_DATE, CHG_BY, CHG_DATE, NHA_ASSET_ID, CFO_ASSET_ID,
        CT_ASSET_ID, UII, ETIC, LOTNO, MFG_DATE, ACCEPT_DATE, NEXT_NDI_DATE, DEPLOYED_DATE, TCN, SHIPPER, SHIP_DATE, 
        RECV_DATE, ETI, ETI_LIATE, CFG_SET_ID, EQUIP_ID, STATION_TYPE, STRING_COUNT, REMARKS, PMEL, IN_TRANSIT, SYS_ID, 
        TAIL_NO, SRD_CD, ASSET_TYPE 
		FROM globaleye.asset
		start with asset_id = ?
		connect by prior nha_asset_id = asset_id
		order by level desc";
        
        local.q.setDatasource(getDatasource().getDsName());
        
        local.q.addParam(value=val(trim(arguments.assetId)),cfsqltype="CF_SQL_NUMERIC");        
        local.q.setsql(local.sql);
        local.qry=local.q.execute().getResult();

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="AssetDao could not find the following record: Asset_Id[#arguments.assetId#]");
        }
    }
    
	/* update */
	public void function update(required Asset chgAsset) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.ASSET SET " & 
                    "PARTNO_ID = ?, SERNO = ?, STATUS_CD = ?, LOC_IDA = ?,  " &
                    "LOC_IDC = ?, INS_BY = ?, INS_DATE = ?, ACTIVE = ?, REPORTABLE = ?,  " &
                    "CFO_TRACKED = ?, BAD_ACTOR = ?, VALID = ?, VAL_BY = ?, VAL_DATE = ?,  " &
                    "CHG_BY = ?, CHG_DATE = ?, NHA_ASSET_ID = ?, CFO_ASSET_ID = ?, CT_ASSET_ID = ?,  " &
                    "UII = ?, ETIC = ?, LOTNO = ?, MFG_DATE = ?, ACCEPT_DATE = ?,  " &
                    "NEXT_NDI_DATE = ?, DEPLOYED_DATE = ?, TCN = ?, SHIPPER = ?, SHIP_DATE = ?,  " &
                    "RECV_DATE = ?, ETI = ?, ETI_LIATE = ?, CFG_SET_ID = ?, EQUIP_ID = ?,  " &
                    "STATION_TYPE = ?, STRING_COUNT = ?, REMARKS = ?, PMEL = ?, IN_TRANSIT = ?,  " &
                    "SYS_ID = ?, TAIL_NO = ?, SRD_CD = ?, ASSET_TYPE = ? " &
                "WHERE ASSET_ID = ? ";

		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getPartnoId()) and !len(trim(arguments.chgAsset.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getSerno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getSerno()) and !len(trim(arguments.chgAsset.getSerno()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getStatusCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getStatusCd()) and !len(trim(arguments.chgAsset.getStatusCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getLocIda())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getLocIda()) and !len(trim(arguments.chgAsset.getLocIda()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getLocIdc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getLocIdc()) and !len(trim(arguments.chgAsset.getLocIdc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getInsBy()) and !len(trim(arguments.chgAsset.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAsset.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getActive()) and !len(trim(arguments.chgAsset.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getReportable())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getReportable()) and !len(trim(arguments.chgAsset.getReportable()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getCfoTracked())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getCfoTracked()) and !len(trim(arguments.chgAsset.getCfoTracked()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getBadActor())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getBadActor()) and !len(trim(arguments.chgAsset.getBadActor()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getValid())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getValid()) and !len(trim(arguments.chgAsset.getValid()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getValBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getValBy()) and !len(trim(arguments.chgAsset.getValBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAsset.getValDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getValDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getChgBy()) and !len(trim(arguments.chgAsset.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgAsset.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getNhaAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getNhaAssetId()) and !len(trim(arguments.chgAsset.getNhaAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getCfoAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getCfoAssetId()) and !len(trim(arguments.chgAsset.getCfoAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getCtAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getCtAssetId()) and !len(trim(arguments.chgAsset.getCtAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getUii())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getUii()) and !len(trim(arguments.chgAsset.getUii()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getEtic())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getEtic()) and !len(trim(arguments.chgAsset.getEtic()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getLotno())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getLotno()) and !len(trim(arguments.chgAsset.getLotno()))) ? "true" : "false");
        if (IsDate(arguments.chgAsset.getMfgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getMfgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAsset.getAcceptDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getAcceptDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAsset.getNextNdiDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getNextNdiDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAsset.getDeployedDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getDeployedDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getTcn())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getTcn()) and !len(trim(arguments.chgAsset.getTcn()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getShipper()) and !len(trim(arguments.chgAsset.getShipper()))) ? "true" : "false");
        if (IsDate(arguments.chgAsset.getShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgAsset.getRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgAsset.getRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getEti())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getEti()) and !len(trim(arguments.chgAsset.getEti()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getEtiLiate())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getEtiLiate()) and !len(trim(arguments.chgAsset.getEtiLiate()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getCfgSetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getCfgSetId()) and !len(trim(arguments.chgAsset.getCfgSetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getEquipId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getEquipId()) and !len(trim(arguments.chgAsset.getEquipId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getStationType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getStationType()) and !len(trim(arguments.chgAsset.getStationType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getStringCount())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getStringCount()) and !len(trim(arguments.chgAsset.getStringCount()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getRemarks()) and !len(trim(arguments.chgAsset.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getPmel())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getPmel()) and !len(trim(arguments.chgAsset.getPmel()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getInTransit())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getInTransit()) and !len(trim(arguments.chgAsset.getInTransit()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getSysId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getSysId()) and !len(trim(arguments.chgAsset.getSysId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getTailNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getTailNo()) and !len(trim(arguments.chgAsset.getTailNo()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getSrdCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getSrdCd()) and !len(trim(arguments.chgAsset.getSrdCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getAssetType())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgAsset.getAssetType()) and !len(trim(arguments.chgAsset.getAssetType()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgAsset.getAssetId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="AssetDao could not update the following record: #arguments.chgAsset.toString()#");
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
        var sql="DELETE FROM GLOBALEYE.ASSET " &
                "WHERE ASSET_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.assetId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="AssetDao could not delete the following record: Asset_Id[#arguments.assetId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ASSET_ID, PARTNO_ID, SERNO, STATUS_CD, LOC_IDA,  " & 
                    "LOC_IDC, INS_BY, INS_DATE, ACTIVE, REPORTABLE,  " & 
                    "CFO_TRACKED, BAD_ACTOR, VALID, VAL_BY, VAL_DATE,  " & 
                    "CHG_BY, CHG_DATE, NHA_ASSET_ID, CFO_ASSET_ID, CT_ASSET_ID,  " & 
                    "UII, ETIC, LOTNO, MFG_DATE, ACCEPT_DATE,  " & 
                    "NEXT_NDI_DATE, DEPLOYED_DATE, TCN, SHIPPER, SHIP_DATE,  " & 
                    "RECV_DATE, ETI, ETI_LIATE, CFG_SET_ID, EQUIP_ID,  " & 
                    "STATION_TYPE, STRING_COUNT, REMARKS, PMEL, IN_TRANSIT,  " & 
                    "SYS_ID, TAIL_NO, SRD_CD, ASSET_TYPE " &
                "FROM GLOBALEYE.ASSET ";

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
        
        if (StructKeyExists(arguments.filter,"uii")) {
            if (whereClauseFound) {
                local.sql &= " AND UII = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE UII = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.uii)),cfsqltype="CF_SQL_VARCHAR");
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
