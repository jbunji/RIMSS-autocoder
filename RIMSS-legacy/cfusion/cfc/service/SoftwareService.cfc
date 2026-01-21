import cfc.dao.SoftwareDao;
import cfc.model.Software;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:SOFTWARE" displayName="SoftwareService" name="SoftwareService" {

    variables.instance = {
        SoftwareDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.SoftwareDao = new SoftwareDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* SOFTWARE SERVICES */
	
	/* Create SOFTWARE */
	public Software function createSoftware(Software item) {
		/* Auto-generated method 
           Insert a new record in SOFTWARE 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.SoftwareDao.create(arguments.item);
        var qry = variables.instance.SoftwareDao.readByRowId(local.idcol);
        var Software = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Software;
	}	
	
	/* Delete Software */
	public void function deleteSoftware(string swId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.SoftwareDao.delete(arguments.swId); 

		/* return success */
		return;
	}
	
	/* Get Software */
	public Software function getSoftware(string swId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.SoftwareDao.read(arguments.swId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update SOFTWARE */
	public Software function updateSoftware(Software item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update SOFTWARE */
		variables.instance.SoftwareDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count SOFTWARE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.SoftwareDao.count(); 
	}

    private Software function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Software object
        local.obj = new Software();
        local.obj.setSwId(arguments.resultSet.SW_ID[1]);
        local.obj.setSwNumber(arguments.resultSet.SW_NUMBER[1]);
        local.obj.setSwType(arguments.resultSet.SW_TYPE[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setCpinFlag(arguments.resultSet.CPIN_FLAG[1]);
        local.obj.setRevision(arguments.resultSet.REVISION[1]);
        local.obj.setRevisionDate(arguments.resultSet.REVISION_DATE[1]);
        local.obj.setSwTitle(arguments.resultSet.SW_TITLE[1]);
        local.obj.setSwDesc(arguments.resultSet.SW_DESC[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Software
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Software();
	        local.obj.setSwId(arguments.resultSet.SW_ID[local.row]);
	        local.obj.setSwNumber(arguments.resultSet.SW_NUMBER[local.row]);
	        local.obj.setSwType(arguments.resultSet.SW_TYPE[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setCpinFlag(arguments.resultSet.CPIN_FLAG[local.row]);
	        local.obj.setRevision(arguments.resultSet.REVISION[local.row]);
	        local.obj.setRevisionDate(arguments.resultSet.REVISION_DATE[local.row]);
	        local.obj.setSwTitle(arguments.resultSet.SW_TITLE[local.row]);
	        local.obj.setSwDesc(arguments.resultSet.SW_DESC[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
