import cfc.dao.SoftwareAssetDao;
import cfc.model.SoftwareAsset;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:SOFTWARE_ASSET" displayName="SoftwareAssetService" name="SoftwareAssetService" {

    variables.instance = {
        SoftwareAssetDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.SoftwareAssetDao = new SoftwareAssetDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* SOFTWAREASSET SERVICES */
	
	/* Create SOFTWARE_ASSET */
	public SoftwareAsset function createSoftwareAsset(SoftwareAsset item) {
		/* Auto-generated method 
           Insert a new record in SOFTWARE_ASSET 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.SoftwareAssetDao.create(arguments.item);
        var qry = variables.instance.SoftwareAssetDao.readByRowId(local.idcol);
        var SoftwareAsset = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.SoftwareAsset;
	}	
	
	/* Delete SoftwareAsset */
	public void function deleteSoftwareAsset(string assetId,    string swId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.SoftwareAssetDao.delete(arguments.assetId,arguments.swId); 

		/* return success */
		return;
	}
	
	/* Get SoftwareAsset */
	public SoftwareAsset function getSoftwareAsset(string assetId,    string swId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.SoftwareAssetDao.read(arguments.assetId,arguments.swId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update SOFTWARE_ASSET */
	public SoftwareAsset function updateSoftwareAsset(SoftwareAsset item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update SOFTWARE_ASSET */
		variables.instance.SoftwareAssetDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count SOFTWARE_ASSET */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.SoftwareAssetDao.count(); 
	}

    private SoftwareAsset function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into SoftwareAsset object
        local.obj = new SoftwareAsset();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setSwId(arguments.resultSet.SW_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of SoftwareAsset
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new SoftwareAsset();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setSwId(arguments.resultSet.SW_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
