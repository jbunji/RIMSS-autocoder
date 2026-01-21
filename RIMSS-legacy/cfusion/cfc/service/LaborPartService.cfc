import cfc.dao.LaborPartDao;
import cfc.model.LaborPart;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LABOR_PART" displayName="LaborPartService" name="LaborPartService" {

    variables.instance = {
        LaborPartDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LaborPartDao = new LaborPartDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LABORPART SERVICES */
	
	/* Create LABOR_PART */
	public LaborPart function createLaborPart(LaborPart item) {
		/* Auto-generated method 
           Insert a new record in LABOR_PART 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LaborPartDao.create(arguments.item);
        var qry = variables.instance.LaborPartDao.readByRowId(local.idcol);
        var LaborPart = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.LaborPart;
	}
	
	/* Delete LaborPart */
	public void function deleteLaborPart(string laborPartId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LaborPartDao.delete(arguments.laborPartId); 

		/* return success */
		return;
	}
	
	/* Get LaborPart */
	public LaborPart function getLaborPart(string laborPartId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborPartDao.read(arguments.laborPartId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Get LaborPart */
	public LaborPart function getLaborPartByLaborId(string laborId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborPartDao.readByLaborId(arguments.laborId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	public LaborPart function getLaborPartByLaborIdPartAction(string laborId, string partAction) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborPartDao.readByLaborIdPartAction(arguments.laborId, arguments.partAction);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LABOR_PART */
	public LaborPart function updateLaborPart(LaborPart item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LABOR_PART */
		variables.instance.LaborPartDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LABOR_PART */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LaborPartDao.count(); 
	}
	
	public any function LaborPartExist(LaborPart item) {
	    local.LaborPartExist = variables.instance.LaborPartDao.readByLaborIdPartAction(arguments.item.getLaborId(), arguments.item.getPartAction());
		
		return local.LaborPartExist;
	}

    private LaborPart function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into LaborPart object
        local.obj = new LaborPart();
        local.obj.setLaborPartId(arguments.resultSet.LABOR_PART_ID[1]);
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setPartAction(arguments.resultSet.PART_ACTION[1]);
        local.obj.setHowMal(arguments.resultSet.HOW_MAL[1]);
        local.obj.setTagNo(arguments.resultSet.TAG_NO[1]);
        local.obj.setPartQty(arguments.resultSet.PART_QTY[1]);
        local.obj.setRefdes(arguments.resultSet.REFDES[1]);
        local.obj.setFsc(arguments.resultSet.FSC[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[1]);
        local.obj.setIsPqdr(arguments.resultSet.IS_PQDR[1]);
        local.obj.setDrNum(arguments.resultSet.DR_NUM[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of LaborPart
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new LaborPart();
	        local.obj.setLaborPartId(arguments.resultSet.LABOR_PART_ID[local.row]);
	        local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setPartAction(arguments.resultSet.PART_ACTION[local.row]);
	        local.obj.setHowMal(arguments.resultSet.HOW_MAL[local.row]);
	        local.obj.setTagNo(arguments.resultSet.TAG_NO[local.row]);
	        local.obj.setPartQty(arguments.resultSet.PART_QTY[local.row]);
	        local.obj.setRefdes(arguments.resultSet.REFDES[local.row]);
	        local.obj.setFsc(arguments.resultSet.FSC[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[local.row]);
        	local.obj.setIsPqdr(arguments.resultSet.IS_PQDR[local.row]);
        	local.obj.setDrNum(arguments.resultSet.DR_NUM[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
