<cfparam name="rc.assetid" default="0"/>
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<cfsilent>
	<cfif isDefined('rc') and not structKeyExists(rc,'nhaassetid')>
		<cflocation url="configuration.cfm" addtoken="false" >
	</cfif>
</cfsilent>

<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script src = "../layout/js/configuration.js"></script>
	<script src="../layout/js/spares.js"></script>
	
<script type="text/javascript">
        $(function() {
			setupSRANounLookupDialog();
			setupSRAAssetLookupDialog();
			setupAddSNDialog();
			
			setupSoftwareDialog();
            setupSoftwareDelete();
				
			
			$('#btnDelete').click(function(e){
				$(this).setAction('remove.sra');
				var c = confirm("Are you sure you want to remove this record?");
				if (c) {
					return true;
				}else{
					return false;
				}
				return false;
			});
			
			$('#btnUpdate').click(function(e){
				$(this).setAction('update.sra');
			});
			
			$('#btnReset').click(function(e){
				$(this).setAction('edit.configuration');
			});
			
			$('#btnAddConfig').click(function(e){
				$(this).setAction('add.configuration.sub');
			});						
        });     
        
			IMG_NUM = 0;
	
			$(function() {
				var IMG_NUM =0;				
				
			});				
			
			function callUploader()
			{				
				var win = ColdFusion.Window.getWindowObject('uploader');
				win.shadow = false;
				ColdFusion.Window.show('uploader');
				ColdFusion.navigate("iFrameContainer.cfm", "uploader");
			}
			
			function getiFrame(obj)
			{
				IMG_NUM++;
				document.getElementById("imgCntr").value = IMG_NUM;
				document.getElementById("list_reg").innerHTML += "<table width='100%' id='subReg"+IMG_NUM+"'><tr><td><label class='font10' for='fileName"+IMG_NUM+"'>&nbsp;"+obj.fileName.value+"</label> - <label class='font10'><a href='javascript: deleteImg("+IMG_NUM+");'>remove</a></label><input type='hidden' name='desc"+IMG_NUM+"' value='"+escape(obj.desc.value)+"' /><input type='hidden' name='ext"+IMG_NUM+"' value='"+obj.ext.value+"' /><input type='hidden' name='fileName"+IMG_NUM+"' value='"+obj.fileName.value+"' /></td></tr></table>";	
				ColdFusion.Window.hide("uploader");	
			}
	
			function canceliFrame()
				{ColdFusion.Window.hide("uploader");}
				
			function deleteImg(img)
			{
				var div = document.getElementById("subReg"+img);
				div.parentNode.removeChild(div);
			}	        
    </script>
	
	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle" >Edit Sub Assembly</div>
    </div>
	
	<div class="mainContent">
		<form id="editConfig" name="editConfig" method="post" action="<cfoutput>index.cfm</cfoutput>">
		<input type="hidden" id="LRU" name="LRU" value="true"/>
		<input type="hidden" name="spareSoftwareId" readonly="readonly" id="spareSoftwareId" <cfif Structkeyexists(form,"spareSoftwareId")>value="#encodeForHTML(trim(form.spareSoftwareId))#"</cfif>/>
		<table class="three_column_table" cellpadding="0px" cellspacing="0px" style="">
			<tbody>
			<tr>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="serno"> SERNO:</label> 
	                        <cfoutput><cfif StructKeyExists(rc,'nhaassetObj')>#rc.nhaassetObj.getSerno()#</cfif>
							<input type="hidden" id="nhaassetId" name="nhaassetId" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getAssetID()))#"</cfif>/>
	                        <input class="form_field required_form_field font10" id="serno" type="hidden" name="serno" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getSerno()))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
				</td>
				<td class="column">
					<div class="columnContent">
					<div class="formField">
                        <label class="font10" id="partno_id_label" for="partno">P/N:</label>
                        <cfoutput>
						<input type="hidden" id="partnoId" name="partnoId" <cfif StructKeyExists(rc,'nhaPartListObj')>value="#encodeForHTML(trim(rc.nhaPartListObj.getPartnoID()))#"</cfif>  />
						<cfif StructKeyExists(rc,'nhaPartListObj')>#rc.nhaPartListObj.getPartno()#</cfif>
                        <input class="form_field required_form_field font10" id="partno" type="hidden" name="partno" <cfif StructKeyExists(rc,'nhaPartListObj')>value="#encodeForHTML(trim(rc.nhaPartListObj.getPartno()))#"</cfif> readonly="readonly" />
						</cfoutput>
					</div>
					</div>
					
				</td>
				<td class="column">
					
					<div class="columnContent">
						<div class="formField">
	                       SYS TYPE:
							<cfoutput>
							<cfif StructKeyExists(rc,'codeObj')>#rc.codeObj.getCodeValue()#</cfif>
							<input class="form_field required_form_field font10" id="systype" type="hidden" name="systype" <cfif StructKeyExists(rc,'codeObj')>value="#rc.codeObj.getCodeValue()#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>

				</td>
			</tr>
			<tr>
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sranoun"><span class="font10">&nbsp;</span>SUB NOUN:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="sranoun" readonly="readonly" type="text" name="sranoun" <cfif StructKeyExists(rc,'partListObj')>value="#encodeForHTML(trim(rc.partListObj.getNoun()))#"</cfif>/>
							</cfoutput>
							<!---<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRANounsDialog.cfm" class="lookup" id="lookup_sra_noun_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>--->
						</div>
					</div>
                </td>	
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_serno_label" for="sraserno"><span class="font10">&nbsp;</span>SUB SERNO:</label>
                            <cfoutput>
							<input type="hidden" id="assetId" name="assetId" tabindex="-1" <cfif StructKeyExists(rc,'assetObj')>value="#encodeForHTML(trim(rc.assetObj.getAssetID()))#"</cfif>/>
							<input type="hidden" id="newassetId"   name="newassetId" value=""/>
                            <input class="form_field font10" id="sraserno" type="text" name="sraserno" readonly="readonly" <cfif StructKeyExists(rc,'assetObj')> value="#encodeForHTML(trim(rc.assetObj.getSerno()))#"</cfif>/>
							
							</cfoutput>
							<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRAAssetByNounDialog.cfm" class="lookup" id="lookup_sra_asset_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
							<span  class="addIcon"><cfoutput><a id="btnAddSerno" href="addSerno.cfm"><img src="#application.rootpath#/common/images/icons/add.png"/></a></cfoutput></span>
						</div>
					</div>
                </td>
				
			</tr>
			<tr>
				
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="srapartno"><span class="font10">&nbsp;</span>SUB PARTNO:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="srapartno" type="text" name="srapartno" <cfif StructKeyExists(rc,'partListObj')>value="#encodeForHTML(trim(rc.partListObj.getPartno()))#"</cfif> />
							<input class="form_field font10 noBackground" id="srapartnoid" type="hidden" name="srapartnoid" <cfif StructKeyExists(rc,'partListObj')>value="#encodeForHTML(trim(rc.partListObj.getPartnoID()))#"</cfif> />
							</cfoutput>
						</div>
					</div>
                </td>
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sransn"><span class="font10">&nbsp;</span>SUB NSN:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="sransn" type="" name="sransn" readonly="readonly" <cfif StructKeyExists(rc,'partListObj')>value="#encodeForHTML(trim(rc.partListObj.getNSN()))#"</cfif> />							
							</cfoutput>
						</div>
					</div>
                </td>	
			</tr>
			<tr>
                        <td colspan="3" class="column">
                          <div class="columnContent">
                                    <div class="formField">
                                        
										<label class="font10" id="nsn_label">SOFTWARE:</label> 
                                        <cfoutput>
                                        <span style="display:inline-block;">
                                            <a href="#application.rootpath#/dialogs/lookupSoftwareDialog.cfm" class="lookup" id="sw_lookup_ref"><img id="lookup_img" src="#application.rootpath#/common/images/lookup.png" /></a>
                                        </span> 
                                        </cfoutput>
                                        
                                        <div id="softwareContainer">
                                              <cfif isDefined("rc.qSpareSoftware") and isQuery(rc.qSpareSoftware) and rc.qSpareSoftware.recordcount>
                                                 <table class="currentSoftware globalTable">
                                                    <thead>
                                                        <tr>
                                                            <th>Number</th>
                                                            <th>Title</th>
                                                            <th class="noSort ">&nbsp;</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <cfloop  query="rc.qSpareSoftware" >
                                                            <cfoutput>
                                                                <tr>
                                                                    <td>#encodeForHTML(SW_NUMBER)#</td>
                                                                    <td>#encodeForHTML(SW_TITLE)#</td>
                                                                    <td class="deleteSoftware deleteIcon " id="#encodeForHTML(ENCRYPTED_SW_ID)#">&nbsp;</td>
                                                                </tr>
                                                            </cfoutput>
                                                        </cfloop>
                                                    </tbody>
                                                </table>
                                                 
                                              </cfif>
                                        
                                        
                                        </div>
                                    </div>
                                </div>  
                        </td>
                        
                    </tr>
				<table class="one_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        <tr>
                            <td class="column">
                                <div class="formField">
                                    <label class="font10" id="attachment_label">&nbsp;ATTACHMENT: </label>
									<input type="button" name="uploadFile" id="uploadFile" value="Upload" onClick="callUploader()"/>
                                </div>
                            </td>
						</tr>
						<tr>
        					<td colspan="2" align="left">&nbsp;<div id="list_reg"></div></td>
      					</tr>
                    </tbody>
                </table>
				<cfif StructKeyExists(rc, "qAttachments") >
				<table class="one_column_table" cellpadding="0px" cellspacing="0px">
					<tbody>
							<cfoutput query="rc.qAttachments">    
					      			<tr>
					         			<td>&nbsp;
											<label class="font10">
					         					<!---<a href="downloader.cfm?fileName=#rc.qAttachments.name#"> #IIF(rc.qAttachments.name NEQ "", DE('#rc.qAttachments.name#'), DE('#rc.qAttachments.attId#'))# - View</a>--->												
												<a target="_blank" href="#application.rootpath#/RIMSS/#application.sessionManager.getUserName()#/#encodeForURL(rc.qAttachments.name)#"> #IIF(rc.qAttachments.name NEQ "", DE('#encodeForURL(rc.qAttachments.name)#'), DE('#rc.qAttachments.attId#'))# - View</a>
											</label>
										</td>
										<td>
											<a href="index.cfm?action=edit.configuration.sub&assetid=#encodeForURL(rc.util.encryptId(rc.assetObj.getAssetID()))#&attId=#encodeForURL(rc.qAttachments.attId)#">Delete</a>
										</td>
										
					      			</tr>
							</cfoutput> 
					</tbody>
				</table>
				</cfif>                    
			<tr  style="text-align:center">				
				<td class="column" style="text-align:center" colspan="3" ><cfoutput><a href="index.cfm?action=edit.configuration&assetid=#encodeForURL(rc.util.encryptId(rc.assetObj.getAssetID()))#">Return to System Config List</a></cfoutput></td>
			</tr>	
			<tr>
				<td class="column button_container" colspan="3" style="text-align:center">
					<input type="submit" name="btnUpdate" id="btnUpdate" value="UPDATE"> 
					<input type="submit" class="removeSRA " name="btnDelete" id="btnDelete" value="REMOVE"> 
					<input type="submit" name="btnReset" id="btnReset" value="RESET">
				</td>
			</tr>
			</tbody>	
		</table>
		
		<cfif not isNull(RC.qconfigs) and isQuery(RC.qconfigs)>

				<table class="one_column_table" cellpadding="0px" cellspacing="0px">
                	<tbody>
                        <tr>
                            <td>
                                <div class="job_detail section_header">
                                    Sub Assembly
                                </div>
                            </td>
                        </tr>
						<tr>
							<cfif REQUEST.context.qconfigs.recordcount>
							<td>
					            <div class="font10">
					             <table class="globalTable" id="sraTable">
									<thead>
									<tr>
										<th>Noun</th>
										<th>NSN</th>
										<th>PARTNO</th>
										<th>SERNO</th>
										<th class="noSort "></th>
									</tr>
									</thead>
									<tbody>
									<cfoutput query="RC.qconfigs">
									<tr class="<cfif currentrow mod 2>odd<cfelse>even</cfif>">
										<td>#encodeForHTML(trim(NOUN))#</td>
										<td>#encodeForHTML(trim(NSN))#</td>
										<td>#encodeForHTML(trim(PARTNO))#</td>
										<td class="edit"><a href="index.cfm?action=edit.configuration.sub&assetid=#encodeForURL(rc.util.encryptId(asset_id))#">#encodeForHTML(trim(SERNO))#</a></td>
										<td class="delete iconClass ">
											<a id="#encodeForHTML(trim(ASSET_ID))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#encodeForURL(rc.util.encryptId(ASSET_ID))#">
												<img src="../../common/images/icons/delete.png" border="0"/>
									
											</a>
										</td>
									</tr>
									</cfoutput>
									</tbody>
								</table>
				            </td>
					            <cfelse> 
	                            	   <td class="column"><div class="formField">No Sub Assembly Configuration.</div></td>
					            </cfif> 
					            </div>
				        </tr>
                        <tr>
                            <td>
                                <div class="button_container">
                                    <input type="submit" class="input_buttons font10" id="btnAddConfig" name="btnAddConfig" value="ADD SUB ASSY" onclick="setAction('add.configuration.sub',this);setMethod('forward',this);" />
                                </div>
                            </td>
                        </tr>
					</tbody>
                </table>
		</div>
		
	</cfif>	
</RIMSS:layout>