<!DOCTYPE html>
	<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfparam name="form.partno" default="0"/>

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset unitLookup = application.sessionManager.getUnitSetting() />

<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset assetLookup = application.objectFactory.create("DbLookups") />
<cfset aSRAAssets = assetLookup.lookupSraAssetsByNoun(form.sranoun, application.sessionManager.getLocIdSetting()) />

</cfsilent>
<div id="sraassetsLookup" style="width: 100%;">
 <form name="lookupSRAAssetByPartOrderNounDialogForm" id="lookupSRAAssetByPartOrderNounDialogForm">
	<table class="lookupDialog font10" id="sraAssetsNoun" cellpadding="0" cellspacing="0" >
	    <thead>
	    <cfif ArrayLen(aSRAAssets) gt 0>   
        <tr>
            <th colspan="3" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 	
		<tr class="header">
	        <th>SERNO</th>
			<th>PARTNO</th>
			<th>NSN</th>
	    </tr></thead>
		<tbody><!---
	---><cfif ArrayLen(aSRAAssets) gt 0>
		    <cfloop index="idx" from="1" to="#ArrayLen(aSRAAssets)#"><!---
		    ---><cfset sraAsset = aSRAAssets[idx] />
		    <tr class="asset <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="serno" id='<cfoutput>#sraAsset.asset_id#</cfoutput>'>
		        	<span><cfoutput>#sraAsset.serno#</cfoutput></span>
		        </td>
		        <td class="partno">
		        	<cfoutput><span id="#sraAsset.partno_id#">#sraAsset.partno#</span></cfoutput>
		        </td>
				<td class="nsn">
		        	<span><cfoutput>#sraAsset.nsn#</cfoutput></span>
		        </td>
		    </tr><!---
		---></cfloop>
	    <cfelse>
	        <tr class="sranoun">
	            <td colspan="3">
	            	No SRA Assets found for <cfoutput>#encodeForHTML(trim(form.sranoun))#</cfoutput> <br/> Program: <cfoutput>#encodeForHTML(trim(programLookup))#</cfoutput>, Unit: <cfoutput>#unitLookup#</cfoutput>, and System Category: <cfoutput>#encodeForHTML(trim(sysCatLookup))#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
	<cfoutput>
		<input type="hidden" name="lookUpId" id="lookUpId" value="#encodeForHTML(form.id)#">
	</cfoutput>
 </form>
</div><!---
---><cfif ArrayLen(aSRAAssets) gt 0>
    <script type="text/javascript"> 
        $(document).ready(function() {
            $("#sraAssetsNoun").delegate("td", "click mouseover mouseout", function(e) {
				
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
                    <cfoutput>#toScript(form.typeCode,'imgId')#</cfoutput>
                    // Get previous input (nearest)
                    var obj = $("#" + imgId).closest("td");
					
					var today = new Date();
					var time = today.getHours()+':'+today.getMinutes();
					var day = ("0" + today.getDate()).slice(-2);
					var month = new Date(today).format("mmm");
					var year = today.getFullYear();
					
					if (day.length == 1) {
						day = '0' + day;
					}
					var now = time + ' <br/> ' + day + '-' + month + '-' + year;
					
                    $("#insSraAssetId_" + $('#lookUpId').val()).val($.trim($(this).parent().find(".serno").attr("id")));
                    $("#insSraSerno_" + $('#lookUpId').val()).val($.trim($(this).parent().find(".serno").text()));
                    $("#insSraPartno_" + $('#lookUpId').val()).val($.trim($(this).parent().find(".partno").text()));
					//$("#fillDate_" + $('#lookUpId').val()).parent().html(now);
					
					var s = getRootPath().toUpperCase();
					var program = $("#prog").val();
					var url = s + "/"+program+"/controller/maintenanceController.cfc";
					
					$.post(
              			url,
              			{
               				method:"partOrderedFilled",
			   				orderId: $('#lookUpId').val(),
							repAssetId: $("#insSraAssetId_" + $('#lookUpId').val()).val()
              			}, function(){
          						$(".message").addClass("global_info_msg").html("Reloading page...");
								alert('The part order has been filled');
								location.reload();
							});
					
                    $('#sraPartOrderAssetlookup').dialog("close");
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