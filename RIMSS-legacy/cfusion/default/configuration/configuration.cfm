
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script src = "../layout/js/configuration.js"></script>
	<!-- DataTables -->
    <script type="text/javascript">
        $(function() {
			setupRemoveSRA();
			//setup asset lookup dialog
			setupAssetLookupDialog();
			setupHighlight(); 
			var dt = $('#sraTable').dataTable({});
			
			//Add .noSort and .date column defs
            modifyDTColumns();
	
        });     
    </script>
	<cfoutput>
	   <div class="message #msgStatus#">#encodeForHTML(trim(msg))#</div>
	</cfoutput>

	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle" >List Configuration</div>
    </div>

	<div class="font12 mainContent">
		<form id="createMaintenance" name="createMaintenance" method="post" action="index.cfm?action=list.configuration">
			<table class="two_column_table" cellpadding="0px" cellspacing="0px">
				<tbody>
					<tr>
							<td class="column">
								<div class="columnContent">
									
									<div class="formField">
				                        <label class="font10" id="asset_id_label">SERNO:</label> 
				                        <cfoutput>
										<input type="hidden" id="assetId" name="assetId" <cfif StructKeyExists(rc,'nhaassetId')>value="#encodeForHTML(trim(rc.nhaassetId))#"</cfif> />
				                        <input class="form_field required_form_field font10" id="serno" type="text" name="serno" <cfif StructKeyExists(rc,'serno')>value="#encodeForHTML(trim(rc.serno))#"</cfif> readonly="readonly" />
										</cfoutput>
										<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupAssetDialog.cfm" class="lookup" id="lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
									</div>
								</div>
							</td>
							<td class="column">
								<div class="columnContent">
                                    <div class="formField">
                                        <label class="font10" id="partno_id_label">P/N:</label>
                                        <cfoutput>
										<input type="hidden" id="partnoId" name="partnoId" value="" />
                                        <input class="form_field required_form_field font10" id="partno" type="text" name="partno" <cfif StructKeyExists(rc,'partno')>value="#encodeForHTML(trim(rc.partno))#"</cfif> readonly="readonly" />
										</cfoutput>
									</div>
								</div>
                            </td>
					</tr>
					<tr>
							<td class="column" colspan="2">
								<div class="columnContent">
									<div class="formField button_container">
										<input type="submit" value="ADD" name="createConfiguration" id="createConfiguration" onclick="setAction('new.configuration',this);setMethod('forward',this);"  />
										<input type="submit" value="SEARCH" name="btnSearch" id="btnSearch" />
									</div>
								</div>
							</td>
                    </tr>
				</tbody>
			</table>
		</form>
	</div>
	

<cfif not isNull(RC.qconfigs) and isQuery(RC.qconfigs)>

<div class="mainContent">	
	<cfif REQUEST.context.qconfigs.recordcount>
		<table class="globalTable" id="sraTable">
			<thead>
			<tr>
				<th>Noun</th>
				<th>NSN</th>
				<th>PARTNO</th>
				<th>SERNO</th>
				<th class="noSort admin"></th>
			</tr>
			</thead>
			<tbody>
			<cfoutput query="RC.qconfigs">
			<tr class="<cfif currentrow mod 2>odd<cfelse>even</cfif>">
				<td>#encodeForHTML(trim(NOUN))#</td>
				<td>#encodeForHTML(trim(NSN))#</td>
				<td>#encodeForHTML(trim(PARTNO))#</td>
				<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(asset_id))#">#encodeForHTML(trim(SERNO))#</a></td>
				<cfif application.sessionManager.userHasPermission("PCS_ACTTS_SU") or application.sessionManager.userHasPermission("PCS_SU")  >
				<td class="delete iconClass admin">
					<a id="#encodeForHTML(trim(ASSET_ID))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#URLEncodedFormat(rc.util.encryptId(ASSET_ID))#">
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
</cfif>	

</RIMSS:layout>