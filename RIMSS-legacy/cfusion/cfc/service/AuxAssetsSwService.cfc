import cfc.dao.AuxAssetsSwDao;
import cfc.model.AuxAssetsSw;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:AUX_ASSETS_SW" displayName="AuxAssetsSwService" name="AuxAssetsSwService" {

    variables.instance = {
        AuxAssetsSwDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.AuxAssetsSwDao = new AuxAssetsSwDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* AUXASSETSSW SERVICES */
	
	/* Create AUX_ASSETS_SW */
	public AuxAssetsSw function createAuxAssetsSw(AuxAssetsSw item) {
		/* Auto-generated method 
           Insert a new record in AUX_ASSETS_SW 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.AuxAssetsSwDao.create(arguments.item);
        var qry = variables.instance.AuxAssetsSwDao.readByRowId(local.idcol);
        var AuxAssetsSw = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.AuxAssetsSw;
	}	
	
	/* Delete AuxAssetsSw */
	public void function deleteAuxAssetsSw(string assetId,    string swId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.AuxAssetsSwDao.delete(arguments.assetId,arguments.swId); 

		/* return success */
		return;
	}
	
	/* Get AuxAssetsSw */
	public AuxAssetsSw function getAuxAssetsSw(string assetId,    string swId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AuxAssetsSwDao.read(arguments.assetId,arguments.swId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update AUX_ASSETS_SW */
	public AuxAssetsSw function updateAuxAssetsSw(AuxAssetsSw item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update AUX_ASSETS_SW */
		variables.instance.AuxAssetsSwDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count AUX_ASSETS_SW */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.AuxAssetsSwDao.count(); 
	}

    private AuxAssetsSw function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into AuxAssetsSw object
        local.obj = new AuxAssetsSw();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setSwId(arguments.resultSet.SW_ID[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of AuxAssetsSw
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new AuxAssetsSw();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setSwId(arguments.resultSet.SW_ID[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
