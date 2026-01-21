
component output="false" displayName="AdmVariable" name="AdmVariable" {
	/* properties */
	property name="varId" type="string" ;
    property name="varGroup" type="string" ;
    property name="varValue" type="string" ;
    property name="varType" type="string" ;
    property name="active" type="string" ;
    property name="insBy" type="string" ;
    property name="insDate" type="string" ;
    property name="chgBy" type="string" ;
    property name="chgDate" type="string" ;
    

	
	variables.instance = {
	    varId = "", varGroup = "", varValue = "", varType = "", active = "",
        insBy = "", insDate = "", chgBy = "", chgDate = ""
    };
	

	/* init */
	function init() {
		return this;
	}

	
	 /*INFO:If This Application is to be run under ColdFusion 9 then the following getters and setters can be removed.
	 			If you delete the getters and setters you should enable use-implicit-getters option in serviceconfig.xml present in webroot/WEB-INF/flex */
				
	/* varId accesor */
	function getVarId() {
		return variables.instance.varId;
	}

	function setVarId(value) {
		var variables.instance.varId = arguments.value;
	}
	
    /* varGroup accesor */
	function getVarGroup() {
		return variables.instance.varGroup;
	}

	function setVarGroup(value) {
		var variables.instance.varGroup = arguments.value;
	}
	
    /* varValue accesor */
	function getVarValue() {
		return variables.instance.varValue;
	}

	function setVarValue(value) {
		var variables.instance.varValue = arguments.value;
	}
	
    /* varType accesor */
	function getVarType() {
		return variables.instance.varType;
	}

	function setVarType(value) {
		var variables.instance.varType = arguments.value;
	}
	
    /* active accesor */
	function getActive() {
		return variables.instance.active;
	}

	function setActive(value) {
		var variables.instance.active = arguments.value;
	}
	
    /* insBy accesor */
	function getInsBy() {
		return variables.instance.insBy;
	}

	function setInsBy(value) {
		var variables.instance.insBy = arguments.value;
	}
	
    /* insDate accesor */
	function getInsDate() {
		return variables.instance.insDate;
	}

	function setInsDate(value) {
		var variables.instance.insDate = arguments.value;
	}
	
    /* chgBy accesor */
	function getChgBy() {
		return variables.instance.chgBy;
	}

	function setChgBy(value) {
		var variables.instance.chgBy = arguments.value;
	}
	
    /* chgDate accesor */
	function getChgDate() {
		return variables.instance.chgDate;
	}

	function setChgDate(value) {
		var variables.instance.chgDate = arguments.value;
	}
	
    function toString() {
        return duplicate(variables.instance);
    }
}

