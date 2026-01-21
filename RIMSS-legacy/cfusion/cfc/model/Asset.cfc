component output="false" displayName="Asset" name="Asset" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="partnoId" type="string";
    property name="serno" type="string";
    property name="statusCd" type="string";
    property name="locIda" type="string";
    property name="locIdc" type="string";
    property name="insBy" type="string";
    property name="insDate" type="string";
    property name="active" type="string";
    property name="reportable" type="string";
    property name="cfoTracked" type="string";
    property name="badActor" type="string";
    property name="valid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="nhaAssetId" type="string";
    property name="cfoAssetId" type="string";
    property name="ctAssetId" type="string";
    property name="uii" type="string";
    property name="etic" type="string";
    property name="lotno" type="string";
    property name="mfgDate" type="string";
    property name="acceptDate" type="string";
    property name="nextNdiDate" type="string";
    property name="deployedDate" type="string";
    property name="tcn" type="string";
    property name="shipper" type="string";
    property name="shipDate" type="string";
    property name="recvDate" type="string";
    property name="eti" type="string";
    property name="etiLiate" type="string";
    property name="cfgSetId" type="string";
    property name="equipId" type="string";
    property name="stationType" type="string";
    property name="stringCount" type="string";
    property name="remarks" type="string";
    property name="pmel" type="string";
    property name="inTransit" type="string";
    property name="sysId" type="string";
    property name="tailNo" type="string";
    property name="srdCd" type="string";
    property name="assetType" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize Asset properties */
        setAssetId("");
        setPartnoId("");
        setSerno("");
        setStatusCd("");
        setLocIda("");
        setLocIdc("");
        setInsBy("");
        setInsDate("");
        setActive("");
        setReportable("");
        setCfoTracked("");
        setBadActor("");
        setValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setNhaAssetId("");
        setCfoAssetId("");
        setCtAssetId("");
        setUii("");
        setEtic("");
        setLotno("");
        setMfgDate("");
        setAcceptDate("");
        setNextNdiDate("");
        setDeployedDate("");
        setTcn("");
        setShipper("");
        setShipDate("");
        setRecvDate("");
        setEti("");
        setEtiLiate("");
        setCfgSetId("");
        setEquipId("");
        setStationType("");
        setStringCount("");
        setRemarks("");
        setPmel("");
        setInTransit("");
        setSysId("");
        setTailNo("");
        setSrdCd("");
        setAssetType("");

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

    /* Validate Asset */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="AssetException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getPartnoId()) or !len(trim(getPartnoId()))) {
            throw (type="AssetException", message="Missing Partno_Id", detail="Please enter in the Partno_Id");
        }
        if (isNull(getSerno()) or !len(trim(getSerno()))) {
            throw (type="AssetException", message="Missing Serno", detail="Please enter in the Serno");
        }
        if (isNull(getStatusCd()) or !len(trim(getStatusCd()))) {
            throw (type="AssetException", message="Missing Status_Cd", detail="Please enter in the Status_Cd");
        }
        if (isNull(getLocIda()) or !len(trim(getLocIda()))) {
            throw (type="AssetException", message="Missing Loc_Ida", detail="Please enter in the Loc_Ida");
        }
        if (isNull(getLocIdc()) or !len(trim(getLocIdc()))) {
            throw (type="AssetException", message="Missing Loc_Idc", detail="Please enter in the Loc_Idc");
        }
        if (isNull(getInsBy()) or !len(trim(getInsBy()))) {
            throw (type="AssetException", message="Missing Ins_By", detail="Please enter in the Ins_By");
        }
        if (isNull(getInsDate()) or !len(trim(getInsDate()))) {
            throw (type="AssetException", message="Missing Ins_Date", detail="Please enter in the Ins_Date");
        }
        if (isNull(getActive()) or !len(trim(getActive()))) {
            throw (type="AssetException", message="Missing Active", detail="Please enter in the Active");
        }
        if (isNull(getReportable()) or !len(trim(getReportable()))) {
            throw (type="AssetException", message="Missing Reportable", detail="Please enter in the Reportable");
        }
        if (isNull(getCfoTracked()) or !len(trim(getCfoTracked()))) {
            throw (type="AssetException", message="Missing Cfo_Tracked", detail="Please enter in the Cfo_Tracked");
        }
        if (isNull(getBadActor()) or !len(trim(getBadActor()))) {
            throw (type="AssetException", message="Missing Bad_Actor", detail="Please enter in the Bad_Actor");
        }
        if (isNull(getValid()) or !len(trim(getValid()))) {
            throw (type="AssetException", message="Missing Valid", detail="Please enter in the Valid");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="AssetException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getPartnoId()) and len(trim(getPartnoId())) and !isNumeric(getPartnoId())) {
            throw (type="AssetException", message="Partno_Id not a number", detail="Please enter a valid number for Partno_Id");
        }
        if (!isNull(getStatusCd()) and len(trim(getStatusCd())) and !isNumeric(getStatusCd())) {
            throw (type="AssetException", message="Status_Cd not a number", detail="Please enter a valid number for Status_Cd");
        }
        if (!isNull(getLocIda()) and len(trim(getLocIda())) and !isNumeric(getLocIda())) {
            throw (type="AssetException", message="Loc_Ida not a number", detail="Please enter a valid number for Loc_Ida");
        }
        if (!isNull(getLocIdc()) and len(trim(getLocIdc())) and !isNumeric(getLocIdc())) {
            throw (type="AssetException", message="Loc_Idc not a number", detail="Please enter a valid number for Loc_Idc");
        }
        if (!isNull(getNhaAssetId()) and len(trim(getNhaAssetId())) and !isNumeric(getNhaAssetId())) {
            throw (type="AssetException", message="Nha_Asset_Id not a number", detail="Please enter a valid number for Nha_Asset_Id");
        }
        if (!isNull(getCfoAssetId()) and len(trim(getCfoAssetId())) and !isNumeric(getCfoAssetId())) {
            throw (type="AssetException", message="Cfo_Asset_Id not a number", detail="Please enter a valid number for Cfo_Asset_Id");
        }
        if (!isNull(getCtAssetId()) and len(trim(getCtAssetId())) and !isNumeric(getCtAssetId())) {
            throw (type="AssetException", message="Ct_Asset_Id not a number", detail="Please enter a valid number for Ct_Asset_Id");
        }
        if (!isNull(getEti()) and len(trim(getEti())) and !isNumeric(getEti())) {
            throw (type="AssetException", message="Eti not a number", detail="Please enter a valid number for Eti");
        }
        if (!isNull(getEtiLiate()) and len(trim(getEtiLiate())) and !isNumeric(getEtiLiate())) {
            throw (type="AssetException", message="Eti_Liate not a number", detail="Please enter a valid number for Eti_Liate");
        }
        if (!isNull(getCfgSetId()) and len(trim(getCfgSetId())) and !isNumeric(getCfgSetId())) {
            throw (type="AssetException", message="Cfg_Set_Id not a number", detail="Please enter a valid number for Cfg_Set_Id");
        }
        if (!isNull(getStringCount()) and len(trim(getStringCount())) and !isNumeric(getStringCount())) {
            throw (type="AssetException", message="String_Count not a number", detail="Please enter a valid number for String_Count");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="AssetException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        if (!isNull(getSrdCd()) and len(trim(getSrdCd())) and !isNumeric(getSrdCd())) {
            throw (type="AssetException", message="Srd_Cd not a number", detail="Please enter a valid number for Srd_Cd");
        }
    
        /* validate date properties */
        if (!isNull(getInsDate()) and len(trim(getInsDate())) and !isDate(getInsDate())) {
            throw (type="AssetException", message="Ins_Date not a valid date", detail="Please enter a valid date for Ins_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="AssetException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="AssetException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getMfgDate()) and len(trim(getMfgDate())) and !isDate(getMfgDate())) {
            throw (type="AssetException", message="Mfg_Date not a valid date", detail="Please enter a valid date for Mfg_Date");
        }
        if (!isNull(getAcceptDate()) and len(trim(getAcceptDate())) and !isDate(getAcceptDate())) {
            throw (type="AssetException", message="Accept_Date not a valid date", detail="Please enter a valid date for Accept_Date");
        }
        if (!isNull(getNextNdiDate()) and len(trim(getNextNdiDate())) and !isDate(getNextNdiDate())) {
            throw (type="AssetException", message="Next_Ndi_Date not a valid date", detail="Please enter a valid date for Next_Ndi_Date");
        }
        if (!isNull(getDeployedDate()) and len(trim(getDeployedDate())) and !isDate(getDeployedDate())) {
            throw (type="AssetException", message="Deployed_Date not a valid date", detail="Please enter a valid date for Deployed_Date");
        }
        if (!isNull(getShipDate()) and len(trim(getShipDate())) and !isDate(getShipDate())) {
            throw (type="AssetException", message="Ship_Date not a valid date", detail="Please enter a valid date for Ship_Date");
        }
        if (!isNull(getRecvDate()) and len(trim(getRecvDate())) and !isDate(getRecvDate())) {
            throw (type="AssetException", message="Recv_Date not a valid date", detail="Please enter a valid date for Recv_Date");
        }
    }
}

