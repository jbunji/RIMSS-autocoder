import cfc.dao.LocByLocDao;
import cfc.model.LocByLoc;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LOC_BY_LOC" displayName="LocByLocService" name="LocByLocService" {

    variables.instance = {
        LocByLocDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LocByLocDao = new LocByLocDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LOCBYLOC SERVICES */
	
	/* Create LOC_BY_LOC */
	public LocByLoc function createLocByLoc(LocByLoc item) {
		/* Auto-generated method 
           Insert a new record in LOC_BY_LOC 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LocByLocDao.create(arguments.item);
        var qry = variables.instance.LocByLocDao.readByRowId(local.idcol);
        var LocByLoc = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.LocByLoc;
	}	
	
	/* Delete LocByLoc */
	public void function deleteLocByLoc(string lblId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LocByLocDao.delete(arguments.lblId); 

		/* return success */
		return;
	}
	
	/* Get LocByLoc */
	public LocByLoc function getLocByLoc(string lblId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LocByLocDao.read(arguments.lblId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LOC_BY_LOC */
	public LocByLoc function updateLocByLoc(LocByLoc item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LOC_BY_LOC */
		variables.instance.LocByLocDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LOC_BY_LOC */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LocByLocDao.count(); 
	}

    private LocByLoc function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into LocByLoc object
        local.obj = new LocByLoc();
        local.obj.setLblId(arguments.resultSet.LBL_ID[1]);
        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[1]);
        local.obj.setLocId1(arguments.resultSet.LOC_ID1[1]);
        local.obj.setLocId2(arguments.resultSet.LOC_ID2[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of LocByLoc
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new LocByLoc();
	        local.obj.setLblId(arguments.resultSet.LBL_ID[local.row]);
	        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[local.row]);
	        local.obj.setLocId1(arguments.resultSet.LOC_ID1[local.row]);
	        local.obj.setLocId2(arguments.resultSet.LOC_ID2[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
