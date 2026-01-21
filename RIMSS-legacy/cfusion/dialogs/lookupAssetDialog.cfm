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

<cfset assetLookup = application.objectFactory.create("DbLookups") />
<cfif structKeyExists(url,"sender")>	
	<cftry>
	    <cfset assets = assetLookup.lookupUserAssets(programLookup, unitLookup, sysCatLookup, "true") />
		<cfcatch>
			<cfset assets = []/>
		</cfcatch>
	</cftry>
<cfelse>
	<cftry>
	    <cfset assets = assetLookup.lookupUserAssets(programLookup, unitLookup, sysCatLookup) />
		<cfcatch>
			<cfset assets = []/>
		</cfcatch>
	</cftry>
</cfif>

</cfsilent>

<!---<cfif ArrayLen(assets) gt 0>
    <div class="filterResult">Filter Results: <input type="text" id="dtSearch"/></div>      
</cfif>--->
<div id="assetsLookup" style="width: 100%;">


	<table class="lookupDialog font10" id="userAssets" cellpadding="0" cellspacing="0" >
	    <thead>
	    <cfif ArrayLen(assets) gt 0>	
		<tr>
		    <th colspan="3" class="filter">
	          <div>Filter Results: <input type="text" id="dtSearch"/></div>      
	        </th>
		</tr>
		</cfif>	
		<tr class="header">
	        <th>NOUN</th>
	        <th>SERNO</th>
	        <th>PARTNO</th>
	    </tr></thead>
		<tbody><!---
	---><cfif ArrayLen(assets) gt 0>
		    <cfloop index="idx" from="1" to="#ArrayLen(assets)#"><!---
		    ---><cfset userAsset = assets[idx] />
		    <tr class="asset <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="noun"><span><cfoutput>#userAsset.NOUN#</cfoutput></span></td>
		        <td class="serno" id='<cfoutput>#userAsset.asset_id#</cfoutput>' data-systype="<cfoutput>#userAsset.sys_type#</cfoutput>" data-ctassetid="<cfoutput>#userAsset.ct_asset_id#</cfoutput>" data-etmstart="<cfoutput>#userAsset.etm_start#</cfoutput>" data-partnoid="<cfoutput>#userAsset.partno_id#</cfoutput>">
		        	<span><cfoutput>#userAsset.serno#</cfoutput></span>
		        </td>
		        <td class="partno">
		        	<span><cfoutput>#userAsset.partno#</cfoutput></span>
		        </td>		        
		    </tr><!---
		---></cfloop>
	    <cfelse>
	        <tr class="asset">
	            <td colspan="3">
	            	No assets found for Program: <cfoutput>#encodeForHTML(programLookup)#</cfoutput>, Unit: <cfoutput>#encodeForHTML(unitLookup)#</cfoutput>, and System Category: <cfoutput>#encodeForHTML(sysCatLookup)#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
</div><!---
---><cfif ArrayLen(assets) gt 0>
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
            $("#userAssets").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					$("#assetId").val($.trim($(this).parent().find(".serno").attr("id")));
					$("#nhaassetId").val($.trim($(this).parent().find(".serno").attr("id")));
					try{
                    	$("#ctAssetId").val($.trim($(this).parent().find(".serno").data("ctassetid")));
                    }catch(err){}
					$("#serno").val($.trim($(this).parent().find(".serno").text()));
					$("#partno").val($.trim($(this).parent().find(".partno").text()));
					$("#systype").val($.trim($(this).parent().find(".serno").data("systype")));
					$("#etmStart").val($.trim($(this).parent().find(".serno").data("etmstart")));
					$("#origEtmStart").val($.trim($(this).parent().find(".serno").data("etmstart")));
					try{
						$("#partnoId").val($.trim($(this).parent().find(".serno").data("partnoid")));
					}catch(err){}
					try{
						if($(this).parent().find(".serno").data("systype") == 'PART')
							$('.etmClass').hide();
						else
							$('.etmClass').show();
							
					}catch(err){}
					
                    $('#assetlookup').dialog("close");
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