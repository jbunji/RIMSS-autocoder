import cfc.dao.TctoDao;
import cfc.model.Tcto;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:TCTO" displayName="TctoService" name="TctoService" {

    variables.instance = {
        TctoDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.TctoDao = new TctoDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* TCTO SERVICES */
	
	/* Create TCTO */
	public Tcto function createTcto(Tcto item) {
		/* Auto-generated method 
           Insert a new record in TCTO 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.TctoDao.create(arguments.item);
        var qry = variables.instance.TctoDao.readByRowId(local.idcol);
        var Tcto = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.Tcto;
	}	
	
	/* Delete Tcto */
	public void function deleteTcto(string tctoId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.TctoDao.delete(arguments.tctoId); 

		/* return success */
		return;
	}
	
	/* Get Tcto */
	public Tcto function getTcto(string tctoId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.TctoDao.read(arguments.tctoId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update TCTO */
	public Tcto function updateTcto(Tcto item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update TCTO */
		variables.instance.TctoDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count TCTO */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.TctoDao.count(); 
	}

    private Tcto function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into Tcto object
        local.obj = new Tcto();
        local.obj.setTctoId(arguments.resultSet.TCTO_ID[1]);
        local.obj.setPgmId(arguments.resultSet.PGM_ID[1]);
        local.obj.setTctoNo(arguments.resultSet.TCTO_NO[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setSysType(arguments.resultSet.SYS_TYPE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setEffDate(arguments.resultSet.EFF_DATE[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setStationType(arguments.resultSet.STATION_TYPE[1]);
        local.obj.setTctoType(arguments.resultSet.TCTO_TYPE[1]);
        local.obj.setTctoCode(arguments.resultSet.TCTO_CODE[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setOldPartnoId(arguments.resultSet.OLD_PARTNO_ID[1]);
        local.obj.setNewPartnoId(arguments.resultSet.NEW_PARTNO_ID[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of Tcto
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new Tcto();
	        local.obj.setTctoId(arguments.resultSet.TCTO_ID[local.row]);
	        local.obj.setPgmId(arguments.resultSet.PGM_ID[local.row]);
	        local.obj.setTctoNo(arguments.resultSet.TCTO_NO[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setSysType(arguments.resultSet.SYS_TYPE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setEffDate(arguments.resultSet.EFF_DATE[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setStationType(arguments.resultSet.STATION_TYPE[local.row]);
	        local.obj.setTctoType(arguments.resultSet.TCTO_TYPE[local.row]);
	        local.obj.setTctoCode(arguments.resultSet.TCTO_CODE[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setOldPartnoId(arguments.resultSet.OLD_PARTNO_ID[local.row]);
	        local.obj.setNewPartnoId(arguments.resultSet.NEW_PARTNO_ID[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
