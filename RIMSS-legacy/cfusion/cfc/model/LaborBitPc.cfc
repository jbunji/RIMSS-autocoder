component output="false" displayName="LaborBitPc" name="LaborBitPc" accessors="true" {
	/* properties */
	property name="laborBitId" type="string";
    property name="laborId" type="string";
    property name="bitPartno" type="string";
    property name="bitName" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="sentImds" type="string";
    property name="bitSeq" type="string";
    property name="bitWuc" type="string";
    property name="howMal" type="string";
    property name="bitQty" type="string";
    property name="fsc" type="string";
    property name="bitDelete" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize LaborBitPc properties */
        setLaborBitId("");
        setLaborId("");
        setBitPartno("");
        setBitName("");
        setInsBy("");
        setInsDate("");
        setSentImds("N");
        setBitSeq("");
        setBitWuc("");
        setHowMal("");
        setBitQty("");
        setFsc("");
        setBitDelete("");
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

    /* Validate LaborBitPc */
    public void function validate() {
        /* validate not null properties */
//        if (isNull(getLaborBitId()) or !len(trim(getLaborBitId()))) {
//            throw (type="LaborBitPcException", message="Missing Labor_Bit_Id", detail="Please enter in the Labor_Bit_Id");
//        }
        if (isNull(getLaborId()) or !len(trim(getLaborId()))) {
            throw (type="LaborBitPcException", message="Missing Labor_Id", detail="Please enter in the Labor_Id");
        }
        if (isNull(getBitPartno()) or !len(trim(getBitPartno()))) {
            throw (type="LaborBitPcException", message="Missing Bit_Partno", detail="Please enter in the Bit_Partno");
        }
        if (isNull(getBitName()) or !len(trim(getBitName()))) {
            throw (type="LaborBitPcException", message="Missing Bit_Name", detail="Please enter in the Bit_Name");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LaborBitPcException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LaborBitPcException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getSentImds()) or !len(trim(getSentImds()))) {
            throw (type="LaborBitPcException", message="Missing Sent_Imds", detail="Please enter in the Sent_Imds");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="LaborBitPcException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getLaborBitId()) and len(trim(getLaborBitId())) and !isNumeric(getLaborBitId())) {
            throw (type="LaborBitPcException", message="Labor_Bit_Id not a number", detail="Please enter a valid number for Labor_Bit_Id");
        }
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="LaborBitPcException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getBitSeq()) and len(trim(getBitSeq())) and !isNumeric(getBitSeq())) {
            throw (type="LaborBitPcException", message="Bit_Seq not a number", detail="Please enter a valid number for Bit_Seq");
        }
        if (!isNull(getHowMal()) and len(trim(getHowMal())) and !isNumeric(getHowMal())) {
            throw (type="LaborBitPcException", message="How_Mal not a number", detail="Please enter a valid number for How_Mal");
        }
        if (!isNull(getBitQty()) and len(trim(getBitQty())) and !isNumeric(getBitQty())) {
            throw (type="LaborBitPcException", message="Bit_Qty not a number", detail="Please enter a valid number for Bit_Qty");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LaborBitPcException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="LaborBitPcException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
    }
}

