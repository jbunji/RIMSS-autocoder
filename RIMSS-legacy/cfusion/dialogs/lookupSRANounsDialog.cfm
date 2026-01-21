<!DOCTYPE html>
	<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfparam name="form.partno" default="0"/>
<cfparam name="form.lruExists" default="false"/>
<cfparam name="url.configSet" default="0"/>

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset unitLookup = application.sessionManager.getUnitSetting() />

<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset assetLookup = application.objectFactory.create("DbLookups") />

<!---<cfdump var="#form.partno#" >
<cfdump var="#url.configSet#" >
<cfabort>--->
<cfif isDefined("form.insSras")>
	<cfset aNouns = assetLookup.lookupMaintSraNouns(form.partnoId)>
<cfelse>
	<cfset aNouns = assetLookup.lookupSraNouns(form.partno,url.configSet) />
</cfif>



</cfsilent>

<div id="nounsLookup" style="width: 100%;">
	<table class="lookupDialog font10" id="sraNouns" cellpadding="0" cellspacing="0" >
	    <thead>
	    	<cfif ArrayLen(aNouns) gt 0>   
            <tr>
	            <th colspan="1" class="filter">
	              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
	            </th>
	        </tr>
	        </cfif> 
			<tr class="header">
		        <th>NOUN</th>
		       
		    </tr>
		</thead>
		<tbody>
	<cfif ArrayLen(aNouns) gt 0>
		    <cfloop index="idx" from="1" to="#ArrayLen(aNouns)#">
		    <cfset noun = aNouns[idx] />
		    <tr class="sranoun <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="sranoun"><span><cfoutput>#noun#</cfoutput></span></td>
		    </tr>
		    </cfloop>
	    <cfelse>
	        <tr class="sranoun">
	            <td>
	            	No Nouns found for Program: <cfoutput>#encodeForHTML(trim(programLookup))#</cfoutput>, Unit: <cfoutput>#encodeForHTML(trim(unitLookup))#</cfoutput>, and System Category: <cfoutput>#encodeForHTML(trim(sysCatLookup))#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
</div>
<cfif ArrayLen(aNouns) gt 0>
    <script type="text/javascript"> 
        $(document).ready(function() {
			if($("#LRU").val()){
				$("#lruExists").val($("#LRU").val())
			}
						

            $("#sraNouns").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
                    <cfoutput>#toScript(form.typeCode,'imgId')#</cfoutput>
                    // Get previous input (nearest)
                    var obj = $("#" + imgId).closest("td");
					if (!$(obj).hasClass("install")) {
						//$("#assetId").val($.trim($(this).parent().find(".serno").attr("id")));
						$("#sranoun").val($.trim($(this).parent().find(".sranoun").text()));
						$("#newassetId").val('');
						$("#sraserno").val('');
					} else {
						$("#insSraNoun").val($.trim($(this).parent().find(".sranoun").text()));
					}
                    $('#sraNouns').parents('.ui-dialog-content').dialog("close");
                }
            });
			
			var dt = $('.lookupDialog:visible').dataTable({ 
                      "bFilter": true,
                      "sDom":"t"
               });
			   
            $('.lookupDialog:visible').find('#dtSearch').on('keyup',function(e){
				
                    dt.fnFilter($(this).val());
            });
			
        });
    </script><!---
---></cfif>