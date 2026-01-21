<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="false">

    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />
	
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	
    <cfparam name="form.systemcat" default="AIRBORNE" />
    <cfparam name="form.partno" default="" />

    <cftry>
		<cfset tctoLookup = application.objectFactory.create("DbLookups") />
		<cfset tctos = tctoLookup.lookupTctos(programLookup, form.systemcat, form.partno) />
    <cfcatch>
        <cfset tctos = [] />
    </cfcatch>
    </cftry>
	
</cfsilent>

<div id="tctosLookup" style="width: 100%;">
    <table class="lookupDialog font10" id="tctos" cellpadding="0" cellspacing="0" >
        <thead>
        <cfif ArrayLen(tctos) gt 0>   
        <tr>
            <th colspan="2" class="filter">
              <div>Filter Results: <input type="text" id="dtSearch"/></div>      
            </th>
        </tr>
        </cfif> 	
		<tr class="header">
            
			<th>TCTO</th>
			<th>EFF DATE</th>
        </tr></thead>
		<tbody><!---
    ---><cfif ArrayLen(tctos) gt 0>
            <cfloop index="i" from="1" to="#ArrayLen(tctos)#"><!---
            ---><cfset tcto = tctos[i] />
            <tr class="tcto <cfif (i mod 2) eq 0>even<cfelse>odd</cfif>">
                <td class="tctoNo" id='<cfoutput>#tcto.tcto_id#</cfoutput>' data-cttctoid="<cfoutput>#tcto.ct_tcto_id#</cfoutput>" ><span><cfoutput>#tcto.tcto_no#</cfoutput></span></td>
                <td class="effDateLookup" id='effDateLookup'  nowrap="nowrap" ><span><cfoutput>#tcto.eff_date#</cfoutput></span></td>
            </tr><!---
        ---></cfloop>
        <cfelse>
            <tr class="code">
                <td colspan="3">
                    No TCTOs found.
                </td>
            </tr>
        </cfif>
        </tbody>
    </table>
</div><!---
---><cfif ArrayLen(tctos) gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
			var dialogId = $(".ui-dialog-content:visible").attr('id');
			$("#"+dialogId).dialog('option','width',500);
            $("#tctos").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
                    $("#tctoId").val($.trim($(this).parent().find(".tctoNo").attr("id")));
//$("#ctTctoId").val($.trim($(this).parent().find(".tctoNo").data("cttctoid")));                    
                    $("#tctoNo").val($.trim($(this).parent().find(".tctoNo").text()));
                    $("#effDate").val($.trim($(this).parent().find(".effDateLookup").text()));
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