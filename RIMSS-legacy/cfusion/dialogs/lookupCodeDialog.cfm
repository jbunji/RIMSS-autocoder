<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="false">

    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />
	
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	
    <cfparam name="form.systemcat" default="AIRBORNE" />
    <cfparam name="form.partno" default="" />
    <cfparam name="form.typeCode" default="" />
	
	<!--- this is a total work around. the original design was flawed and didn't allow for two of the same dialog code types. i.e.: curr / asgn unit. FIX LATER --->
	<cfif form.typeCode EQ "assignedUnitCode">
		<cfset form.typeCodeParam = "unitCode" />
	<cfelse>
		<cfset form.typeCodeParam = form.typeCode />
	</cfif>
			<!---<cfdump var="#form#">
			<cfabort>--->	
	<cfif isDefined("form.typeMaint")>
		<cfif (((form.typeMaint EQ "2 - PERIODIC INSPECTION") OR (form.typeMaint EQ "P - PERIODIC INSPECTION") OR form.typeMaint EQ "P-PERIODIC - PERIODIC INSPECTION" OR (form.typeMaint EQ "D - SCHEDULED INSPECTION") OR (form.typeMaint EQ "J - SCHEDULED CALIBRATION")) and (form.typeCode EQ "hmCode"))>
			<cfset form.typeCodeParam = "pmiHmCode" />
		</cfif> 
	</cfif>
	<!---<cfdump var="#form#">
	<cfabort>--->
	<cftry>
	    <cfset codeLookup = application.objectFactory.create("DbLookups") />
		<!---<cfset codes = codeLookup.lookupCodesByTypeCode(typeCode, programLookup, form.systemcat, form.partno) />--->
		<cfif form.typeCodeParam EQ "pmiCode">
	   		<cfset codes = codeLookup.lookupInspectionTypeByPMIHowMal(form.howmal) />
	   	<cfelse>
			<cfset codes = codeLookup.lookupCodesByTypeCode(form.typeCodeParam, programLookup, form.systemcat, form.partno) />

		</cfif>	   
    <cfcatch>
        <cfset codes = [] />
    </cfcatch>
    </cftry>
	
</cfsilent>

<div id="codesLookup" style="width: 100%;">
    <table class="lookupDialog font10" id="codes" cellpadding="0" cellspacing="0" >
    	<thead>
		<cfif ArrayLen(codes) gt 0>   
            <tr>
            <th colspan="2" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 
        <tr class="header">
        	
            <th>CODE</th>
            <th>CODE VALUE</th>
        </tr></thead>
		<tbody><!---
    ---><cfif ArrayLen(codes) gt 0>
            <cfloop index="i" from="1" to="#ArrayLen(codes)#"><!---
            ---><cfset code = codes[i] />
            <tr class="code <cfif (i mod 2) eq 0>even<cfelse>odd</cfif>">
                <td class="codeValue" id='<cfoutput>#code.code_Id#</cfoutput>'><span><cfoutput>#code.code_value#</cfoutput></span></td>
                <td class="codeDescription"><span><cfoutput>#code.description#</cfoutput></span></td>
            </tr><!---
        ---></cfloop>
        <cfelse>
            <tr class="code">
                <td colspan="3">
                    No codes found for CODE TYPE: <cfoutput>#encodeForHTML(trim(form.typeCodeParam))#</cfoutput>
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif ArrayLen(codes) gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
            var dialogId = $(".ui-dialog-content:visible").attr('id');
            $("#codes").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					<cfoutput>#toScript(form.typeCode,'imgId')#</cfoutput>
		            // Get previous input (nearest)
					var inputValue = '';
					var lookupIcon = $("#" + imgId);
		            var obj = $(lookupIcon).prevAll("input[type=text]:first");
					var objId = $(lookupIcon).prevAll("input[type=hidden]:first");
                    $(objId).val($.trim($(this).parent().find(".codeValue").attr("id")));

					if($(lookupIcon).hasClass("codeOnly")){
					   inputValue += $.trim($(this).parent().find(".codeValue").text());	
					
					}

					if($(lookupIcon).hasClass("descriptionOnly")){
					   	if ($(lookupIcon).hasClass("codeOnly")) {
						  inputValue += " - ";
						}
						
                       inputValue += $.trim($(this).parent().find(".codeDescription").text()); 
                    
                    }
					
					if ($.trim($(this).parent().find(".codeValue").text()) == "T") {
						$("#luPartNo").attr('disabled', false);
					}
					
					if(!$(lookupIcon).hasClass('codeOnly') && !$(lookupIcon).hasClass('descriptionOnly')){
					   inputValue = $.trim($(this).parent().find(".codeValue").text()) + " - " + $.trim($(this).parent().find(".codeDescription").text());
					}

                    $(obj).val(inputValue);
					$(obj).change();
                    $('#'+dialogId).dialog("close");
                }
				
            });
			
			var dt = $('.lookupDialog:visible').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });
            $('#dtSearch').on('keyup',function(e){
                    dt.fnFilter($(this).val());
            });
			
        });
    </script><!---
---></cfif>