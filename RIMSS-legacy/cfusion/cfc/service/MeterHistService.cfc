import cfc.dao.MeterHistDao;
import cfc.model.MeterHist;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:METER_HIST" displayName="MeterHistService" name="MeterHistService" {

    variables.instance = {
        MeterHistDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.MeterHistDao = new MeterHistDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* METERHIST SERVICES */
	
	/* Create METER_HIST */
	public MeterHist function createMeterHist(MeterHist item) {
		/* Auto-generated method 
           Insert a new record in METER_HIST 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.MeterHistDao.create(arguments.item);
        var qry = variables.instance.MeterHistDao.readByRowId(local.idcol);
        var MeterHist = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.MeterHist;
	}	
	
	/* Delete MeterHist */
	public void function deleteMeterHist(string meterId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.MeterHistDao.delete(arguments.meterId); 

		/* return success */
		return;
	}
	
	/* Get MeterHist */
	public MeterHist function getMeterHist(string meterId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        writeLog(file="RIMSS", text="MeterHistService.cfc - getMeterHist - Enter (#arguments.meterId#)");
        var qry = variables.instance.MeterHistDao.read(arguments.meterId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		writeLog(file="RIMSS", text="MeterHistService.cfc - getMeterHist - Exit (#arguments.meterId#)");
		return local.obj;
	}
	
	// MeterEventHist - Kevin Lovett
	public MeterHist function getMeterEventHist(string eventId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.MeterHistDao.readByEventId(arguments.eventId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	// MeterEvent Hist end
	
	/* Update METER_HIST */
	public MeterHist function updateMeterHist(MeterHist item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update METER_HIST */
		variables.instance.MeterHistDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count METER_HIST */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.MeterHistDao.count(); 
	}

    /* generate new id sequence number from sequence nextval */
    public string function nextval() {
        return variables.instance.MeterHistDao.nextval();
    }

    private MeterHist function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into MeterHist object
        local.obj = new MeterHist();
        local.obj.setMeterId(arguments.resultSet.METER_ID[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setMeterType(arguments.resultSet.METER_TYPE[1]);
        local.obj.setMeterAction(arguments.resultSet.METER_ACTION[1]);
        local.obj.setChanged(arguments.resultSet.CHANGED[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setMeterIn(arguments.resultSet.METER_IN[1]);
        local.obj.setMeterOut(arguments.resultSet.METER_OUT[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setSeqNum(arguments.resultSet.SEQ_NUM[1]);
        local.obj.setFailure(arguments.resultSet.FAILURE[1]);
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setEventId(arguments.resultSet.EVENT_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of MeterHist
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new MeterHist();
	        local.obj.setMeterId(arguments.resultSet.METER_ID[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setMeterType(arguments.resultSet.METER_TYPE[local.row]);
	        local.obj.setMeterAction(arguments.resultSet.METER_ACTION[local.row]);
	        local.obj.setChanged(arguments.resultSet.CHANGED[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setMeterIn(arguments.resultSet.METER_IN[local.row]);
	        local.obj.setMeterOut(arguments.resultSet.METER_OUT[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setSeqNum(arguments.resultSet.SEQ_NUM[local.row]);
	        local.obj.setFailure(arguments.resultSet.FAILURE[local.row]);
	        local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
	        local.obj.setEventId(arguments.resultSet.EVENT_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
