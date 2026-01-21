component output="false" displayName="CfgList" name="CfgList" accessors="true" {
	/* properties */
	property name="listId" type="string";
    property name="cfgSetId" type="string";
    property name="partnoP" type="string";
    property name="partnoC" type="string";
    property name="sortOrder" type="string";
    property name="active" type="string";
    property name="QPA" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize CfgList properties */
        setListId("");
        setCfgSetId("");
        setPartnoP("");
        setPartnoC("");
        setSortOrder("");
        setActive("");
        setQPA("");
        setInsBy("");
        setInsDate("");
        setChgBy("");
        setChgDate("");

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

    /* Validate CfgList */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getListId()) or !len(trim(getListId()))) {
            throw (type="CfgListException", message="Missing List_Id", detail="Please enter in the List_Id");
        }
        if (isNull(getCfgSetId()) or !len(trim(getCfgSetId()))) {
            throw (type="CfgListException", message="Missing Cfg_Set_Id", detail="Please enter in the Cfg_Set_Id");
        }
        if (isNull(getPartnoP()) or !len(trim(getPartnoP()))) {
            throw (type="CfgListException", message="Missing Partno_P", detail="Please enter in the Partno_P");
        }
        if (isNull(getPartnoC()) or !len(trim(getPartnoC()))) {
            throw (type="CfgListException", message="Missing Partno_C", detail="Please enter in the Partno_C");
        }
        if (isNull(getSortOrder()) or !len(trim(getSortOrder()))) {
            throw (type="CfgListException", message="Missing Sort_Order", detail="Please enter in the Sort_Order");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="CfgListException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getQPA()) or !len(trim(getQPA()))) {
            throw (type="CfgListException", message="Missing QPA", detail="Please enter in the QPA");
        }        
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="CfgListException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="CfgListException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getListId()) and len(trim(getListId())) and !isNumeric(getListId())) {
            throw (type="CfgListException", message="List_Id not a number", detail="Please enter a valid number for List_Id");
        }
        if (!isNull(getCfgSetId()) and len(trim(getCfgSetId())) and !isNumeric(getCfgSetId())) {
            throw (type="CfgListException", message="Cfg_Set_Id not a number", detail="Please enter a valid number for Cfg_Set_Id");
        }
        if (!isNull(getPartnoP()) and len(trim(getPartnoP())) and !isNumeric(getPartnoP())) {
            throw (type="CfgListException", message="Partno_P not a number", detail="Please enter a valid number for Partno_P");
        }
        if (!isNull(getPartnoC()) and len(trim(getPartnoC())) and !isNumeric(getPartnoC())) {
            throw (type="CfgListException", message="Partno_C not a number", detail="Please enter a valid number for Partno_C");
        }
        if (!isNull(getSortOrder()) and len(trim(getSortOrder())) and !isNumeric(getSortOrder())) {
            throw (type="CfgListException", message="Sort_Order not a number", detail="Please enter a valid number for Sort_Order");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="CfgListException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="CfgListException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
    }
}

