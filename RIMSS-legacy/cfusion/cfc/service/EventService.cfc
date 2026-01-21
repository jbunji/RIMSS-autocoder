import cfc.dao.EventDao;
import cfc.model.Event;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:EVENT" displayName="EventService" name="EventService" {

    variables.instance = {
        EventDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.EventDao = new EventDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* EVENT SERVICES */
	
	/* Create EVENT */
	public Event function createEvent(Event item) {
		/* Auto-generated method 
           Insert a new record in EVENT 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.EventDao.create(arguments.item);
        var qry = variables.instance.EventDao.readByRowId(local.idcol);
        var Event = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Event;
	}	
	
	/* Delete Event */
	public void function deleteEvent(string eventId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.EventDao.delete(arguments.eventId); 

		/* return success */
		return;
	}
	
	/* Get Event */
	public Event function getEvent(string eventId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.EventDao.read(arguments.eventId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update EVENT */
	public Event function updateEvent(Event item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update EVENT */
		variables.instance.EventDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count EVENT */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.EventDao.count(); 
	}

    /* generate new id sequence number from sequence nextval */
    public string function nextval() {
        return variables.instance.EventDao.nextval();
    }

    private Event function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Event object
        local.obj = new Event();
        local.obj.setEventId(arguments.resultSet.EVENT_ID[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setSource(arguments.resultSet.SOURCE[1]);
        local.obj.setSourceCat(arguments.resultSet.SOURCE_CAT[1]);
        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setWcCd(arguments.resultSet.WC_CD[1]);
        local.obj.setMaintTypeEe(arguments.resultSet.MAINT_TYPE_EE[1]);
        local.obj.setSquad(arguments.resultSet.SQUAD[1]);
        local.obj.setNonImds(arguments.resultSet.NON_IMDS[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setJobNo(arguments.resultSet.JOB_NO[1]);
        local.obj.setTailNo(arguments.resultSet.TAIL_NO[1]);
        local.obj.setDiscrepancy(arguments.resultSet.DISCREPANCY[1]);
        local.obj.setStartJob(arguments.resultSet.START_JOB[1]);
        local.obj.setStopJob(arguments.resultSet.STOP_JOB[1]);
        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[1]);
        local.obj.setPriority(arguments.resultSet.PRIORITY[1]);
        local.obj.setSymbol(arguments.resultSet.SYMBOL[1]);
        local.obj.setTctoId(arguments.resultSet.TCTO_ID[1]);
        local.obj.setImdsUserid(arguments.resultSet.IMDS_USERID[1]);
        local.obj.setEticDate(arguments.resultSet.ETIC_DATE[1]);
        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[1]);
        local.obj.setOldJob(arguments.resultSet.OLD_JOB[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setHowMal(arguments.resultSet.HOW_MAL[1]);
        local.obj.setLruInd(arguments.resultSet.LRU_IND[1]);
        local.obj.setSrd(arguments.resultSet.SRD[1]);
        local.obj.setPec(arguments.resultSet.PEC[1]);
        local.obj.setMti(arguments.resultSet.MTI[1]);
        local.obj.setEventType(arguments.resultSet.EVENT_TYPE[1]);
        local.obj.setSortieId(arguments.resultSet.SORTIE_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Event
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Event();
	        local.obj.setEventId(arguments.resultSet.EVENT_ID[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setSource(arguments.resultSet.SOURCE[local.row]);
	        local.obj.setSourceCat(arguments.resultSet.SOURCE_CAT[local.row]);
	        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setWcCd(arguments.resultSet.WC_CD[local.row]);
	        local.obj.setMaintTypeEe(arguments.resultSet.MAINT_TYPE_EE[local.row]);
	        local.obj.setSquad(arguments.resultSet.SQUAD[local.row]);
	        local.obj.setNonImds(arguments.resultSet.NON_IMDS[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setJobNo(arguments.resultSet.JOB_NO[local.row]);
	        local.obj.setTailNo(arguments.resultSet.TAIL_NO[local.row]);
	        local.obj.setDiscrepancy(arguments.resultSet.DISCREPANCY[local.row]);
	        local.obj.setStartJob(arguments.resultSet.START_JOB[local.row]);
	        local.obj.setStopJob(arguments.resultSet.STOP_JOB[local.row]);
	        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[local.row]);
	        local.obj.setPriority(arguments.resultSet.PRIORITY[local.row]);
	        local.obj.setSymbol(arguments.resultSet.SYMBOL[local.row]);
	        local.obj.setTctoId(arguments.resultSet.TCTO_ID[local.row]);
	        local.obj.setImdsUserid(arguments.resultSet.IMDS_USERID[local.row]);
	        local.obj.setEticDate(arguments.resultSet.ETIC_DATE[local.row]);
	        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[local.row]);
	        local.obj.setOldJob(arguments.resultSet.OLD_JOB[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setHowMal(arguments.resultSet.HOW_MAL[local.row]);
	        local.obj.setLruInd(arguments.resultSet.LRU_IND[local.row]);
	        local.obj.setSrd(arguments.resultSet.SRD[local.row]);
	        local.obj.setPec(arguments.resultSet.PEC[local.row]);
	        local.obj.setMti(arguments.resultSet.MTI[local.row]);
	        local.obj.setEventType(arguments.resultSet.EVENT_TYPE[local.row]);
	        local.obj.setSortieId(arguments.resultSet.SORTIE_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
