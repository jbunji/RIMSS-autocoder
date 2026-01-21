component output="false" displayName="MsgTransmit" name="MsgTransmit" accessors="true" {
	/* properties */
	property name="msgId" type="string" ;
    property name="msgText" type="string" ;
    property name="insBy" type="string" ;
    property name="insDate" type="string" ;
    property name="startDate" type="string" ;
    property name="stopDate" type="string" ;
    property name="active" type="string" ;
    property name="priority" type="string" ;
    property name="locId" type="string" ;
    property name="sysId" type="string" ;
    property name="fromUser" type="string" ;
    property name="toUser" type="string" ;
    property name="chgBy" type="string" ;
    property name="chgDate" type="string" ;
    

	/* init */
	function init() {
		
		setMsgId("");
        setMsgText("");
        setInsBy("");
        setInsDate("");
        setStartDate("");
        setStopDate("");
        setActive("Y");
        setPriority("3");
        setLocId("");
        setSysId("");
        setFromUser("");
        setToUser("");
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
       
       local.results = ReplaceNoCase(SerializeJSON(local.results),'"',"''","ALL");
       
       return local.results;  
    }
	
	 
	
	/* Validate MsgTransmit */
    public void function validate(boolean validateId = true) {
        /* validate not null properties */
        if(ARGUMENTS.validateId){
	        if (isNull(getMsgId()) or !len(trim(getMsgId()))) {
	            throw (type="MsgTransmitException", message="Missing Msg_Id", detail="Please enter in the Msg_id");
	        }
        }
        
        if (isNull(getStartDate()) or !len(trim(getStartDate()))) {
            throw (type="MsgTransmitException", message="Missing Start_Date", detail="Please enter in the Start_Date");
        }
        
        if (isNull(getStopDate()) or !len(trim(getStopDate()))) {
            throw (type="MsgTransmitException", message="Missing Stop_Date", detail="Please enter in the Stop_Date");
        }

        if (isNull(getMsgText()) or !len(trim(getMsgText()))) {
            throw (type="MsgTransmitException", message="Missing Msg_Text", detail="Please enter in the Msg_Text");
        }

        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="MsgTransmitException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="MsgTransmitException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="MsgTransmitException", message="Missing Active", detail="Please enter in the Active");
        }
        
        if (isNull(getPriority()) or !len(trim(getPriority()))) {
            throw (type="MsgTransmitException", message="Missing Priority", detail="Please enter in the Priority");
        }
        
    
        /* validate numeric properties */
        if(ARGUMENTS.validateId){
	        if (!isNull(getMsgId()) and len(trim(getMsgId())) and !isNumeric(getMsgId())) {
	            throw (type="MsgTransmitException", message="Msg_Id not a number", detail="Please enter a valid number for Msg_Id");
	        }
        }
        
        if (!isNull(getStartDate()) and !isDate(getStartDate())) {
            throw (type="MsgTransmitException", message="Start_Date not a valid date", detail="Please enter a valid date for Start_Date");
        }
        
        if (!isNull(getStopDate()) and !isDate(getStopDate())) {
            throw (type="MsgTransmitException", message="Stop_Date not a valid date", detail="Please enter a valid date for Stop_Date");
        }
        
        if (!isNull(getStopDate()) and isDate(getStopDate()) and !isNull(getStartDate()) and isDate(getStartDate())) {
            if(DateCompare(getStartDate(),getStopDate()) > 0){
                throw (type="MsgTransmitException", message="Start_Date needs to be less than Stop_Date", detail="Please enter a valid date for Start_Date");   
            }   
        }

        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="MsgTransmitException", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="MsgTransmitException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        
        if (!isNull(getPriority()) and len(trim(getPriority())) and !isNumeric(getPriority())) {
            throw (type="MsgTransmitException", message="Priority not a number", detail="Please enter a valid number for Priority");
        }
        
        /* validate date properties */

        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="MsgTransmitException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="MsgTransmitException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
 
    }
	

}
