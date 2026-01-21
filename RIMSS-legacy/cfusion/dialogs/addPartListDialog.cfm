<!DOCTYPE html>
<cfsilent>
	
	<!--- don't use a template on this page.  will be used as a dialog box. --->
	<cfsetting showDebugOutput="false">

<!---    <cfset javaLogger = new cfc.utils.javaLoggerProxy() />--->
	
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	
	    <cfset partLookup = application.objectFactory.create("DBUtils") />
	   <cfset parts = partLookup.getPartListBySysType() />
	 
   
	
</cfsilent>

<cfif StructKeyExists(form, "id")>
	<script>
		<cfoutput>
			var #toScript(form.action, "action")#;
		</cfoutput>
	</script>
   </cfif>
   <cfif StructKeyExists(form, "action")>
	<script>
		<cfoutput>
			var #toScript(form.id, "id")#;
		</cfoutput>
	</script>
</cfif>
	   
	   
<div class="dialogDiv"></div>
<div style="width: 100%;">
	
    <table class="lookupDialog font10" id="parts" border="1" style="width: 100%;" cellpadding="0" cellspacing="0" >
    	<thead> 
	        <tr class="header">
	            <th colspan="2">*All fields are required</th>
	        </tr>
        </thead>
        <tr>        	
            <td>Noun</td>
            <td>
            	<input type="text" id="newNoun" />
            </td>
        </tr>
        <tr>
            <td>Part Number</td>
            <td>
            	<input type="text" id="newPartNo" />
            </td>
        </tr>
        <tr>
            <td>NSN</td>
            <td>
            	<input type="text" id="newNsn" />
            </td>
        </tr>    
        <tr>
            <td>MSL</td>
            <td>
            	<input type="text" id="newMsl" />
            </td>
        </tr>         
    </table>
</div>
<!---<cfif parts.recordcount gt 0>
    <script type="text/javascript">
        $(document).ready(function() {
	   				
            var dialogId = $(".ui-dialog-content:visible").attr('id');
            $("#parts").delegate("td", "click mouseover mouseout", function(e) {
                if (e.type == "mouseover") {
                    $(this).parent().addClass("highlight");
                } else if (e.type == "mouseout") {
                    $(this).parent().removeClass("highlight");
                } else if (e.type == "click") {
                console.log("Action: "+action);
					//$("#sraPartnoId").val($.trim($(this).parent().find(".partId").attr("id")));
					$("#"+action+"Noun_"+id).val($.trim($(this).parent().find(".noun").text()));
					$("#"+action+"PartnoId_"+id).val($.trim($(this).parent().find(".partId").attr("id")));
					//$("#sraNsn").val($.trim($(this).parent().find(".nsn").attr("id")));
                    $('#manageConfig').dialog("close");
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
    </script>
</cfif>--->