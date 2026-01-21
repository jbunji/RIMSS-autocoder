import cfc.dao.TestFailedDao;
import cfc.model.TestFailed;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:TESTFAILED" displayName="TestFailedService" name="TestFailedService" {

    variables.instance = {
        TestFailedDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.TestFailedDao = new TestFailedDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* TEST FAILED SERVICES */
	
	/* Create TEST FAILED */
	public TestFailed function createTestFailed(TestFailed item) {
		/* Auto-generated method 
           Insert a new record in TEST FAILED 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.TestFailedDao.create(arguments.item);
        //var qry = variables.instance.TestFailedDao.readByRowId(local.idcol);
        //var TestFailed = loadObjectFromQuery(local.qry); 

        /* return created item */
        //return local.TestFailed;
        return arguments.item;
	}	
	
	/* Delete TEST FAILED */
	public void function deleteTestFailed(string testFailId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.TestFailedDao.delete(arguments.testFailId); 

		/* return success */
		return;
	}
	
	/* Get Test Failed */
	public TestFailed function getTestFailed(string testFailId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.TestFailedDao.read(arguments.testFailId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	public TestFailed function getTestFailedLaborId(required string laborId) {
        var qry = variables.instance.TestFailedDao.readByLaborId(arguments.laborId);
        var obj = loadObjectFromQuery(qry);
        return local.obj;
    }
	
	
	
	/* Update Test Failed */
	public TestFailed function updateTestFailed(TestFailed item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update Test Failed */		
		variables.instance.TestFailedDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count Test Failed */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.TestFailedDao.count(); 
	}

    private TestFailed function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Test Failed object
        local.obj = new TestFailed();
        local.obj.setTestFailId(arguments.resultSet.TEST_FAIL_ID[1]);
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setTestFailCd(arguments.resultSet.TEST_FAIL_CD[1]);       
        local.obj.setTestTypeCd(arguments.resultSet.TEST_TYPE_CD[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Test Failed
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new TestFailed();
	        local.obj.setTestFailId(arguments.resultSet.TEST_FAIL_ID[local.row]);
        	local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
        	local.obj.setTestFailCd(arguments.resultSet.TEST_FAIL_CD[local.row]);
        	local.obj.setTestTypeCd(arguments.resultSet.TEST_TYPE_CD[local.row]);
        	local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
        	local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
        	local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
        	local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
        	local.obj.setValid(arguments.resultSet.VALID[local.row]);
        	local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
        	local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
