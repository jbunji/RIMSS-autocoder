import cfc.dao.TctoAssetDao;
import cfc.model.TctoAsset;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:TCTO_ASSET" displayName="TctoAssetService" name="TctoAssetService" {

    variables.instance = {
        TctoAssetDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.TctoAssetDao = new TctoAssetDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* TCTOASSET SERVICES */
	
	/* Create TCTO_ASSET */
	public TctoAsset function createTctoAsset(TctoAsset item) {
		/* Auto-generated method 
           Insert a new record in TCTO_ASSET 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.TctoAssetDao.create(arguments.item);
        var qry = variables.instance.TctoAssetDao.readByRowId(local.idcol);
        var TctoAsset = loadObjectFromQuery(local.qry); 

        /* return created item */
        return arguments.item;
	}	
	
	/* Delete TctoAsset */
	public void function deleteTctoAsset(string tctoId,    string assetId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.TctoAssetDao.delete(arguments.tctoId,arguments.assetId); 

		/* return success */
		return;
	}
	
	/* Get TctoAsset */
	public TctoAsset function getTctoAsset(string tctoId,    string assetId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.TctoAssetDao.read(arguments.tctoId,arguments.assetId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/*Get TctoAssetByRepair */
	public TctoAsset function getTctoAssetByRepairId(string repairId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.TctoAssetDao.readByRepairId(arguments.repairId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update TCTO_ASSET */
	public TctoAsset function updateTctoAsset(TctoAsset item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update TCTO_ASSET */
		variables.instance.TctoAssetDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}
	
	/* Update TCTO_ASSET By RepairId */
	public TctoAsset function updateTctoAssetByRepairId(TctoAsset item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update TCTO_ASSET */
		variables.instance.TctoAssetDao.updateByRepairId(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count TCTO_ASSET */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.TctoAssetDao.count(); 
	}

    private TctoAsset function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into TctoAsset object
        local.obj = new TctoAsset();
        local.obj.setTctoId(arguments.resultSet.TCTO_ID[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setCompleteDate(arguments.resultSet.COMPLETE_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of TctoAsset
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new TctoAsset();
	        local.obj.setTctoId(arguments.resultSet.TCTO_ID[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setCompleteDate(arguments.resultSet.COMPLETE_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
