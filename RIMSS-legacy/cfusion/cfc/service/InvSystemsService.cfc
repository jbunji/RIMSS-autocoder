import cfc.dao.InvSystemsDao;
import cfc.model.InvSystems;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:INV_SYSTEMS" displayName="InvSystemsService" name="InvSystemsService" {

    variables.instance = {
        InvSystemsDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.InvSystemsDao = new InvSystemsDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* INVSYSTEMS SERVICES */
	
	/* Create INV_SYSTEMS */
	public InvSystems function createInvSystems(InvSystems item) {
		/* Auto-generated method 
           Insert a new record in INV_SYSTEMS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.InvSystemsDao.create(arguments.item);
        var qry = variables.instance.InvSystemsDao.readByRowId(local.idcol);
        var InvSystems = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.InvSystems;
	}	
	
	/* Delete InvSystems */
	public void function deleteInvSystems(string sysId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.InvSystemsDao.delete(arguments.sysId); 

		/* return success */
		return;
	}
	
	/* Get InvSystems */
	public InvSystems function getInvSystems(string sysId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.InvSystemsDao.read(arguments.sysId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update INV_SYSTEMS */
	public InvSystems function updateInvSystems(InvSystems item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update INV_SYSTEMS */
		variables.instance.InvSystemsDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count INV_SYSTEMS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.InvSystemsDao.count(); 
	}

    private InvSystems function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into InvSystems object
        local.obj = new InvSystems();
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setFffId(arguments.resultSet.FFF_ID[1]);
        local.obj.setCage(arguments.resultSet.CAGE[1]);
        local.obj.setPartno(arguments.resultSet.PARTNO[1]);
        local.obj.setVersion(arguments.resultSet.VERSION[1]);
        local.obj.setNsn(arguments.resultSet.NSN[1]);
        local.obj.setIsActive(arguments.resultSet.IS_ACTIVE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[1]);
        local.obj.setSysType(arguments.resultSet.SYS_TYPE[1]);
        local.obj.setNoun(arguments.resultSet.NOUN[1]);
        local.obj.setMds(arguments.resultSet.MDS[1]);
        local.obj.setMNsn(arguments.resultSet.M_NSN[1]);
        local.obj.setNewCost(arguments.resultSet.NEW_COST[1]);
        local.obj.setExchCost(arguments.resultSet.EXCH_COST[1]);
        local.obj.setConfig(arguments.resultSet.CONFIG[1]);
        local.obj.setSrd(arguments.resultSet.SRD[1]);
        local.obj.setOldSysId(arguments.resultSet.OLD_SYS_ID[1]);
        local.obj.setIsPars(arguments.resultSet.IS_PARS[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of InvSystems
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new InvSystems();
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setFffId(arguments.resultSet.FFF_ID[local.row]);
	        local.obj.setCage(arguments.resultSet.CAGE[local.row]);
	        local.obj.setPartno(arguments.resultSet.PARTNO[local.row]);
	        local.obj.setVersion(arguments.resultSet.VERSION[local.row]);
	        local.obj.setNsn(arguments.resultSet.NSN[local.row]);
	        local.obj.setIsActive(arguments.resultSet.IS_ACTIVE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        local.obj.setProgramId(arguments.resultSet.PROGRAM_ID[local.row]);
	        local.obj.setSysType(arguments.resultSet.SYS_TYPE[local.row]);
	        local.obj.setNoun(arguments.resultSet.NOUN[local.row]);
	        local.obj.setMds(arguments.resultSet.MDS[local.row]);
	        local.obj.setMNsn(arguments.resultSet.M_NSN[local.row]);
	        local.obj.setNewCost(arguments.resultSet.NEW_COST[local.row]);
	        local.obj.setExchCost(arguments.resultSet.EXCH_COST[local.row]);
	        local.obj.setConfig(arguments.resultSet.CONFIG[local.row]);
	        local.obj.setSrd(arguments.resultSet.SRD[local.row]);
	        local.obj.setOldSysId(arguments.resultSet.OLD_SYS_ID[local.row]);
	        local.obj.setIsPars(arguments.resultSet.IS_PARS[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
