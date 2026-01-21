component output="false" displayName="InvAssets" name="InvAssets" accessors="true" {
	/* properties */
	property name="assetId" type="string";
    property name="sysId" type="string";
    property name="serno" type="string";
    property name="isActive" type="string";
    property name="assignedLocId" type="string";
    property name="currentLocId" type="string";
    property name="maintLocId" type="string";
    property name="ownerId" type="string";
    property name="mfgDate" type="string";
    property name="acceptDate" type="string";
    property name="etic" type="string";
    property name="discrep" type="string";
    property name="edd" type="string";
    property name="msnCap" type="string";
    property name="status" type="string";
    property name="nextNdiDate" type="string";
    property name="sentBy" type="string";
    property name="remarks" type="string";
    property name="isValid" type="string";
    property name="valBy" type="string";
    property name="valDate" type="string";
    property name="chgBy" type="string";
    property name="chgDate" type="string";
    property name="dataSource" type="string";
    property name="createDate" type="string";
    property name="createdBy" type="string";
    property name="oldAssetId" type="string";
    property name="tcn" type="string";
    property name="deployedDate" type="string";
    property name="ownerLocId" type="string";
    property name="inTransitShipDate" type="string";
    property name="inTransitRecvDate" type="string";
    property name="shipper" type="string";
    property name="cfoAssetId" type="string";
    property name="isCfoTracked" type="string";
    property name="lotno" type="string";
    property name="effDate" type="string";
    property name="isReportable" type="string";
    property name="nextNdiDue" type="string";
    

	
	

	/* init */
	function init() {
	    /* initialize InvAssets properties */
        setAssetId("");
        setSysId("");
        setSerno("");
        setIsActive("");
        setAssignedLocId("");
        setCurrentLocId("");
        setMaintLocId("");
        setOwnerId("");
        setMfgDate("");
        setAcceptDate("");
        setEtic("");
        setDiscrep("");
        setEdd("");
        setMsnCap("");
        setStatus("");
        setNextNdiDate("");
        setSentBy("");
        setRemarks("");
        setIsValid("");
        setValBy("");
        setValDate("");
        setChgBy("");
        setChgDate("");
        setDataSource("");
        setCreateDate("");
        setCreatedBy("");
        setOldAssetId("");
        setTcn("");
        setDeployedDate("");
        setOwnerLocId("");
        setInTransitShipDate("");
        setInTransitRecvDate("");
        setShipper("");
        setCfoAssetId("");
        setIsCfoTracked("");
        setLotno("");
        setEffDate("");
        setIsReportable("");
        setNextNdiDue("");

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

    /* Validate InvAssets */
    public void function validate() {
        /* validate not null properties */
        if (isNull(getAssetId()) or !len(trim(getAssetId()))) {
            throw (type="InvAssetsException", message="Missing Asset_Id", detail="Please enter in the Asset_Id");
        }
        if (isNull(getSysId()) or !len(trim(getSysId()))) {
            throw (type="InvAssetsException", message="Missing Sys_Id", detail="Please enter in the Sys_Id");
        }
        if (isNull(getSerno()) or !len(trim(getSerno()))) {
            throw (type="InvAssetsException", message="Missing Serno", detail="Please enter in the Serno");
        }
        if (isNull(getIsActive()) or !len(trim(getIsActive()))) {
            throw (type="InvAssetsException", message="Missing Is_Active", detail="Please enter in the Is_Active");
        }
        if (isNull(getStatus()) or !len(trim(getStatus()))) {
            throw (type="InvAssetsException", message="Missing Status", detail="Please enter in the Status");
        }
        if (isNull(getIsValid()) or !len(trim(getIsValid()))) {
            throw (type="InvAssetsException", message="Missing Is_Valid", detail="Please enter in the Is_Valid");
        }
        if (isNull(getChgBy()) or !len(trim(getChgBy()))) {
            throw (type="InvAssetsException", message="Missing Chg_By", detail="Please enter in the Chg_By");
        }
        if (isNull(getChgDate()) or !len(trim(getChgDate()))) {
            throw (type="InvAssetsException", message="Missing Chg_Date", detail="Please enter in the Chg_Date");
        }
        if (isNull(getEffDate()) or !len(trim(getEffDate()))) {
            throw (type="InvAssetsException", message="Missing Eff_Date", detail="Please enter in the Eff_Date");
        }
    
        /* validate numeric properties */
        if (!isNull(getAssetId()) and len(trim(getAssetId())) and !isNumeric(getAssetId())) {
            throw (type="InvAssetsException", message="Asset_Id not a number", detail="Please enter a valid number for Asset_Id");
        }
        if (!isNull(getSysId()) and len(trim(getSysId())) and !isNumeric(getSysId())) {
            throw (type="InvAssetsException", message="Sys_Id not a number", detail="Please enter a valid number for Sys_Id");
        }
        if (!isNull(getAssignedLocId()) and len(trim(getAssignedLocId())) and !isNumeric(getAssignedLocId())) {
            throw (type="InvAssetsException", message="Assigned_Loc_Id not a number", detail="Please enter a valid number for Assigned_Loc_Id");
        }
        if (!isNull(getCurrentLocId()) and len(trim(getCurrentLocId())) and !isNumeric(getCurrentLocId())) {
            throw (type="InvAssetsException", message="Current_Loc_Id not a number", detail="Please enter a valid number for Current_Loc_Id");
        }
        if (!isNull(getMaintLocId()) and len(trim(getMaintLocId())) and !isNumeric(getMaintLocId())) {
            throw (type="InvAssetsException", message="Maint_Loc_Id not a number", detail="Please enter a valid number for Maint_Loc_Id");
        }
        if (!isNull(getOwnerId()) and len(trim(getOwnerId())) and !isNumeric(getOwnerId())) {
            throw (type="InvAssetsException", message="Owner_Id not a number", detail="Please enter a valid number for Owner_Id");
        }
        if (!isNull(getStatus()) and len(trim(getStatus())) and !isNumeric(getStatus())) {
            throw (type="InvAssetsException", message="Status not a number", detail="Please enter a valid number for Status");
        }
        if (!isNull(getOldAssetId()) and len(trim(getOldAssetId())) and !isNumeric(getOldAssetId())) {
            throw (type="InvAssetsException", message="Old_Asset_Id not a number", detail="Please enter a valid number for Old_Asset_Id");
        }
        if (!isNull(getOwnerLocId()) and len(trim(getOwnerLocId())) and !isNumeric(getOwnerLocId())) {
            throw (type="InvAssetsException", message="Owner_Loc_Id not a number", detail="Please enter a valid number for Owner_Loc_Id");
        }
        if (!isNull(getCfoAssetId()) and len(trim(getCfoAssetId())) and !isNumeric(getCfoAssetId())) {
            throw (type="InvAssetsException", message="Cfo_Asset_Id not a number", detail="Please enter a valid number for Cfo_Asset_Id");
        }
    
        /* validate date properties */
        if (!isNull(getMfgDate()) and len(trim(getMfgDate())) and !isDate(getMfgDate())) {
            throw (type="InvAssetsException", message="Mfg_Date not a valid date", detail="Please enter a valid date for Mfg_Date");
        }
        if (!isNull(getAcceptDate()) and len(trim(getAcceptDate())) and !isDate(getAcceptDate())) {
            throw (type="InvAssetsException", message="Accept_Date not a valid date", detail="Please enter a valid date for Accept_Date");
        }
        if (!isNull(getEdd()) and len(trim(getEdd())) and !isDate(getEdd())) {
            throw (type="InvAssetsException", message="Edd not a valid date", detail="Please enter a valid date for Edd");
        }
        if (!isNull(getNextNdiDate()) and len(trim(getNextNdiDate())) and !isDate(getNextNdiDate())) {
            throw (type="InvAssetsException", message="Next_Ndi_Date not a valid date", detail="Please enter a valid date for Next_Ndi_Date");
        }
        if (!isNull(getValDate()) and len(trim(getValDate())) and !isDate(getValDate())) {
            throw (type="InvAssetsException", message="Val_Date not a valid date", detail="Please enter a valid date for Val_Date");
        }
        if (!isNull(getChgDate()) and len(trim(getChgDate())) and !isDate(getChgDate())) {
            throw (type="InvAssetsException", message="Chg_Date not a valid date", detail="Please enter a valid date for Chg_Date");
        }
        if (!isNull(getCreateDate()) and len(trim(getCreateDate())) and !isDate(getCreateDate())) {
            throw (type="InvAssetsException", message="Create_Date not a valid date", detail="Please enter a valid date for Create_Date");
        }
        if (!isNull(getDeployedDate()) and len(trim(getDeployedDate())) and !isDate(getDeployedDate())) {
            throw (type="InvAssetsException", message="Deployed_Date not a valid date", detail="Please enter a valid date for Deployed_Date");
        }
        if (!isNull(getInTransitShipDate()) and len(trim(getInTransitShipDate())) and !isDate(getInTransitShipDate())) {
            throw (type="InvAssetsException", message="In_Transit_Ship_Date not a valid date", detail="Please enter a valid date for In_Transit_Ship_Date");
        }
        if (!isNull(getInTransitRecvDate()) and len(trim(getInTransitRecvDate())) and !isDate(getInTransitRecvDate())) {
            throw (type="InvAssetsException", message="In_Transit_Recv_Date not a valid date", detail="Please enter a valid date for In_Transit_Recv_Date");
        }
        if (!isNull(getEffDate()) and len(trim(getEffDate())) and !isDate(getEffDate())) {
            throw (type="InvAssetsException", message="Eff_Date not a valid date", detail="Please enter a valid date for Eff_Date");
        }
    }
}

