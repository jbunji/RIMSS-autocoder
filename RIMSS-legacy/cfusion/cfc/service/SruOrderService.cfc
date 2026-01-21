import cfc.dao.SruOrderDao;
import cfc.model.SruOrder;
import cfc.utils.Datasource;

component output="false" hint="CFBuilder-Generated:SRU_ORDER" displayName="SruOrderService" name="SruOrderService" {

    variables.instance = {
        SruOrderDao = ''
    };
	

	/* init */
	public function init(required Datasource datasource) {
        variables.instance.SruOrderDao = new SruOrderDao(arguments.datasource);
		/* return success */
		return this;
	}
	
	/* SRUORDER SERVICES */
	
	/* Create SRU_ORDER */
	public SruOrder function createSruOrder(SruOrder item) {
		/* Auto-generated method 
           Insert a new record in SRU_ORDER 
           Add authorization or any logical checks for secure access to your data */
        var idcol=variables.instance.SruOrderDao.create(arguments.item);
        var qry = variables.instance.SruOrderDao.readByRowId(local.idcol);
        var SruOrder = loadObjectFromQuery(local.qry); 

        /* return created item */
        return local.SruOrder;
	}	
	
	/* Delete SruOrder */
	public void function deleteSruOrder(string orderId) {
		/* Auto-generated method
           Delete a record in the database 
           Add authorization or any logical checks for secure access to your data */
				 
		variables.instance.SruOrderDao.delete(arguments.orderId); 

		/* return success */
		return;
	}
	
	/* Get SruOrder */
	public SruOrder function getSruOrder(string orderId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.SruOrderDao.read(arguments.orderId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	public SruOrder function getSruOrderbyRepairId(string repairId) {
		/* Auto-generated method
		   Retrieve a single record and return it as a query or array 
           Add authorization or any logical checks for secure access to your data */
        var qry = variables.instance.SruOrderDao.readByRepairId(arguments.repairId);
        var obj = loadObjectFromQuery(qry);  

		/* return item */
		return local.obj;
	}
	
	/* Update SRU_ORDER */
	public SruOrder function updateSruOrder(SruOrder item) {
		/* Auto-generated method
		   Update an existing record in the database 
           Add authorization or any logical checks for secure access to your data */

		/* update SRU_ORDER */
		variables.instance.SruOrderDao.update(arguments.item); 

		/* return success */
		return arguments.item;
	}	
	
	/* Count SRU_ORDER */
	public numeric function count() {
	    /* Auto-generated method
		   Return the number of items in your table 
           Add authorization or any logical checks for secure access to your data  */

		return variables.instance.SruOrderDao.count(); 
	}

    private SruOrder function loadObjectFromQuery (required Query resultSet) {
        var obj = '';

        //load query result into SruOrder object
        local.obj = new SruOrder();
        local.obj.setOrderId(arguments.resultSet.ORDER_ID[1]);
        local.obj.setActive(arguments.resultSet.ACTIVE[1]);
        local.obj.setInsBy(arguments.resultSet.INS_BY[1]);
        local.obj.setInsDate(arguments.resultSet.INS_DATE[1]);
        local.obj.setSruId(arguments.resultSet.SRU_ID[1]);
        local.obj.setEventId(arguments.resultSet.EVENT_ID[1]);
        local.obj.setDocNo(arguments.resultSet.DOC_NO[1]);
        local.obj.setOrderDate(arguments.resultSet.ORDER_DATE[1]);
        local.obj.setReceiveDate(arguments.resultSet.RECEIVE_DATE[1]);
        local.obj.setEsd(arguments.resultSet.ESD[1]);
        local.obj.setChgBy(arguments.resultSet.CHG_BY[1]);
        local.obj.setChgDate(arguments.resultSet.CHG_DATE[1]);
        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[1]);
        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[1]);
        local.obj.setOrderQty(arguments.resultSet.ORDER_QTY[1]);
        local.obj.setStatus(arguments.resultSet.STATUS[1]);
        local.obj.setMicap(arguments.resultSet.MICAP[1]);
        local.obj.setDeliveryDest(arguments.resultSet.DELIVERY_DEST[1]);
        local.obj.setDeliveryPriority(arguments.resultSet.DELIVERY_PRIORITY[1]);
        local.obj.setUjc(arguments.resultSet.UJC[1]);
        local.obj.setReceiver(arguments.resultSet.RECEIVER[1]);
        local.obj.setReceiveQty(arguments.resultSet.RECEIVE_QTY[1]);
        local.obj.setRemarks(arguments.resultSet.REMARKS[1]);
        local.obj.setWucCd(arguments.resultSet.WUC_CD[1]);
        local.obj.setLocId(arguments.resultSet.LOC_ID[1]);
        local.obj.setAssetId(arguments.resultSet.ASSET_ID[1]);
        local.obj.setAcknowledgeDate(arguments.resultSet.Acknowledge_Date[1]);
        local.obj.setFillDate(arguments.resultSet.Fill_Date[1]);
        local.obj.setReplSruShipDate(arguments.resultSet.Repl_Sru_Ship_Date[1]);
        local.obj.setReplSruRecvDate(arguments.resultSet.Repl_Sru_Recv_Date[1]);
        local.obj.setShipper(arguments.resultSet.shipper[1]);
        local.obj.setTCN(arguments.resultSet.tcn[1]);
        local.obj.setREMshipper(arguments.resultSet.REM_SHIPPER[1]);
        local.obj.setREMTCN(arguments.resultSet.REM_TCN[1]);
        local.obj.setREMSruShipDate(arguments.resultSet.REM_Sru_Ship_Date[1]);
        

        return local.obj;
    }

    private Array function loadObjectsFromQuery (required Query resultSet) {
        var objectArray = [];
        var obj = '';

        //load query results into an array of SruOrder
        for (var row = 1; row lte resultSet.recordCount; row += 1) {
	        local.obj = new SruOrder();
	        local.obj.setOrderId(arguments.resultSet.ORDER_ID[local.row]);
	        local.obj.setActive(arguments.resultSet.ACTIVE[local.row]);
	        local.obj.setInsBy(arguments.resultSet.INS_BY[local.row]);
	        local.obj.setInsDate(arguments.resultSet.INS_DATE[local.row]);
	        local.obj.setSruId(arguments.resultSet.SRU_ID[local.row]);
	        local.obj.setEventId(arguments.resultSet.EVENT_ID[local.row]);
	        local.obj.setDocNo(arguments.resultSet.DOC_NO[local.row]);
	        local.obj.setOrderDate(arguments.resultSet.ORDER_DATE[local.row]);
	        local.obj.setReceiveDate(arguments.resultSet.RECEIVE_DATE[local.row]);
	        local.obj.setEsd(arguments.resultSet.ESD[local.row]);
	        local.obj.setChgBy(arguments.resultSet.CHG_BY[local.row]);
	        local.obj.setChgDate(arguments.resultSet.CHG_DATE[local.row]);
	        local.obj.setRepairId(arguments.resultSet.REPAIR_ID[local.row]);
	        local.obj.setPartnoId(arguments.resultSet.PARTNO_ID[local.row]);
	        local.obj.setOrderQty(arguments.resultSet.ORDER_QTY[local.row]);
	        local.obj.setStatus(arguments.resultSet.STATUS[local.row]);
	        local.obj.setMicap(arguments.resultSet.MICAP[local.row]);
	        local.obj.setDeliveryDest(arguments.resultSet.DELIVERY_DEST[local.row]);
	        local.obj.setDeliveryPriority(arguments.resultSet.DELIVERY_PRIORITY[local.row]);
	        local.obj.setUjc(arguments.resultSet.UJC[local.row]);
	        local.obj.setReceiver(arguments.resultSet.RECEIVER[local.row]);
	        local.obj.setReceiveQty(arguments.resultSet.RECEIVE_QTY[local.row]);
	        local.obj.setRemarks(arguments.resultSet.REMARKS[local.row]);
	        local.obj.setWucCd(arguments.resultSet.WUC_CD[local.row]);
	        local.obj.setLocId(arguments.resultSet.LOC_ID[local.row]);
        	local.obj.setAssetId(arguments.resultSet.ASSET_ID[local.row]);
        	local.obj.setAcknowledgeDate(arguments.resultSet.Acknowledge_Date[local.row]);
        	local.obj.setFillDate(arguments.resultSet.Fill_Date[local.row]);
        	local.obj.setReplSruShipDate(arguments.resultSet.Repl_Sru_Ship_Date[local.row]);
        	local.obj.setReplSruRecvDate(arguments.resultSet.Repl_Sru_Recv_Date[local.row]);
	        local.obj.setShipper(arguments.resultSet.shipper[local.row]);
	        local.obj.setTCN(arguments.resultSet.tcn[local.row]);  
	        local.obj.setREMshipper(arguments.resultSet.REM_shipper[local.row]); 
	        local.obj.setREMTCN(arguments.resultSet.REM_TCN[local.row]); 
	        local.obj.setREMSruShipDate(arguments.resultSet.REM_Sru_Ship_Date[local.row]);    	
	        
            ArrayAppend(local.objectArray, local.obj);
        }

        return local.objectArray;
    }
}
