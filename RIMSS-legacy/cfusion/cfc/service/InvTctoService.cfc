import cfc.dao.InvTctoDao;
import cfc.model.InvTcto;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:INV_TCTO" displayName="InvTctoService" name="InvTctoService" {

    variables.instance = {
        InvTctoDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.InvTctoDao = new InvTctoDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* INVTCTO SERVICES */
	
	/* Create INV_TCTO */
	public InvTcto function createInvTcto(InvTcto item) {
		/* Auto-generated method 
           Insert a new record in INV_TCTO 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.InvTctoDao.create(arguments.item);
        var qry = variables.instance.InvTctoDao.readByRowId(local.idcol);
        var InvTcto = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.InvTcto;
	}	
	
	/* Delete InvTcto */
	public void function deleteInvTcto(string tctoId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.InvTctoDao.delete(arguments.tctoId); 

		/* return success */
		return;
	}
	
	/* Get InvTcto */
	public InvTcto function getInvTcto(string tctoId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.InvTctoDao.read(arguments.tctoId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update INV_TCTO */
	public InvTcto function updateInvTcto(InvTcto item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update INV_TCTO */
		variables.instance.InvTctoDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count INV_TCTO */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.InvTctoDao.count(); 
	}

    private InvTcto function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into InvTcto object
        local.obj = new InvTcto();
        local.obj.setTctoNo(arguments.resultSet.TCTO_NO[1]);
        local.obj.setTctoId(arguments.resultSet.TCTO_ID[1]);
        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[1]);
        local.obj.setSysType(arguments.resultSet.SYS_TYPE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of InvTcto
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new InvTcto();
	        local.obj.setTctoNo(arguments.resultSet.TCTO_NO[local.row]);
	        local.obj.setTctoId(arguments.resultSet.TCTO_ID[local.row]);
	        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[local.row]);
	        local.obj.setSysType(arguments.resultSet.SYS_TYPE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
