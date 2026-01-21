import cfc.dao.CfgSetDao;
import cfc.model.CfgSet;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-GeneratedcfG_SET" displayName="CfgSetService" name="CfgSetService" {

    variables.instance = {
        CfgSetDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CfgSetDao = new CfgSetDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CFGSET SERVICES */
	
	/* Create CFG_SET */
	public CfgSet function createCfgSet(CfgSet item) {
		/* Auto-generated method 
           Insert a new record in CFG_SET 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CfgSetDao.create(arguments.item);
        var qry = variables.instance.CfgSetDao.readByRowId(local.idcol);
        var CfgSet = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CfgSet;
	}	
	
	/* Delete CfgSet */
	public void function deleteCfgSet(string cfgSetId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CfgSetDao.delete(arguments.cfgSetId); 

		/* return success */
		return;
	}
	
	/* Get CfgSet */
	public CfgSet function getCfgSet(string cfgSetId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CfgSetDao.read(arguments.cfgSetId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CFG_SET */
	public CfgSet function updateCfgSet(CfgSet item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CFG_SET */
		variables.instance.CfgSetDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CFG_SET */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CfgSetDao.count(); 
	}

    private CfgSet function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CfgSet object
        local.obj = new CfgSet();
        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[1]);
        local.obj.setCfgName(arguments.resultSet.CFG_NAME[1]);
        local.obj.setCfgType(arguments.resultSet.CFG_TYPE[1]);
        local.obj.setPgmId(arguments.resultSet.PGM_ID[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setDescription(arguments.resultSet.DESCRIPTION[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CfgSet
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CfgSet();
	        local.obj.setCfgSetId(arguments.resultSet.CFG_SET_ID[local.row]);
	        local.obj.setCfgName(arguments.resultSet.CFG_NAME[local.row]);
	        local.obj.setCfgType(arguments.resultSet.CFG_TYPE[local.row]);
	        local.obj.setPgmId(arguments.resultSet.PGM_ID[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setDescription(arguments.resultSet.DESCRIPTION[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
