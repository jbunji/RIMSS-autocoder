component output="false" displayName="SruOrder" name="SruOrder" accessors="true" {
	/* properties */
	property name="orderId" type="string";
    property name="active" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="sruId" type="string";
    property name="eventId" type="string";
    property name="docNo" type="string";
    property name="orderDate" type="string";
    property name="receiveDate" type="string";
    property name="esd" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="repairId" type="string";
    property name="partnoId" type="string";
    property name="orderQty" type="string";
    property name="status" type="string";
    property name="micap" type="string";
    property name="deliveryDest" type="string";
    property name="deliveryPriority" type="string";
    property name="ujc" type="string";
    property name="receiver" type="string";
    property name="receiveQty" type="string";
    property name="remarks" type="string";
    property name="wucCd" type="string";
    property name="locId" type="string";
    property name="assetId" type="string";
    property name="acknowledgeDate" type="string";
    property name="fillDate" type="string";
    property name="replSruShipDate" type="string";
    property name="replSruRecvDate" type="string";
    property name="shipper" type="string";
    property name="tcn" type="string";
    property name="REMshipper" type="string";
    property name="REMtcn" type="string"; 
    property name="REMSruShipDate" type="string";       
    

	
	

	/* init */
	function init() {
	    /* initialize SruOrder properties */
        setOrderId("");
        setActive("");
        setInsBy("");
        setInsDate("");
        setSruId("");
        setEventId("");
        setDocNo("");
        setOrderDate("");
        setReceiveDate("");
        setEsd("");
        setChgBy("");
        setChgDate("");
        setRepairId("");
        setPartnoId("");
        setOrderQty("");
        setStatus("");
        setMicap("");
        setDeliveryDest("");
        setDeliveryPriority("");
        setUjc("");
        setReceiver("");
        setReceiveQty("");
        setRemarks("");
        setWucCd("");
        setLocId("");
        setAssetId("");
        setAcknowledgeDate("");
        setFillDate("");
        setReplSruShipDate("");
        setReplSruRecvDate("");
        setshipper("");
        setTCN("");
        setRemSruShipDate(""); 
        setREMshipper("");
        setREMTCN("");               

		return this;
	}

	

    /* return the property name/value pair of this object */
    public any function toString() {
       var local = {};
       local.results = {};
       
       local.metaData = getMetaData(this);
       if(Structkeyexists(local.metaData,"properties") and isArray(local.metaData['properties'])) {           
          local.properties = local.metaData['properties']; 
          for(local.p=1;local.p<=ArrayLen(local.properties);local.p++) {
              local.name = local.properties[local.p].name;
               local.results[local.name] = (Structkeyexists(variables,local.name))? variables[local.name] :"";          
          }    
       }
       return SerializeJSON(local.results);  
    }

    /* Validate SruOrder */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getOrderId()) or !len(trim(getOrderId()))) {
            throw (type="SruOrderException", message="Missing Order_Id", detail="Please enter in the Order_Id");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="SruOrderException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="SruOrderException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="SruOrderException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getRepairId()) or !len(trim(getRepairId()))) {
            throw (type="SruOrderException", message="Missing Repair_Id", detail="Please enter in the Repair_Id");
        }
        if (isNull(getPartnoId()) or !len(trim(getPartnoId()))) {
            throw (type="SruOrderException", message="Missing Partno_Id", detail="Please enter in the Partno_Id");
        }
    
        /* validate numeric properties */
        if (!isNull(getOrderId()) and len(trim(getOrderId())) and !isNumeric(getOrderId())) {
            throw (type="SruOrderException", message="Order_Id not a number", detail="Please enter a valid number for Order_Id");
        }
        if (!isNull(getSruId()) and len(trim(getSruId())) and !isNumeric(getSruId())) {
            throw (type="SruOrderException", message="Sru_Id not a number", detail="Please enter a valid number for Sru_Id");
        }
        if (!isNull(getEventId()) and len(trim(getEventId())) and !isNumeric(getEventId())) {
            throw (type="SruOrderException", message="Event_Id not a number", detail="Please enter a valid number for Event_Id");
        }
        if (!isNull(getEsd()) and len(trim(getEsd())) and !isNumeric(getEsd())) {
            throw (type="SruOrderException", message="Esd not a number", detail="Please enter a valid number for Esd");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="SruOrderException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="SruOrderException", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getOrderQty()) and len(trim(getOrderQty())) and !isNumeric(getOrderQty())) {
            throw (type="SruOrderException", message="Order_Qty not a number", detail="Please enter a valid number for Order_Qty");
        }
        if (!isNull(getDeliveryPriority()) and len(trim(getDeliveryPriority())) and !isNumeric(getDeliveryPriority())) {
            throw (type="SruOrderException", message="Delivery_Priority not a number", detail="Please enter a valid number for Delivery_Priority");
        }
        if (!isNull(getReceiveQty()) and len(trim(getReceiveQty())) and !isNumeric(getReceiveQty())) {
            throw (type="SruOrderException", message="Receive_Qty not a number", detail="Please enter a valid number for Receive_Qty");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="SruOrderException", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="SruOrderException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="SruOrderException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="SruOrderException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getOrderDate()) and len(trim(getOrderDate())) and !isDate(getOrderDate())) {
            throw (type="SruOrderException", message="Order_Date not a valid date", detail="Please enter a valid date for Order_Date");
        }
        if (!isNull(getReceiveDate()) and len(trim(getReceiveDate())) and !isDate(getReceiveDate())) {
            throw (type="SruOrderException", message="Receive_Date not a valid date", detail="Please enter a valid date for Receive_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="SruOrderException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getAcknowledgeDate()) and len(trim(getAcknowledgeDate())) and !isDate(getAcknowledgeDate())) {
            throw (type="SruOrderException", message="Acknowledge_Date not a valid date", detail="Please enter a valid date for Acknowledge_Date");
        }
        if (!isNull(getFillDate()) and len(trim(getFillDate())) and !isDate(getFillDate())) {
            throw (type="SruOrderException", message="Fill_Date not a valid date", detail="Please enter a valid date for Fill_Date");
        }
        if (!isNull(getReplSruShipDate()) and len(trim(getReplSruShipDate())) and !isDate(getReplSruShipDate())) {
            throw (type="SruOrderException", message="Repl_Sru_Ship_Date not a valid date", detail="Please enter a valid date for Repl_Sru_Ship_Date");
        }
        if (!isNull(getReplSruRecvDate()) and len(trim(getReplSruRecvDate())) and !isDate(getReplSruRecvDate())) {
            throw (type="SruOrderException", message="Repl_Sru_Recv_Date not a valid date", detail="Please enter a valid date for Repl_Sru_Recv_Date");
        }
        if (!isNull(getREMSruShipDate()) and len(trim(getRemSruShipDate())) and !isDate(getRemSruShipDate())) {
            throw (type="SruOrderException", message="Rem_Sru_Ship_Date not a valid date", detail="Please enter a valid date for Rem_Sru_Ship_Date");
        }        
    }
}

