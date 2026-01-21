import cfc.dao.AuxAssetsTctoDao;
import cfc.model.AuxAssetsTcto;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:AUX_ASSETS_TCTO" displayName="AuxAssetsTctoService" name="AuxAssetsTctoService" {

    variables.instance = {
        AuxAssetsTctoDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.AuxAssetsTctoDao = new AuxAssetsTctoDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* AUXASSETSTCTO SERVICES */
	
	/* Create AUX_ASSETS_TCTO */
	public AuxAssetsTcto function createAuxAssetsTcto(AuxAssetsTcto item) {
		/* Auto-generated method 
           Insert a new record in AUX_ASSETS_TCTO 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.AuxAssetsTctoDao.create(arguments.item);
        var qry = variables.instance.AuxAssetsTctoDao.readByRowId(local.idcol);
        var AuxAssetsTcto = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.AuxAssetsTcto;
	}	
	
	/* Delete AuxAssetsTcto */
	public void function deleteAuxAssetsTcto(string assetId,    string tctoId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.AuxAssetsTctoDao.delete(arguments.assetId,arguments.tctoId); 

		/* return success */
		return;
	}
	
	/* Get AuxAssetsTcto */
	public AuxAssetsTcto function getAuxAssetsTcto(string assetId,    string tctoId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.AuxAssetsTctoDao.read(arguments.assetId,arguments.tctoId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update AUX_ASSETS_TCTO */
	public AuxAssetsTcto function updateAuxAssetsTcto(AuxAssetsTcto item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update AUX_ASSETS_TCTO */
		variables.instance.AuxAssetsTctoDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count AUX_ASSETS_TCTO */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.AuxAssetsTctoDao.count(); 
	}

    private AuxAssetsTcto function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into AuxAssetsTcto object
        local.obj = new AuxAssetsTcto();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setTctoId(arguments.resultSet.TCTO_ID[1]);
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

        //load query results into an array of AuxAssetsTcto
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new AuxAssetsTcto();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setTctoId(arguments.resultSet.TCTO_ID[local.row]);
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
