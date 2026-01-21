import cfc.dao.PartListDao;
import cfc.model.PartList;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:PART_LIST" displayName="PartListService" name="PartListService" {

    variables.instance = {
        PartListDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.PartListDao = new PartListDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* PARTLIST SERVICES */
	
	/* Create PART_LIST */
	public PartList function createPartList(PartList item) {
		/* Auto-generated method 
           Insert a new record in PART_LIST 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.PartListDao.create(arguments.item);
        var qry = variables.instance.PartListDao.readByRowId(local.idcol);
        var PartList = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.PartList;
	}	
	
	/* Delete PartList */
	public void function deletePartList(string partnoId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.PartListDao.delete(arguments.partnoId); 

		/* return success */
		return;
	}
	
	/* Get PartList */
	public PartList function getPartList(string partnoId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.PartListDao.read(arguments.partnoId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update PART_LIST */
	public PartList function updatePartList(PartList item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update PART_LIST */
		variables.instance.PartListDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count PART_LIST */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.PartListDao.count(); 
	}

    private PartList function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into PartList object
        local.obj = new PartList();
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setPartno(arguments.resultSet.PARTNO[1]);
        local.obj.setSysType(arguments.resultSet.SYS_TYPE[1]);
        local.obj.setPgmId(arguments.resultSet.PGM_ID[1]);
        local.obj.setNoun(arguments.resultSet.NOUN[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setSnTracked(arguments.resultSet.SN_TRACKED[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setMdsCd(arguments.resultSet.MDS_CD[1]);
        local.obj.setVersion(arguments.resultSet.VERSION[1]);
        local.obj.setNsn(arguments.resultSet.NSN[1]);
        local.obj.setCage(arguments.resultSet.CAGE[1]);
        local.obj.setNhaId(arguments.resultSet.NHA_ID[1]);
        local.obj.setConfig(arguments.resultSet.CONFIG[1]);
        local.obj.setUnitPrice(arguments.resultSet.UNIT_PRICE[1]);
        local.obj.setCtSysId(arguments.resultSet.CT_SYS_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setErrc(arguments.resultSet.ERRC[1]);
        local.obj.setLsruFlag(arguments.resultSet.LSRU_FLAG[1]);
        local.obj.setExchCost(arguments.resultSet.EXCH_COST[1]);
        local.obj.setLocIdr(arguments.resultSet.LOC_IDR[1]);
        local.obj.setMSL(arguments.resultSet.MSL[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of PartList
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new PartList();
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setPartno(arguments.resultSet.PARTNO[local.row]);
	        local.obj.setSysType(arguments.resultSet.SYS_TYPE[local.row]);
	        local.obj.setPgmId(arguments.resultSet.PGM_ID[local.row]);
	        local.obj.setNoun(arguments.resultSet.NOUN[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setSnTracked(arguments.resultSet.SN_TRACKED[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setMdsCd(arguments.resultSet.MDS_CD[local.row]);
	        local.obj.setVersion(arguments.resultSet.VERSION[local.row]);
	        local.obj.setNsn(arguments.resultSet.NSN[local.row]);
	        local.obj.setCage(arguments.resultSet.CAGE[local.row]);
	        local.obj.setNhaId(arguments.resultSet.NHA_ID[local.row]);
	        local.obj.setConfig(arguments.resultSet.CONFIG[local.row]);
	        local.obj.setUnitPrice(arguments.resultSet.UNIT_PRICE[local.row]);
	        local.obj.setCtSysId(arguments.resultSet.CT_SYS_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setErrc(arguments.resultSet.ERRC[local.row]);
	        local.obj.setLsruFlag(arguments.resultSet.LSRU_FLAG[local.row]);
	        local.obj.setExchCost(arguments.resultSet.EXCH_COST[local.row]);
	        local.obj.setLocIdr(arguments.resultSet.LOC_IDR[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
