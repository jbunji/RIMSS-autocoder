import cfc.dao.CfgMetersDao;
import cfc.model.CfgMeters;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-GeneratedcfG_METERS" displayName="CfgMetersService" name="CfgMetersService" {

    variables.instance = {
        CfgMetersDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.CfgMetersDao = new CfgMetersDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* CFGMETERS SERVICES */
	
	/* Create CFG_METERS */
	public CfgMeters function createCfgMeters(CfgMeters item) {
		/* Auto-generated method 
           Insert a new record in CFG_METERS 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.CfgMetersDao.create(arguments.item);
        var qry = variables.instance.CfgMetersDao.readByRowId(local.idcol);
        var CfgMeters = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.CfgMeters;
	}	
	
	/* Delete CfgMeters */
	public void function deleteCfgMeters() {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.CfgMetersDao.delete(); 

		/* return success */
		return;
	}
	
	public void function deleteEventMeter(assetId, eventId) {
		variables.instance.CfgMetersDao.deleteMeterEvent(arguments.assetId, arguments.eventId); 
		return;
	}
	
	/* Get CfgMeters */
	public CfgMeters function getCfgMeters(String eventId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.CfgMetersDao.read(arguments.eventId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Get CfgMetersCurrReading */
	public CfgMeters function getCfgMetersCurrentMeter(String assetId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
           writeLog(file="cfgmetersservice" text="getCfgMetersCurrentMeter - #arguments.assetId#");
        var qry = variables.instance.CfgMetersDao.readByCurrentMeter(arguments.assetId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update CFG_METERS */
	public CfgMeters function updateCfgMeters(CfgMeters item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update CFG_METERS */
		variables.instance.CfgMetersDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count CFG_METERS */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.CfgMetersDao.count(); 
	}

    private CfgMeters function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into CfgMeters object
        local.obj = new CfgMeters();
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setEventId(arguments.resultSet.EVENT_ID[1]);
        local.obj.setMeterType(arguments.resultSet.METER_TYPE[1]);
        local.obj.setValueIn(arguments.resultSet.VALUE_IN[1]);
        local.obj.setValueOut(arguments.resultSet.VALUE_OUT[1]);
        local.obj.setIsMeterChg(arguments.resultSet.IS_METER_CHG[1]);
        local.obj.setMeterSeq(arguments.resultSet.METER_SEQ[1]);
        local.obj.setOperHrs(arguments.resultSet.OPER_HRS[1]);
        local.obj.setBenchHrs(arguments.resultSet.BENCH_HRS[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        local.obj.setSourceTable(arguments.resultSet.SOURCE_TABLE[1]);
        local.obj.setSourceDummyPk(arguments.resultSet.SOURCE_DUMMY_PK[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setIsValid(arguments.resultSet.IS_VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[1]);
        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of CfgMeters
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new CfgMeters();
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setEventId(arguments.resultSet.EVENT_ID[local.row]);
	        local.obj.setMeterType(arguments.resultSet.METER_TYPE[local.row]);
	        local.obj.setValueIn(arguments.resultSet.VALUE_IN[local.row]);
	        local.obj.setValueOut(arguments.resultSet.VALUE_OUT[local.row]);
	        local.obj.setIsMeterChg(arguments.resultSet.IS_METER_CHG[local.row]);
	        local.obj.setMeterSeq(arguments.resultSet.METER_SEQ[local.row]);
	        local.obj.setOperHrs(arguments.resultSet.OPER_HRS[local.row]);
	        local.obj.setBenchHrs(arguments.resultSet.BENCH_HRS[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        local.obj.setSourceTable(arguments.resultSet.SOURCE_TABLE[local.row]);
	        local.obj.setSourceDummyPk(arguments.resultSet.SOURCE_DUMMY_PK[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setIsValid(arguments.resultSet.IS_VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setCreateDate(arguments.resultSet.CREATE_DATE[local.row]);
	        local.obj.setCreatedBy(arguments.resultSet.CREATED_BY[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
