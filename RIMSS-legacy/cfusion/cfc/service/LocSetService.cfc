import cfc.dao.LocSetDao;
import cfc.model.LocSet;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LOC_SET" displayName="LocSetService" name="LocSetService" {

    variables.instance = {
        LocSetDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LocSetDao = new LocSetDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LOCSET SERVICES */
	
	/* Create LOC_SET */
	public LocSet function createLocSet(LocSet item) {
		/* Auto-generated method 
           Insert a new record in LOC_SET 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LocSetDao.create(arguments.item);
        var qry = variables.instance.LocSetDao.readByRowId(local.idcol);
        var LocSet = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.LocSet;
	}	
	
	/* Delete LocSet */
	public void function deleteLocSet(string setId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LocSetDao.delete(arguments.setId); 

		/* return success */
		return;
	}
	
	/* Get LocSet */
	public LocSet function getLocSet(string setId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LocSetDao.read(arguments.setId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LOC_SET */
	public LocSet function updateLocSet(LocSet item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LOC_SET */
		variables.instance.LocSetDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LOC_SET */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LocSetDao.count(); 
	}

    private LocSet function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into LocSet object
        local.obj = new LocSet();
        local.obj.setSetId(arguments.resultSet.SET_ID[1]);
        local.obj.setSetName(arguments.resultSet.SET_NAME[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setDisplayName(arguments.resultSet.DISPLAY_NAME[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of LocSet
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new LocSet();
	        local.obj.setSetId(arguments.resultSet.SET_ID[local.row]);
	        local.obj.setSetName(arguments.resultSet.SET_NAME[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setDisplayName(arguments.resultSet.DISPLAY_NAME[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
