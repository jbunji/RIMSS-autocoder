import cfc.dao.CodeGroupDao;
import cfc.model.CodeGroup;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:CODE_GROUP" displayName="CodeGroupService" name="CodeGroupService" {

    variables.instance = {
        CodeGroupDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CodeGroupDao = new CodeGroupDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CODEGROUP SERVICES */
	
	/* Create CODE_GROUP */
	public CodeGroup function createCodeGroup(CodeGroup item) {
		/* Auto-generated method 
           Insert a new record in CODE_GROUP 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CodeGroupDao.create(arguments.item);
        var qry = variables.instance.CodeGroupDao.readByRowId(local.idcol);
        var CodeGroup = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CodeGroup;
	}	
	
	/* Delete CodeGroup */
	public void function deleteCodeGroup(string cdgrpId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CodeGroupDao.delete(arguments.cdgrpId); 

		/* return success */
		return;
	}
	
	/* Get CodeGroup */
	public CodeGroup function getCodeGroup(string cdgrpId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CodeGroupDao.read(arguments.cdgrpId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CODE_GROUP */
	public CodeGroup function updateCodeGroup(CodeGroup item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CODE_GROUP */
		variables.instance.CodeGroupDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CODE_GROUP */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CodeGroupDao.count(); 
	}

    private CodeGroup function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CodeGroup object
        local.obj = new CodeGroup();
        local.obj.setCdgrpId(arguments.resultSet.CDGRP_ID[1]);
        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[1]);
        local.obj.setCodeId(arguments.resultSet.CODE_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[1]);
        local.obj.setDescription(arguments.resultSet.DESCRIPTION[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CodeGroup
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CodeGroup();
	        local.obj.setCdgrpId(arguments.resultSet.CDGRP_ID[local.row]);
	        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[local.row]);
	        local.obj.setCodeId(arguments.resultSet.CODE_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[local.row]);
	        local.obj.setDescription(arguments.resultSet.DESCRIPTION[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
