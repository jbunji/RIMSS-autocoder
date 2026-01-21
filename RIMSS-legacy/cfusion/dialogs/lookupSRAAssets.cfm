<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="no">

    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />
	
	<cfparam name="form.nhaAssetId" default="" />
    <cfparam name="form.nhaSerno" default="" /> <!--- not really used except for "No SRA asset..." message --->
    <cfset javaLogger.info(serializeJSON(form)) />
	
	<cfset assetLookup = application.objectFactory.create("DbLookups") />
	
	<cftry>
	    <cfset sraAssets = assetLookup.lookupSRAAssets(form.nhaAssetId) />
	    <cfcatch>
	        <cfset sraAssets = []/>
	    </cfcatch>
	</cftry>
	
</cfsilent>
<div id="assetsLookup" style="width: 100%;">
    <table class="lookupDialog font10" id="sraAssets" cellpadding="0" cellspacing="0" >
        <thead>
        <cfif ArrayLen(sraAssets) gt 0>   
        <tr>
            <th colspan="4" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif>	
		<tr class="header">
            <th>SRA NOUN</th>
            <th>SRA PARTNO</th>
			<th>SRA NSN</th>
            <th>SRA SERNO</th>
        </tr></thead>
		<tbody><!---
    ---><cfif ArrayLen(sraAssets) gt 0>
            <cfloop index="idx" from="1" to="#ArrayLen(sraAssets)#"><!---
            ---><cfset sra = sraAssets[idx] />
            <tr class="sra <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">            	
                <td class="sraNoun"><span><cfoutput>#sra.noun#</cfoutput></span></td>
                <td class="partno" id="<cfoutput>#sra.partnoid#</cfoutput>">
                    <span><cfoutput>#sra.partno#</cfoutput></span>
                </td>
                <td class="nsn" id='<cfoutput>#sra.nsn#</cfoutput>'>
                    <span><cfoutput>#sra.nsn#</cfoutput></span>
                </td>
                <td class="serno" id='<cfoutput>#sra.asset_id#</cfoutput>'>
                    <span><cfoutput>#sra.serno#</cfoutput></span>
                </td>
            </tr><!---
        ---></cfloop>
        <cfelse>
            <tr class="asset">
                <td colspan="4">
                    No SRA assets found for ASSET: <cfoutput>#encodeForHTML(trim(form.nhaSerno))#</cfoutput>
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif ArrayLen(sraAssets) gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
            var dialogId = $(".ui-dialog-content:visible").attr('id');
            $("#sraAssets").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					
                    <cfoutput>#toScript(form.typeCode,'imgId')#</cfoutput>
                    // Get previous input (nearest)
                    var obj = $("#" + imgId).closest("tbody");
					
					
                    $(obj).find('input.sraNoun').val($.trim($(this).parent().find(".sraNoun").text()));
					$(obj).find('input.sraId').val($.trim($(this).parent().find(".serno").attr('id')));
                    $(obj).find('input.sraSerno').val($.trim($(this).parent().find(".serno").text()));
                    $(obj).find('input.sraPartno').val($.trim($(this).parent().find(".partno").text()));
                    $(obj).find('input.sraNsn').val($.trim($(this).parent().find(".nsn").text()));
					$(obj).find('input.sraPartnoId').val($.trim($(this).parent().find(".partno").attr('id')));
                    $('#'+dialogId).dialog("close");
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