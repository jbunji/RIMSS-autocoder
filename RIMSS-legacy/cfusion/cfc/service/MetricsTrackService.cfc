import cfc.dao.MetricsTrackDao;
import cfc.model.MetricsTrack;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:METRICS_TRACK" displayName="MetricsTrackService" name="MetricsTrackService" {

    variables.instance = {
        MetricsTrackDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.MetricsTrackDao = new MetricsTrackDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* METRICSTRACK SERVICES */
	
	/* Create METRICS_TRACK */
	public MetricsTrack function createMetricsTrack(MetricsTrack item) {
		/* Auto-generated method 
           Insert a new record in METRICS_TRACK 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.MetricsTrackDao.create(arguments.item);
        var qry = variables.instance.MetricsTrackDao.readByRowId(local.idcol);
        var MetricsTrack = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.MetricsTrack;
	}	
	
	/* Delete MetricsTrack */
	public void function deleteMetricsTrack(string trackId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.MetricsTrackDao.delete(arguments.trackId); 

		/* return success */
		return;
	}
	
	/* Get MetricsTrack */
	public MetricsTrack function getMetricsTrack(string trackId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.MetricsTrackDao.read(arguments.trackId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update METRICS_TRACK */
	public MetricsTrack function updateMetricsTrack(MetricsTrack item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update METRICS_TRACK */
		variables.instance.MetricsTrackDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count METRICS_TRACK */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.MetricsTrackDao.count(); 
	}

    private MetricsTrack function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into MetricsTrack object
        local.obj = new MetricsTrack();
        local.obj.setTrackId(arguments.resultSet.TRACK_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setVetType(arguments.resultSet.VET_TYPE[1]);
        local.obj.setVetStatus(arguments.resultSet.VET_STATUS[1]);
        local.obj.setTypeFail(arguments.resultSet.TYPE_FAIL[1]);
        local.obj.setVetDate(arguments.resultSet.VET_DATE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of MetricsTrack
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new MetricsTrack();
	        local.obj.setTrackId(arguments.resultSet.TRACK_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        local.obj.setVetType(arguments.resultSet.VET_TYPE[local.row]);
	        local.obj.setVetStatus(arguments.resultSet.VET_STATUS[local.row]);
	        local.obj.setTypeFail(arguments.resultSet.TYPE_FAIL[local.row]);
	        local.obj.setVetDate(arguments.resultSet.VET_DATE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
