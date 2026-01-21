component output="false" displayName="Attachments" name="Attachments" accessors="true" {
	/* properties */
    property name="attId" type="string";	
    property name="assetId" type="string";
    property name="repairId" type="string";
    property name="name" type="string";
    property name="attachment" type="blob";
    property name="thumbnail" type="blob";
    property name="contentType" type="string";
    property name="description" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";	
	

	/* init */
	function init() {
	    /* initialize Repair properties */
        setAttId("");
        setAssetId("");
        setRepairId("");
        setName("");
        setContentType("");
        setDescription("");
        setInsBy("");
        setInsDate("");
        setChgBy("");
        setChgDate("");
        setValid("N");
        setValBy("");
        setValDate("");
        
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

    /* Validate Repair */
    public void function validate() {
        
        /* validate not null properties */

    
        /* validate numeric properties */
        if (!isNull(getAttId()) and len(trim(getAttId())) and !isNumeric(getAttId())) {
            throw (type="AttachmentsException", message="Att_Id not a number", detail="Please enter a valid number for Att_Id");
        }
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="AttachmentsException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getRepairId()) and len(trim(getRepairId())) and !isNumeric(getRepairId())) {
            throw (type="AttachmentsException", message="Repair_Id not a number", detail="Please enter a valid number for Repair_Id");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="AttachmentsException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="AttachmentsException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="AttachmentsException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
    }

    public void function validateAttachments() {
        /* validate not null properties */
        if (isNull(getAttId()) or !len(trim(getAttId()))) {
            throw (type="AttachmentsException", message="Missing Att_Id", detail="Please enter in the Att_Id");
        }
    }

}



