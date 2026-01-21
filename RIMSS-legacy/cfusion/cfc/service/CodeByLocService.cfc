import cfc.dao.CodeByLocDao;
import cfc.model.CodeByLoc;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:CODE_BY_LOC" displayName="CodeByLocService" name="CodeByLocService" {

    variables.instance = {
        CodeByLocDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CodeByLocDao = new CodeByLocDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CODEBYLOC SERVICES */
	
	/* Create CODE_BY_LOC */
	public CodeByLoc function createCodeByLoc(CodeByLoc item) {
		/* Auto-generated method 
           Insert a new record in CODE_BY_LOC 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CodeByLocDao.create(arguments.item);
        var qry = variables.instance.CodeByLocDao.readByRowId(local.idcol);
        var CodeByLoc = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CodeByLoc;
	}	
	
	/* Delete CodeByLoc */
	public void function deleteCodeByLoc(string cblId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CodeByLocDao.delete(arguments.cblId); 

		/* return success */
		return;
	}
	
	/* Get CodeByLoc */
	public CodeByLoc function getCodeByLoc(string cblId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CodeByLocDao.read(arguments.cblId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CODE_BY_LOC */
	public CodeByLoc function updateCodeByLoc(CodeByLoc item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CODE_BY_LOC */
		variables.instance.CodeByLocDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CODE_BY_LOC */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CodeByLocDao.count(); 
	}

    private CodeByLoc function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CodeByLoc object
        local.obj = new CodeByLoc();
        local.obj.setCblId(arguments.resultSet.CBL_ID[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setCodeId(arguments.resultSet.CODE_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[1]);
        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[1]);
        local.obj.setKeyArea(arguments.resultSet.KEY_AREA[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CodeByLoc
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CodeByLoc();
	        local.obj.setCblId(arguments.resultSet.CBL_ID[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setCodeId(arguments.resultSet.CODE_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[local.row]);
	        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[local.row]);
	        local.obj.setKeyArea(arguments.resultSet.KEY_AREA[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
