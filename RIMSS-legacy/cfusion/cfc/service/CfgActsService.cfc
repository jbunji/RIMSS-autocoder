import cfc.dao.CfgActsDao;
import cfc.model.CfgActs;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-GeneratedcfG_ACTS" displayName="CfgActsService" name="CfgActsService" {

    variables.instance = {
        CfgActsDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CfgActsDao = new CfgActsDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CFGACTS SERVICES */
	
	/* Create CFG_ACTS */
	public CfgActs function createCfgActs(CfgActs item) {
		/* Auto-generated method 
           Insert a new record in CFG_ACTS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CfgActsDao.create(arguments.item);
        var qry = variables.instance.CfgActsDao.readByRowId(local.idcol);
        var CfgActs = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CfgActs;
	}	
	
	/* Delete CfgActs */
	public void function deleteCfgActs() {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CfgActsDao.delete(); 

		/* return success */
		return;
	}
	
	/* Get CfgActs */
	public CfgActs function getCfgActs() {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CfgActsDao.read();
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CFG_ACTS */
	public CfgActs function updateCfgActs(CfgActs item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CFG_ACTS */
		variables.instance.CfgActsDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CFG_ACTS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CfgActsDao.count(); 
	}

    private CfgActs function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CfgActs object
        local.obj = new CfgActs();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setADelays(arguments.resultSet.A_DELAYS[1]);
        local.obj.setBDelays(arguments.resultSet.B_DELAYS[1]);
        local.obj.setBearing(arguments.resultSet.BEARING[1]);
        local.obj.setDistance(arguments.resultSet.DISTANCE[1]);
        local.obj.setElevation(arguments.resultSet.ELEVATION[1]);
        local.obj.setLatitude(arguments.resultSet.LATITUDE[1]);
        local.obj.setLongitude(arguments.resultSet.LONGITUDE[1]);
        local.obj.setRxSensA(arguments.resultSet.RX_SENS_A[1]);
        local.obj.setRxSensB(arguments.resultSet.RX_SENS_B[1]);
        local.obj.setTxPwrA(arguments.resultSet.TX_PWR_A[1]);
        local.obj.setTxPwrB(arguments.resultSet.TX_PWR_B[1]);
        local.obj.setUmbilCode(arguments.resultSet.UMBIL_CODE[1]);
        local.obj.setPodId(arguments.resultSet.POD_ID[1]);
        local.obj.setFrequency(arguments.resultSet.FREQUENCY[1]);
        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        local.obj.setAccessibility(arguments.resultSet.ACCESSIBILITY[1]);
        local.obj.setDfTubeCnt(arguments.resultSet.DF_TUBE_CNT[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CfgActs
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CfgActs();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setADelays(arguments.resultSet.A_DELAYS[local.row]);
	        local.obj.setBDelays(arguments.resultSet.B_DELAYS[local.row]);
	        local.obj.setBearing(arguments.resultSet.BEARING[local.row]);
	        local.obj.setDistance(arguments.resultSet.DISTANCE[local.row]);
	        local.obj.setElevation(arguments.resultSet.ELEVATION[local.row]);
	        local.obj.setLatitude(arguments.resultSet.LATITUDE[local.row]);
	        local.obj.setLongitude(arguments.resultSet.LONGITUDE[local.row]);
	        local.obj.setRxSensA(arguments.resultSet.RX_SENS_A[local.row]);
	        local.obj.setRxSensB(arguments.resultSet.RX_SENS_B[local.row]);
	        local.obj.setTxPwrA(arguments.resultSet.TX_PWR_A[local.row]);
	        local.obj.setTxPwrB(arguments.resultSet.TX_PWR_B[local.row]);
	        local.obj.setUmbilCode(arguments.resultSet.UMBIL_CODE[local.row]);
	        local.obj.setPodId(arguments.resultSet.POD_ID[local.row]);
	        local.obj.setFrequency(arguments.resultSet.FREQUENCY[local.row]);
	        local.obj.setDeployedDate(arguments.resultSet.DEPLOYED_DATE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        local.obj.setAccessibility(arguments.resultSet.ACCESSIBILITY[local.row]);
	        local.obj.setDfTubeCnt(arguments.resultSet.DF_TUBE_CNT[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
