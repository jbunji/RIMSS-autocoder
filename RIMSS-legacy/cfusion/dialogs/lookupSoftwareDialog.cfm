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


<cfset getSoftwareList = dbUtils.getSoftwareBySysId(sysLookup)/>
<cfset swList = ""/>
<cfif Structkeyexists(form,"swId")>
    <cfset swList = form.swId/>
</cfif>


</cfsilent>

<div id="softwareLookup" style="width: 100%;">


	<table class="lookupDialog font10" id="softwareList" cellpadding="0" cellspacing="0" >
	    <thead>
	    <cfif getSoftwareList.recordcount gt 0>	
		<tr>
		    <th colspan="3" class="filter">
	          <div>Filter Results: <input type="text" id="dtSearch"/></div>      
	        </th>
		</tr>
		</cfif>	
		<tr class="header">
	        <th>NUMBER</th>
	        <th>TITLE</th>
			<th>&nbsp;</th>
	    </tr></thead>
		<tbody><!---
	---><cfif getSoftwareList.recordcount gt 0>
		    <cfloop query="getSoftwareList"><cfset swIdEncrypt = utils.encryptId(sw_id)/><!---
		    --->
		    <tr class="sw <cfif (currentrow mod 2) eq 0>even<cfelse>odd</cfif>">
		        <td class="number"><span><cfoutput>#encodeForHTML(sw_number)#</cfoutput></span></td>
		        <td class="title" >
		        	<span><cfoutput>#encodeForHTML(sw_title)#</cfoutput></span>
		        </td>
				<td class="swId noSort"  >
                    <span><input name="loadedSoftware" id='<cfoutput>#swIdEncrypt#</cfoutput>' <cfoutput>value = "#swIdEncrypt#"</cfoutput> <cfif ListFindNocase(swList,swIdEncrypt)>checked="checked"</cfif>  class="loadedSoftware" type="checkbox"/></span>
                </td>
		    </tr><!---
		---></cfloop>
	    <cfelse>
	        <tr class="asset">
	            <td colspan="3">
	            	No software found for System: <cfoutput>#sysVal#</cfoutput>
	            </td>
			</tr>
	    </cfif>
	    </tbody>
	</table>
</div><!---
---><cfif getSoftwareList.recordcount gt 0>
    <script type="text/javascript">
        
        $(document).ready(function() {
			
			$("#spareSoftwareId").val(getCheckedValues());
			
			$(".loadedSoftware").each(function(event){
				if($(this).is(":checked")){
				    $(this).parents("tr").addClass("highlightStatic");    
				}else{
					$(this).parents("tr").removeClass("highlightStatic");
				}   
				
			});
			
            $("#softwareList").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
					var rowCheckBox = $(this).parents("tr").find(".loadedSoftware");
					if($(rowCheckBox).is(":checked")){
						$(rowCheckBox).removeAttr("checked");
						$(this).parents("tr").removeClass("highlightStatic");
					}else{
						$(rowCheckBox).attr("checked",true);
						$(this).parents("tr").addClass("highlightStatic");
					}  
					
					getCheckedValues();
					$("#spareSoftwareId").val(getCheckedValues());
					updateTable();
                    
					
                }
            });

			
			$(".loadedSoftware").on("click",function(event){
			     if($(this).is(":checked")){
                        $(this).removeAttr("checked");
                        $(this).parents("tr").removeClass("highlightStatic");
                    }else{
                        $(this).attr("checked",true);
                        $(this).parents("tr").addClass("highlightStatic");
                    } 
					
					getCheckedValues(); 
					$("#spareSoftwareId").val(getCheckedValues());
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