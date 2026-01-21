import cfc.dao.BadActorDao;
import cfc.model.BadActor;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:BAD_ACTOR" displayName="BadActorService" name="BadActorService" {

    variables.instance = {
        BadActorDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.BadActorDao = new BadActorDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* BADACTOR SERVICES */
	
	/* Create BAD_ACTOR */
	public BadActor function createBadActor(BadActor item) {
		/* Auto-generated method 
           Insert a new record in BAD_ACTOR 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.BadActorDao.create(arguments.item);
        var qry = variables.instance.BadActorDao.readByRowId(local.idcol);
        var BadActor = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.BadActor;
	}	
	
	/* Delete BadActor */
	public void function deleteBadActor(string badActorId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.BadActorDao.delete(arguments.badActorId); 

		/* return success */
		return;
	}
	
	/* Get BadActor */
	public BadActor function getBadActor(string badActorId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.BadActorDao.read(arguments.badActorId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update BAD_ACTOR */
	public BadActor function updateBadActor(BadActor item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update BAD_ACTOR */
		variables.instance.BadActorDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count BAD_ACTOR */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.BadActorDao.count(); 
	}

    private BadActor function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into BadActor object
        local.obj = new BadActor();
        local.obj.setBadActorId(arguments.resultSet.BAD_ACTOR_ID[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setStatusPeriod(arguments.resultSet.STATUS_PERIOD[1]);
        local.obj.setStatusPeriodType(arguments.resultSet.STATUS_PERIOD_TYPE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setMultiAc(arguments.resultSet.MULTI_AC[1]);
        local.obj.setStatusCount(arguments.resultSet.STATUS_COUNT[1]);
        local.obj.setStatusCd(arguments.resultSet.STATUS_CD[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of BadActor
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new BadActor();
	        local.obj.setBadActorId(arguments.resultSet.BAD_ACTOR_ID[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setStatusPeriod(arguments.resultSet.STATUS_PERIOD[local.row]);
	        local.obj.setStatusPeriodType(arguments.resultSet.STATUS_PERIOD_TYPE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setMultiAc(arguments.resultSet.MULTI_AC[local.row]);
	        local.obj.setStatusCount(arguments.resultSet.STATUS_COUNT[local.row]);
	        local.obj.setStatusCd(arguments.resultSet.STATUS_CD[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
