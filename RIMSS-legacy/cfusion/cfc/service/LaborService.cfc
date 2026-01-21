import cfc.dao.LaborDao;
import cfc.model.Labor;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LABOR" displayName="LaborService" name="LaborService" {

    variables.instance = {
        LaborDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LaborDao = new LaborDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LABOR SERVICES */
	
	/* Create LABOR */
	public Labor function createLabor(Labor item) {
		/* Auto-generated method 
           Insert a new record in LABOR 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LaborDao.create(arguments.item);
        var qry = variables.instance.LaborDao.readByRowId(local.idcol);
        var Labor = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Labor;
	}	
	
	/* Delete Labor */
	public void function deleteLabor(string laborId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LaborDao.delete(arguments.laborId); 

		/* return success */
		return;
	}
	
	/* Get Labor */
	public Labor function getLabor(string laborId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborDao.read(arguments.laborId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	public Labor function getLaborByRepairId (string repairId) {
		var qry = variables.instance.LaborDao.readByRepairId(arguments.repairId);
		var obj = loadObjectFromQuery(qry);
		
		return local.obj;
	}
	
	/* Update LABOR */
	public Labor function updateLabor(Labor item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LABOR */
		local.idcol = variables.instance.LaborDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LABOR */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LaborDao.count(); 
	}

    private Labor function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Labor object
        local.obj = new Labor();
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setLaborSeq(arguments.resultSet.LABOR_SEQ[1]);
        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setNewShopStatus(arguments.resultSet.NEW_SHOP_STATUS[1]);
        local.obj.setTypeMaint(arguments.resultSet.TYPE_MAINT[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setActionTaken(arguments.resultSet.ACTION_TAKEN[1]);
        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[1]);
        local.obj.setHowMal(arguments.resultSet.HOW_MAL[1]);
        local.obj.setCatLabor(arguments.resultSet.CAT_LABOR[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setUnits(arguments.resultSet.UNITS[1]);
        local.obj.setStartDate(arguments.resultSet.START_DATE[1]);
        local.obj.setStopDate(arguments.resultSet.STOP_DATE[1]);
        local.obj.setCrewChief(arguments.resultSet.CREW_CHIEF[1]);
        local.obj.setCrewSize(arguments.resultSet.CREW_SIZE[1]);
        local.obj.setCorrective(arguments.resultSet.CORRECTIVE[1]);
        local.obj.setDiscrepancy(arguments.resultSet.DISCREPANCY[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setCorrectedBy(arguments.resultSet.CORRECTED_BY[1]);
        local.obj.setInspectedBy(arguments.resultSet.INSPECTED_BY[1]);
        local.obj.setHours(arguments.resultSet.HOURS[1]);
        local.obj.setLaborAction(arguments.resultSet.LABOR_ACTION[1]);
        local.obj.setStationId(arguments.resultSet.STATION_ID[1]);
        local.obj.setBitLog(arguments.resultSet.BIT_LOG[1]);
        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[1]);
        local.obj.setOmitWce(arguments.resultSet.OMIT_WCE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setDdrDocno(arguments.resultSet.DDR_DOCNO[1]);
        local.obj.setTimeOverrideFlag(arguments.resultSet.TIME_OVERRIDE_FLAG[1]);
        local.obj.setTestGrp(arguments.resultSet.TEST_GRP[1]);
        local.obj.setTestFailNo(arguments.resultSet.TEST_FAIL_NO[1]);
        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Labor
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Labor();
	        local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        local.obj.setLaborSeq(arguments.resultSet.LABOR_SEQ[local.row]);
	        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setNewShopStatus(arguments.resultSet.NEW_SHOP_STATUS[local.row]);
	        local.obj.setTypeMaint(arguments.resultSet.TYPE_MAINT[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setActionTaken(arguments.resultSet.ACTION_TAKEN[local.row]);
	        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[local.row]);
	        local.obj.setHowMal(arguments.resultSet.HOW_MAL[local.row]);
	        local.obj.setCatLabor(arguments.resultSet.CAT_LABOR[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setUnits(arguments.resultSet.UNITS[local.row]);
	        local.obj.setStartDate(arguments.resultSet.START_DATE[local.row]);
	        local.obj.setStopDate(arguments.resultSet.STOP_DATE[local.row]);
	        local.obj.setCrewChief(arguments.resultSet.CREW_CHIEF[local.row]);
	        local.obj.setCrewSize(arguments.resultSet.CREW_SIZE[local.row]);
	        local.obj.setCorrective(arguments.resultSet.CORRECTIVE[local.row]);
	        local.obj.setDiscrepancy(arguments.resultSet.DISCREPANCY[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setCorrectedBy(arguments.resultSet.CORRECTED_BY[local.row]);
	        local.obj.setInspectedBy(arguments.resultSet.INSPECTED_BY[local.row]);
	        local.obj.setHours(arguments.resultSet.HOURS[local.row]);
	        local.obj.setLaborAction(arguments.resultSet.LABOR_ACTION[local.row]);
	        local.obj.setStationId(arguments.resultSet.STATION_ID[local.row]);
	        local.obj.setBitLog(arguments.resultSet.BIT_LOG[local.row]);
	        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[local.row]);
	        local.obj.setOmitWce(arguments.resultSet.OMIT_WCE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setDdrDocno(arguments.resultSet.DDR_DOCNO[local.row]);
	        local.obj.setTimeOverrideFlag(arguments.resultSet.TIME_OVERRIDE_FLAG[local.row]);
	        local.obj.setTestGrp(arguments.resultSet.TEST_GRP[local.row]);
	        local.obj.setTestFailNo(arguments.resultSet.TEST_FAIL_NO[local.row]);
	        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
