component output="false" displayName="LocByLoc" name="LocByLoc" accessors="true" {
	/* properties */
	property name="lblId" type="string";
    property name="groupCd" type="string";
    property name="locId1" type="string";
    property name="locId2" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize LocByLoc properties */
        setLblId("");
        setGroupCd("");
        setLocId1("");
        setLocId2("");
        setInsBy("");
        setInsDate("");

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

    /* Validate LocByLoc */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getLblId()) or !len(trim(getLblId()))) {
            throw (type="LocByLocException", message="Missing Lbl_Id", detail="Please enter in the Lbl_Id");
        }
        if (isNull(getGroupCd()) or !len(trim(getGroupCd()))) {
            throw (type="LocByLocException", message="Missing Group_Cd", detail="Please enter in the Group_Cd");
        }
        if (isNull(getLocId1()) or !len(trim(getLocId1()))) {
            throw (type="LocByLocException", message="Missing Loc_Id1", detail="Please enter in the Loc_Id1");
        }
        if (isNull(getLocId2()) or !len(trim(getLocId2()))) {
            throw (type="LocByLocException", message="Missing Loc_Id2", detail="Please enter in the Loc_Id2");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="LocByLocException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="LocByLocException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getLblId()) and len(trim(getLblId())) and !isNumeric(getLblId())) {
            throw (type="LocByLocException", message="Lbl_Id not a number", detail="Please enter a valid number for Lbl_Id");
        }
        if (!isNull(getGroupCd()) and len(trim(getGroupCd())) and !isNumeric(getGroupCd())) {
            throw (type="LocByLocException", message="Group_Cd not a number", detail="Please enter a valid number for Group_Cd");
        }
        if (!isNull(getLocId1()) and len(trim(getLocId1())) and !isNumeric(getLocId1())) {
            throw (type="LocByLocException", message="Loc_Id1 not a number", detail="Please enter a valid number for Loc_Id1");
        }
        if (!isNull(getLocId2()) and len(trim(getLocId2())) and !isNumeric(getLocId2())) {
            throw (type="LocByLocException", message="Loc_Id2 not a number", detail="Please enter a valid number for Loc_Id2");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="LocByLocException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
    }
}

