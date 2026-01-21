import cfc.dao.InvSoftwareDao;
import cfc.model.InvSoftware;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:INV_SOFTWARE" displayName="InvSoftwareService" name="InvSoftwareService" {

    variables.instance = {
        InvSoftwareDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.InvSoftwareDao = new InvSoftwareDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* INVSOFTWARE SERVICES */
	
	/* Create INV_SOFTWARE */
	public InvSoftware function createInvSoftware(InvSoftware item) {
		/* Auto-generated method 
           Insert a new record in INV_SOFTWARE 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.InvSoftwareDao.create(arguments.item);
        var qry = variables.instance.InvSoftwareDao.readByRowId(local.idcol);
        var InvSoftware = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.InvSoftware;
	}	
	
	/* Delete InvSoftware */
	public void function deleteInvSoftware(string swId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.InvSoftwareDao.delete(arguments.swId); 

		/* return success */
		return;
	}
	
	/* Get InvSoftware */
	public InvSoftware function getInvSoftware(string swId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.InvSoftwareDao.read(arguments.swId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update INV_SOFTWARE */
	public InvSoftware function updateInvSoftware(InvSoftware item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update INV_SOFTWARE */
		variables.instance.InvSoftwareDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count INV_SOFTWARE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.InvSoftwareDao.count(); 
	}

    private InvSoftware function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into InvSoftware object
        local.obj = new InvSoftware();
        local.obj.setSwId(arguments.resultSet.SW_ID[1]);
        local.obj.setSwNumber(arguments.resultSet.SW_NUMBER[1]);
        local.obj.setRevision(arguments.resultSet.REVISION[1]);
        local.obj.setIsCpin(arguments.resultSet.IS_CPIN[1]);
        local.obj.setSwDesc(arguments.resultSet.SW_DESC[1]);
        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[1]);
        local.obj.setSwType(arguments.resultSet.SW_TYPE[1]);
        local.obj.setSwTitle(arguments.resultSet.SW_TITLE[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        local.obj.setIsPending(arguments.resultSet.IS_PENDING[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of InvSoftware
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new InvSoftware();
	        local.obj.setSwId(arguments.resultSet.SW_ID[local.row]);
	        local.obj.setSwNumber(arguments.resultSet.SW_NUMBER[local.row]);
	        local.obj.setRevision(arguments.resultSet.REVISION[local.row]);
	        local.obj.setIsCpin(arguments.resultSet.IS_CPIN[local.row]);
	        local.obj.setSwDesc(arguments.resultSet.SW_DESC[local.row]);
	        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[local.row]);
	        local.obj.setSwType(arguments.resultSet.SW_TYPE[local.row]);
	        local.obj.setSwTitle(arguments.resultSet.SW_TITLE[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        local.obj.setIsPending(arguments.resultSet.IS_PENDING[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
