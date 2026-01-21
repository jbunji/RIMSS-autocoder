import cfc.dao.LaborBitPcDao;
import cfc.model.LaborBitPc;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:LABOR_BIT_PC" displayName="LaborBitPcService" name="LaborBitPcService" {

    variables.instance = {
        LaborBitPcDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.LaborBitPcDao = new LaborBitPcDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* LABORBITPC SERVICES */
	
	/* Create LABOR_BIT_PC */
	public LaborBitPc function createLaborBitPc(LaborBitPc item) {
		/* Auto-generated method 
           Insert a new record in LABOR_BIT_PC 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.LaborBitPcDao.create(arguments.item);
        var qry = variables.instance.LaborBitPcDao.readByRowId(local.idcol);
        var LaborBitPc = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.LaborBitPc;
	}	
	
	/* Delete LaborBitPc */
	public void function deleteLaborBitPc(string laborBitId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.LaborBitPcDao.delete(arguments.laborBitId); 

		/* return success */
		return;
	}
	
	/* Get LaborBitPc */
	public LaborBitPc function getLaborBitPc(string laborBitId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.LaborBitPcDao.read(arguments.laborBitId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update LABOR_BIT_PC */
	public LaborBitPc function updateLaborBitPc(LaborBitPc item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update LABOR_BIT_PC */
		variables.instance.LaborBitPcDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count LABOR_BIT_PC */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.LaborBitPcDao.count(); 
	}

    private LaborBitPc function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into LaborBitPc object
        local.obj = new LaborBitPc();
        local.obj.setLaborBitId(arguments.resultSet.LABOR_BIT_ID[1]);
        local.obj.setLaborId(arguments.resultSet.LABOR_ID[1]);
        local.obj.setBitPartno(arguments.resultSet.BIT_PARTNO[1]);
        local.obj.setBitName(arguments.resultSet.BIT_NAME[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[1]);
        local.obj.setBitSeq(arguments.resultSet.BIT_SEQ[1]);
        local.obj.setBitWuc(arguments.resultSet.BIT_WUC[1]);
        local.obj.setHowMal(arguments.resultSet.HOW_MAL[1]);
        local.obj.setBitQty(arguments.resultSet.BIT_QTY[1]);
        local.obj.setFsc(arguments.resultSet.FSC[1]);
        local.obj.setBitDelete(arguments.resultSet.BIT_DELETE[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of LaborBitPc
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new LaborBitPc();
	        local.obj.setLaborBitId(arguments.resultSet.LABOR_BIT_ID[local.row]);
	        local.obj.setLaborId(arguments.resultSet.LABOR_ID[local.row]);
	        local.obj.setBitPartno(arguments.resultSet.BIT_PARTNO[local.row]);
	        local.obj.setBitName(arguments.resultSet.BIT_NAME[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSentImds(arguments.resultSet.SENT_IMDS[local.row]);
	        local.obj.setBitSeq(arguments.resultSet.BIT_SEQ[local.row]);
	        local.obj.setBitWuc(arguments.resultSet.BIT_WUC[local.row]);
	        local.obj.setHowMal(arguments.resultSet.HOW_MAL[local.row]);
	        local.obj.setBitQty(arguments.resultSet.BIT_QTY[local.row]);
	        local.obj.setFsc(arguments.resultSet.FSC[local.row]);
	        local.obj.setBitDelete(arguments.resultSet.BIT_DELETE[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
