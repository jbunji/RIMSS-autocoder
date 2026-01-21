<cfimport taglib="../layout" prefix="RIMSS"/>
<RIMSS:layout section="maintenance" showSubSection=false>
    <RIMSS:subLayout/>
    <script>
        try {
            $(document).ready(function(){
                //setupEditHighlight();
                setupHighlight();
            });
        }catch(err){}
    </script>
	
	
<cfoutput>	
<div class="message #msgStatus#">#msg#</div>
</cfoutput>      
	   
<div class="headerContent" >
    <div class="headerTitle">UID Reader Input Detail</div>
</div>
<cfif not isNull(RC.qAssetLevels) and isQuery(RC.qAssetLevels)>
        <form name="assetlevels" id="assetlevels" method="post" action="index.cfm" style="text-align:center">
	        <div class="mainContent">   
	            <cfif RC.qAssetLevels.recordcount>
	                <cfoutput>
	                   <table class="globalTable" id="levelAssetTable">
	                      <thead>
	                        <tr>
	                            <th>Part No</th>
	                            <th>Serial No</th>
								<th>Assigned Loc</th>
	                            <th>Current Loc</th>
								<th>Status</th>
	                            <th>Maint</th>
	                        </tr>
	                      </thead>
	                      <tbody>
	                           <tr class="<cfif currentRow mod 2> odd <cfelse> even </cfif>">
	                               <td class="nowrap">#PARTNO#</td>
	                               <td class="nowrap">#SERNO#</td>
								   <td class="nowrap">#LOC_IDA#</td>
	                               <td class="nowrap">#LOC_IDC#</td>
								   <td class="nowrap">#STATUS_CD#</td>
	                               <td style="width:16px"><input type="checkbox" name="maintAsset"  class="maintAsset" id="maintAsset_#currentRow#" value="#asset_id#" <cfif isDefined("form.maintAsset") and listfindnocase(form.maintAsset,asset_id)>checked="checked"</cfif>></a></td>
	                           </tr>
	                      </tbody>
	                   </table>
	                </cfoutput>
	            <cfelse>
	                <div class="global_notice_msg">No Data Found</div>
	            </cfif>
	        </div>
		</form>
</cfif>

</RIMSS:layout>

