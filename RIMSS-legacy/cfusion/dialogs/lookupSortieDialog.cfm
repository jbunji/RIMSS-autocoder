<!DOCTYPE html>
	<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset unitLookup = application.sessionManager.getUnitSetting() />

<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset sortieLookup = application.objectFactory.create("DbLookups") />


<cftry>
    <cfset sorties = sortieLookup.lookupSorties(programLookup, unitLookup, sysCatLookup, form.asset) />
	<cfcatch>
		<cfset sorties = []/>
	</cfcatch>
</cftry>

</cfsilent>

<!---<cfif ArrayLen(assets) gt 0>
    <div class="filterResult">Filter Results: <input type="text" id="dtSearch"/></div>      
</cfif>--->
<div id="sortiesLookup" style="width: 100%;">


	<table class="lookupDialog font10" id="userSorties" cellpadding="0" cellspacing="0" >
	    <thead>
	    <cfif ArrayLen(sorties) gt 0>	
		<tr>
		    <th colspan="3" class="filter">
	          <div>Filter Results: <input type="text" id="dtSearch"/></div>      
	        </th>
		</tr>
		</cfif>	
		<tr class="header">
	        <th>MISSION ID</th>
	        <th>UNIT</th>
	        <th>SERNO</th>
	    </tr></thead>
		<tbody><!---
	---><cfif ArrayLen(sorties) gt 0>
		    <cfloop index="idx" from="1" to="#ArrayLen(sorties)#"><!---
		    ---><cfset userSortie = sorties[idx] />
		    <tr class="sortie <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="missionid"><span><cfoutput>#userSortie.mission_id#</cfoutput></span></td>
		        <td class="unit" id='<cfoutput>#userSortie.sortie_id#</cfoutput>' data-serno="<cfoutput>#userSortie.serno#</cfoutput>" data-sortieid="<cfoutput>#userSortie.sortie_id#</cfoutput>" data-missionid="<cfoutput>#userSortie.mission_id#</cfoutput>">
		        	<span><cfoutput>#userSortie.CURRENT_UNIT_VALUE#</cfoutput></span>
		        </td>
		        <td class="tailNo">
		        	<span><cfoutput>#userSortie.SERNO#</cfoutput></span>
		        </td>
		    </tr><!---
		---></cfloop>
	    <cfelse>
	        <tr class="sortie">
	            <td colspan="3">
	            	The request for Non-Effective sorties for this asset resulted in no records found. 
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	    </tbody>
	</table>
</div><!---
---><cfif ArrayLen(sorties) gt 0>
    <script type="text/javascript">
        function getCodeValue(codeId) {
            var result = "";

            // set ajax post to synchronous
            $.ajaxSetup({
                async: false
            });
            
            //load code information
            $.post(
               "<cfoutput>#application.rootpath#</cfoutput>cfc/controller/EventController.cfc",
               {
                method:"getCode",
                codeId: codeId,
                returnFormat: "json"
               },
               function(codeData) {
                  var codeObj = $.parseJSON(codeData);
                  result = codeObj.codeValue;
               }
            );

            // set ajax post back to asynchronous
            $.ajaxSetup({
                async: true
            });

            return result;
        }
        
        $(document).ready(function() {
            $("#userSorties").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					$("#sortieId").val($.trim($(this).parent().find(".unit").data("sortieid")));
					$("#mission").val($.trim($(this).parent().find(".unit").data("missionid")));
                    $('#dialogLookup').dialog("close");
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