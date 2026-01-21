<cfsilent>
	<cfimport taglib="../layout" prefix="RIMSS"/>
	<cfsetting showdebugoutput="false" >
</cfsilent>

<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
    <script type="text/javascript">

		
		$(function() {
			setupHighlight(); 
			
			
			
			var dt = $('#configTable').dataTable({ 
				
			"bFilter": true,
			"sDom":'t'
				
			});
			
			
			$('#dtSearch').on('keyup',function(e){
				dt.fnFilter($(this).val());
			});
			

        });  
		
		
		
		
    </script>
	
	<cfoutput>
	   <div class="message #msgStatus#">#msg#</div>
	</cfoutput>

	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle" >Search Configuration</div>
    </div>
	

	<div class="mainContent">	
		<cfif StructKeyExists(REQUEST.context,"qSearch") and REQUEST.context.qSearch.recordcount>
			
			<table class="globalTable" id="configTable">
				<thead>
				<tr>
					<th colspan="8" class="filter">
						Filter Results: <input type="text" id="dtSearch"/>						
					</th>
				</tr>
				<tr>
					<th colspan="3">NHA</th>
					<th colspan="5">SRA</th>
				</tr>
				<tr>
					<th>SYSTYPE</th>
					<th>SERNO</th>
					<th>PARTNO</th>
					<th>SRA NOUN</th>
					<th>SRA SERNO</th>
					<th>SRA PARTNO</th>
					<th>REMARKS</th>
					<th class="noSort admin"></th>
				</tr>
				</thead>
				
				<tbody>
				
				<cfoutput query="RC.qSearch">
				<tr class="<cfif RC.qSearch.currentrow mod 2> odd <cfelse> even </cfif>">
					<td>#encodeForHTML(trim(sys_type))#</td>
					<td>#encodeForHTML(trim(nha_serno))#</td>
					<td>#encodeForHTML(trim(nha_partno))#</td>
					<td>#encodeForHTML(trim(sra_noun))#</td>
					<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(rc.util.encryptId(sra_asset_id))#">#encodeForHTML(trim(sra_serno))#</a></td>
					<td>#encodeForHTML(trim(sra_partno))#</td>
					<td>#encodeForHTML(trim(nha_remarks))#</td>
					<cfif application.sessionManager.userHasPermission("PCS_ACTTS_SU") or application.sessionManager.userHasPermission("PCS_SU")  >
					<td class="delete iconClass admin">
						<a id="#encodeForHTML(trim(sra_asset_id))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#encodeForURL(rc.util.encryptId(sra_asset_id))#">
							<img src="../../common/images/icons/delete.png" border="0"/>
						
						</a>
					</td>
					<cfelse>
						<td></td>
					</cfif>
					
				</tr>
				</cfoutput>
				</tbody>
			</table>
		<cfelse>
			<div class="global_notice_msg">No Data Found</div>
		</cfif>

	</div>
	
</RIMSS:layout>