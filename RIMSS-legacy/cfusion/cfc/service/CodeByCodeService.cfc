import cfc.dao.CodeByCodeDao;
import cfc.model.CodeByCode;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:CODE_BY_CODE" displayName="CodeByCodeService" name="CodeByCodeService" {

    variables.instance = {
        CodeByCodeDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CodeByCodeDao = new CodeByCodeDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CODEBYCODE SERVICES */
	
	/* Create CODE_BY_CODE */
	public CodeByCode function createCodeByCode(CodeByCode item) {
		/* Auto-generated method 
           Insert a new record in CODE_BY_CODE 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CodeByCodeDao.create(arguments.item);
        var qry = variables.instance.CodeByCodeDao.readByRowId(local.idcol);
        var CodeByCode = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CodeByCode;
	}	
	
	/* Delete CodeByCode */
	public void function deleteCodeByCode(string cbcId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CodeByCodeDao.delete(arguments.cbcId); 

		/* return success */
		return;
	}
	
	/* Get CodeByCode */
	public CodeByCode function getCodeByCode(string cbcId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CodeByCodeDao.read(arguments.cbcId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CODE_BY_CODE */
	public CodeByCode function updateCodeByCode(CodeByCode item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CODE_BY_CODE */
		variables.instance.CodeByCodeDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CODE_BY_CODE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CodeByCodeDao.count(); 
	}

    public string function getAllCodeBAsValueListByCodeA(required string codea) {
        var qry = variables.instance.codeByCodeDao.getAllCodeBAsValueListByCodeA(arguments.codea);
        var resultValueList = '';
        local.resultValueList = ValueList(local.qry.CODE_B);
        return local.resultValueList;
    }

    private CodeByCode function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CodeByCode object
        local.obj = new CodeByCode();
        local.obj.setCbcId(arguments.resultSet.CBC_ID[1]);
        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[1]);
        local.obj.setCodeA(arguments.resultSet.CODE_A[1]);
        local.obj.setCodeB(arguments.resultSet.CODE_B[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setKeyArea(arguments.resultSet.KEY_AREA[1]);
        local.obj.setRuType(arguments.resultSet.RU_TYPE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CodeByCode
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CodeByCode();
	        local.obj.setCbcId(arguments.resultSet.CBC_ID[local.row]);
	        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[local.row]);
	        local.obj.setCodeA(arguments.resultSet.CODE_A[local.row]);
	        local.obj.setCodeB(arguments.resultSet.CODE_B[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setKeyArea(arguments.resultSet.KEY_AREA[local.row]);
	        local.obj.setRuType(arguments.resultSet.RU_TYPE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
