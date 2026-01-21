import cfc.dao.CodeDao;
import cfc.model.Code;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:CODE" displayName="CodeService" name="CodeService" {

    variables.instance = {
        CodeDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CodeDao = new CodeDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CODE SERVICES */
	
	/* Create CODE */
	public Code function createCode(Code item) {
		/* Auto-generated method 
           Insert a new record in CODE 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CodeDao.create(arguments.item);
        var qry = variables.instance.CodeDao.readByRowId(local.idcol);
        var Code = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Code;
	}	
	
	/* Delete Code */
	public void function deleteCode(string codeId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CodeDao.delete(arguments.codeId); 

		/* return success */
		return;
	}
	
	/* Get Code */
	public Code function getCode(string codeId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CodeDao.read(arguments.codeId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CODE */
	public Code function updateCode(Code item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CODE */
		variables.instance.CodeDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CODE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CodeDao.count(); 
	}

    /* find code by its code_value */
    public Code function findByCodeTypeCodeValue(required string codeType, required string codeValue) {
        var qry = variables.instance.codeDao.findByCodeTypeCodeValue(arguments.codeType, arguments.codeValue);
        var obj = loadObjectFromQuery(qry);
        return local.obj;
    }

    /* find code by its code_value using regex */
    public Code function getCodeByREValue(required string codeType, required string codeValue) {
        var qry = variables.instance.codeDao.getCodeByREValue(arguments.codeType, arguments.codeValue);
        var obj = loadObjectFromQuery(qry);
        return local.obj;
    }

    /* find code by its core_table code id */
    public Code function findByCtCodeId(required string ctCodeId) {
        var qry = variables.instance.codeDao.findByCtCodeId(arguments.ctCodeId);
        var obj = loadObjectFromQuery(qry);
        return local.obj;
    }

    /* find codes by their code type */
    public Code[] function findCodesByCodeType(required string codeType) {
        var qry = variables.instance.codeDao.findCodesByCodeType(arguments.codeType);
        var obj = loadObjectsFromQuery(qry);
        return local.obj;
    }

    private Code function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Code object
        local.obj = new Code();
        local.obj.setCodeId(arguments.resultSet.CODE_ID[1]);
        local.obj.setCodeType(arguments.resultSet.CODE_TYPE[1]);
        local.obj.setCodeValue(arguments.resultSet.CODE_VALUE[1]);
        local.obj.setDescription(arguments.resultSet.DESCRIPTION[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[1]);
        local.obj.setCtCodeId(arguments.resultSet.CT_CODE_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Code
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Code();
	        local.obj.setCodeId(arguments.resultSet.CODE_ID[local.row]);
	        local.obj.setCodeType(arguments.resultSet.CODE_TYPE[local.row]);
	        local.obj.setCodeValue(arguments.resultSet.CODE_VALUE[local.row]);
	        local.obj.setDescription(arguments.resultSet.DESCRIPTION[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[local.row]);
	        local.obj.setCtCodeId(arguments.resultSet.CT_CODE_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
