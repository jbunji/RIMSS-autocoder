<cfimport taglib="../layout" prefix="RIMMS"/>
<cfsetting showdebugoutput="false" >

<cfset dropDownUtilities = application.objectFactory.create("DropDownDao") />
<cfset status = dropDownUtilities.getProgramStatus(application.sessionManager.getProgramSetting()) />
<cfset dbUtils = application.objectFactory.create("DBUtils") />


<RIMMS:layout layout="default">
    <RIMMS:subLayout subSection="#application.sessionManager.getSubSection()#"/>
    
    <link href="<cfoutput>#application.rootpath#</cfoutput>/common/css/timePicker.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/maintenance.js"></script>
    <script type="text/javascript" src="<cfoutput>#application.rootpath#</cfoutput>/common/js/jquery.timePicker.min.js"></script>

    <!-- DataTables -->
    <script type="text/javascript">
    	$(document).ready(function(){
    		    		
    		
			    		//var jobcompdt = document.getElementById('maintCompDate').value;
			    		//textObject.disabled = true|false
			    		
			    		var jobcompdt = document.getElementById('maintCompDate').value;
			    		
			    		//alert(document.getElementById('maintCompDate').disabled);
					 	if(jobcompdt.length > 0 && document.getElementById('maintCompDate').disabled == false){
					 		
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 	}    		    		
    		
    		  			
			});
    	
    	
        $(function() {
            //setupRemoveSRA();
            //setup asset lookup dialog
            //setupAssetLookupDialog();
            setupHighlight(); 
            var dt = $('#repairTable').dataTable({});
            
            //Add .noSort and .date column defs
            modifyDTColumns();
    
        });     	
		$(function(){
				$(".admin").click(function(event){
					if (confirm("Are you sure you want to remove this record?")==true){
						return true;
					}else{
						event.preventDefault();
					}
				});
		  });
		  
		 $(function(){
			$(".clearDate").click(function(event){
				if (confirm("Are you sure you want to clear the Maintenance Completion Date and Time?")==true){
					 document.getElementById('maintCompDate').value='';
			    	 document.getElementById('maintCompTime').value=''; 
			    	 document.getElementById("clearDate_png").style.visibility = "hidden";
			    	 document.getElementById('maintCompDate').readOnly = false;
					return true;
				}else{
					event.preventDefault();
				}
			});
		 }); 
		 
		 
		 function maintCompDateOnChange(){
		 			
			    		//var jobcompdt = document.getElementById('maintCompDate').value;
			    		var jobcompdt = document.getElementById('maintCompDate').value;
					 	if(jobcompdt.length > 0 && document.getElementById('maintCompDate').disabled == false){
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 		document.getElementById('maintCompDate').readOnly = true;
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 	}    		    		
    		
		 	
	
    		return;
		 }
		 
		 function onKeyPressMaintCompDate(){
		 	
		 	var jobcompdt = document.getElementById('maintCompDate').value;
					 	if(jobcompdt.length > 0 && document.getElementById('maintCompDate').disabled == false){
					 		document.getElementById("clearDate_png").style.visibility = "visible";
					 		document.getElementById('maintCompDate').readOnly = true;
					 	}
					 	else{
					 		document.getElementById("clearDate_png").style.visibility = "hidden";
					 		document.getElementById('maintCompDate').readOnly = false;
					 	}    		    		
		 }
		 

		  	
    </script>
    
    <cfoutput><div class="message #msgStatus#">#msg#</div></cfoutput>
    <div class="headerContent">
        <div class="headerTitle">Update Maintenance</div>
    </div>
    <div class="font12 mainContent">
        <form id="createMaintenance" name="createMaintenance" method="post" action="index.cfm">
			<input type="hidden" id="eventId" name="eventId" value="<cfif StructKeyExists(form, 'eventId')><cfoutput>#encodeForHTML(form.eventId)#</cfoutput></cfif>" />
            <input type="hidden" id="meterId" name="meterId" value="<cfif StructKeyExists(form, 'meterId')><cfoutput>#encodeForHTML(form.meterId)#</cfoutput></cfif>" />		
            
			<div class="formContent">
                <table class="three_column_table" cellpadding="0px" cellspacing="0px">
                    <tbody>
                        
	                        <tr>
	                        	<td class="section_header" colspan="3">
									SERNO: <span id="serno"><cfif StructKeyExists(form, 'serno')><cfoutput>#encodeForHTML(trim(form.serno))#</cfoutput></cfif></span> | PARTNO: <span id="partno"><cfif StructKeyExists(form, 'partno')><cfoutput>#encodeForHTML(trim(form.partno))#</cfoutput></cfif></span> | NOUN: <span id="partno"><cfif StructKeyExists(form, 'noun')><cfoutput>#encodeForHTML(trim(form.noun))#</cfoutput></cfif></span>
								</td>
							</tr>
                       <!--- <tr>
						    <td colspan="3">
                                <div class="formField">
                                    <label class="font10" id="job_id_label"><span class="font10 required_field">*</span>JOB ID:</label>
                                    <input class="form_field required_form_field font10" id="job_id_field" type="text" name="jobId" value="<cfif StructKeyExists(form, 'jobId')><cfoutput>#encodeForHTML(trim(form.jobId))#</cfoutput></cfif>" readonly="readonly" />
                                </div>
                            </td>
                        </tr>--->
                        <tr>
                            <td class="column">
                                <div class="columnContent">
                                    <div class="formField">
                                    	<label class="font10" id="job_id_label"><span class="font10 required_field">*</span>JOB ID:</label>
                                    	<input class="form_field required_form_field font10" id="job_id_field" type="text" name="jobId" value="<cfif StructKeyExists(form, 'jobId')><cfoutput>#encodeForHTML(trim(form.jobId))#</cfoutput></cfif>" readonly="readonly" />
                                	</div>
									<div class="formField">
                                        <label class="font10" id="asset_id_label"><span class="font10 required_field">*</span>SERNO:</label> 
                                        <input type="hidden" id="assetId" name="assetId" value="<cfif StructKeyExists(form, 'assetId')><cfoutput>#encodeForHTML(trim(form.assetId))#</cfoutput></cfif>" />
                                        <input type="hidden" id="ctAssetId" name="ctAssetId" value="<cfif StructKeyExists(form, 'ctAssetId')><cfoutput>#encodeForHTML(trim(form.ctAssetId))#</cfoutput></cfif>" />
                                        <input class="form_field required_form_field font10" id="serno" type="text" name="serno" value="<cfif StructKeyExists(form, 'serno')><cfoutput>#encodeForHTML(trim(form.serno))#</cfoutput></cfif>" readonly="readonly" />
                                    </div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE' AND StructKeyExists(form, "systype") AND form.systype NEQ "PART">
	                                    <div class="formField">
	                                        <label class="font10" id="etm_start_label"><span class="font10 required_field">*</span>ETM START:</label> 
	                                        <input class="form_field font10" id="etmStart" type="text" name="etmStart" value="<cfif StructKeyExists(form, 'etmStart')><cfoutput>#encodeForHTML(trim(form.etmStart))#</cfoutput></cfif>" style="width: 50px;max-width: 50px;" />
	                                    </div>
									</cfif>
                                    <div class="formField">
                                        <label class="font10" id="maint_start_label"><span class="font10 required_field">*</span>MAINT START:</label>
                                        <input class="form_field font10 calendar_field" id="maintStartDate" type="text" name="maintStartDate" value="<cfif StructKeyExists(form, 'maintStartDate')><cfoutput>#encodeForHTML(trim(form.maintStartDate))#</cfoutput></cfif>" readonly="readonly" />
                                        <input class="form_field font10 time_field" id="maintStartTime" type="text" name="maintStartTime" value="<cfif StructKeyExists(form, 'maintStartTime')><cfoutput>#encodeForHTML(trim(form.maintStartTime))#</cfoutput></cfif>" />
                                    </div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                	 <div class="formField">&nbsp;</div>
                                    <div class="formField">
                                        <label class="font10" id="partno_id_label"><span class="font10 required_field">&nbsp;</span>P/N:</label>
                                        <input id="partnoId" type="hidden" name="partnoId" value="<cfif StructKeyExists(form, 'partnoId')><cfoutput>#encodeForHTML(trim(form.partnoId))#</cfoutput></cfif>"/>
										<input class="form_field required_form_field font10" id="partno" type="text" name="partno" value="<cfif StructKeyExists(form, 'partno')><cfoutput>#encodeForHTML(trim(form.partno))#</cfoutput></cfif>" readonly="readonly" />
                                    </div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE' AND StructKeyExists(form, "systype") AND form.systype NEQ "PART">
	                                    <div class="formField">
	                                        <label class="font10" id="meter_chg_label"><span class="font10 required_field">&nbsp;</span>REPLACED METER:</label>
	                                        <select class="select_field font10" id="meterchg" name="meterchg">
	                                            <option value="Y" <cfif StructKeyExists(form, 'meterchg') and form.meterchg eq 'Y'>selected="selected"</cfif> >YES</option>
	                                            <option value="N" <cfif !StructKeyExists(form, 'meterchg') or (StructKeyExists(form, 'meterchg') and form.meterchg neq 'Y')>selected="selected"</cfif> >NO</option>
	                                        </select>
	                                    </div>
									</cfif>
                                    <div class="formField">&nbsp;</div>
                                </div>
                            </td>
                            <td class="column">
                                <div class="columnContent">
                                	<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE'>
	                                    <div class="formField">
											<label class="font10" id="sortie_id_label"><span class="font10"></span>SORTIE ID:</label>
											<input type="hidden" id="sortieId" name="sortieId" value="<cfif StructKeyExists(form, 'sortieId')><cfoutput>#encodeForHTML(trim(form.sortieId))#</cfoutput></cfif>" />
											<input class="form_field font10" id="mission" type="text" name="mission" value="<cfif StructKeyExists(form, 'mission')><cfoutput>#encodeForHTML(trim(form.mission))#</cfoutput></cfif>" readonly="readonly" />
											<a href="<cfoutput>#application.rootpath#</cfoutput>/dialogs/lookupSortieDialog.cfm" class="lookup_ref" id="sortie" title="SORTIE"><img id="lookup_img" src="<cfoutput>#application.rootpath#</cfoutput>/common/images/lookup.png" /></a>
										</div>
									<cfelse>
										<div class="formField">&nbsp;</div>
									</cfif>
									<div class="formField">
                                        <label class="font10" id="status_label"><span class="font10 required_field">*</span>STATUS:</label>
                                        <select class="select_field font10" id="status_select" name="status_select">
                                            <option value=""></option>
                                            <cfloop array="#status#" index="idx">
                                                <option value="<cfoutput>#idx[1]#</cfoutput>" <cfif StructKeyExists(form,'status_select')><cfif form.status_select eq idx[1] >selected=selected</cfif></cfif>><cfoutput>#idx[2]#</cfoutput></option>
                                            </cfloop>
                                        </select>
                                    </div>
									<cfif application.sessionManager.getSubSection() EQ 'AIRBORNE' AND StructKeyExists(form, "systype") AND form.systype NEQ "PART">
	                                    <div class="formField">
	                                        <label class="font10" id="etm_comp_label"><span class="font10 required_field">&nbsp;</span>ETM COMP:</label> 
	                                        <input class="form_field font10" id="etmComp" type="text" name="etmComp" value="<cfif StructKeyExists(form, 'etmComp')><cfoutput>#encodeForHTML(trim(form.etmComp))#</cfoutput></cfif>" style="width: 50px;max-width: 50px;" />
	                                    </div>
									</cfif>
                                    <div class="formField">
                                        <label class="font10" id="maint_stop_label">MAINT COMP:</label>
                                        <input class="form_field font10 calendar_field"  onkeypress="onKeyPressMaintCompDate()" onkeyup="onKeyPressMaintCompDate();"  onkeydown="onKeyPressMaintCompDate();" onfocus="maintCompDateOnChange();" onchange="maintCompDateOnChange();"   id="maintCompDate" type="text" name="maintCompDate" value="<cfif StructKeyExists(form, 'maintCompDate')><cfoutput>#encodeForHTML(trim(form.maintCompDate))#</cfoutput></cfif>" readonly="readonly" />
                                        <input class="form_field font10 time_field" id="maintCompTime" type="text" name="maintCompTime" value="<cfif StructKeyExists(form, 'maintCompTime')><cfoutput>#encodeForHTML(trim(form.maintCompTime))#</cfoutput></cfif>" readonly="readonly" />
                                        <img src="../../common/images/date_delete.png" id="clearDate_png" name="clearDate_png" title="Clear Date and Time" alt="Clear Date and Time" class="clearDate" <cfif partOnOrder GT 0>style="visibility:hidden;"</cfif>   />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div class="formField">
                                    <label class="font10" id="discrepancy_label" style="vertical-align: top;"><span class="font10 required_field">&nbsp;</span>DISCREPANCY:</label>
                                    <textarea class="text_area_field font10" id="discrepancy" name="discrepancy" ><cfif StructKeyExists(form, 'discrepancy')><cfoutput>#encodeForHTML(trim(form.discrepancy))#</cfoutput></cfif></textarea>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <div class="button_container">
                                    <input type="submit" class="input_buttons font10" id="btnUpdate" name="btnUpdate" value="UPDATE" onclick="setAction('update.event',this);setMethod('doAction',this);" />
                                    <input type="reset" class="input_buttons font10" id="btnReset" name="btnReset" value="RESET" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="one_column_table" cellpadding="0px" cellspacing="0px">
                	<tbody>
                        <tr>
                            <td>
                                <div class="job_detail section_header">
                                    Maintenance Detail
                                </div>
                            </td>
                        </tr>
						<tr>
					            <cfif StructKeyExists(rc, "qRepair") and rc.qRepair.recordcount GT 0 >								
							<td>
					            <div class="font10">
					             <table class="globalTable" id="repairTable">
					                     <thead>
					                        <tr>
					                            <th class="noSort" width="3%">&nbsp;</th>
					                            <th width="5%">Repair Sequence</th>
												<th width="15%">Noun</th>
					                            <th>Serno</th>
					                            <th>Part No.</th>
					                            <th>Maint Start</th>
	                                            <th>Maint Comp.</th>
	                                            <th>Narrative</th>
					                            <th class="noSort admin">&nbsp;</th>
					                        </tr>
					                        
					                     </thead>
					                   <tbody>          
					                   <cfoutput>
					                   <cfloop query="rc.qRepair">    
					                        <tr class="<cfif rc.qRepair.currentRow mod 2> odd <cfelse> even </cfif>">
					                            <td>			                            	
													<table>
					                            		<tr>
					                            			<td style="border:0px" class="edit editIcon">
					                            				<a href="index.cfm?action=edit.maintenance.detail&eventRepair=#encodeForURL(rc.qRepair.ENCRYPTED_REPAIRID)#"></a>							                            				
					                            			</td>
															<td style="border:0px">
																<cfif dbUtils.hasAttachmentsByRepairId(REPAIRID)>
																	<div class="attachIcon"></div>
																</cfif>
															</td>
					                            		</tr>
					                            	</table>
												</td>
					                            <td>#encodeForHTML(trim(repair_seq))#</td>
												<td>#encodeForHTML(trim(noun))#</td>
					                            <td>#encodeForHTML(trim(serno))#</td>
					                            <td>#encodeForHTML(trim(partno))#</td>
					                            <td>#encodeForHTML(trim(ucase(dateformat(start_date, "dd-MMM-yyyy"))))# #encodeForHTML(trim(ucase(timeformat(start_date, "hh:mm"))))#</td>
	                                            <td>#encodeForHTML(trim(ucase(dateformat(stop_date, "dd-MMM-yyyy"))))# #encodeForHTML(trim(ucase(timeformat(stop_date, "hh:mm"))))#</td>
	                                            <td>#encodeForHTML(trim(narrative))#</td>
					                            <td class="delete deleteIcon admin"><a href="index.cfm?action=delete.maintenance.detail&eventRepair=#encodeForURL(rc.qRepair.ENCRYPTED_REPAIRID)#"></a></td>
					                        </tr>      
					                   </cfloop>
					                   </cfoutput>
					                   </tbody>
					               </table>
				            </td>
					            <cfelse> 
	                            	   <td class="column"><div class="formField">There is no Maintenance Detail for this job.</div></td>
					            </cfif> 
					            </div>
				        </tr>
                        <tr>
                            <td>
                                <div class="button_container">
                                    <input type="submit" class="input_buttons font10" id="btnAddDetail" name="btnAddDetail" value="ADD DETAIL" onclick="setAction('create.maintenance.detail',this);setMethod('forward',this);" />
                                </div>
                            </td>
                        </tr>
						<tr>
							<td class="column" style="text-align:center"><cfoutput><a href="#application.rootpath#/#application.sessionManager.getProgramSetting()#/maintenance/#session.workload#">Return to #session.workloadredirect#</a></cfoutput></td>
						</tr>
					</tbody>
                </table>
            </div>
        </form>
    </div>
	
</RIMMS:layout>
