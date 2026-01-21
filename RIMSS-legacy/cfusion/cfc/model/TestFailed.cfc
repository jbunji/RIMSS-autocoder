component output="false" displayName="TestFailed" name="TestFailed" accessors="true" {
	/* properties */
    property name="testFailId" type="string";	
    property name="laborId" type="string";
    property name="testFailCd" type="string";
    property name="testTypeCd" type="string";
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
        setTestFailId("");
        setLaborId("");
        setTestFailCd("");
        setTestTypeCd("");
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
        if (!isNull(getTestFailId()) and len(trim(getTestFailId())) and !isNumeric(getTestFailId())) {
            throw (type="TestFailedException", message="Test_Fail_Id not a number", detail="Please enter a valid number for Test_Fail_Id");
        }
        if (!isNull(getLaborId()) and len(trim(getLaborId())) and !isNumeric(getLaborId())) {
            throw (type="TestFailedException", message="Labor_Id not a number", detail="Please enter a valid number for Labor_Id");
        }
        if (!isNull(getTestFailCd()) and len(trim(getTestFailCd())) and !isNumeric(getTestFailCd())) {
            throw (type="TestFailedException", message="Test_Fail_Cd not a number", detail="Please enter a valid number for Test_Fail_Cd");
        }
        if (!isNull(getTestTypeCd()) and len(trim(getTestTypeCd())) and !isNumeric(getTestTypeCd())) {
            throw (type="TestFailedException", message="Test_Type_Cd not a number", detail="Please enter a valid number for Test_Type_Cd");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="TestFailedException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="TestFailedException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="TestFailedException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
    }

    public void function validateAttachments() {
        /* validate not null properties */
        if (isNull(getLaborId()) or !len(trim(getLaborId()))) {
            throw (type="TestFailedException", message="Missing Labor_Id", detail="Please enter in the Labor_Id");
        }
        if (isNull(getTestFailCd()) or !len(trim(getTestFailCd()))) {
            throw (type="TestFailedException", message="Missing Test_Fail_Cd", detail="Please enter in the Test_Fail_Cd");
        }
    }

}