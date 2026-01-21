import cfc.dao.LocationDao;
import cfc.model.Location;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LOCATION" displayName="LocationService" name="LocationService" {

    variables.instance = {
        LocationDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LocationDao = new LocationDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LOCATION SERVICES */
	
	/* Create LOCATION */
	public Location function createLocation(Location item) {
		/* Auto-generated method 
           Insert a new record in LOCATION 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LocationDao.create(arguments.item);
        var qry = variables.instance.LocationDao.readByRowId(local.idcol);
        var Location = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Location;
	}	
	
	/* Delete Location */
	public void function deleteLocation(string locId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LocationDao.delete(arguments.locId); 

		/* return success */
		return;
	}
	
	/* Get Location */
	public Location function getLocation(string locId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LocationDao.read(arguments.locId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LOCATION */
	public Location function updateLocation(Location item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LOCATION */
		variables.instance.LocationDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LOCATION */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LocationDao.count(); 
	}


    public Location[] function getLocationsByUnitCode(required string unitCode) {
        var qry = variables.instance.LocationDao.getLocationsByUnitCode(arguments.unitCode);
        var obj = loadObjectsFromQuery(qry);  

        /* return item */
        return local.obj;
    }

    public Location function getLocationBySiteUnitCode(required string siteCode, required string unitCode) {
        var qry = variables.instance.LocationDao.getLocationBySiteUnitCode(arguments.siteCode, arguments.unitCode);
        var obj = loadObjectFromQuery(qry);  

        /* return item */
        return local.obj;
    }

    public String function getLocIdValueListByUnitCode(required string unitCode) {
        var qry = variables.instance.LocationDao.getLocIdValueListByUnitCode(arguments.unitCode);
        var resultValueList = '';
        local.resultValueList = ValueList(local.qry.LOC_ID);
        return local.resultValueList;
    }

    private Location function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Location object
        local.obj = new Location();
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setMajcomCd(arguments.resultSet.MAJCOM_CD[1]);
        local.obj.setSiteCd(arguments.resultSet.SITE_CD[1]);
        local.obj.setUnitCd(arguments.resultSet.UNIT_CD[1]);
        local.obj.setDescription(arguments.resultSet.DESCRIPTION[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSquadCd(arguments.resultSet.SQUAD_CD[1]);
        local.obj.setGeoloc(arguments.resultSet.GEOLOC[1]);
        local.obj.setDisplayName(arguments.resultSet.DISPLAY_NAME[1]);
        local.obj.setCtLocId(arguments.resultSet.CT_LOC_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Location
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Location();
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setMajcomCd(arguments.resultSet.MAJCOM_CD[local.row]);
	        local.obj.setSiteCd(arguments.resultSet.SITE_CD[local.row]);
	        local.obj.setUnitCd(arguments.resultSet.UNIT_CD[local.row]);
	        local.obj.setDescription(arguments.resultSet.DESCRIPTION[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSquadCd(arguments.resultSet.SQUAD_CD[local.row]);
	        local.obj.setGeoloc(arguments.resultSet.GEOLOC[local.row]);
	        local.obj.setDisplayName(arguments.resultSet.DISPLAY_NAME[local.row]);
	        local.obj.setCtLocId(arguments.resultSet.CT_LOC_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
