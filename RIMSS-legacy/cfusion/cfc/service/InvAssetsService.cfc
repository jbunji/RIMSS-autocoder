import cfc.dao.InvAssetsDao;
import cfc.model.InvAssets;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:INV_ASSETS" displayName="InvAssetsService" name="InvAssetsService" {

    variables.instance = {
        InvAssetsDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.InvAssetsDao = new InvAssetsDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* INVASSETS SERVICES */
	
	/* Create INV_ASSETS */
	public InvAssets function createInvAssets(InvAssets item) {
		/* Auto-generated method 
           Insert a new record in INV_ASSETS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.InvAssetsDao.create(arguments.item);
        var qry = variables.instance.InvAssetsDao.readByRowId(local.idcol);
        var InvAssets = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.InvAssets;
	}	
	
	/* Delete InvAssets */
	public void function deleteInvAssets(string assetId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.InvAssetsDao.delete(arguments.assetId); 

		/* return success */
		return;
	}
	
	/* Get InvAssets */
	public InvAssets function getInvAssets(string assetId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.InvAssetsDao.read(arguments.assetId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update INV_ASSETS */
	public InvAssets function updateInvAssets(InvAssets item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update INV_ASSETS */
		variables.instance.InvAssetsDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count INV_ASSETS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.InvAssetsDao.count(); 
	}

    private InvAssets function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into InvAssets object
        local.obj = new InvAssets();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setSerno(arguments.resultSet.SERNO[1]);
        local.obj.setIsActive(arguments.resultSet.IS_ACTIVE[1]);
        local.obj.setAssignedLocId(arguments.resultSet.ASSIGNED_LOC_ID[1]);
        local.obj.setCurrentLocId(arguments.resultSet.CURRENT_LOC_ID[1]);
        local.obj.setMaintLocId(arguments.resultSet.MAINT_LOC_ID[1]);
        local.obj.setOwnerId(arguments.resultSet.OWNER_ID[1]);
        local.obj.setMfgDate(arguments.resultSet.MFG_DATE[1]);
        local.obj.setAcceptDate(arguments.resultSet.ACCEPT_DATE[1]);
        local.obj.setEtic(arguments.resultSet.ETIC[1]);
        local.obj.setDiscrep(arguments.resultSet.DISCREP[1]);
        local.obj.setEdd(arguments.resultSet.EDD[1]);
        local.obj.setMsnCap(arguments.resultSet.MSN_CAP[1]);
        local.obj.setStatus(arguments.resultSet.STATUS[1]);
        local.obj.setNextNdiDate(arguments.resultSet.NEXT_NDI_DATE[1]);
        local.obj.setSentBy(arguments.resultSet.SENT_BY[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setDataSource(arguments.resultSet.DATA_SOURCE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        local.obj.setOldAssetId(arguments.resultSet.OLD_ASSET_ID[1]);
        local.obj.setTcn(arguments.resultSet.TCN[1]);
        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[1]);
        local.obj.setOwnerLocId(arguments.resultSet.OWNER_LOC_ID[1]);
        local.obj.setInTransitShipDate(arguments.resultSet.IN_TRANSIT_SHIP_DATE[1]);
        local.obj.setInTransitRecvDate(arguments.resultSet.IN_TRANSIT_RECV_DATE[1]);
        local.obj.setShipper(arguments.resultSet.SHIPPER[1]);
        local.obj.setCfoAssetId(arguments.resultSet.CFO_ASSET_ID[1]);
        local.obj.setIsCfoTracked(arguments.resultSet.IS_CFO_TRACKED[1]);
        local.obj.setLotno(arguments.resultSet.LOTNO[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        local.obj.setIsReportable(arguments.resultSet.IS_REPORTABLE[1]);
        local.obj.setNextNdiDue(arguments.resultSet.NEXT_NDI_DUE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of InvAssets
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new InvAssets();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setSerno(arguments.resultSet.SERNO[local.row]);
	        local.obj.setIsActive(arguments.resultSet.IS_ACTIVE[local.row]);
	        local.obj.setAssignedLocId(arguments.resultSet.ASSIGNED_LOC_ID[local.row]);
	        local.obj.setCurrentLocId(arguments.resultSet.CURRENT_LOC_ID[local.row]);
	        local.obj.setMaintLocId(arguments.resultSet.MAINT_LOC_ID[local.row]);
	        local.obj.setOwnerId(arguments.resultSet.OWNER_ID[local.row]);
	        local.obj.setMfgDate(arguments.resultSet.MFG_DATE[local.row]);
	        local.obj.setAcceptDate(arguments.resultSet.ACCEPT_DATE[local.row]);
	        local.obj.setEtic(arguments.resultSet.ETIC[local.row]);
	        local.obj.setDiscrep(arguments.resultSet.DISCREP[local.row]);
	        local.obj.setEdd(arguments.resultSet.EDD[local.row]);
	        local.obj.setMsnCap(arguments.resultSet.MSN_CAP[local.row]);
	        local.obj.setStatus(arguments.resultSet.STATUS[local.row]);
	        local.obj.setNextNdiDate(arguments.resultSet.NEXT_NDI_DATE[local.row]);
	        local.obj.setSentBy(arguments.resultSet.SENT_BY[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setDataSource(arguments.resultSet.DATA_SOURCE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        local.obj.setOldAssetId(arguments.resultSet.OLD_ASSET_ID[local.row]);
	        local.obj.setTcn(arguments.resultSet.TCN[local.row]);
	        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[local.row]);
	        local.obj.setOwnerLocId(arguments.resultSet.OWNER_LOC_ID[local.row]);
	        local.obj.setInTransitShipDate(arguments.resultSet.IN_TRANSIT_SHIP_DATE[local.row]);
	        local.obj.setInTransitRecvDate(arguments.resultSet.IN_TRANSIT_RECV_DATE[local.row]);
	        local.obj.setShipper(arguments.resultSet.SHIPPER[local.row]);
	        local.obj.setCfoAssetId(arguments.resultSet.CFO_ASSET_ID[local.row]);
	        local.obj.setIsCfoTracked(arguments.resultSet.IS_CFO_TRACKED[local.row]);
	        local.obj.setLotno(arguments.resultSet.LOTNO[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        local.obj.setIsReportable(arguments.resultSet.IS_REPORTABLE[local.row]);
	        local.obj.setNextNdiDue(arguments.resultSet.NEXT_NDI_DUE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
