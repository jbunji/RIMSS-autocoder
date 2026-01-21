import cfc.dao.AdmVariableDao;
import cfc.model.AdmVariable;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:ADM_VARIABLE" displayName="AdmVariableService" name="AdmVariableService" {
	/*
           README for sample service

          This generated sample service contains functions that illustrate typical service operations.
          Use these functions as a starting point for creating your own service implementation. Modify the function signatures, 
          references to the database, and implementation according to your needs. Delete the functions that you do not use.
                
          Save your changes and return to Flash Builder. In Flash Builder Data/Services View, refresh the service. 
          Then drag service operations onto user interface components in Design View. For example, drag the getAllItems() operation onto a DataGrid.
                                
          This code is for prototyping only.
          Authenticate the user prior to allowing them to call these methods. You can find more information at http://www.adobe.com/go/cf9_usersecurity

     */


    variables.instance = {
        admVariableDao = ''
    };
	
	/* init */
	public function init(required Datasource datasource) {
	    variables.instance.admVariableDao = new AdmVariableDao(arguments.datasource);

		/* return success */
		return this;
	}

	
	

	/* ADMVARIABLE SERVICES */

	
	/* Create ADM_VARIABLE */
	public AdmVariable function createAdmVariable(AdmVariable item) {
		/* Auto-generated method 
		  Insert a new record in ADM_VARIABLE 
		  Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.AdmVariableDao.create(arguments.item);
        var qry = variables.instance.AdmVariableDao.readByRowId(local.idcol);
        var admVariable = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.admVariable;
	}
	
	
	/* Delete AdmVariable */
	public void function deleteAdmVariable(string varId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.AdmVariableDao.delete(arguments.varId); 

		/* return success */
		return;
	}
	
	/* Get AdmVariable */
	public AdmVariable function getAdmVariable(string varId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.admVariableDao.read(arguments.varId);
        var obj = loadObjectFromQuery(qry);  

        /* return item */
        return local.obj;
	}
	
	/* Update ADM_VARIABLE */
	public AdmVariable function updateAdmVariable(AdmVariable item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update ADM_VARIABLE */
		variables.instance.admVariableDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}
	
	
	/* Count ADM_VARIABLE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.admVariableDao.count(); 
	}

    public AdmVariable function readByVarGroup(required string varGroup) {
        var qry = variables.instance.admVariableDao.readByVarGroup(arguments.varGroup);
        var obj = loadObjectFromQuery(qry);  

        /* return item */
        return local.obj;
    }

    private AdmVariable function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //map resultset to AdmVariable object
        local.obj = new AdmVariable();
        local.obj.setVarId(arguments.resultSet.VAR_ID[1]);
        local.obj.setVarGroup(arguments.resultSet.VAR_GROUP[1]);
        local.obj.setVarValue(arguments.resultSet.VAR_VALUE[1]);
        local.obj.setVarType(arguments.resultSet.VAR_TYPE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of AdmVariable
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
            local.obj = new AdmVariable();
	        local.obj.setVarId(arguments.resultSet.VAR_ID[local.row]);
	        local.obj.setVarGroup(arguments.resultSet.VAR_GROUP[local.row]);
	        local.obj.setVarValue(arguments.resultSet.VAR_VALUE[local.row]);
	        local.obj.setVarType(arguments.resultSet.VAR_TYPE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
            
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
