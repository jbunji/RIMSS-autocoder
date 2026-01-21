import cfc.dao.RepairDao;
import cfc.model.Repair;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:REPAIR" displayName="RepairService" name="RepairService" {

    variables.instance = {
        RepairDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.RepairDao = new RepairDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* REPAIR SERVICES */
	
	/* Create REPAIR */
	public Repair function createRepair(Repair item) {
		/* Auto-generated method 
           Insert a new record in REPAIR 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.RepairDao.create(arguments.item);
        var qry = variables.instance.RepairDao.readByRowId(local.idcol);
        var Repair = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Repair;
	}	
	
	/* Delete Repair */
	public void function deleteRepair(string repairId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.RepairDao.delete(arguments.repairId); 

		/* return success */
		return;
	}
	
	/* Get Repair */
	public Repair function getRepair(string repairId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.RepairDao.read(arguments.repairId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update REPAIR */
	public Repair function updateRepair(Repair item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update REPAIR */		
		variables.instance.RepairDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count REPAIR */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.RepairDao.count(); 
	}

    private Repair function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Repair object
        local.obj = new Repair();
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setRepairSeq(arguments.resultSet.REPAIR_SEQ[1]);
        local.obj.setEventId(arguments.resultSet.EVENT_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setMicap(arguments.resultSet.MICAP[1]);
        local.obj.setMicapLogin(arguments.resultSet.MICAP_LOGIN[1]);
        local.obj.setDamage(arguments.resultSet.DAMAGE[1]);
        local.obj.setChiefReview(arguments.resultSet.CHIEF_REVIEW[1]);
        local.obj.setSuperReview(arguments.resultSet.SUPER_REVIEW[1]);
        local.obj.setEtiChange(arguments.resultSet.ETI_CHANGE[1]);
        local.obj.setRepeatRecur(arguments.resultSet.REPEAT_RECUR[1]);
        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setTypeMaint(arguments.resultSet.TYPE_MAINT[1]);
        local.obj.setPwc(arguments.resultSet.PWC[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setHowMal(arguments.resultSet.HOW_MAL[1]);
        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[1]);
        local.obj.setShopStatus(arguments.resultSet.SHOP_STATUS[1]);
        local.obj.setSrdCd(arguments.resultSet.SRD_CD[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setNarrative(arguments.resultSet.NARRATIVE[1]);
        local.obj.setStartDate(arguments.resultSet.START_DATE[1]);
        local.obj.setStopDate(arguments.resultSet.STOP_DATE[1]);
        local.obj.setEticDate(arguments.resultSet.ETIC_DATE[1]);
        local.obj.setRecvDate(arguments.resultSet.RECV_DATE[1]);
        local.obj.setTagNo(arguments.resultSet.TAG_NO[1]);
        local.obj.setDocNo(arguments.resultSet.DOC_NO[1]);
        local.obj.setSymbol(arguments.resultSet.SYMBOL[1]);
        local.obj.setEquipId(arguments.resultSet.EQUIP_ID[1]);
        local.obj.setFsc(arguments.resultSet.FSC[1]);
        local.obj.setEtiIn(arguments.resultSet.ETI_IN[1]);
        local.obj.setEtiOut(arguments.resultSet.ETI_OUT[1]);
        local.obj.setEtiDelta(arguments.resultSet.ETI_DELTA[1]);
        local.obj.setEtiDeltaNonCnd(arguments.resultSet.ETI_DELTA_NON_CND[1]);
        local.obj.setDeferStatus(arguments.resultSet.DEFER_STATUS[1]);
        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[1]);
        local.obj.setOldJob(arguments.resultSet.OLD_JOB[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[1]);
        local.obj.setJobType(arguments.resultSet.JOB_TYPE[1]);
        local.obj.setStationType(arguments.resultSet.STATION_TYPE[1]);
        local.obj.setJstId(arguments.resultSet.JST_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Repair
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Repair();
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        local.obj.setRepairSeq(arguments.resultSet.REPAIR_SEQ[local.row]);
	        local.obj.setEventId(arguments.resultSet.EVENT_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setMicap(arguments.resultSet.MICAP[local.row]);
	        local.obj.setMicapLogin(arguments.resultSet.MICAP_LOGIN[local.row]);
	        local.obj.setDamage(arguments.resultSet.DAMAGE[local.row]);
	        local.obj.setChiefReview(arguments.resultSet.CHIEF_REVIEW[local.row]);
	        local.obj.setSuperReview(arguments.resultSet.SUPER_REVIEW[local.row]);
	        local.obj.setEtiChange(arguments.resultSet.ETI_CHANGE[local.row]);
	        local.obj.setRepeatRecur(arguments.resultSet.REPEAT_RECUR[local.row]);
	        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setTypeMaint(arguments.resultSet.TYPE_MAINT[local.row]);
	        local.obj.setPwc(arguments.resultSet.PWC[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setHowMal(arguments.resultSet.HOW_MAL[local.row]);
	        local.obj.setWhenDisc(arguments.resultSet.WHEN_DISC[local.row]);
	        local.obj.setShopStatus(arguments.resultSet.SHOP_STATUS[local.row]);
	        local.obj.setSrdCd(arguments.resultSet.SRD_CD[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setNarrative(arguments.resultSet.NARRATIVE[local.row]);
	        local.obj.setStartDate(arguments.resultSet.START_DATE[local.row]);
	        local.obj.setStopDate(arguments.resultSet.STOP_DATE[local.row]);
	        local.obj.setEticDate(arguments.resultSet.ETIC_DATE[local.row]);
	        local.obj.setRecvDate(arguments.resultSet.RECV_DATE[local.row]);
	        local.obj.setTagNo(arguments.resultSet.TAG_NO[local.row]);
	        local.obj.setDocNo(arguments.resultSet.DOC_NO[local.row]);
	        local.obj.setSymbol(arguments.resultSet.SYMBOL[local.row]);
	        local.obj.setEquipId(arguments.resultSet.EQUIP_ID[local.row]);
	        local.obj.setFsc(arguments.resultSet.FSC[local.row]);
	        local.obj.setEtiIn(arguments.resultSet.ETI_IN[local.row]);
	        local.obj.setEtiOut(arguments.resultSet.ETI_OUT[local.row]);
	        local.obj.setEtiDelta(arguments.resultSet.ETI_DELTA[local.row]);
	        local.obj.setEtiDeltaNonCnd(arguments.resultSet.ETI_DELTA_NON_CND[local.row]);
	        local.obj.setDeferStatus(arguments.resultSet.DEFER_STATUS[local.row]);
	        local.obj.setEditFlag(arguments.resultSet.EDIT_FLAG[local.row]);
	        local.obj.setOldJob(arguments.resultSet.OLD_JOB[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setLegacyPk(arguments.resultSet.LEGACY_PK[local.row]);
	        local.obj.setJobType(arguments.resultSet.JOB_TYPE[local.row]);
	        local.obj.setStationType(arguments.resultSet.STATION_TYPE[local.row]);
	        local.obj.setJstId(arguments.resultSet.JST_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
