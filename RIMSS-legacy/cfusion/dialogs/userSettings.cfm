
<script>
	
	$(function(){
		$("#program").bind("change", function(){  // When program changes values
			var program = $("#program option:selected").text();  // Get the current selection
			$("#unit").empty().append($("<option></option>").text("Loading..."));  // Empty UNIT DD and supply Loading feedback
			
			// 
			$.ajax({
				type: "POST",
				url: "/RIMSS/cfc/facade/SessionFacade.cfc?method=remoteSetProgramSetting&returnFormat=json",
				data:{'program':program},   
		  		dataType: 'json',  
				success : function (data) {
					$("#unit").empty();
					$.each(data["DATA"], function(key,value){
						$("#unit").append($("<option></option>").data("unit", value[1]).val(value[0]).text(value[2]));
					});
				}
			});
		});
	})
		
</script>

<cfsilent>
	
	<cfsetting showdebugoutput="false"/>	

	<!--- load session user security module --->
	<cfset userModel = application.sessionManager.getUserModel() />
	<cfset programs = "" />
	<cfset units = "" />
	<cfif (IsDefined("userModel")) >
	    <cfset dbUtils = application.objectFactory.create("DbUtils") />
	    <cfif application.sessionManager.isUserLoggedOn() >
	        <cfset programs = dbUtils.getUserPrograms(userModel) />
	        <cfset units = dbUtils.getUserUnits(userModel) />
	    </cfif>
	</cfif>
	
	<!--- If user only has one program and unit then default the session to these --->
	<cfif (IsDefined("programs") and !IsSimpleValue(programs)) >
	    <cfif programs.recordcount eq 1 >
	        <cfset application.sessionManager.setProgramSetting(programs.CODE_VALUE) />
	        <cfset application.sessionManager.setProgramIdSetting(programs.CODE_ID) />
	    </cfif>
	</cfif>
	
	<cfif (IsDefined("units") and !IsSimpleValue(units)) >
	    <cfif units.recordcount eq 1 >
	        <cfset application.sessionManager.setUnitSetting(units.UNIT) />
	        <cfset application.sessionManager.setLocIdSetting(units.LOC_ID) />
	    </cfif>
	</cfif>
	
	<!--- define user settings --->
	<cfset programInSession = application.sessionManager.getProgramSetting() />
	<cfset programIdInSession = application.sessionManager.getProgramIdSetting() />
	<cfset unitInSession = application.sessionManager.getUnitSetting() />
	<cfset locIdInSession = application.sessionManager.getLocIdSetting() />
    <cfset sourceCatInSession = application.sessionManager.getSourceCatSetting() />
    <cfset maintLevelInSession = application.sessionManager.getMaintLevelSetting() />
	
	<!--- default drop down values --->
	<cfset maintLevel = {"D" = "DEPOT","I" = "SHOP"}/>
	<cfif application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_ALL") 
		or (application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_SHOP") 
		and application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_DEPOT"))>
	   <cfset maintLevel = {"D" = "DEPOT","I" = "SHOP"}/>
	<cfelseif application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_DEPOT")>
		<cfset maintLevel = {"D" = "DEPOT"}/>
		<cfset maintLevelInSession = application.sessionManager.getMaintLevelSetting("DEPOT") />
		<cfset application.sessionManager.setSourceCatSetting("D") />
	<cfelseif application.sessionManager.userHasPermission("ACCESS_EVENT_TYPE_SHOP")>
        <cfset maintLevel = {"I" = "SHOP"}/>
		<cfset maintLevelInSession = application.sessionManager.getMaintLevelSetting("SHOP") />	
		<cfset application.sessionManager.setSourceCatSetting("I") />
	</cfif>
	
	
	
</cfsilent>
<cfoutput>

<table width='100%'>
    <tr>
        <td width='20%'>Program: </td>
        <td width='80%'>
            <select id='program' name='program' width='100' style="width:215px">
                <option value="">Select...</option>
                <cfif IsDefined("programs") and isQuery(programs) and programs.recordcount gt 1>
                    <cfloop query="programs" >
                        <cfset thisProgram = programs.CODE_VALUE />
                        <cfset thisProgramId = programs.CODE_ID />
                        <option value="#encodeForHTML(thisProgramId)#" <cfif thisProgramId eq programIdInSession>selected="selected"</cfif>>#encodeForHTML(thisProgram)#</option>
                    </cfloop>
                <cfelseif IsDefined("programs") and isQuery(programs) and programs.recordcount eq 1 >
                    <cfset thisProgram = programs.CODE_VALUE />
                    <cfset thisProgramId = programs.CODE_ID />
                    <option value="#encodeForHTML(thisProgramId)#" selected="selected">#encodeForHTML(thisProgram)#</option>
                </cfif>
            </select>
        </td>
    </tr>
    <tr>
        <td width='20%'>Unit: </td>
        <td width='80%'>
            <select id='unit' name='unit' width='100' style="width:215px">
                <option value="">Select...</option>
                <cfif IsDefined("units") and isQuery(units) and units.recordcount gt 1>
                    <cfloop query="units" >
                        <cfset thisUnit = units.UNIT />
                        <cfset thisLocId = units.LOC_ID />
                        <option value="#encodeForHTML(thisLocId)#"  data-unit="#encodeForHTML(UNIT)#" <cfif thisLocId eq locIdInSession>selected="selected"</cfif>>#encodeForHTML(SITE)#</option>
                    </cfloop>
                <cfelseif IsDefined("units") and isQuery(units) and units.recordcount eq 1 >
                    <cfset thisUnit = units.UNIT />
                    <cfset thisLocId = units.LOC_ID />
                    <option value="#thisLocId#" selected="selected" data-unit="#units.UNIT#">#units.site#</option>
                </cfif>
            </select>
        </td>
    </tr>
	<tr>
        <td width='20%'>Maint Level: </td>
        <td width='80%'>
            <select id='maintLevel' name='maintLevel' width='100' style="width:215px">
                <option value="">Select...</option>
				<cfloop collection = "#maintLevel#" item="key">
				    <option value="#key#" <cfif sourceCatInSession eq "#key#">selected="selected"</cfif> >#maintLevel[key]#</option>
				</cfloop>
						
				<!---<option value="D" <cfif sourceCatInSession eq "D">selected="selected"</cfif> >DEPOT</option>
				<option value="I" <cfif sourceCatInSession eq "I">selected="selected"</cfif> >SHOP</option>--->
            </select>
        </td>
	</tr>
</table>
</cfoutput>


