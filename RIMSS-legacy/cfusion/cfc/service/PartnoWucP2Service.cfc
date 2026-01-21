import cfc.dao.PartnoWucP2Dao;
import cfc.model.PartnoWucP2;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:PARTNO_WUC_P2" displayName="PartnoWucP2Service" name="PartnoWucP2Service" {

    variables.instance = {
        PartnoWucP2Dao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.PartnoWucP2Dao = new PartnoWucP2Dao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* PARTNOWUCP2 SERVICES */
	
	/* Create PARTNO_WUC_P2 */
	public PartnoWucP2 function createPartnoWucP2(PartnoWucP2 item) {
		/* Auto-generated method 
           Insert a new record in PARTNO_WUC_P2 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.PartnoWucP2Dao.create(arguments.item);
        var qry = variables.instance.PartnoWucP2Dao.readByRowId(local.idcol);
        var PartnoWucP2 = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.PartnoWucP2;
	}	
	
	/* Delete PartnoWucP2 */
	public void function deletePartnoWucP2(string pnWucId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.PartnoWucP2Dao.delete(arguments.pnWucId); 

		/* return success */
		return;
	}
	
	/* Get PartnoWucP2 */
	public PartnoWucP2 function getPartnoWucP2(string pnWucId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.PartnoWucP2Dao.read(arguments.pnWucId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update PARTNO_WUC_P2 */
	public PartnoWucP2 function updatePartnoWucP2(PartnoWucP2 item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update PARTNO_WUC_P2 */
		variables.instance.PartnoWucP2Dao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count PARTNO_WUC_P2 */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.PartnoWucP2Dao.count(); 
	}

    private PartnoWucP2 function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into PartnoWucP2 object
        local.obj = new PartnoWucP2();
        local.obj.setPnWucId(arguments.resultSet.PN_WUC_ID[1]);
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setSysId(arguments.resultSet.SYS_ID[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setTwoLevel(arguments.resultSet.TWO_LEVEL[1]);
        local.obj.setEtiMeter(arguments.resultSet.ETI_METER[1]);
        local.obj.setGoldFlag(arguments.resultSet.GOLD_FLAG[1]);
        local.obj.setClassified(arguments.resultSet.CLASSIFIED[1]);
        local.obj.setNocFlag(arguments.resultSet.NOC_FLAG[1]);
        local.obj.setStationType(arguments.resultSet.STATION_TYPE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setIpbTo(arguments.resultSet.IPB_TO[1]);
        local.obj.setFigure(arguments.resultSet.FIGURE[1]);
        local.obj.setFigureIndex(arguments.resultSet.FIGURE_INDEX[1]);
        local.obj.setRefdes(arguments.resultSet.REFDES[1]);
        local.obj.setNhaId(arguments.resultSet.NHA_ID[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setNhaWucCd(arguments.resultSet.NHA_WUC_CD[1]);
        local.obj.setValid(arguments.resultSet.VALID[1]);
        local.obj.setValBy(arguments.resultSet.VAL_BY[1]);
        local.obj.setValDate(arguments.resultSet.VAL_DATE[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of PartnoWucP2
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new PartnoWucP2();
	        local.obj.setPnWucId(arguments.resultSet.PN_WUC_ID[local.row]);
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setSysId(arguments.resultSet.SYS_ID[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setTwoLevel(arguments.resultSet.TWO_LEVEL[local.row]);
	        local.obj.setEtiMeter(arguments.resultSet.ETI_METER[local.row]);
	        local.obj.setGoldFlag(arguments.resultSet.GOLD_FLAG[local.row]);
	        local.obj.setClassified(arguments.resultSet.CLASSIFIED[local.row]);
	        local.obj.setNocFlag(arguments.resultSet.NOC_FLAG[local.row]);
	        local.obj.setStationType(arguments.resultSet.STATION_TYPE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setIpbTo(arguments.resultSet.IPB_TO[local.row]);
	        local.obj.setFigure(arguments.resultSet.FIGURE[local.row]);
	        local.obj.setFigureIndex(arguments.resultSet.FIGURE_INDEX[local.row]);
	        local.obj.setRefdes(arguments.resultSet.REFDES[local.row]);
	        local.obj.setNhaId(arguments.resultSet.NHA_ID[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setNhaWucCd(arguments.resultSet.NHA_WUC_CD[local.row]);
	        local.obj.setValid(arguments.resultSet.VALID[local.row]);
	        local.obj.setValBy(arguments.resultSet.VAL_BY[local.row]);
	        local.obj.setValDate(arguments.resultSet.VAL_DATE[local.row]);
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
