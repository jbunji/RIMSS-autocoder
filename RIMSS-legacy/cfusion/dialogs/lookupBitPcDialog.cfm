<!DOCTYPE html>
	<cfsilent>

<!--- don't use a template on this page.  will be used as a dialog box. --->
<cfsetting showDebugOutput="no">

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset utils = new cfc.utils.utilities()/>
<cfset code = application.objectFactory.create("CodeService") />

<cfset programLookup = application.sessionManager.getProgramSetting() />
<cfset programIdLookup = application.sessionManager.getProgramIdSetting() />
<cfset sysLookup = dbUtils.getSysIdByProgram(programLookup)/>

<cfset sysVal = code.getCode(val(sysLookup)).getCodeValue()/>


<cfset getBitPC = dbUtils.getBitPC()/>
<cfset bitList = ""/>

<cfif Structkeyexists(form,"bitPcId")>
    <cfset bitList = form.bitPcId/>
</cfif>


</cfsilent>

<div id="bitPcLookup" style="width: 100%;">


	<table class="lookupDialog font8" id="bitPcList" cellpadding="0" cellspacing="0" >
	    <thead>
	    <cfif getBitPC.recordcount gt 0>	
		<tr>
		    <th colspan="3" class="filter">
	          <div>Filter Results: <input type="text" id="dtSearch"/></div>      
	        </th>
		</tr>
		</cfif>	
		<tr class="header">
	        <th>Part No</th>
	        <th>Noun</th>
			<th>&nbsp;</th>
	    </tr></thead>
		<tbody><!---
	---><cfif getBitPC.recordcount gt 0>
		    <cfloop query="getBitPc"><!---<cfset swIdEncrypt = utils.encryptId(sw_id)/>---><!---
		    --->
		    <tr class="bit <cfif (currentrow mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="partno"><span><cfoutput>#encodeForHTML(partno)#</cfoutput></span></td>
		        <td class="noun" >
		        	<span><cfoutput>#encodeForHTML(noun)#</cfoutput></span>
		        </td>
				<td class="bitPcId noSort"  >
                    <!---<span><input name="loadedBits"  value = "#pn_cd_id#" class="loadedBits" type="checkbox"/></span>--->
                    <span><input name="loadedBitPc" id='<cfoutput>#encodeForHTML(partno)#</cfoutput>' <cfoutput>value = "#encodeForHTML(partno)#"</cfoutput> <cfif ListFindNocase(bitList,partno)>checked="checked"</cfif>  class="loadedBitPc" type="checkbox"/></span>
                </td>
		    </tr><!---
		---></cfloop>
	    <cfelse>
	        <tr class="asset">
	            <td colspan="3">
	            	No Bit/Pieces found for System: <cfoutput>#sysVal#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
</div><!---
---><cfif getBitPc.recordcount gt 0>
    <script type="text/javascript">
        
        $(document).ready(function() {
			
			$("#bitPcId").val(getCheckedValues());
			
			$(".loadedBitPc").each(function(event){
				if($(this).is(":checked")){
				    $(this).parents("tr").addClass("highlightStatic");    
				}else{
					$(this).parents("tr").removeClass("highlightStatic");
				}   
				
			});
			
            $("#bitPcList").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					var rowCheckBox = $(this).parents("tr").find(".loadedBitPc");
					if($(rowCheckBox).is(":checked")){
						$(rowCheckBox).removeAttr("checked");
						$(this).parents("tr").removeClass("highlightStatic");
					}else{
						$(rowCheckBox).attr("checked",true);
						$(this).parents("tr").addClass("highlightStatic");
					}  
					
					getCheckedValues();
					$("#bitPcId").val(getCheckedValues());
					updateTable();
                    
					
                }
            });

			
			$(".loadedBitPc").on("click",function(event){
			     if($(this).is(":checked")){
                        $(this).removeAttr("checked");
                        $(this).parents("tr").removeClass("highlightStatic");
                    }else{
                        $(this).attr("checked",true);
                        $(this).parents("tr").addClass("highlightStatic");
                    } 
					
					getCheckedValues(); 
					$("#bitPcId").val(getCheckedValues());
					updateTable();
	
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