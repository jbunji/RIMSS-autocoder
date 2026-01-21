import cfc.dao.PartnoCodeDao;
import cfc.model.PartnoCode;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:PARTNO_CODE" displayName="PartnoCodeService" name="PartnoCodeService" {

    variables.instance = {
        PartnoCodeDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.PartnoCodeDao = new PartnoCodeDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* PARTNOCODE SERVICES */
	
	/* Create PARTNO_CODE */
	public PartnoCode function createPartnoCode(PartnoCode item) {
		/* Auto-generated method 
           Insert a new record in PARTNO_CODE 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.PartnoCodeDao.create(arguments.item);
        var qry = variables.instance.PartnoCodeDao.readByRowId(local.idcol);
        var PartnoCode = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.PartnoCode;
	}	
	
	/* Delete PartnoCode */
	public void function deletePartnoCode(string pnCdId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.PartnoCodeDao.delete(arguments.pnCdId); 

		/* return success */
		return;
	}
	
	/* Get PartnoCode */
	public PartnoCode function getPartnoCode(string pnCdId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.PartnoCodeDao.read(arguments.pnCdId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update PARTNO_CODE */
	public PartnoCode function updatePartnoCode(PartnoCode item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update PARTNO_CODE */
		variables.instance.PartnoCodeDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count PARTNO_CODE */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.PartnoCodeDao.count(); 
	}

    public String function getPartnoIdAsValueListByProgram(required string program) {
        var qry = variables.instance.partnoCodeDao.getPartnoIdAsValueListByProgram(arguments.program);
        var resultValueList = '';
        local.resultValueList = ValueList(local.qry.PARTNO_ID);
        return local.resultValueList;
    }

    private PartnoCode function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into PartnoCode object
        local.obj = new PartnoCode();
        local.obj.setPnCdId(arguments.resultSet.PN_CD_ID[1]);
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setCodeId(arguments.resultSet.CODE_ID[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[1]);
        local.obj.setStationType(arguments.resultSet.STATION_TYPE[1]);
        local.obj.setContracted(arguments.resultSet.CONTRACTED[1]);
        local.obj.setPriorityFlag(arguments.resultSet.PRIORITY_FLAG[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of PartnoCode
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new PartnoCode();
	        local.obj.setPnCdId(arguments.resultSet.PN_CD_ID[local.row]);
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setCodeId(arguments.resultSet.CODE_ID[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setGroupCd(arguments.resultSet.GROUP_CD[local.row]);
	        local.obj.setStationType(arguments.resultSet.STATION_TYPE[local.row]);
	        local.obj.setContracted(arguments.resultSet.CONTRACTED[local.row]);
	        local.obj.setPriorityFlag(arguments.resultSet.PRIORITY_FLAG[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
