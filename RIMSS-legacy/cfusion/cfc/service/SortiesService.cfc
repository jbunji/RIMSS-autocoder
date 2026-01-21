import cfc.dao.SortiesDao;
import cfc.model.Sorties;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:SORTIES" displayName="SortiesService" name="SortiesService" {

    variables.instance = {
        SortiesDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.SortiesDao = new SortiesDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* SORTIES SERVICES */
	
	/* Create SORTIES */
	public Sorties function createSorties(Sorties item) {
		/* Auto-generated method 
           Insert a new record in SORTIES 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.SortiesDao.create(arguments.item);
        var qry = variables.instance.SortiesDao.readByRowId(local.idcol);
        var Sorties = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Sorties;
	}	
	
	/* Delete Sorties */
	public void function deleteSorties(string sortieId) {
		var local = {};
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.SortiesDao.delete(arguments.sortieId); 

		/* return success */
		return;
	}
	
	/* Get Sorties */
	public Sorties function getSorties(string sortieId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.SortiesDao.read(arguments.sortieId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update SORTIES */
	public Sorties function updateSorties(Sorties item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update SORTIES */
		variables.instance.SortiesDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count SORTIES */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.SortiesDao.count(); 
	}

    private Sorties function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Sorties object
        local.obj = new Sorties();
        local.obj.setSortieId(arguments.resultSet.SORTIE_ID[1]);
        local.obj.setMissionId(arguments.resultSet.MISSION_ID[1]);
        local.obj.setSerno(arguments.resultSet.SERNO[1]);
        local.obj.setAcTailno(arguments.resultSet.AC_TAILNO[1]);
        local.obj.setSortieDate(arguments.resultSet.SORTIE_DATE[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setSortieEffect(arguments.resultSet.SORTIE_EFFECT[1]);
        local.obj.setAcStation(arguments.resultSet.AC_STATION[1]);
        local.obj.setAcType(arguments.resultSet.AC_TYPE[1]);
        local.obj.setCurrentUnit(arguments.resultSet.CURRENT_UNIT[1]);
        local.obj.setAssignedUnit(arguments.resultSet.ASSIGNED_UNIT[1]);
        local.obj.setRange(arguments.resultSet.RANGE[1]);
        local.obj.setReason(arguments.resultSet.REASON[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setSourceData(arguments.resultSet.SOURCE_DATA[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        
        local.obj.setIsNonPodded(arguments.resultSet.IS_NON_PODDED[1]);
        local.obj.setIsDebrief(arguments.resultSet.IS_DEBRIEF[1]);
        local.obj.setIsLiveMonitor(arguments.resultSet.IS_LIVE_MONITOR[1]);
		
        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Sorties
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Sorties();
	        local.obj.setSortieId(arguments.resultSet.SORTIE_ID[local.row]);
	        local.obj.setMissionId(arguments.resultSet.MISSION_ID[local.row]);
	        local.obj.setSerno(arguments.resultSet.SERNO[local.row]);
	        local.obj.setAcTailno(arguments.resultSet.AC_TAILNO[local.row]);
	        local.obj.setSortieDate(arguments.resultSet.SORTIE_DATE[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setSortieEffect(arguments.resultSet.SORTIE_EFFECT[local.row]);
	        local.obj.setAcStation(arguments.resultSet.AC_STATION[local.row]);
	        local.obj.setAcType(arguments.resultSet.AC_TYPE[local.row]);
	        local.obj.setCurrentUnit(arguments.resultSet.CURRENT_UNIT[local.row]);
	        local.obj.setAssignedUnit(arguments.resultSet.ASSIGNED_UNIT[local.row]);
	        local.obj.setRange(arguments.resultSet.RANGE[local.row]);
	        local.obj.setReason(arguments.resultSet.REASON[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setSourceData(arguments.resultSet.SOURCE_DATA[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        
	        local.obj.setIsNonPodded(arguments.resultSet.IS_NON_PODDED[local.row]);
	        local.obj.setIsDebrief(arguments.resultSet.IS_DEBRIEF[local.row]);
	        local.obj.setIsLiveMonitor(arguments.resultSet.IS_LIVE_MONITOR[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
