import cfc.model.SruOrder;
import cfc.utils.Datasource;

component output="false" displayName="SruOrderDao" name="SruOrderDao" {
    variables.instance = {
        datasource = 0
    };

	/* Auto-generated method
       Add authroization or any logical checks for secure access to your data */
	/* init */
	public any function init(required Datasource datasource) {
        variables.instance.datasource = arguments.datasource;
		return this ;
	}

    /* retrieve datasource object from variables.instance */
    private any function getDatasource() {
        return variables.instance.datasource;
    }
	
	/* create */
	public any function create(required SruOrder newSruOrder) {
		/* Auto-generated method - Add authroization or any logical checks for secure access to your data */
		var IdentityCol="";
		var qry="";
        var recordcount = 0;
        var msg = "";
        var sql="INSERT INTO GLOBALEYE.SRU_ORDER ( " &
                    "ORDER_ID, ACTIVE, INS_BY, INS_DATE, SRU_ID,  " & 
                    "EVENT_ID, DOC_NO, ORDER_DATE, RECEIVE_DATE, ESD,  " & 
                    "CHG_BY, CHG_DATE, REPAIR_ID, PARTNO_ID, ORDER_QTY,  " & 
                    "STATUS, MICAP, DELIVERY_DEST, DELIVERY_PRIORITY, UJC,  " & 
                    "RECEIVER, RECEIVE_QTY, REMARKS, WUC_CD, LOC_ID, " &
                    " ASSET_ID, ACKNOWLEDGE_DATE, FILL_DATE, REPL_SRU_SHIP_DATE, REPL_SRU_RECV_DATE " & 
                    ") " &
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  " & 
                        "?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";	

		/*TODO:  Below code is for table without auto increment enabled for primary key .Change the query Appropriately*/

		/* insert record */
		var q = new query();
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getOrderId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getOrderId()) and !len(trim(arguments.newSruOrder.getOrderId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getActive()) and !len(trim(arguments.newSruOrder.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getInsBy()) and !len(trim(arguments.newSruOrder.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.newSruOrder.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getSruId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getSruId()) and !len(trim(arguments.newSruOrder.getSruId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getEventId()) and !len(trim(arguments.newSruOrder.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getDocNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getDocNo()) and !len(trim(arguments.newSruOrder.getDocNo()))) ? "true" : "false");
        if (IsDate(arguments.newSruOrder.getOrderDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getOrderDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newSruOrder.getReceiveDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getReceiveDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getEsd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getEsd()) and !len(trim(arguments.newSruOrder.getEsd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getChgBy()) and !len(trim(arguments.newSruOrder.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.newSruOrder.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getRepairId()) and !len(trim(arguments.newSruOrder.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getPartnoId()) and !len(trim(arguments.newSruOrder.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getOrderQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getOrderQty()) and !len(trim(arguments.newSruOrder.getOrderQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getStatus()) and !len(trim(arguments.newSruOrder.getStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getMicap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getMicap()) and !len(trim(arguments.newSruOrder.getMicap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getDeliveryDest())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getDeliveryDest()) and !len(trim(arguments.newSruOrder.getDeliveryDest()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getDeliveryPriority())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getDeliveryPriority()) and !len(trim(arguments.newSruOrder.getDeliveryPriority()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getUjc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getUjc()) and !len(trim(arguments.newSruOrder.getUjc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getReceiver())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getReceiver()) and !len(trim(arguments.newSruOrder.getReceiver()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getReceiveQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getReceiveQty()) and !len(trim(arguments.newSruOrder.getReceiveQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getRemarks()) and !len(trim(arguments.newSruOrder.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getWucCd()) and !len(trim(arguments.newSruOrder.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getLocId()) and !len(trim(arguments.newSruOrder.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getAssetId()) and !len(trim(arguments.newSruOrder.getAssetId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.newSruOrder.getAcknowledgeDate())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.newSruOrder.getAcknowledgeDate()) and !len(trim(arguments.newSruOrder.getAcknowledgeDate()))) ? "true" : "false");
        if (IsDate(arguments.newSruOrder.getFillDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getFillDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newSruOrder.getReplSruShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getReplSruShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.newSruOrder.getReplSruRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.newSruOrder.getReplSruRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.setsql(local.sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount eq 1) {
            local.identityCol = local.qry.getPrefix().ROWID;

            /* return IdentityCol */
            return local.IdentityCol;
        } else {
            local.msg = "RIMSS was unable to perform the requested insert.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="CreateException", message=local.msg, detail="SruOrderDao could not insert the following record: #arguments.newSruOrder.toString()#");
        }
	}
	
	/* read */
	public Query function read(required string orderId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new SruOrder();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.orderId = arguments.orderId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="SruOrderDao could not find the following record: Order_Id[#arguments.orderId#]");
        }
    }
    
    /* readByRepairId */
	public Query function readByRepairId(required string repairId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var obj = new SruOrder();
        var filter = {};
        var msg = "";
		var qry="";

        local.filter.repairId = arguments.repairId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="SruOrderDao could not find the following record: Repair_Id[#arguments.repairId#]");
        }
    }
	
    /* read by row_id */
    public Query function readByRowId(required string rowId) {
        /* Auto-generated method
           Add authroization or any logical checks for secure access to your data */
        var obj = new SruOrder();
        var filter = {};
        var msg = "";
        var qry="";

        local.filter.rowId = arguments.rowId;
        local.qry=findByFilter(local.filter);

        /* load value object */
        if (local.qry.recordcount gt 0) {
            /* return success */
            return local.qry;
        } else {
            local.msg = "RIMSS was unable to perform the requested search.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="RecordNotFoundException", message=local.msg, detail="SruOrderDao could not find the following record: ROWID[#arguments.rowId#]");
        }
    }

	/* update */
	public void function update(required SruOrder chgSruOrder) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */var recordcount = 0;
        var msg = "";
		var qry="";
        var q=new query();
 
        var sql="UPDATE GLOBALEYE.SRU_ORDER SET " & 
                    "ACTIVE = ?, INS_BY = ?, INS_DATE = ?, SRU_ID = ?,  " &
                    "EVENT_ID = ?, DOC_NO = ?, ORDER_DATE = ?, RECEIVE_DATE = ?, ESD = ?,  " &
                    "CHG_BY = ?, CHG_DATE = ?, REPAIR_ID = ?, PARTNO_ID = ?, ORDER_QTY = ?,  " &
                    "STATUS = ?, MICAP = ?, DELIVERY_DEST = ?, DELIVERY_PRIORITY = ?, UJC = ?,  " &
                    "RECEIVER = ?, RECEIVE_QTY = ?, REMARKS = ?, WUC_CD = ?, LOC_ID = ?, ASSET_ID = ?, " &
                    "ACKNOWLEDGE_DATE = ?, FILL_DATE = ?, REPL_SRU_SHIP_DATE = ?, REPL_SRU_RECV_DATE = ?, SHIPPER = ?, TCN = ?, REM_SHIPPER = ?, REM_TCN = ?, REM_SRU_SHIP_DATE = ? " &
                    " " &
                "WHERE ORDER_ID = ? ";
		/* update database */
        local.q.setDatasource(getDatasource().getDsName());
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getActive())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getActive()) and !len(trim(arguments.chgSruOrder.getActive()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getInsBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getInsBy()) and !len(trim(arguments.chgSruOrder.getInsBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSruOrder.getInsDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getInsDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getSruId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getSruId()) and !len(trim(arguments.chgSruOrder.getSruId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getEventId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getEventId()) and !len(trim(arguments.chgSruOrder.getEventId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getDocNo())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getDocNo()) and !len(trim(arguments.chgSruOrder.getDocNo()))) ? "true" : "false");
        if (IsDate(arguments.chgSruOrder.getOrderDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getOrderDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgSruOrder.getReceiveDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getReceiveDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getEsd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getEsd()) and !len(trim(arguments.chgSruOrder.getEsd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getChgBy())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getChgBy()) and !len(trim(arguments.chgSruOrder.getChgBy()))) ? "true" : "false");
        if (IsDate(arguments.chgSruOrder.getChgDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getChgDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getRepairId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getRepairId()) and !len(trim(arguments.chgSruOrder.getRepairId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getPartnoId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getPartnoId()) and !len(trim(arguments.chgSruOrder.getPartnoId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getOrderQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getOrderQty()) and !len(trim(arguments.chgSruOrder.getOrderQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getStatus())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getStatus()) and !len(trim(arguments.chgSruOrder.getStatus()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getMicap())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getMicap()) and !len(trim(arguments.chgSruOrder.getMicap()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getDeliveryDest())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getDeliveryDest()) and !len(trim(arguments.chgSruOrder.getDeliveryDest()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getDeliveryPriority())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getDeliveryPriority()) and !len(trim(arguments.chgSruOrder.getDeliveryPriority()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getUjc())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getUjc()) and !len(trim(arguments.chgSruOrder.getUjc()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getReceiver())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getReceiver()) and !len(trim(arguments.chgSruOrder.getReceiver()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getReceiveQty())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getReceiveQty()) and !len(trim(arguments.chgSruOrder.getReceiveQty()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getRemarks())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getRemarks()) and !len(trim(arguments.chgSruOrder.getRemarks()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getWucCd())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getWucCd()) and !len(trim(arguments.chgSruOrder.getWucCd()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getLocId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getLocId()) and !len(trim(arguments.chgSruOrder.getLocId()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getAssetId())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getAssetId()) and !len(trim(arguments.chgSruOrder.getAssetId()))) ? "true" : "false");
        if (IsDate(arguments.chgSruOrder.getAcknowledgeDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getAcknowledgeDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgSruOrder.getFillDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getFillDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgSruOrder.getReplSruShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getReplSruShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        if (IsDate(arguments.chgSruOrder.getReplSruRecvDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getReplSruRecvDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getShipper()) and !len(trim(arguments.chgSruOrder.getShipper()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getTCN())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getTCN()) and !len(trim(arguments.chgSruOrder.getTCN()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getREMShipper())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getREMShipper()) and !len(trim(arguments.chgSruOrder.getREMShipper()))) ? "true" : "false");
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getREMTCN())),cfsqltype="CF_SQL_VARCHAR",null=(IsNull(arguments.chgSruOrder.getREMTCN()) and !len(trim(arguments.chgSruOrder.getREMTCN()))) ? "true" : "false");
        if (IsDate(arguments.chgSruOrder.getREMSruShipDate())) {
            local.q.addParam(value=ParseDateTime(arguments.chgSruOrder.getREMSruShipDate()),cfsqltype="CF_SQL_TIMESTAMP");
        } else {
            local.q.addParam(value=javacast("null",""),cfsqltype="CF_SQL_VARCHAR");
        }        
        local.q.addParam(value=ucase(trim(arguments.chgSruOrder.getOrderId())),cfsqltype="CF_SQL_VARCHAR");
        local.q.setsql(sql);
        try {
        local.qry=local.q.execute();
        } catch (any e) {
        	writeLog(file="PartOrdered" text="DAO Message - (#e.message#)");
		}
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested update.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="UpdateException", message=local.msg, detail="SruOrderDao could not update the following record: #arguments.chgSruOrder.toString()#");
        }
	}
	
	/* delete */
	public void function delete(required string orderId) {
		/* Auto-generated method
		   Add authroization or any logical checks for secure access to your data */
        var recordcount = 0;
        var msg = "";
		var qry="";
        var q =new query();
        var sql="DELETE FROM GLOBALEYE.SRU_ORDER " &
                "WHERE ORDER_ID = ?  ";

		/* delete from database */
        local.q.addParam(value=ucase(trim(arguments.orderId)),cfsqltype="CF_SQL_VARCHAR");        
		local.q.setsql(sql);
        local.qry=local.q.execute();
        local.recordcount = local.qry.getPrefix().RECORDCOUNT;

        if (local.recordcount neq 1) {
            local.msg = "RIMSS was unable to perform the requested delete.  Please try again later.  If this problem persists, please contact RAMPOD's help desk for further assistance.";
            throw(type="DeleteException", message=local.msg, detail="SruOrderDao could not delete the following record: Order_Id[#arguments.orderId#]");
        }
	}

    private Query function findByFilter(required struct filter) output=false {
        var whereClauseFound = false;
        var objQuery = new Query();
        var resultQuery = '';
        var sql="SELECT ORDER_ID, ACTIVE, INS_BY, INS_DATE, SRU_ID,  " & 
                    "EVENT_ID, DOC_NO, ORDER_DATE, RECEIVE_DATE, ESD,  " & 
                    "CHG_BY, CHG_DATE, REPAIR_ID, PARTNO_ID, ORDER_QTY,  " & 
                    "STATUS, MICAP, DELIVERY_DEST, DELIVERY_PRIORITY, UJC,  " & 
                    "RECEIVER, RECEIVE_QTY, REMARKS, WUC_CD, LOC_ID, " &
                    "ASSET_ID, ACKNOWLEDGE_DATE, FILL_DATE, REPL_SRU_SHIP_DATE, REPL_SRU_RECV_DATE, SHIPPER, TCN, REM_SHIPPER, REM_TCN, REM_SRU_SHIP_DATE " & 
                    " " &
                "FROM GLOBALEYE.SRU_ORDER ";

        local.objQuery.setDatasource(getDatasource().getDsName());

        
        
        if (StructKeyExists(arguments.filter,"orderId")) {
            if (whereClauseFound) {
                local.sql &= " AND ORDER_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ORDER_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.orderId)),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"rowId")) {
            if (whereClauseFound) {
                local.sql &= " AND ROWIDTOCHAR(ROWID) = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE ROWIDTOCHAR(ROWID) = ? ";
            }
            local.objQuery.addParam(value=trim(arguments.filter.rowId),cfsqltype="CF_SQL_VARCHAR");
        }
        
        if (StructKeyExists(arguments.filter,"repairId")) {
            if (whereClauseFound) {
                local.sql &= " AND REPAIR_ID = ? ";
            } else {
                whereClauseFound = true;
                local.sql &= " WHERE REPAIR_ID = ? ";
            }
            local.objQuery.addParam(value=ucase(trim(arguments.filter.repairId)),cfsqltype="CF_SQL_VARCHAR");
        }

        local.objQuery.setSql(local.sql);
        local.resultQuery = local.objQuery.execute().getResult();

        return local.resultQuery;
    }

}
