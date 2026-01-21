import cfc.dao.CfgListDao;
import cfc.model.CfgList;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-GeneratedcfG_LIST" displayName="CfgListService" name="CfgListService" {

    variables.instance = {
        CfgListDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CfgListDao = new CfgListDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CFGLIST SERVICES */
	
	/* Create CFG_LIST */
	public CfgList function createCfgList(CfgList item) {
		/* Auto-generated method 
           Insert a new record in CFG_LIST 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CfgListDao.create(arguments.item);
        var qry = variables.instance.CfgListDao.readByRowId(local.idcol);
        var CfgList = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CfgList;
	}	
	
	/* Delete CfgList */
	public void function deleteCfgList(string listId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CfgListDao.delete(arguments.listId); 

		/* return success */
		return;
	}
	
	/* Get CfgList */
	public CfgList function getCfgList(string listId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CfgListDao.read(arguments.listId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CFG_LIST */
	public CfgList function updateCfgList(CfgList item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CFG_LIST */
		variables.instance.CfgListDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CFG_LIST */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CfgListDao.count(); 
	}

    private CfgList function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CfgList object
        local.obj = new CfgList();
        local.obj.setListId(arguments.resultSet.LIST_ID[1]);
        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[1]);
        local.obj.setPartnoP(arguments.resultSet.PARTNO_P[1]);
        local.obj.setPartnoC(arguments.resultSet.PARTNO_C[1]);
        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setQPA(arguments.resultSet.QPA[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CfgList
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CfgList();
	        local.obj.setListId(arguments.resultSet.LIST_ID[local.row]);
	        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[local.row]);
	        local.obj.setPartnoP(arguments.resultSet.PARTNO_P[local.row]);
	        local.obj.setPartnoC(arguments.resultSet.PARTNO_C[local.row]);
	        local.obj.setSortOrder(arguments.resultSet.SORT_ORDER[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setQPA(arguments.resultSet.QPA[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
