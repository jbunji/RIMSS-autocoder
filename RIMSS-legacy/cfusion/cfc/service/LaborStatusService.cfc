import cfc.dao.LaborStatusDao;
import cfc.model.LaborStatus;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LABOR_STATUS" displayName="LaborStatusService" name="LaborStatusService" {

    variables.instance = {
        LaborStatusDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LaborStatusDao = new LaborStatusDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LABORSTATUS SERVICES */
	
	/* Create LABOR_STATUS */
	public LaborStatus function createLaborStatus(LaborStatus item) {
		/* Auto-generated method 
           Insert a new record in LABOR_STATUS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LaborStatusDao.create(arguments.item);
        var qry = variables.instance.LaborStatusDao.readByRowId(local.idcol);
        var LaborStatus = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.LaborStatus;
	}	
	
	/* Delete LaborStatus */
	public void function deleteLaborStatus(string labStatId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LaborStatusDao.delete(arguments.labStatId); 

		/* return success */
		return;
	}
	
	/* Get LaborStatus */
	public LaborStatus function getLaborStatus(string labStatId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborStatusDao.read(arguments.labStatId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LABOR_STATUS */
	public LaborStatus function updateLaborStatus(LaborStatus item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LABOR_STATUS */
		variables.instance.LaborStatusDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LABOR_STATUS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LaborStatusDao.count(); 
	}

    private LaborStatus function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into LaborStatus object
        local.obj = new LaborStatus();
        local.obj.setLabStatId(arguments.resultSet.LAB_STAT_ID[1]);
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setStatus(arguments.resultSet.STATUS[1]);
        local.obj.setStatusDate(arguments.resultSet.STATUS_DATE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setCrewId(arguments.resultSet.CREW_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of LaborStatus
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new LaborStatus();
	        local.obj.setLabStatId(arguments.resultSet.LAB_STAT_ID[local.row]);
	        local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setStatus(arguments.resultSet.STATUS[local.row]);
	        local.obj.setStatusDate(arguments.resultSet.STATUS_DATE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setCrewId(arguments.resultSet.CREW_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
