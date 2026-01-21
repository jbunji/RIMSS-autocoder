
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >

<cfset dbUtils = application.objectFactory.create("DBUtils") />
<cfset utils = new cfc.utils.utilities()/>
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
			
			//alert(<cfoutput>#application.sessionManager.getLocIdSetting()#</cfoutput>);	
			
			//$(this).toggleClass('expand').nextUntil('tr.headerConfig').toggle();					
			
			$('.headerConfig').click(function(){
				 var assetID = $(this).attr('id');

			     $(this).siblings('.' + assetID + '.1').toggle(); //works opens level 1s for one element
		 		
			});		
			
			$('.bodyConfig').click(function(){
				 var UI = $(this).attr('id').split(' ');
				 var part = UI[0];
				 var asset = UI[1];

				 $(this).siblings('.' + asset + '.' + part).toggle();	
				 	 
			});				
	
        });     
    </script>
	<cfoutput>
	   <div class="message #msgStatus#">#encodeForHTML(trim(msg))#</div>
	</cfoutput>
	
	<cfset programLookup = application.sessionManager.getProgramSetting() />
	<cfset unitLookup = application.sessionManager.getUnitSetting() />
	
	<cfset ATTRIBUTES.showAdmin = application.sessionManager.getUserModel().isMemberOfGroup("PCS_SU")/>

	<cfset sysCatLookup = ucase(application.sessionManager.getSubSection()) />

	
	<cfset assetLookup = application.objectFactory.create("DbLookups") />

	<!---<cftry>--->
	    <cfset assets = assetLookup.lookupUserAssets(programLookup, unitLookup, sysCatLookup) />
		<!---<cfcatch>
			<cfset assets = []/>
		</cfcatch>
	</cftry>--->	
	
	
	<cfset PROCEDURES = createObject("component", "procedures")>
	<!---<cfset configList = PROCEDURES.getConfig('349991')>--->
	<!---<cfdump var="#assets#">--->
	<!---<cfdump var="#configList#">--->
	 
	<cfoutput>
		<div class="headerContent">
	    	<div class="headerTitle" id="headerTitle" name="headerTitle" >List Configuration</div>
	    </div>
	    
	    <div class="font12 mainContent">
	    	<table class="globalTable sticky-headers">
				<thead>
					<th>NOUN</th>
					<th>PART NO</th>
					<th>SER NO</th>
					<th>AVAILABLE/CONFIGURABLE</th>
					<!---<cfset i = 1>
					<cfloop from="i" to="7" index="i">
						<th>&nbsp;</th>
					</cfloop>--->
				</thead>
				<tbody>
					<cfset i = 1>
					<cfloop from="1" to="#arrayLen(assets)#" index="i">
						<cfset curAssetConfig = PROCEDURES.getConfig('#assets[i].asset_id#')>
							<tr id="#assets[i].asset_id#" class="headerConfig 0">
								<td>#assets[i].noun#&nbsp;<a href="##" onclick="return false;" style="text-decoration: none">+
									<cfif attributes.showAdmin>
										</a>&nbsp;&nbsp;<a href="index.cfm?action=new.configuration&assetid=#encodeForURL(utils.encryptId(assets[i].asset_id))#&configSet=#curAssetConfig.cfg_set_id#" onClick="event.stopPropagation();">Configure Lvl 1</a>
									</cfif>
								</td>
								<!---<td>#assets[i].asset_id#</td>--->
								<td>#assets[i].partno#&nbsp;</td>
								<td>#assets[i].serno#&nbsp;</td>
								<td>&nbsp;</td>
							</tr>		
							<cfset nhAssetId = "">				
						<cfloop query="curAssetConfig">
							<!---<cfif curAssetConfig.level EQ 1>
								<cfset nhAssetId = assets[i].asset_id>
							<cfelseif (curAssetConfig.level GT 1) AND (curAssetConfig.has_child_config EQ "Y")>
								<cfset nhAssetId = curAssetConfig.asset_id>
							</cfif>--->
							<cfif (curAssetConfig.has_child_config EQ "Y")>
								<cfset nhAssetId = curAssetConfig.asset_id>
							</cfif>
							<tr style="display: none;" id="#encodeForHTML(assets[i].asset_id)# #encodeForHTML(curAssetConfig.partno_c)#" class="bodyConfig #encodeForHTML(assets[i].asset_id)# #encodeForHTML(curAssetConfig.level)# #encodeForHTML(curAssetConfig.partno_p)#">
							<!---<tr style="display: none;" id="#curAssetConfig.level#" class="bodyConfig #assets[i].asset_id# #curAssetConfig.asset_id# #curAssetConfig.level#">--->
								<cfset j = 1>
								<!---<cfloop from="1" to="#curAssetConfig.level#" index="j">
									<td>&nbsp;</td>
								</cfloop>--->
								<td>
									<cfloop from="1" to="#curAssetConfig.level#" index="j">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</cfloop>
									-&nbsp;#encodeForHTML(curAssetConfig.noun)#&nbsp;
									<cfif curAssetConfig.HAS_CHILD_CONFIG EQ "Y"><a href="##" onclick="return false;" style="text-decoration: none">+</a>&nbsp;&nbsp;</cfif>
									<!---#curAssetConfig.partno_c#&nbsp;#curAssetConfig.partno_p#--->
								</td>
								<td>
									<cfset j = 1>
									<cfloop from="1" to="#curAssetConfig.level#" index="j">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</cfloop>
									-&nbsp;#encodeForHTML(curAssetConfig.partno)#
									<cfif (curAssetConfig.has_parent_asset EQ "Y") AND (curAssetConfig.asset_id NEQ "") AND (curAssetConfig.has_child_config EQ "Y" AND (attributes.showAdmin))><!---#curAssetConfig.asset_id#--->
										&nbsp;&nbsp;<a href="index.cfm?action=add.configuration.sub&assetid=#encodeForURL(utils.encryptId(curAssetConfig.asset_id))#&configSet=#encodeForURL(curAssetConfig.cfg_set_id)#" onClick="event.stopPropagation();">Configure Sub Assy</a>&nbsp;&nbsp;
									</cfif>
								</td>
								<td>
<!---									<cfset j = 1>
									<cfloop from="1" to="#curAssetConfig.level#" index="j">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									</cfloop>--->
									<cfif NOT attributes.showAdmin>
										<cfif curAssetConfig.asset_id NEQ "">
											#encodeForHTML(curAssetConfig.serno)#&nbsp;&nbsp;
										<cfelse>
											UNKN&nbsp;&nbsp;
										</cfif>
									<cfelseif curAssetConfig.asset_id NEQ "" AND curAssetConfig.level EQ 1>
										<a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(utils.encryptId(curAssetConfig.asset_id))#">#encodeForHTML(curAssetConfig.serno)#</a>&nbsp;&nbsp;<!---#curAssetConfig.asset_id#--->
										<cfif curAssetConfig.orig_repair NEQ ""><a title="This asset configuration was changed by a maintenance action" href="../maintenance/index.cfm?action=edit.maintenance.detail&eventRepair=#encodeForURL(curAssetConfig.orig_repair)#" onClick="event.stopPropagation();">Edit</a></cfif>
									<cfelseif curAssetConfig.asset_id NEQ "" AND curAssetConfig.level GT 1>
										<a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(utils.encryptId(curAssetConfig.asset_id))#">#encodeForHTML(curAssetConfig.serno)#</a>&nbsp;&nbsp;<!---#curAssetConfig.asset_id#--->
										<cfif curAssetConfig.orig_repair NEQ ""><a title="This asset configuration was changed by a maintenance action" href="../maintenance/index.cfm?action=edit.maintenance.detail&eventRepair=#encodeForURL(curAssetConfig.orig_repair)#" onClick="event.stopPropagation();">Edit</a></cfif>
									<cfelseif curAssetConfig.level EQ 1>									
										<a style="color: red" href="index.cfm?action=new.configuration&assetid=#encodeForURL(utils.encryptId(assets[i].asset_id))#&configSet=#encodeForHTML(curAssetConfig.cfg_set_id)#" onClick="event.stopPropagation();">UNKN</a>
									<cfelseif curAssetConfig.level GT 1 and variables.nhAssetId NEQ "">
										<a style="color: red" href="index.cfm?action=add.configuration.sub&assetid=#encodeForURL(utils.encryptId(variables.nhAssetId))#&configSet=#encodeForHTML(curAssetConfig.cfg_set_id)#" onClick="event.stopPropagation();">UNKN</a><!---#variables.nhAssetID#--->
									<cfelse>
										&nbsp;Must Configure NHA&nbsp;
									</cfif>
								</td>								
								<td align="center">#encodeForHTML(curAssetConfig.available)#&nbsp;/&nbsp;#encodeForHTML(curAssetConfig.qpa)#</td>
							</tr>
						</cfloop>
					</cfloop>
				</tbody>
			</table>
	    </div>
    </cfoutput>	

<!---	<div class="headerContent">
    	<div class="headerTitle">List Configuration</div>
    </div>
<cfdump var="#application.sessionManager#">
<cfdump var="#application.sessionManager.getLocIdSetting()#">
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
				<th>SOFTWARE</th>
				<th>SERNO</th>
				<th class="noSort "></th>
			</tr>
			</thead>
			<tbody>
			<cfoutput query="RC.qconfigs">
				<cfset swQry = #dbUtils.getSoftwareByAssetId(val(asset_id))# />	
			<tr class="<cfif currentrow mod 2>odd<cfelse>even</cfif>">
				<td>#encodeForHTML(trim(NOUN))#</td>
				<td>#encodeForHTML(trim(NSN))#</td>
				<td>#encodeForHTML(trim(PARTNO))#</td>
				<td>
					<cfif swQry.recordcount GT 0>
						<ul>
							<cfloop query="swQry">
								<li>#sw_number# / #sw_title#</li>																	
							</cfloop>
						</ul>
					</cfif>		
				</td>				
				<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(rc.util.encryptId(asset_id))#">#encodeForHTML(trim(SERNO))#</a></td>
				<td class="delete iconClass ">
					<a id="#encodeForHTML(trim(ASSET_ID))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#encodeForURL(rc.util.encryptId(ASSET_ID))#">
						<img src="../../common/images/icons/delete.png" border="0"/>
					
					</a>
				</td>
			</tr>
			</cfoutput>
			</tbody>
		</table>
	<cfelse>
		<div class="global_notice_msg">No Data Found</div>
	</cfif>
</div>
</cfif>	--->

</RIMSS:layout>