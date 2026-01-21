component output="false" displayName="PartnoWucP2" name="PartnoWucP2" accessors="true" {
	/* properties */
	property name="pnWucId" type="string";
    property name="partnoId" type="string";
    property name="wucCd" type="string";
    property name="sysId" type="string";
    property name="locId" type="string";
    property name="active" type="string";
    property name="twoLevel" type="string";
    property name="etiMeter" type="string";
    property name="goldFlag" type="string";
    property name="classified" type="string";
    property name="nocFlag" type="string";
    property name="stationType" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="ipbTo" type="string";
    property name="figure" type="string";
    property name="figureIndex" type="string";
    property name="refdes" type="string";
    property name="nhaId" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="nhaWucCd" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize PartnoWucP2 properties */
        setPnWucId("");
        setPartnoId("");
        setWucCd("");
        setSysId("");
        setLocId("");
        setActive("");
        setTwoLevel("");
        setEtiMeter("");
        setGoldFlag("");
        setClassified("");
        setNocFlag("");
        setStationType("");
        setInsBy("");
        setInsDate("");
        setIpbTo("");
        setFigure("");
        setFigureIndex("");
        setRefdes("");
        setNhaId("");
        setChgBy("");
        setChgDate("");
        setNhaWucCd("");
        setValid("");
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

    /* Validate PartnoWucP2 */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getPnWucId()) or !len(trim(getPnWucId()))) {
            throw (type="PartnoWucP2Exception", message="Missing Pn_Wuc_Id", detail="Please enter in the Pn_Wuc_Id");
        }
        if (isNull(getPartnoId()) or !len(trim(getPartnoId()))) {
            throw (type="PartnoWucP2Exception", message="Missing Partno_Id", detail="Please enter in the Partno_Id");
        }
        if (isNull(getWucCd()) or !len(trim(getWucCd()))) {
            throw (type="PartnoWucP2Exception", message="Missing Wuc_Cd", detail="Please enter in the Wuc_Cd");
        }
        if (isNull(getSysId()) or !len(trim(getSysId()))) {
            throw (type="PartnoWucP2Exception", message="Missing Sys_Id", detail="Please enter in the Sys_Id");
        }
        if (isNull(getLocId()) or !len(trim(getLocId()))) {
            throw (type="PartnoWucP2Exception", message="Missing Loc_Id", detail="Please enter in the Loc_Id");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="PartnoWucP2Exception", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getTwoLevel()) or !len(trim(getTwoLevel()))) {
            throw (type="PartnoWucP2Exception", message="Missing Two_Level", detail="Please enter in the Two_Level");
        }
        if (isNull(getEtiMeter()) or !len(trim(getEtiMeter()))) {
            throw (type="PartnoWucP2Exception", message="Missing Eti_Meter", detail="Please enter in the Eti_Meter");
        }
        if (isNull(getGoldFlag()) or !len(trim(getGoldFlag()))) {
            throw (type="PartnoWucP2Exception", message="Missing Gold_Flag", detail="Please enter in the Gold_Flag");
        }
        if (isNull(getClassified()) or !len(trim(getClassified()))) {
            throw (type="PartnoWucP2Exception", message="Missing Classified", detail="Please enter in the Classified");
        }
        if (isNull(getNocFlag()) or !len(trim(getNocFlag()))) {
            throw (type="PartnoWucP2Exception", message="Missing Noc_Flag", detail="Please enter in the Noc_Flag");
        }
        if (isNull(getStationType()) or !len(trim(getStationType()))) {
            throw (type="PartnoWucP2Exception", message="Missing Station_Type", detail="Please enter in the Station_Type");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="PartnoWucP2Exception", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="PartnoWucP2Exception", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="PartnoWucP2Exception", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getPnWucId()) and len(trim(getPnWucId())) and !isNumeric(getPnWucId())) {
            throw (type="PartnoWucP2Exception", message="Pn_Wuc_Id not a number", detail="Please enter a valid number for Pn_Wuc_Id");
        }
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="PartnoWucP2Exception", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getWucCd()) and len(trim(getWucCd())) and !isNumeric(getWucCd())) {
            throw (type="PartnoWucP2Exception", message="Wuc_Cd not a number", detail="Please enter a valid number for Wuc_Cd");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="PartnoWucP2Exception", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        if (!isNull(getLocId()) and len(trim(getLocId())) and !isNumeric(getLocId())) {
            throw (type="PartnoWucP2Exception", message="Loc_Id not a number", detail="Please enter a valid number for Loc_Id");
        }
        if (!isNull(getNhaId()) and len(trim(getNhaId())) and !isNumeric(getNhaId())) {
            throw (type="PartnoWucP2Exception", message="Nha_Id not a number", detail="Please enter a valid number for Nha_Id");
        }
        if (!isNull(getNhaWucCd()) and len(trim(getNhaWucCd())) and !isNumeric(getNhaWucCd())) {
            throw (type="PartnoWucP2Exception", message="Nha_Wuc_Cd not a number", detail="Please enter a valid number for Nha_Wuc_Cd");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="PartnoWucP2Exception", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="PartnoWucP2Exception", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="PartnoWucP2Exception", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
    }
}

