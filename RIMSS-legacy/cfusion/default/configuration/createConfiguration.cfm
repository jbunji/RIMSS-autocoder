<cfparam name="rc.assetid" default="0"/>
<cfimport taglib="../layout" prefix="RIMSS"/>
<cfsetting showdebugoutput="false" >
<RIMSS:layout section="configuration">
	<RIMSS:subLayout subsection="#APPLICATION.sessionManager.getSubsection()#"/>
	<script src = "../layout/js/configuration.js"></script>
	<script src="../layout/js/spares.js"></script>
	<script type="text/javascript">
        $(function() {
			//setup asset lookup dialog
			setupAssetLookupDialog();
			setupSRANounLookupDialog();
			setupSRAAssetLookupDialog();
			setupAddSNDialog();
			
			setupSoftwareDialog();
            setupSoftwareDelete();
			
			$('#btnInsert').click(function(e){
				$(this).setAction('create.configuration');
				//return false;
			});
			
			$('#btnReset').click(function(e){
				$(this).setAction('new.configuration');
				//return false;
			});
			
        });     
    </script>
	
	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle">Create Configuration</div>
    </div>
	
	<div class="mainContent">	
		<form id="createConfiguration" name="createConfiguration" method="post" action="<cfoutput>index.cfm</cfoutput>">
		<table class="three_column_table" cellpadding="0px" cellspacing="0px" style="margin:0px auto;">
			<tbody>
			<tr>
				
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="serno"> SERNO:</label> 
	                        <cfoutput>
							<input type="hidden" id="nhaassetId" name="nhaassetId" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getAssetId()))#"</cfif> readonly="readonly" />
							<input type="hidden" name="spareSoftwareId" readonly="readonly" id="spareSoftwareId" <cfif Structkeyexists(form,"spareSoftwareId")>value="#encodeForHTML(trim(form.spareSoftwareId))#"</cfif>/>
	                        <input class="form_field required_form_field font10" id="serno" type="text" name="serno" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getSerno()))#"</cfif> readonly="readonly" />
							</cfoutput>
							<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupAssetDialog.cfm" class="lookup" id="lookup_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
						</div>
					</div>
				</td>
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="partno_id_label" for="partno"><span class="font10 required_field">&nbsp;</span>P/N:</label>
                            <cfoutput>
							<input type="hidden" id="partnoId" name="partnoId" <cfif StructKeyExists(rc,'nhaPartListObj')>value="#encodeForHTML(trim(rc.nhaPartListObj.getPartnoID()))#"</cfif> readonly="readonly" />
                            <input class="form_field required_form_field font10" id="partno" type="text" name="partno" <cfif StructKeyExists(rc,'nhaPartListObj')>value="#encodeForHTML(trim(rc.nhaPartListObj.getPartno()))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
                </td>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="systype">SYS TYPE:</label>
							<cfoutput>
							<input class="form_field required_form_field font10 noBackground" id="systype" type="text" name="systype" <cfif StructKeyExists(rc,'codeObj')>value="#encodeForHTML(trim(rc.codeObj.getCodeValue()))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
				</td>
			</tr>
			<tr>
				
				
				<td class="column">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sranoun"><span class="font10">&nbsp;</span>SRA NOUN:</label>
                            <cfoutput>
                            <input class="form_field font10" id="sranoun" type="text" name="sranoun" value="" readonly="readonly" />
							</cfoutput>
							<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSRANounsDialog.cfm" class="lookup" id="lookup_sra_noun_ref"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
						</div>
					</div>
                </td>	
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_serno_label" for="sraserno"><span class="font10">&nbsp;</span>SRA SERNO:</label>
                            <cfoutput>
                            <input class="form_field font10" id="sraserno" type="text" name="sraserno" readonly="readonly" />
							<input type="hidden" id="assetid" tabindex="-1" name="assetid" value="">
							<input type="hidden" id="newpartnoId" name="newpartnoId" value="" />
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
                            <label class="font10" id="sra_partno_label" for="srapartno"><span class="font10">&nbsp;</span>SRA PARTNO:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="srapartno" type="text" name="srapartno" readonly="readonly"/>
							<input class="form_field font10 noBackground" id="srapartnoid" type="hidden" name="srapartnoid" />
							</cfoutput>
						</div>
					</div>
                </td>
				
				<td class="column" colspan="2">
					<div class="columnContent">
                        <div class="formField">
                            <label class="font10" id="sra_partno_label" for="sransn"><span class="font10">&nbsp;</span>SRA NSN:</label>
                            <cfoutput>
                            <input class="form_field font10 noBackground" id="sransn" type="text" name="sransn" readonly="readonly"/>
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
                                                    <th class="noSort admin">&nbsp;</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <cfloop  query="rc.qSpareSoftware" >
                                                    <cfoutput>
                                                        <tr>
                                                            <td>#encodeForHTML(SW_NUMBER)#</td>
                                                            <td>#encodeForHTML(SW_TITLE)#</td>
                                                            <td class="deleteSoftware deleteIcon admin" id="#encodeForHTML(ENCRYPTED_SW_ID)#">&nbsp;</td>
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
            
			<tr align="center">
				<td colspan="3" class="button_container">
					<input type="submit" name="btnInsert" id="btnInsert" value="INSERT"> 
					<input type="submit" name="btnReset" id="btnReset" value="RESET"> 
				</td>
			</tr>
			<cfif StructKeyExists(rc,'nhaassetObj')>	
			<tr>
				
					<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=new.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.assetObj.getAssetID()))#">Add New Sys Config</a></cfoutput></td>
				<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=list.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.nhaassetObj.getAssetID()))#">Return to System Config List</a></cfoutput></td>
				
			</tr>
			<cfelse>
				<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=new.configuration">Add New Sys Config</a></cfoutput></td>
				<td class="column" style="text-align:right"><cfoutput><a href="index.cfm">Return to System Config Search</a></cfoutput></td>
			</cfif>
			</tbody>
		</table>
		</form>
	</div>	

</RIMSS:layout>