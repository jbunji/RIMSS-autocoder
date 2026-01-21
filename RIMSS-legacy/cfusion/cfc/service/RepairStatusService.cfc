import cfc.dao.RepairStatusDao;
import cfc.model.RepairStatus;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:REPAIR_STATUS" displayName="RepairStatusService" name="RepairStatusService" {

    variables.instance = {
        RepairStatusDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.RepairStatusDao = new RepairStatusDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* REPAIRSTATUS SERVICES */
	
	/* Create REPAIR_STATUS */
	public RepairStatus function createRepairStatus(RepairStatus item) {
		/* Auto-generated method 
           Insert a new record in REPAIR_STATUS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.RepairStatusDao.create(arguments.item);
        var qry = variables.instance.RepairStatusDao.readByRowId(local.idcol);
        var RepairStatus = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.RepairStatus;
	}	
	
	/* Delete RepairStatus */
	public void function deleteRepairStatus(string rpstatId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.RepairStatusDao.delete(arguments.rpstatId); 

		/* return success */
		return;
	}
	
	/* Get RepairStatus */
	public RepairStatus function getRepairStatus(string rpstatId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.RepairStatusDao.read(arguments.rpstatId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update REPAIR_STATUS */
	public RepairStatus function updateRepairStatus(RepairStatus item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update REPAIR_STATUS */
		variables.instance.RepairStatusDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count REPAIR_STATUS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.RepairStatusDao.count(); 
	}

    private RepairStatus function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into RepairStatus object
        local.obj = new RepairStatus();
        local.obj.setRpstatId(arguments.resultSet.RPSTAT_ID[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
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

        //load query results into an array of RepairStatus
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new RepairStatus();
	        local.obj.setRpstatId(arguments.resultSet.RPSTAT_ID[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
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
