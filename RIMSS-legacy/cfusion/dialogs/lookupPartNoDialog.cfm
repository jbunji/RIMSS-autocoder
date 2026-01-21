<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="false">

    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />
	
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	
    <cfparam name="form.systemcat" default="AIRBORNE" />
		
	<cftry>
	    <cfset partLookup = application.objectFactory.create("DropDownDao") />
	   <cfset parts = partLookup.getPartsByNounPart(noun="#form.sraNoun#") />
    <cfcatch>
        <cfset parts = "" />		
    </cfcatch>
    </cftry>
	
</cfsilent>

<div id="partNoLookup" style="width: 100%;">
    <table class="lookupDialog font10" id="parts" border="1" style="width: 100%;" cellpadding="0" cellspacing="0" >
    	<thead>
		<cfif parts.recordcount gt 0>   
            <tr>
            <th colspan="3" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 
        <tr class="header">
        	
            <th>Noun</th>
            <th>Part No</th>
            <th>NSN</th>
        </tr></thead>
		<tbody><!--- --->
    	<cfif parts.recordcount gt 0>
            <cfloop index="i" from="1" to="#parts.recordcount#"><!---
            --->
            <tr class="part <cfif (i mod 2) eq 0>even<cfelse>odd</cfif>">
                <td class="noun"><span><cfoutput>#parts.noun[i]#</cfoutput></span></td>
                <td class="partId" id='<cfoutput>#parts.partno_id[i]#</cfoutput>' data-partnoNum='<cfoutput>#parts.partno[i]#</cfoutput>'><span><cfoutput>#parts.partno[i]#</cfoutput></span></td>
				<td class="nsn" id='<cfoutput>#parts.nsn[i]#</cfoutput>'><span><cfoutput>#parts.nsn[i]#</cfoutput></span></td>
            </tr><!---
        ---></cfloop>
        <cfelse>
            <tr class="part">
                <td colspan="3">
                    No Parts found for Noun: <cfoutput>#encodeForHTML(trim(form.sraNoun))#</cfoutput>
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif parts.recordcount gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
            var dialogId = $(".ui-dialog-content:visible").attr('id');
            $("#parts").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					$("#sraPartnoId").val($.trim($(this).parent().find(".partId").attr("id")));
					$("#sraPartno").val($.trim($(this).parent().find(".partId").text()));
					$("#sraNsn").val($.trim($(this).parent().find(".nsn").attr("id")));
                    $('#dialogPartNoLookup').dialog("close");
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