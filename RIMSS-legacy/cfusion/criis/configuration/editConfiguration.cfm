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
			//setup asset lookup dialog
			//setupAssetLookupDialog();
			setupSRANounLookupDialog();
			setupSRAAssetLookupDialog();
			setupAddSNDialog();
			
			setupSoftwareDialog();
            setupSoftwareDelete();
			
			$('#btnDelete').click(function(e){
				$(this).setAction('remove.sra');
				var c = confirm("Are you sure you want to remove this SRA?");
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
    </script>

	<!---jQuery below is responsible for Export to Excel function along with hidden table at bottom of page --->   
	<script>
		$(function() { 
		
		//Creating report timestamp for exports	
		var d = new Date();
		
		var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		
		function addZero(i) {
		    if (i < 10) {
		        i = "0" + i;
		    }
		    return i;
		}
		
		var reportTimeStamp = "Report Prepared on: " +  days[d.getUTCDay()] + ", " +  months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " +  d.getUTCFullYear() + ", " + addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes()) + ":" + addZero(d.getUTCSeconds()) + " ZULU";
		
		
		var sraTable = $('#sraTable').DataTable( {
		        dom: 'Brtp',
		        "paging": false,
		        //Options below control the size and scrolling options of tables
		    	"bAutoWidth": false,
				"bScrollCollapse": false,
		        "bSort" : true,
		        "aaSorting": [],
		        "columnDefs": [{
		        	"targets": 'noSort',
		        	"orderable": false
		        }],
		        buttons: [
		            {
		                extend: 'excelHtml5',
		                className: 'excelBtn',
		                title: document.getElementById("skin_sub_title").innerText + ' - NHA SERNO: ' + document.getElementById("serno").value,
		                messageTop: 'NOUN: ' + document.getElementById("sranoun").value + ' | PARTNO: ' + document.getElementById("srapartno").value + ' | SERNO: ' + document.getElementById("sraserno").value,
		                filename: 'config_export',
		                text: 'Export to Excel',
		                exportOptions: {
				            columns: 'th:not(.noSort)'
				         },
		                //"CustomizeData" below allows for data to maintain formatting in export
			            customizeData: function(data) {
			          		//Looping over data in table body
					        for(var i = 0; i < data.body.length; i++) {
					          for(var j = 0; j < data.body[i].length; j++) {
					            data.body[i][j] = '\u200C' + data.body[i][j].trim();
					          }
							}
						}
		            }		            
		            
		        ]
		} ); 	
			    
			//De-tatching buttons from table and appending them to a div, so that buttons can be moved on page   	
			sraTable.buttons().container().appendTo('#exportButtons');
		});
			
	</script>
	
	<cfoutput>
	   <div class="message #msgStatus#">#encodeForHTML(trim(msg))#</div>
	</cfoutput>
	
	<div class="headerContent">
    	<div class="headerTitle" id="headerTitle" name="headerTitle">Edit Configuration</div>
    </div>

	<div class="mainContent">
		<form id="editConfig" name="editConfig" method="post" action="<cfoutput>index.cfm</cfoutput>">
		<table class="three_column_table" cellpadding="0px" cellspacing="0px" style="">
			<tbody>
			<tr>
				<td class="column">
					<div class="columnContent">
						<div class="formField">
	                        <label class="font10" id="asset_id_label" for="serno"> NHA SERNO:</label> 
	                        <cfoutput><cfif StructKeyExists(rc,'nhaassetObj')>#rc.nhaassetObj.getSerno()#</cfif>
							<input type="hidden" id="nhaassetId" name="nhaassetId" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getAssetID()))#"</cfif>/>
							<input type="hidden" name="spareSoftwareId" readonly="readonly" id="spareSoftwareId" <cfif Structkeyexists(form,"spareSoftwareId")>value="#encodeForHTML(trim(form.spareSoftwareId))#"</cfif>/>
	                        <input class="form_field required_form_field font10" id="serno" type="hidden" name="serno" <cfif StructKeyExists(rc,'nhaassetObj')>value="#encodeForHTML(trim(rc.nhaassetObj.getSerno()))#"</cfif> readonly="readonly" />
							</cfoutput>
						</div>
					</div>
				</td>
				<td class="column">
					<div class="columnContent">
					<div class="formField">
                        <label class="font10" id="partno_id_label" for="partno">NHA P/N:</label>
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
	                       NHA SYS TYPE:
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
                            <label class="font10" id="sra_partno_label" for="sranoun"><span class="font10">&nbsp;</span>NOUN:</label>
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
                            <label class="font10" id="sra_serno_label" for="sraserno"><span class="font10">&nbsp;</span>SERNO:</label>
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
                            <label class="font10" id="sra_partno_label" for="srapartno"><span class="font10">&nbsp;</span>PARTNO:</label>
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
                            <label class="font10" id="sra_partno_label" for="sransn"><span class="font10">&nbsp;</span>NSN:</label>
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
			
			
			<tr>
				<td class="column button_container" colspan="3" style="text-align:center">
					<input type="submit" name="btnUpdate" id="btnUpdate" value="UPDATE"> 
					<input type="submit" class="removeSRA " name="btnDelete" id="btnDelete" value="REMOVE"> 
					<input type="submit" name="btnReset" id="btnReset" value="RESET">
				</td>
			</tr>
			<tr>
				<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=new.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.assetObj.getAssetID()))#">Add New Sys Config</a></cfoutput></td>
				
				
				<cfoutput>
				<cfif StructKeyExists(rc,'codeObj') and (rc.codeObj.getCodeValue() NEQ 'PART')>
					<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=list.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.nhaassetObj.getAssetID()))#">Return to System Config List</a></cfoutput></td>	
				<cfelse>
					<td class="column" style="text-align:right"><cfoutput><a href="index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(rc.nhaassetObj.getAssetID()))#">Return to Edit Config</a></cfoutput></td>
				</cfif>				
				</cfoutput>
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
										<td class="edit"><a href="index.cfm?action=edit.configuration&assetid=#URLEncodedFormat(rc.util.encryptId(asset_id))#">#encodeForHTML(trim(SERNO))#</a></td>
										<td class="delete iconClass ">
											<a id="#encodeForHTML(trim(ASSET_ID))#" class="removeSRA" href="index.cfm?action=remove.sra&assetid=#URLEncodedFormat(rc.util.encryptId(ASSET_ID))#">
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
	</form>
</RIMSS:layout>