<!DOCTYPE html>
	<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfparam name="form.partno" default="0"/>
<cfparam name="form.partnoid" default="0"/>

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset unitLookup = application.sessionManager.getUnitSetting() />

<cfset sysCatLookup = "AIRBORNE" />
<cfif IsDefined("form.systemcat")>
    <cfset sysCatLookup = ucase(form.systemcat) />
</cfif>

<cfset assetLookup = application.objectFactory.create("DbLookups") />

<cfset aSRAAssets = assetLookup.lookupSraAssetsByNoun(form.sranoun,application.sessionManager.getLocIdSetting()) />
<!---<cfset aSRAAssets = assetLookup.lookupSraAssetByParentPart(form.sranoun,form.partnoid) />--->

</cfsilent>
<div id="sraassetsLookup" style="width: 100%;">
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
					if (!$(obj).hasClass('install')) {
						$("#newassetId").val($.trim($(this).parent().find(".serno").attr("id")));
						$("#assetid").val($.trim($(this).parent().find(".serno").attr("id")));
						$("#sraserno").val($.trim($(this).parent().find(".serno").text()));
						$("#srapartno").val($.trim($(this).parent().find(".partno").text()));
						$("#sransn").val($.trim($(this).parent().find(".nsn").text()));
						$("#newpartnoId").val($.trim($(this).find('span').prop('id')));
						$("#srapartnoid").val($.trim($(this).find('span').prop('id')));
					} else {
                        $("#insSraAssetId").val($.trim($(this).parent().find(".serno").attr("id")));
                        $("#insSraSerno").val($.trim($(this).parent().find(".serno").text()));
                        $("#insSraPartno").val($.trim($(this).parent().find(".partno").text()));
                        $("#insSraNsn").val($.trim($(this).parent().find(".nsn").text()));
					}
                    $('#sraAssetlookup').dialog("close");
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