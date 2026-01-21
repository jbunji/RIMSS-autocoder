<!DOCTYPE html>
<cfsilent>
    
    <!--- don't use a template on this page.  will be used as a dialog box. --->
    <cfsetting showDebugOutput="no">

    <cfset startTime = getTickCount() />

    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />
    
    <cfparam name="form.nhaPartno" default="" />

    <cfset javaLogger.info(serializeJSON(form)) />
    
    <cfset assetLookup = application.objectFactory.create("DbLookups") />

    <cftry>
        <cfset sraAssets = assetLookup.lookupSRAAssetsByNhaPartno(form.nhaPartno) />
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
        </tr></thead><tbody><!---
    ---><cfif ArrayLen(sraAssets) gt 0>
            <cfloop index="idx" from="1" to="#ArrayLen(sraAssets)#"><!---
            ---><cfset sra = sraAssets[idx] />
            <tr class="sra <cfif (idx mod 2) eq 0>even<cfelse>odd</cfif>">
                <td class="sraNoun"><span><cfoutput>#sra.noun#</cfoutput></span></td>
                <td class="partno">
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
                    No SRA assets found for PART NO: <cfoutput>#encodeForHTML(trim(form.nhaPartno))#</cfoutput>
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif ArrayLen(sraAssets) gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
            var dialogId = $(".ui-dialog:visible").attr('id');
            $("#sraAssets").delegate("td", "click mouseover mouseout", function(e) {
			console.log(e);
                if (e.type == "mouseover") {
					
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
                    <cfoutput>#toScript(form.typeCode,'imgId')#</cfoutput>
                    // Get previous input (nearest)
                    var obj = $("#" + imgId).closest("tbody");
//                    $(obj).find('.sraNoun').val($.trim($(this).parent().find(".sraNoun").text()));
//                    $(obj).find('.sraId').val($.trim($(this).parent().find(".serno").attr('id')));
//                    $(obj).find('.sraSerno').val($.trim($(this).parent().find(".serno").text()));
//                    $(obj).find('.sraPartno').val($.trim($(this).parent().find(".partno").text()));
//                    $(obj).find('.sraNsn').val($.trim($(this).parent().find(".nsn").text()));
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
    var stopTime = new Date().getTime();
	//console.log(stopTime);
    </script><!---
---></cfif>
    <cfset stopTime = getTickCount() />
    <cfset javaLogger.info("Start Time: " & startTime & " and Stop Time: " & stopTime & " [" & (stopTime - startTime) & "]") />
