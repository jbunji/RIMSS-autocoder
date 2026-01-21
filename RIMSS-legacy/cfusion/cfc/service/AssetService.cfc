import cfc.dao.AssetDao;
import cfc.model.Asset;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:ASSET" displayName="AssetService" name="AssetService" {

    variables.instance = {
        AssetDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.AssetDao = new AssetDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* ASSET SERVICES */
	
	/* Create ASSET */
	public Asset function createAsset(Asset item) {
		/* Auto-generated method 
           Insert a new record in ASSET 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.AssetDao.create(arguments.item);
        var qry = variables.instance.AssetDao.readByRowId(local.idcol);
        var Asset = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Asset;
	}	
	
	/* Delete Asset */
	public void function deleteAsset(string assetId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.AssetDao.delete(arguments.assetId); 

		/* return success */
		return;
	}
	
	/* Get Asset */
	public Asset function getAsset(string assetId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AssetDao.read(arguments.assetId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Get Asset by UII */
    public Asset function getAssetByUII(string uii) {
          /* Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AssetDao.readByUII(arguments.uii);

        var obj = loadObjectFromQuery(qry);  

        /* return item */
        return local.obj;
    }
    
    /* Get Asset by Id (with levels) */
    public Array function getLevelsByAssetId(string assetId) {
          /* Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AssetDao.readLevelsByAssetId(arguments.assetId);

        var obj = loadObjectsFromQuery(qry);  

        /* return item */
        return local.obj;
    }
	
	/* Update ASSET */
	public Asset function updateAsset(Asset item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update ASSET */
		variables.instance.AssetDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count ASSET */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.AssetDao.count(); 
	}

    private Asset function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Asset object
        local.obj = new Asset();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setSerno(arguments.resultSet.SERNO[1]);
        local.obj.setStatusCd(arguments.resultSet.STATUS_CD[1]);
        local.obj.setLocIda(arguments.resultSet.LOC_IDA[1]);
        local.obj.setLocIdc(arguments.resultSet.LOC_IDC[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setReportable(arguments.resultSet.REPORTABLE[1]);
        local.obj.setCfoTracked(arguments.resultSet.CFO_TRACKED[1]);
        local.obj.setBadActor(arguments.resultSet.BAD_ACTOR[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setNhaAssetId(arguments.resultSet.NHA_ASSET_ID[1]);
        local.obj.setCfoAssetId(arguments.resultSet.CFO_ASSET_ID[1]);
        local.obj.setCtAssetId(arguments.resultSet.CT_ASSET_ID[1]);
        local.obj.setUii(arguments.resultSet.UII[1]);
        local.obj.setEtic(arguments.resultSet.ETIC[1]);
        local.obj.setLotno(arguments.resultSet.LOTNO[1]);
        local.obj.setMfgDate(arguments.resultSet.MFG_DATE[1]);
        local.obj.setAcceptDate(arguments.resultSet.ACCEPT_DATE[1]);
        local.obj.setNextNdiDate(arguments.resultSet.NEXT_NDI_DATE[1]);
        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[1]);
        local.obj.setTcn(arguments.resultSet.TCN[1]);
        local.obj.setShipper(arguments.resultSet.SHIPPER[1]);
        local.obj.setShipDate(arguments.resultSet.SHIP_DATE[1]);
        local.obj.setRecvDate(arguments.resultSet.RECV_DATE[1]);
        local.obj.setEti(arguments.resultSet.ETI[1]);
        local.obj.setEtiLiate(arguments.resultSet.ETI_LIATE[1]);
        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[1]);
        local.obj.setEquipId(arguments.resultSet.EQUIP_ID[1]);
        local.obj.setStationType(arguments.resultSet.STATION_TYPE[1]);
        local.obj.setStringCount(arguments.resultSet.STRING_COUNT[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setPmel(arguments.resultSet.PMEL[1]);
        local.obj.setInTransit(arguments.resultSet.IN_TRANSIT[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setTailNo(arguments.resultSet.TAIL_NO[1]);
        local.obj.setSrdCd(arguments.resultSet.SRD_CD[1]);
        local.obj.setAssetType(arguments.resultSet.ASSET_TYPE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Asset
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Asset();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setSerno(arguments.resultSet.SERNO[local.row]);
	        local.obj.setStatusCd(arguments.resultSet.STATUS_CD[local.row]);
	        local.obj.setLocIda(arguments.resultSet.LOC_IDA[local.row]);
	        local.obj.setLocIdc(arguments.resultSet.LOC_IDC[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setReportable(arguments.resultSet.REPORTABLE[local.row]);
	        local.obj.setCfoTracked(arguments.resultSet.CFO_TRACKED[local.row]);
	        local.obj.setBadActor(arguments.resultSet.BAD_ACTOR[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setNhaAssetId(arguments.resultSet.NHA_ASSET_ID[local.row]);
	        local.obj.setCfoAssetId(arguments.resultSet.CFO_ASSET_ID[local.row]);
	        local.obj.setCtAssetId(arguments.resultSet.CT_ASSET_ID[local.row]);
	        local.obj.setUii(arguments.resultSet.UII[local.row]);
	        local.obj.setEtic(arguments.resultSet.ETIC[local.row]);
	        local.obj.setLotno(arguments.resultSet.LOTNO[local.row]);
	        local.obj.setMfgDate(arguments.resultSet.MFG_DATE[local.row]);
	        local.obj.setAcceptDate(arguments.resultSet.ACCEPT_DATE[local.row]);
	        local.obj.setNextNdiDate(arguments.resultSet.NEXT_NDI_DATE[local.row]);
	        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[local.row]);
	        local.obj.setTcn(arguments.resultSet.TCN[local.row]);
	        local.obj.setShipper(arguments.resultSet.SHIPPER[local.row]);
	        local.obj.setShipDate(arguments.resultSet.SHIP_DATE[local.row]);
	        local.obj.setRecvDate(arguments.resultSet.RECV_DATE[local.row]);
	        local.obj.setEti(arguments.resultSet.ETI[local.row]);
	        local.obj.setEtiLiate(arguments.resultSet.ETI_LIATE[local.row]);
	        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[local.row]);
	        local.obj.setEquipId(arguments.resultSet.EQUIP_ID[local.row]);
	        local.obj.setStationType(arguments.resultSet.STATION_TYPE[local.row]);
	        local.obj.setStringCount(arguments.resultSet.STRING_COUNT[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setPmel(arguments.resultSet.PMEL[local.row]);
	        local.obj.setInTransit(arguments.resultSet.IN_TRANSIT[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setTailNo(arguments.resultSet.TAIL_NO[local.row]);
	        local.obj.setSrdCd(arguments.resultSet.SRD_CD[local.row]);
	        local.obj.setAssetType(arguments.resultSet.ASSET_TYPE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
